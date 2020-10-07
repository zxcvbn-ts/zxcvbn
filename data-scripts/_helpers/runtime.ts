import { IDataGenerator } from "data-scripts/_generators/IDataGenerator";
import * as fs from "fs";
import * as path from "path";

declare const global: any;

export type ListConfig = {
    language: string;
    filename: string;
    url: string;
    generator: IDataGenerator;
    options?: any;
};

export type GeneratorOptions = ListConfig[];

export function registerList(language: string, filename: string, url: string, generator: any, options?) {
    ensureGlobalLists();
    global.lists.push({ language, filename, url, generator, options });
}

export async function run() {
    ensureGlobalLists();
    for (const g of global.lists) {
        const generator = new (g.generator)(g.url, g.options);
        const folder = path.join(__dirname, "../../data/", g.language);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        fs.writeFileSync(path.join(folder, `${g.filename}.json`), JSON.stringify(await generator.run()));
    }
}

function ensureGlobalLists() {
    if (!Array.isArray(global.lists)) {
        global.lists = [];
    }
}