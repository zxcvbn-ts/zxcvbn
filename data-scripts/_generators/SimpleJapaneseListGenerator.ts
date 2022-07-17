// @ts-ignore
import Kuroshiro from 'kuroshiro'
// @ts-ignore
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import SimpleListGenerator from './SimpleListGenerator'

export default class SimpleJapaneseListGenerator extends SimpleListGenerator {
  async convertJapanese() {
    const kuroshiro = new Kuroshiro()
    await kuroshiro.init(new KuromojiAnalyzer())
    console.info('Converting hiragana and katakana to romaji')
    const promises = this.data.map(async (entry) => {
      const isKatakana = entry.split('').every((char) => {
        return Kuroshiro.Util.isKatakana(char)
      })
      if (isKatakana) {
        return ''
      }
      return kuroshiro.convert(entry, {
        to: 'romaji',
        romajiSystem: 'passport',
      })
    })
    // eslint-disable-next-line compat/compat
    this.data = await Promise.all(promises)
  }

  public async run(): Promise<string[]> {
    console.info('Downloading')
    const data = await this.getData()
    this.data = data.split(this.options.splitter)
    this.filterOccurrences()
    this.commentPrefixes()
    this.trimWhitespaces()
    this.removeDuplicates()
    await this.convertJapanese()
    this.removeDuplicates()
    this.filterMinLength()
    return this.data
  }
}
