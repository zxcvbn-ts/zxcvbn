import { DataGenerator } from "../DataGenerator";
import axios from "axios";

export class EnCommonWordsGenerator implements DataGenerator {
    public data: any = [];
    private url: string = "https://gist.githubusercontent.com/h3xx/1976236/raw";

    public async init() {
        console.log("Downloading");
        this.data = await (await axios.get(this.url)).data;
        console.log("Filtering comments");
        this.data = this.data.split("\n").filter((l) => !l.startsWith("#"));
        console.log("Filtering whitespaces");
        this.data = this.data.map((l) => l.trim());
        console.log("Filtering duplicates");
        this.data = this.data.filter((item, pos) => {
            return this.data.indexOf(item) == pos;
        });
    }

    public generateJSON() {
        return this.data;
    }

    public generateTXT() {
        return this.data.join("\n");
    }
}