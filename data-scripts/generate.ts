import { GeneratorOptions, register, runGenerators } from "./_helpers/runtime";
import { EnCommonWordsGenerator } from "./en/EnCommonWordsGenerator";
import { DeCommonWordsGenerator } from "./de/DeCommonWordsGenerator";
import { EnFirstnamesGenerator } from "./en/EnFirstnamesGenerator";
import { EnLastnamesGenerator } from "./en/EnLastnamesGenerator";

register("commonWords", "en", EnCommonWordsGenerator);
register("firstnames", "en", EnFirstnamesGenerator);
register("lastnames", "en", EnLastnamesGenerator);

register("commonWords", "de", DeCommonWordsGenerator);

runGenerators();