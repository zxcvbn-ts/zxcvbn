export function processSimpleList(list: string, options = {
    splitter: "\n",
    commentPrefixes: ["#", "//"],
    removeDuplicates: true,
    trimWhitespaces: true,
    toLowerCase: false,
}): string[] {
    let data = list.split(options.splitter);
    if (Array.isArray(options.commentPrefixes)) {
        console.log("Filtering comments");
        for (const p of options.commentPrefixes) {
            data = data.filter((l) => !l.startsWith(p));
        }
    }
    if (options.trimWhitespaces) {
        console.log("Filtering whitespaces");
        data = data.map((l) => l.trim());
    }
    if (options.removeDuplicates) {
        console.log("Filtering duplicates");
        data = data.filter((item, pos) => {
            return data.indexOf(item) == pos;
        });
    }
    if (options.toLowerCase) {
        console.log("Converting to lowercase");
        data = data.map((l) => l.toLowerCase());
    }
    return data;
}