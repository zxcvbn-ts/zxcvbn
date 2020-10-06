export function processSimpleList(list: string, options = {
    splitter: "\n",
    commentPrefixes: ["#", "//"],
    removeDuplicates: true,
    trimWhitespaces: true,
}): string[] {
    let data = list.split(options.splitter);
    console.log(data);
    if (Array.isArray(options.commentPrefixes)) {
        console.log("Filtering comments");
        for (const p of options.commentPrefixes) {
            data = data.filter((l) => !l.startsWith(p));
        }
    }
    console.log(data);
    if (options.trimWhitespaces) {
        console.log("Filtering whitespaces");
        data = data.map((l) => l.trim());
    }
    console.log(data);
    if (options.removeDuplicates) {
        console.log("Filtering duplicates");
        data = data.filter((item, pos) => {
            return data.indexOf(item) == pos;
        });
    }
    console.log(data);
    return data;
}