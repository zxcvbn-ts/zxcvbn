import { IDataGenerator } from "./IDataGenerator";
import axios from "axios";

type Options = {
    splitter: string,
    commentPrefixes: string[],
    removeDuplicates: boolean,
    trimWhitespaces: boolean,
    toLowerCase: boolean,
};

const defaultOptions: Options = {
    splitter: "\n",
    commentPrefixes: ["#", "//"],
    removeDuplicates: true,
    trimWhitespaces: true,
    toLowerCase: true,
}

export class SimpleListGenerator implements IDataGenerator {
    public data: any = [];
    private url: string;
    private options: Options;

    constructor(url: string, options: any) {
        this.url = url;
        this.options = Object.assign(options || {}, defaultOptions);
        return this;
    }

    public async run(): Promise<string[]> {
        console.log("Downloading");
        this.data = (await axios.get(this.url)).data;
        this.data = this.data.split(this.options.splitter);
        if (Array.isArray(this.options.commentPrefixes)) {
            console.log("Filtering comments");
            for (const p of this.options.commentPrefixes) {
                this.data = this.data.filter((l) => !l.startsWith(p));
            }
        }
        if (this.options.trimWhitespaces) {
            console.log("Filtering whitespaces");
            this.data = this.data.map((l) => l.trim());
        }
        if (this.options.removeDuplicates) {
            console.log("Filtering duplicates");
            this.data = this.data.filter((item, pos) => {
                return this.data.indexOf(item) == pos;
            });
        }
        if (this.options.toLowerCase) {
            console.log("Converting to lowercase");
            this.data = this.data.map((l) => l.toLowerCase());
        }
        return this.data;
    }
}