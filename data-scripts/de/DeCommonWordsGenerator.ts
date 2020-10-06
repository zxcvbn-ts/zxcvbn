import { DataGenerator } from "../DataGenerator";
import axios from "axios";

export class DeCommonWordsGenerator implements DataGenerator {
    public data: any = [];
    private url: string = "http://pcai056.informatik.uni-leipzig.de/downloads/etc/legacy/Papers/top1000de.txt";

    public async init() {
        console.log("Downloading");
        this.data = (await axios.get(this.url)).data;
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