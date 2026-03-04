import generatorHelper, { GeneratorManifest } from '@prisma/generator-helper'
import { generate } from './generate.js';

function onManifest(): GeneratorManifest {
  return {
    prettyName: 'prisma-generator-zod-local',
    defaultOutput: './generated/zod',
    version: '0.0.1',
  };

}
generatorHelper.generatorHandler({
  onManifest: onManifest,
  onGenerate: generate,
})
