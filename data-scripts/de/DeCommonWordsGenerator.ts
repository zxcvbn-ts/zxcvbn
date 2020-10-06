import { DataGenerator } from "../DataGenerator";
import axios from "axios";
import { processSimpleList } from "../_helpers/processors/simpleList";

export class DeCommonWordsGenerator implements DataGenerator {
    public data: any = [];
    private url: string = "http://pcai056.informatik.uni-leipzig.de/downloads/etc/legacy/Papers/top1000de.txt";

    public async init() {
        console.log("Downloading");
        this.data = (await axios.get(this.url)).data;
        this.data = processSimpleList(this.data);
    }

    public generateJSON() {
        return this.data;
    }

    public generateTXT() {
        return this.data.join("\n");
    }
}