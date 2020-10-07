import { SimpleListGenerator } from "./_generators/SimpleListGenerator";
import { registerList, run } from "./_helpers/runtime";

registerList("en", "commonWords", "https://gist.githubusercontent.com/h3xx/1976236/raw", SimpleListGenerator);
registerList("en", "firstnames", "https://raw.githubusercontent.com/dominictarr/random-name/master/first-names.txt", SimpleListGenerator);
registerList("en", "lastnames", "https://raw.githubusercontent.com/arineng/arincli/master/lib/last-names.txt", SimpleListGenerator);

registerList("de", "commonWords", "http://pcai056.informatik.uni-leipzig.de/downloads/etc/legacy/Papers/top1000de.txt", SimpleListGenerator);

run();