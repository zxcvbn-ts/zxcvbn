// @ts-expect-error for testing purposes
import pinyin from 'chinese-to-pinyin'
import CommonWordsGenerator from './CommonWordsGenerator'

function containsChinese(text: string) {
  // Matches common Chinese character ranges
  return /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/.test(text)
}
export default class SimpleChineseListGenerator extends CommonWordsGenerator {
  async convertChinese() {
    console.info('Converting chinese to pinyin')
    const promises = this.data.map((entry) => {
      if (containsChinese(entry)) {
        return pinyin(entry)
      }
      return entry
    })

    this.data = await Promise.all(promises)
  }

  public async run(): Promise<string[]> {
    console.info('Downloading')
    const data = await this.getData()
    this.data = data.split(this.options.splitter)
    this.clearLine()
    this.filterOccurrences()
    this.commentPrefixes()
    this.trimWhitespaces()
    this.removeDuplicates()
    await this.convertChinese()
    this.removeDuplicates()
    this.filterMinLength()
    return this.data
  }
}
