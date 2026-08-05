import type { DMMF } from '@prisma/generator-helper';

export function fieldsToZodObject(fields: DMMF.Field[], isUpdate: boolean = false): string {
  return fields
    .map(field => fieldToZod(field, isUpdate))
    .join(',\n');
}

function fieldToZod(field: DMMF.Field, isUpdate: boolean = false): string {
  let name = field.name;
  let zodType = prismaScalarToZod(field, name);

  if (field.isList) {
    zodType = `z.array(${zodType})`;
    name += 'Id';
  }

  if (isUpdate || !field.isRequired) {
    zodType += '.nullish()';
  }
  else if (field.type == "String") {
    zodType += `.nonempty(\"${name} is required\")`;
  }

  return `  ${name}: ${zodType}`;
}

function prismaScalarToZod(field: DMMF.Field, name: string): string {
  switch (field.kind) {
    case 'enum':
      return `${field.type}Schema`;
    case 'object':
      return `${field.type}ModelSchema`;
  }

  switch (field.type) {
    case 'String': return 'z.string()';
    case 'Int': return 'z.number().int()';
    case 'Float': return `z.number(\"${name} should be a number\")`;
    case 'Decimal': return 'z.number()';
    case 'Boolean': return 'z.boolean()';
    case 'DateTime': return 'z.string().pipe(z.coerce.date())';
    case 'Json': return 'z.unknown()';
    default: return 'z.any()';
  }
}