import type { DMMF } from '@prisma/generator-helper';
import { fi } from 'zod/locales';

export function fieldsToTypes(fields: DMMF.Field[]): string {
  return fields
    .map(field => `\t${field.name}: ${prismaScalarToZodType(field.type)}`)
    .join(',\n');
}

export function fieldsToZodObject(fields: DMMF.Field[]): string {
  return fields
    .map(fieldToZod)
    .join(',\n');
}

function fieldToZod(field: DMMF.Field): string {
  let zodType = prismaScalarToZod(field.type);

  if (!field.isRequired) {
    zodType += '.nullable()';
  }

  if (field.isList) {
    zodType = `z.array(${zodType})`;
  }

  return `  ${field.name}: ${zodType}`;
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

function prismaScalarToZodType(type: string): string {
  switch (type) {
    case 'String': return 'z.ZodString';
    case 'Int': return 'z.ZodNumber';
    case 'Float': return 'z.ZodNumber';
    case 'Boolean': return 'z.ZodBoolean';
    case 'DateTime': return 'z.ZodDate';
    case 'Json': return 'z.ZodUnknown';
    default: return 'z.ZodAny';
  }
}