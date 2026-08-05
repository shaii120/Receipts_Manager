import { DMMF } from '@prisma/generator-helper';
import { fieldsToZodObject } from "./zod-mapper.js"
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const schemaTypes = { Model: 'Model', Create: 'Create', Update: 'Update', Result: 'Result' } as const;

function getFields(model: DMMF.Model): Map<string, DMMF.Field[]> {
    const exceptedKinds: DMMF.FieldKind[] = ['scalar', 'enum']
    const fields = model.fields
        .filter(f => exceptedKinds.includes(f.kind) || (f.kind === 'object' && f.isList));
    const schemasFields = new Map<string, DMMF.Field[]>();
    schemasFields.set(schemaTypes.Model, fields);
    schemasFields.set(schemaTypes.Create, fields
        .filter(f => !f.hasDefaultValue && !f.isGenerated && !f.isUpdatedAt));
    schemasFields.set(schemaTypes.Update, fields
        .filter(f => !f.isId && !f.isReadOnly));
    schemasFields.set(schemaTypes.Result, fields
        .filter(f => exceptedKinds.includes(f.kind)));
    return schemasFields;
}

function modelToSchemas(model: DMMF.Model): string {
    let code = 'import { z } from "zod";\n';
    const fieldsMap = getFields(model);
    const enums = Array.from(new Set(
        fieldsMap.get(schemaTypes.Model)
            ?.filter(f => f.kind === 'enum')
            .map(f => `${f.type}Schema`)
    ));
    const modelSchemas = Array.from(new Set(
        fieldsMap.get(schemaTypes.Model)
            ?.filter(f => f.kind === 'object')
            .map(f => f.type)
    ));

    if (enums && enums.length > 0) {
        code += `import { ${enums.join(', ')} } from "./enums.schema.js";\n`;
    }
    if (modelSchemas && modelSchemas.length > 0) {
        modelSchemas.forEach(schema => {
            code += `import { ${schema}ModelSchema } from "./${schema}.schema.js";\n`;
        });
    }
    code += '\n';

    fieldsMap
        .forEach((fields, type) => {
            if (fields.length === 0) return;
            const isUpdate = type === schemaTypes.Update;
            code += `export const ${model.name}${type}Schema = z.object({\n${fieldsToZodObject(fields, isUpdate)}\n});\n`;
            code += `export type ${model.name}${type} = z.infer<typeof ${model.name}${type}Schema>;\n`;
            code += `export type ${model.name}${type}Input = z.input<typeof ${model.name}${type}Schema>;\n`;
            code += '\n';
        });
    return code.trim();
}

function enumModelToSchemas(enums: readonly DMMF.DatamodelEnum[]): string {
    let code = 'import { z } from "zod";\n\n';

    enums.forEach((enumType) => {
        const values = enumType.values
            .map(value => `"${value.name}"`)
            .join(", ");
        code += `export const ${enumType.name}Schema = z.enum([${values}]);\n`;
        code += `export type ${enumType.name} = z.infer<typeof ${enumType.name}Schema>;\n\n`;
    });

    return code;
}

export function emitSchema(
    outputDir: string,
    model: DMMF.Model,
) {
    const modelName = model.name
    mkdirSync(outputDir, { recursive: true })

    const baseName = `${modelName}.schema`

    writeFileSync(
        join(outputDir, `${baseName}.ts`),
        modelToSchemas(model),
        'utf8',
    )
}

export function emitIndex(
    outputDir: string,
    modelNames: string[],
    hasEnums: boolean
) {
    let code: string[] = [];

    if (hasEnums) {
        code.push(`export * from "./enums.schema.js";`);
    }
    modelNames.forEach((modelName) => {
        const schemaLine = `export * from "./${modelName}.schema.js";`
        code.push(schemaLine);
    });

    writeFileSync(
        join(outputDir, 'index.ts'),
        code.join('\n') + '\n',
        'utf8',
    );
}

export function emitEnums(
    outputDir: string,
    enums: readonly DMMF.DatamodelEnum[],
) {
    if (enums.length === 0) {
        return;
    }

    const content = enumModelToSchemas(enums);

    writeFileSync(
        join(outputDir, "enums.schema.ts"),
        content,
        "utf8",
    );
}