import type { DMMF } from '@prisma/generator-helper';

export function fieldsToZodObject(fields: DMMF.Field[], isUpdate: boolean = false): string {
  return fields
    .map(field => fieldToZod(field, isUpdate))
    .join(',\n');
}

function fieldToZod(field: DMMF.Field, isUpdate: boolean = false): string {
  let zodType = prismaScalarToZod(field.type);
  let name = field.name;

  if (field.isList) {
    zodType = `z.array(${zodType})`;
    name += 'Id';
  }

  if (isUpdate || !field.isRequired) {
    zodType += '.nullable()';
  }
  else if (field.type == "String") {
    zodType += ".nonempty()"
  }

  return `  ${name}: ${zodType}`;
}

function prismaScalarToZod(type: string): string {
  switch (type) {
    case 'String': return 'z.string()';
    case 'Int': return 'z.number().int()';
    case 'Float': return 'z.number()';
    case 'Boolean': return 'z.boolean()';
    case 'DateTime': return 'z.date()';
    case 'Json': return 'z.unknown()';
    default: return 'z.any()';
  }
}