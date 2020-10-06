import { DataGenerator } from "./DataGenerator";
import { EnCommonWordsGenerator } from "./en/EnCommonWordsGenerator";
import * as fs from "fs";
import * as path from "path";

const generators: {
    filename: string;
    language: string;
    generator: DataGenerator;
}[] = [];

function register(filename, language, generator) {
    generators.push({ filename, language, generator });
}

register("commonWords", "en", EnCommonWordsGenerator);

(async () => {
    for (const g of generators) {
        const generator = new (g.generator as any)();
        await generator.init();
        const folder = path.join(__dirname, "../data/", g.language);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        fs.writeFileSync(path.join(folder, `${g.filename}.json`), JSON.stringify(await generator.generateJSON()));
        fs.writeFileSync(path.join(folder, `${g.filename}.txt`), await generator.generateTXT());
    }
})()