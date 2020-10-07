import { DataGenerator } from "../DataGenerator";
import axios from "axios";
import { processSimpleList } from "../_helpers/processors/simpleList";

export class EnCommonWordsGenerator implements DataGenerator {
    public data: any = [];
    private url: string = "https://gist.githubusercontent.com/h3xx/1976236/raw";

    public async init() {
        console.log("Downloading");
        this.data = await (await axios.get(this.url)).data;
        this.data = processSimpleList(this.data);
    }

    public generateJSON() {
        return this.data;
    }
}