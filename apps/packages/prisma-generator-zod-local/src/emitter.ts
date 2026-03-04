import { DMMF } from '@prisma/generator-helper';
import { fieldsToTypes, fieldsToZodObject } from "./zod-mapper.js"
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const schemaTypes = ['Model', 'Create']

function getFields(model: DMMF.Model): Map<string, DMMF.Field[]> {
    const fields = new Map<string, DMMF.Field[]>();
    fields.set('Model', model.fields
        .filter(f => f.kind === 'scalar'));
    fields.set('Create', model.fields
        .filter(f => f.kind === 'scalar')
        .filter(f => !f.hasDefaultValue && !f.isGenerated && !f.isUpdatedAt));
    return fields;
}

function modelToSchemas(model: DMMF.Model): string {
    let code = 'import { z } from "zod";\n\n';
    getFields(model)
        .forEach((fields, type) => {
            code += `export const ${model.name}${type}Schema = z.object({\n${fieldsToZodObject(fields)}\n});\n\n`;
        });
    return code.trim();
}

function renderTypes(model: DMMF.Model): string {
    let code = 'import { z } from "zod";\n\n';
    getFields(model)
        .forEach((fields, type) => {
            code += `export declare const ${model.name}${type}Schema: z.ZodObject<{\n${fieldsToTypes(fields)}\n}>\n`
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
        join(outputDir, `${baseName}.js`),
        modelToSchemas(model),
        'utf8',
    )

    writeFileSync(
        join(outputDir, `${baseName}.d.ts`),
        renderTypes(model),
        'utf8',
    )
}

export function emitIndex(
    outputDir: string,
    modelNames: string[],
) {
    let exportMap = new Map<string, string[]>();
    let jsLines: string[] = [];
    let dtsLines: string[] = [];

    for (const name of modelNames) {
        exportMap.set(name, schemaTypes.map(type => `${name}${type}`));
    }

    exportMap.forEach((types, modelName) => {
        const schemaLine = `export { ${types.map(t => `${t}Schema`).join(', ')} } from "./${modelName}.schema.js";`
        jsLines.push(schemaLine);
        dtsLines.push(schemaLine);
        dtsLines.push(`export type { ${types.join(', ')} } from "./${modelName}.schema.js";`);
    });

    writeFileSync(
        join(outputDir, 'index.js'),
        jsLines.join('\n') + '\n',
        'utf8',
    )

    writeFileSync(
        join(outputDir, 'index.d.ts'),
        dtsLines.join('\n') + '\n',
        'utf8',
    )
}