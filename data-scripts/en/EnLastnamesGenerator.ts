import { DataGenerator } from "../DataGenerator";
import axios from "axios";
import { processSimpleList } from "../_helpers/processors/simpleList";

export class EnLastnamesGenerator implements DataGenerator {
    public data: any = [];
    private url: string = "https://raw.githubusercontent.com/arineng/arincli/master/lib/last-names.txt";

    public async init() {
        console.log("Downloading");
        this.data = await (await axios.get(this.url)).data;
        this.data = processSimpleList(this.data, { toLowerCase: true });
    }

    public generateJSON() {
        return this.data;
    }
}