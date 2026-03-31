import { DMMF } from '@prisma/generator-helper';
import { fieldsToZodObject } from "./zod-mapper.js"
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const schemaTypes = { Model: 'Model', Create: 'Create', Update: "Update" }

function getFields(model: DMMF.Model): Map<string, DMMF.Field[]> {
    const fields = model.fields.filter(f => f.kind === 'scalar' || (f.kind === 'object' && f.isList));
    const schemasFields = new Map<string, DMMF.Field[]>();
    schemasFields.set(schemaTypes.Model, fields);
    schemasFields.set(schemaTypes.Create, fields
        .filter(f => !f.hasDefaultValue && !f.isGenerated && !f.isUpdatedAt));
    schemasFields.set(schemaTypes.Update, fields
        .filter(f => !f.isId));
    return schemasFields;
}

function modelToSchemas(model: DMMF.Model): string {
    let code = 'import { z } from "zod";\n\n';
    getFields(model)
        .forEach((fields, type) => {
            const isUpdate = type === schemaTypes.Update;
            code += `export const ${model.name}${type}Schema = z.object({\n${fieldsToZodObject(fields, isUpdate)}\n});\n`;
            code += `export type ${model.name}${type} = z.infer<typeof ${model.name}${type}Schema>;\n\n`;
        });
    return code.trim();
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
) {
    let jsLines: string[] = [];

    modelNames.forEach((modelName) => {
        const schemaLine = `export * from "./${modelName}.schema.js";`
        jsLines.push(schemaLine);
    });

    writeFileSync(
        join(outputDir, 'index.ts'),
        jsLines.join('\n') + '\n',
        'utf8',
    );
}