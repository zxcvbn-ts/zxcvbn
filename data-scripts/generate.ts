import { GeneratorOptions, register, runGenerators } from "./_helpers/runtime";
import { EnCommonWordsGenerator } from "./en/EnCommonWordsGenerator";
import { DeCommonWordsGenerator } from "./de/DeCommonWordsGenerator";

register("commonWords", "en", EnCommonWordsGenerator);
register("commonWords", "de", DeCommonWordsGenerator);

runGenerators();