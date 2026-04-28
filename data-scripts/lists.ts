import PasswordGenerator from './_generators/PasswordGenerator'
import KeyboardAdjacencyGraph from './_generators/KeyboardAdjacencyGraph'
import { ExcelGenerator } from './_generators/ExcelGenerator'
import { TxtGenerator } from './_generators/TxtGenerator'
import ApiGenerator from './_generators/ApiGenerator'
import HTMLGenerator from './_generators/HTMLGenerator'
import SimpleJapaneseListGenerator from './_generators/SimpleJapaneseListGenerator'
import SimpleChineseListGenerator from './_generators/SimpleChineseListGenerator'
import latin2Decoder from './latin2Decoder'
import CommonWordsGenerator from './_generators/CommonWordsGenerator'

export interface LanguageListEntry {
  source?: string
  options?: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  generator?: Function
  customList?: boolean
}

export type LanguageList = Record<string, Record<string, LanguageListEntry>>

const polishFirstnamesOptions = {
  hasOccurrences: true,
  minOccurrences: 200,
  splitter: '\r\n',
  clearLine: (line: string) => {
    const lineArray = line.split(',')
    return `${lineArray[0]} ${lineArray[2]}`
  },
}

export default {
  'en': {
    commonWords: {
      generator: CommonWordsGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/en.freq.gz',
      options: { hasOccurrences: true },
    },
    firstnames: {
      source:
        'https://raw.githubusercontent.com/dominictarr/random-name/master/first-names.txt',
    },
    lastnames: {
      source:
        'https://raw.githubusercontent.com/arineng/arincli/master/lib/last-names.txt',
    },
  },
  'da-dk': {
    commonWords: {
      generator: CommonWordsGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/da.freq.gz',
      options: { hasOccurrences: true },
    },
    maleFirstnames: {
      source:
        'https://raw.githubusercontent.com/n0kovo/danish-wordlists/main/first_names_male_2021.txt',
    },
    femaleFirstnames: {
      source:
        'https://raw.githubusercontent.com/n0kovo/danish-wordlists/main/first_names_female_2021.txt',
    },
    lastnames: {
      source:
        'https://raw.githubusercontent.com/n0kovo/danish-wordlists/main/last_names_2021.txt',
    },
  },
  'pl': {
    commonWords: {
      generator: CommonWordsGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/pl.freq.gz',
    },
    maleFirstnames: {
      source:
        'https://api.dane.gov.pl/resources/42873,lista-imion-meskich-w-rejestrze-pesel-stan-na-24012022-imie-pierwsze/csv',
      options: polishFirstnamesOptions,
    },
    femaleFirstnames: {
      source:
        'https://api.dane.gov.pl/resources/42874,lista-imion-zenskich-w-rejestrze-pesel-stan-na-24012022-imie-pierwsze/csv',
      options: polishFirstnamesOptions,
    },
    maleLastnames: {
      source:
        'https://api.dane.gov.pl/resources/36401,nazwiska-meskie-stan-na-2022-01-27/csv',
      options: {
        hasOccurrences: true,
        occurrenceSeparator: ',',
        splitter: '\r\n',
        minOccurrences: 200,
      },
    },
    femaleLastnames: {
      source:
        'https://api.dane.gov.pl/resources/38772,nazwiska-zenskie-stan-na-2022-01-27/csv',
      options: {
        hasOccurrences: true,
        occurrenceSeparator: ',',
        splitter: '\r\n',
        minOccurrences: 200,
      },
    },
  },
  'de': {
    commonWords: {
      generator: CommonWordsGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/de.freq.gz',
    },
    firstnames: {
      source:
        'https://gist.githubusercontent.com/hrueger/2aa48086e9720ee9b87ec734889e1b15/raw',
    },
    lastnames: {
      source:
        'https://gist.githubusercontent.com/hrueger/6599d1ac1e03b4c3dc432d722ffcefd0/raw',
    },
  },
  'nl-be': {
    commonWords: {
      generator: CommonWordsGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/nl.freq.gz',
    },
    boysFirstnames: {
      generator: ExcelGenerator,
      customList: true,
      options: {
        url: 'https://statbel.fgov.be/sites/default/files/files/documents/bevolking/5.10%20Namen%20en%20voornamen/5.10.%203%20Voornamen%20meisjes%20en%20jongens/Voornamen_Jongens_1995-2017_0.xls',
        column: 8,
        row: 2,
        sheetName: '1995-2019',
        minOccurrences: 50,
      },
    },
    girlsFirstnames: {
      generator: ExcelGenerator,
      customList: true,
      options: {
        url: 'https://statbel.fgov.be/sites/default/files/files/documents/bevolking/5.10%20Namen%20en%20voornamen/5.10.%203%20Voornamen%20meisjes%20en%20jongens/Voornamen_meisjes_1995-2017.xls',
        column: 8,
        row: 2,
        sheetName: '1995-2019',
        minOccurrences: 50,
      },
    },
    lastnames: {
      generator: ExcelGenerator,
      customList: true,
      options: {
        url: 'https://statbel.fgov.be/sites/default/files/files/documents/bevolking/5.10%20Namen%20en%20voornamen/5.10.1%20Familienamen/Familienamen_2020.xlsx',
        column: 5,
        row: 2,
        minOccurrences: 50,
      },
    },
  },
  'fi': {
    commonWords: {
      generator: CommonWordsGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/fi.freq.gz',
    },
    maleFirstnames: {
      generator: ExcelGenerator,
      customList: true,
      options: {
        url: 'https://www.avoindata.fi/data/dataset/57282ad6-3ab1-48fb-983a-8aba5ff8d29a/resource/08c89936-a230-42e9-a9fc-288632e234f5/download/etunimitilasto-2022-08-04-dvv.xlsx',
        column: 1,
        row: 2,
        sheetName: 'Miehet kaikki',
        minOccurrences: 50,
      },
    },
    femaleFirstnames: {
      generator: ExcelGenerator,
      customList: true,
      options: {
        url: 'https://www.avoindata.fi/data/dataset/57282ad6-3ab1-48fb-983a-8aba5ff8d29a/resource/08c89936-a230-42e9-a9fc-288632e234f5/download/etunimitilasto-2022-08-04-dvv.xlsx',
        column: 1,
        row: 2,
        sheetName: 'Naiset kaikki',
        minOccurrences: 50,
      },
    },
    lastnames: {
      generator: ExcelGenerator,
      customList: true,
      options: {
        url: 'https://www.avoindata.fi/data/dataset/57282ad6-3ab1-48fb-983a-8aba5ff8d29a/resource/957d19a5-b87a-4c4d-8595-49c22d9d3c58/download/sukunimitilasto-2022-08-04-dvv.xlsx',
        column: 1,
        row: 2,
        sheetName: 'Nimet',
        minOccurrences: 50,
      },
    },
  },
  'fr': {
    commonWords: {
      generator: CommonWordsGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/fr.freq.gz',
    },
    firstnames: {
      generator: TxtGenerator,
      customList: true,
      options: {
        url: 'https://www.insee.fr/fr/statistiques/fichier/3536630/noms2008nat_txt.zip',
        occurrenceColumn: 11,
        row: 2,
        minOccurrences: 100,
      },
    },
    lastnames: {
      generator: TxtGenerator,
      customList: true,
      options: {
        url: 'https://www.insee.fr/fr/statistiques/fichier/2540004/nat2021_csv.zip',
        occurrenceColumn: 3,
        valueColumn: 1,
        separator: ';',
        row: 2,
        minOccurrences: 100,
      },
    },
  },
  'id': {
    commonWords: {
      generator: CommonWordsGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/id.freq.gz',
    },
    names: {
      source:
        'https://gist.githubusercontent.com/bgwastu/35c80cdd8c32ca0b6aafa119e80e93ef/raw/13c57d71a3eaea0f59823eca5d22d1fb270aa56c/indonesia_names.txt',
    },
  },
  'es-es': {
    commonWords: {
      generator: CommonWordsGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/es.freq.gz',
    },
    firstnames: {
      generator: ExcelGenerator,
      customList: true,
      options: {
        url: 'https://www.ine.es/daco/daco42/nombyapel/nombres_por_edad_media.xls',
        column: 2,
        row: 8,
        minOccurrences: 500,
        splitCompoundNames: true,
      },
    },
    lastnames: {
      generator: ExcelGenerator,
      customList: true,
      options: {
        url: 'https://www.ine.es/daco/daco42/nombyapel/apellidos_frecuencia.xls',
        column: 2,
        row: 6,
        minOccurrences: 500,
      },
    },
  },
  'it': {
    commonWords: {
      generator: CommonWordsGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/it.freq.gz',
    },
    firstnames: {
      source:
        'https://gist.github.com/allanlewis/ddfe6e7053fd12986589c52edf6ef856/raw/bc6ca7a55527930ec5f25e448c3aa0a7deee2de6/italian-first-names.txt',
    },
    lastnames: {
      // Same as English
      source:
        'https://gist.github.com/allanlewis/ddfe6e7053fd12986589c52edf6ef856/raw/bc6ca7a55527930ec5f25e448c3aa0a7deee2de6/italian-last-names.txt',
    },
  },
  'ro': {
    commonWords: {
      generator: CommonWordsGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/ro.freq.gz',
    },
    firstnames: {
      source:
        'https://raw.githubusercontent.com/daniesy/romanian/main/firstnames.txt',
    },
    lastnames: {
      source:
        'https://raw.githubusercontent.com/daniesy/romanian/main/lastnames.txt',
    },
  },
  'hr': {
    commonWords: {
      generator: CommonWordsGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/hr.freq.gz',
      options: { normalizeDiacritics: true },
    },
    firstnames: {
      generator: HTMLGenerator,
      source:
        'https://raw.githubusercontent.com/faker-js/faker/main/src/locales/hr/person/first_name.ts',
      options: {
        normalizeDiacritics: true,
        extractorFunction: (fileContent: Buffer) => {
          return Array.from(
            fileContent.toString('utf8').matchAll(/'((?:\\'|[^'])+)'/g),
            (match: string[]) => match[1].replace(/\\'/g, "'"),
          )
        },
      },
    },
    lastnames: {
      generator: HTMLGenerator,
      source:
        'https://raw.githubusercontent.com/faker-js/faker/main/src/locales/hr/person/last_name.ts',
      options: {
        normalizeDiacritics: true,
        extractorFunction: (fileContent: Buffer) => {
          return Array.from(
            fileContent.toString('utf8').matchAll(/'((?:\\'|[^'])+)'/g),
            (match: string[]) => match[1].replace(/\\'/g, "'"),
          )
        },
      },
    },
  },
  'pt-br': {
    commonWords: {
      generator: CommonWordsGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/pt_BR.freq.gz',
    },
    firstnames: {
      generator: ApiGenerator,
      source: 'https://servicodados.ibge.gov.br/api/v1/censos/nomes/faixa',
      options: {
        hasOccurrences: true,
        requestConfig: {
          params: {
            qtd: 5000,
            faixa: 2010,
          },
        },
        mapFunction: (entry: any) => {
          return {
            name: entry.nome,
            occurrences: entry.freq,
          }
        },
      },
    },
    lastnames: {
      generator: HTMLGenerator,
      source:
        'https://pt.wiktionary.org/wiki/Ap%C3%AAndice:Sobrenomes_em_portugu%C3%AAs',
      options: {
        extractorFunction: (HTMLData: Buffer) => {
          const REGEX = /<li><a .*>([A-z]+)<\/a><\/li>/g
          const lastnamesArray = Array.from(
            HTMLData.toString().matchAll(REGEX),
            (m: string[]) => m[1],
          )
          return lastnamesArray
        },
      },
    },
  },
  'zh': {
    commonWords: {
      generator: SimpleChineseListGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/zh_CN.freq.gz',
    },
    firstnames: {
      source:
        'https://raw.githubusercontent.com/limzykenneth/chinese-wordlist/master/pinyin.txt',
    },
    lastnames: {
      source:
        'https://raw.githubusercontent.com/Greenwolf/Spray/master/name-lists/chinese-last-100.txt',
    },
  },
  'ja': {
    commonWords: {
      generator: SimpleJapaneseListGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/ja.freq.gz',
    },
    firstnames: {
      source:
        'https://raw.githubusercontent.com/tomoyukikashiro/zxcvbn-japanese-data/main/data/first-names.txt.txt',
    },
    lastnames: {
      source:
        'https://raw.githubusercontent.com/tomoyukikashiro/zxcvbn-japanese-data/main/data/last-names.txt.txt',
    },
  },
  'cs': {
    commonWords: {
      generator: CommonWordsGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/cs.freq.gz',
      options: { normalizeDiacritics: true },
    },
    firstnames: {
      generator: HTMLGenerator,
      source:
        'https://krestnijmeno.prijmeni.cz/oblast/3000-ceska_republika/muzska_jmena&page=__PAGINATION__',
      options: {
        pagination: 15,
        normalizeDiacritics: true,
        requestConfig: {
          responseType: 'arraybuffer',
        },
        extractorFunction: (HTMLData: Buffer) => {
          const REGEX =
            /<tr class="itemjmeno"><td>\d{1,4}\.<\/td><td><a href='.*'>(.+)<\/a><\/td><td>\d*<\/td><\/tr>/g

          const firstnamesArray = Array.from(
            latin2Decoder(HTMLData).matchAll(REGEX),
            (m: string[]) => {
              return m[1]
            },
          )
          return firstnamesArray
        },
      },
    },
    lastnames: {
      generator: HTMLGenerator,
      source:
        'https://www.prijmeni.cz/oblast/3000-ceska_republika&page=__PAGINATION__',
      options: {
        pagination: 50,
        normalizeDiacritics: true,
        requestConfig: {
          responseType: 'arraybuffer',
        },
        extractorFunction: (HTMLData: Buffer) => {
          const REGEX =
            /<tr class="itemprijmeni"><td>\d{1,2}\.<\/td><td><a href='.*'>(.+)<\/a><\/td><td>\d*<\/td><\/tr>/g
          const lastnamesArray = Array.from(
            latin2Decoder(HTMLData).matchAll(REGEX),
            (m: string[]) => m[1],
          )
          return lastnamesArray
        },
      },
    },
  },
  'ar': {
    /**
     * Exclusion of Common Words in Arabic Language for Passwords
     * 1. **Arabic Letter Usage**: In practice, speakers of the Arabic language often do not use standard Arabic letters in their passwords. When they do, the passwords are generally more secure.
     * 2. **Lack of Standardized Romanization**: Unlike languages such as Japanese, there is no widely-accepted method for converting Arabic letters into Roman letters. This makes it challenging to apply a common conversion algorithm for password security.
     */
    // commonWords: {
    //   generator: CommonWordsGenerator,
    //   source:
    //     'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/ar.freq.gz',
    //   options: { normalizeDiacritics: true },
    // },
    firstnames: {
      source:
        'https://raw.githubusercontent.com/AKhateeb/arabic-names/master/Most-Popular-Arabic-FirstNames.txt',
    },
    lastnames: {
      source:
        'https://raw.githubusercontent.com/AKhateeb/arabic-names/master/Most-Popular-Arabic-LastNames.txt',
    },
  },
  'fa': {
    /**
     * Exclusion of Common Words in Persian Language for Passwords
     * 1. **Persian Letter Usage**: In practice, speakers of the Persian language often do not use standard Persian letters in their passwords. When they do, the passwords are generally more secure.
     * 2. **Lack of Standardized Romanization**: Unlike languages such as Japanese, there is no widely-accepted method for converting Persian letters into Roman letters. This makes it challenging to apply a common conversion algorithm for password security.
     */
    // commonWords: {
    //   generator: CommonWordsGenerator,
    //   source:
    //     'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/fa.freq.gz',
    // },
    firstnames: {
      source:
        'https://raw.githubusercontent.com/winkcor/persian-first-names/refs/heads/main/persian-first-names.txt',
    },
    lastnames: {
      source:
        'https://raw.githubusercontent.com/farbodbj/iranian-surname-frequencies/refs/heads/github-master/iranian-surname-frequencies.csv',
      options: {
        hasOccurrences: true,
        minOccurrences: 0.001, // filter very rare names
        splitter: '\n',
        clearLine: (line: string) => {
          if (line.startsWith('name,')) return ''

          const [, frequency, nameEnglish] = line.split(',')

          if (!nameEnglish || !/^[A-Za-z]+$/.test(nameEnglish)) return ''

          return `${nameEnglish} ${Number(frequency)}`
        },
      },
    },
  },
  'th': {
    commonWords: {
      generator: CommonWordsGenerator,
      source:
        'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/th.freq.gz',
    },
  },
  'common': {
    passwords: {
      generator: PasswordGenerator,
      customList: true,
    },
    keyboardLayouts: {
      generator: KeyboardAdjacencyGraph,
      customList: true,
    },
  },
} as LanguageList
