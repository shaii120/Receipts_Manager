import type { DMMF } from '@prisma/generator-helper';

export type SchemaField = {
    field: DMMF.Field;
    isUpdate: boolean;
    isRecursive: boolean;
};

export function fieldsToZodObject(fields: SchemaField[]): string {
    return fields
        .map(field => fieldToZod(field))
        .join(',\n');
}

function fieldToZod(schemField: SchemaField): string {
    let name = schemField.field.name;
    let zodType = prismaScalarToZod(schemField, name);

    if (schemField.field.isList) {
        zodType = `z.array(${zodType})`;
    }

    if (schemField.isUpdate || !schemField.field.isRequired) {
        zodType += '.nullish()';
    }
    else if (schemField.field.type == "String") {
        zodType += `.nonempty(\"${name} is required\")`;
    }

    if (schemField.isRecursive) {
        return `\tget ${name}(){ return ${zodType} }`
    }

    return `\t${name}: ${zodType}`;
}

function prismaScalarToZod(schemField: SchemaField, name: string): string {
    switch (schemField.field.kind) {
        case 'enum':
            return `${schemField.field.type}Schema`;
        case 'object':
            return `${schemField.field.type}ModelSchema`;
    }

    switch (schemField.field.type) {
        case 'String': return 'z.string()';
        case 'Int': return 'z.number().int(\"${name} should be a whole number\")';
        case 'Decimal':
        case 'Float': return `z.number(\"${name} should be a number\")`;
        case 'Boolean': return 'z.boolean()';
        case 'DateTime': return 'z.string().pipe(z.coerce.date())';
        case 'Json': return 'z.unknown()';
        default: return 'z.any()';
    }
}