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
    toLowerCase: false,
}

export function processSimpleList(list: string, options?: Partial<Options>): string[] {
    const effectiveOptions = Object.assign(defaultOptions, options);
    let data = list.split(effectiveOptions.splitter);
    if (Array.isArray(effectiveOptions.commentPrefixes)) {
        console.log("Filtering comments");
        for (const p of effectiveOptions.commentPrefixes) {
            data = data.filter((l) => !l.startsWith(p));
        }
    }
    if (effectiveOptions.trimWhitespaces) {
        console.log("Filtering whitespaces");
        data = data.map((l) => l.trim());
    }
    if (effectiveOptions.removeDuplicates) {
        console.log("Filtering duplicates");
        data = data.filter((item, pos) => {
            return data.indexOf(item) == pos;
        });
    }
    if (effectiveOptions.toLowerCase) {
        console.log("Converting to lowercase");
        data = data.map((l) => l.toLowerCase());
    }
    return data;
}