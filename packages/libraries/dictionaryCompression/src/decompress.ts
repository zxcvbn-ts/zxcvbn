import { decompressSync, strFromU8 } from 'fflate'
import { decodeBase85 } from '@alttiri/base85'

export default function decompress(encodedString: string) {
  const decoded = decodeBase85(encodedString)
  const decompressedBuffer = decompressSync(decoded)
  const decompressedArray = strFromU8(decompressedBuffer).split(/([A-Z])/g)
  const decompressedData = []
  let last = ''
  let i
  for (i = 1; i < decompressedArray.length; i += 2) {
    last =
      last.slice(0, decompressedArray[i].charCodeAt(0) - 65) +
      decompressedArray[i + 1]
    decompressedData.push(last)
  }

  return decompressedData
}
