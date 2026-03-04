import { GeneratorOptions } from '@prisma/generator-helper';
import { mkdir } from 'node:fs/promises';
import { emitIndex, emitSchema } from './emitter.js'

export async function generate(options: GeneratorOptions) {
  const modelNames: string[] = []
  const outDir = options.generator.output?.value;
  if (!outDir) {
    throw new Error('Missing generator output path')
  }

  await mkdir(outDir, { recursive: true });

  for (const model of options.dmmf.datamodel.models) {
    emitSchema(outDir, model);
    modelNames.push(model.name)
  }

  emitIndex(outDir, modelNames);
}

