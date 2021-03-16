import axios from 'axios'
import { promises as fs } from 'fs'

export type Options = {
    url: string
    row: number
    column: number
    trimWhitespaces?: boolean
    toLowerCase?: boolean
    removeDuplicates?: boolean
    /**
     * The occurences count should be the cell after (right side) of the name.
     * Set to undefined if occurences are missing in the excel file
     */
    minOccurrences?: number
}

const defaultOptions: Options = {
    url: '',
    row: 1,
    occurence_column: 1,
	value_column: 0,
	separator: '\t', // default tab separator 
    trimWhitespaces: true,
    toLowerCase: true,
    removeDuplicates: true,
}

export class TxtGenerator {
    public options: Options

    values: string[] = []

    constructor(options: Options) {
        this.options = { ...defaultOptions }
        Object.assign(this.options, options)
    }

    private trimWhitespaces() {
        if (this.options.trimWhitespaces) {
            console.info('Filtering whitespaces')
            this.values = this.values.map((l) => l.trim())
        }
    }

    private convertToLowerCase() {
        if (this.options.toLowerCase) {
            console.info('Converting to lowercase')
            this.values = this.values.map((l) => l.toLowerCase())
        }
    }

    private removeDuplicates() {
        if (this.options.removeDuplicates) {
            console.info('Filtering duplicates')
            this.values = this.values.filter((item, pos) => {
                return this.values.indexOf(item) === pos
            })
        }
    }

    public async run(output: string) {
        var request = require('request');
        var JSZip = require("jszip");

        // Download the file
        console.info('Fetching file')
        const response = await axios.get(this.options.url, {
            responseType: 'arraybuffer',
        });
        const data = new Uint8Array(response.data);
		
		let content = [];
		
        content = await JSZip.loadAsync(data).then(function (zip) {
            return zip.file(Object.keys(zip.files)[0]).async("string");
        }).then(function (text) {

            let alltextlines = text.split(/\r/);
            return alltextlines;
			
        });
		 for (let i = 0; i < content.length; i++) {
			 if(i > this.options.row) {
                // split content 
				const regexstring = this.options.separator;
				const regexp = new RegExp(regexstring, "g");		
                let line = content[i].split(regexp);

				// If no occurence found in file, use 0 by default
				let occurence = 0; 
				if (line[this.options.occurence_column]) {
					occurence = line[this.options.occurence_column];
				}
				if (isNaN(+occurence)) {
					throw new Error(`Expecting number at column ${this.options.occurence_column}`)
				}
				if (occurence < this.options.minOccurrences) {
					// Don't add this one
					// eslint-disable-next-line no-continue
					continue
				}
				else {
					if (!this.values.includes(line[this.options.value_column])) {
					   this.values.push(line[this.options.value_column]);
					}
				}
			 }
			 
		 }
		// remove empty values 
		this.values = this.values.filter((l) => l.length > 0);
		// get from requested row number
		this.values = this.values.slice(this.options.row);
		
        this.trimWhitespaces();
        this.convertToLowerCase();
        this.removeDuplicates();

        console.info('Saving to disk')
        const json = JSON.stringify(this.values);
        fs.writeFile(`${output}.json`, json)
    }
}
