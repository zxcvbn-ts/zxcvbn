import { GeneratorOptions, register, runGenerators } from "./_helpers/runtime";
import { EnCommonWordsGenerator } from "./en/EnCommonWordsGenerator";
import { DeCommonWordsGenerator } from "./de/DeCommonWordsGenerator";
import { EnFirstnamesGenerator } from "./en/EnFirstnamesGenerator";

register("commonWords", "en", EnCommonWordsGenerator);
register("firstnames", "en", EnFirstnamesGenerator);
register("commonWords", "de", DeCommonWordsGenerator);

runGenerators();