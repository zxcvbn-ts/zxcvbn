import * as fs from "fs";
import * as path from "path";

const DICTIONARIES = {
    us_tv_and_film: 30000,
    english_wikipedia: 30000,
    passwords: 30000,
    surnames: 10000,
    male_names: null,
    female_names: null,
};

/**
 *  @returns {list_name: {token: rank}}, as tokens and ranks occur in each file.
 */
function parse_frequency_lists(data_dir){
    const freq_lists = {}
    for (const filename of fs.readdirSync(data_dir)) {
        const freq_list_name = path.basename(filename).replace(/\.[^/.]+$/, "");
        if (DICTIONARIES[freq_list_name] === undefined) {   
            console.log(`Warning: ${freq_list_name} appears in ${data_dir} directory but not in DICTIONARY settings. Excluding.`);
            continue;
        }
        const token_to_rank = {}
        const content = fs.readFileSync(path.join(data_dir, filename)).toString().split("\n");
        for (const i of content.keys()) {
            const rank = i + 1 // rank starts at 1
            const token = content[i].split(" ")[0]
            token_to_rank[token] = rank;
        }
        freq_lists[freq_list_name] = token_to_rank;
    }
    for (const freq_list_name in DICTIONARIES) {
        if (!freq_lists[freq_list_name]) {
            console.log(`Warning: ${freq_list_name} appears in DICTIONARY settings but not in ${data_dir} directory. Excluding.`)
        }
    }
    return freq_lists;
}

function is_rare_and_short(token, rank) {
    return rank >= 10**token.length
}

function has_comma_or_double_quote(token, rank, lst_name) {
    /* hax, switch to csv or similar if this excludes too much.
    simple comma joining has the advantage of being easy to process
    client-side w/o needing a lib, and so far this only excludes a few
    very high-rank tokens eg 'ps8,000' at rank 74868 from wikipedia list. */
    return token.indexOf(",") !== -1 || token.indexOf("\"") !== -1;
}

function filter_frequency_lists(freq_lists: Record<string, string>) {
    /** 
    filters frequency data according to:
        - filter out short tokens if they are too rare.
        - filter out tokens if they already appear in another dict
          at lower rank.
        - cut off final freq_list at limits set in DICTIONARIES, if any.
    */
    const filtered_token_and_rank: {
        [key: string]: [string, string][]
    } = {} // maps {name: [(token, rank), ...]}
    const token_count: any = {}; // maps freq list name: current token count.
    for (const name in freq_lists) {
        filtered_token_and_rank[name] = [];
        token_count[name] = 0;
    }
    const minimum_rank = {} // maps token -> lowest token rank across all freq lists
    const minimum_name = {} // maps token -> freq list name with lowest token rank
    for (const [name, token_to_rank] of Object.entries(freq_lists)) {
        for (const [token, rank] of Object.entries(token_to_rank)) {
            if (!minimum_rank[token]) {
                if (!minimum_name[token]) {
                    //throw new Error();
                }
                minimum_rank[token] = rank
                minimum_name[token] = name
            } else {
                if (!minimum_name[token]) {
                    //throw new Error();
                }
                if (minimum_name[token] == name) {
                    throw new Error(`same token occurs multiple times in ${name}`);
                }
                const min_rank = minimum_rank[token]
                if (rank < min_rank) {
                    minimum_rank[token] = rank
                    minimum_name[token] = name
                }
            }
        }
    }                
    for (const [name, token_to_rank] of Object.entries(freq_lists)) {
        for (const [token, rank] of Object.entries(token_to_rank)) {
            if (minimum_name[token] != name){
                continue;
            }
            if (is_rare_and_short(token, rank) || has_comma_or_double_quote(token, rank, name)){
                continue;
            }
            filtered_token_and_rank[name].push([token, rank])
            token_count[name] += 1
        }
    }
    const result = {}
    for (let [name, token_rank_pairs] of Object.entries(filtered_token_and_rank)) {
        token_rank_pairs.sort((a, b) => {
            if ( a[1] < b[1] ){
                return -1;
            }
            if ( a[1] > b[1] ){
                return 1;
            }
            return 0;
        });
        const cutoff_limit = DICTIONARIES[name];
        if (cutoff_limit && token_rank_pairs.length > cutoff_limit){
            token_rank_pairs = token_rank_pairs.slice(0, cutoff_limit);
        }
        result[name] = [];
        for (const pair of token_rank_pairs) {
            result[name].push(pair[0]); // discard rank post - sort
        }
    }
    return result;
}

function to_kv(lst, lst_name) {
    const val = `"${lst.join(",")}".split(",")`;
    return `${lst_name}: ${val}`;
}

function main() {
    const data_dir = path.join(__dirname, "../data");
    const output_file = path.join(__dirname, "../src/data/frequency_lists.js");
    const unfiltered_freq_lists = parse_frequency_lists(data_dir)
    const freq_lists = filter_frequency_lists(unfiltered_freq_lists)
    let content = "";
    content += 'var frequency_lists;\n\nfrequency_lists = {\n  ';
    const lines: string[] = [];
    for (const [name, lst] of Object.entries(freq_lists)) {
        lines.push(to_kv(lst, name))
    }
    content += lines.join(',\n  ');
    content += '\n};\n\nexport default frequency_lists;\n';
    fs.writeFileSync(output_file, content);
}

main();