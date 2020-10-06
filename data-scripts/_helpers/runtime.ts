import { DataGenerator } from "data-scripts/DataGenerator";
import * as fs from "fs";
import * as path from "path";

declare const global: any;

export type GeneratorOption = {
    filename: string;
    language: string;
    generator: DataGenerator;
};

export type GeneratorOptions = GeneratorOption[];

export function register(filename, language, generator) {
    ensureGlobalGenerators();
    global.generators.push({ filename, language, generator });
}

export async function runGenerators() {
    ensureGlobalGenerators();
    for (const g of global.generators) {
        const generator = new (g.generator as any)();
        await generator.init();
        const folder = path.join(__dirname, "../../data/", g.language);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        fs.writeFileSync(path.join(folder, `${g.filename}.json`), JSON.stringify(await generator.generateJSON()));
        fs.writeFileSync(path.join(folder, `${g.filename}.txt`), await generator.generateTXT());
    }
}

function ensureGlobalGenerators() {
    if (!Array.isArray(global.generators)) {
        global.generators = [];
    }
}