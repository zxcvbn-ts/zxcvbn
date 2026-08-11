export default function fakerJsExtractor(fileContent: Buffer) {
  return Array.from(
    fileContent.toString('utf8').matchAll(/'((?:\\'|[^'])+)'/g),
    (match: string[]) => match[1].replace(/\\'/g, "'"),
  )
}
