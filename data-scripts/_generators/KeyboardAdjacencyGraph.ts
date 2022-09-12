import fs, { readdirSync } from 'fs'
import path from 'path'
import { LooseObject } from '../_helpers/runtime'

// returns the six adjacent coordinates on a standard keyboard, where each row is slanted to the
// right from the last. adjacencies are clockwise, starting with key to the left, then two keys
// above, then right key, then two keys below. (that is, only near-diagonal keys are adjacent,
//   so g's coordinate is adjacent to those of t,y,b,v, but not those of r,u,n,c.)
const getSlantedAdjacentCoords = (x: number, y: number) => {
  return [
    `${x - 1},${y}`,
    `${x},${y - 1}`,
    `${x + 1},${y - 1}`,
    `${x + 1},${y}`,
    `${x},${y + 1}`,
    `${x - 1},${y + 1}`,
  ]
}

// returns the nine clockwise adjacent coordinates on a keypad, where each row is vert aligned.
const getAlignedAdjacentCoords = (x: number, y: number) => {
  return [
    `${x - 1},${y}`,
    `${x - 1},${y - 1}`,
    `${x},${y - 1}`,
    `${x + 1},${y - 1}`,
    `${x + 1},${y}`,
    `${x + 1},${y + 1}`,
    `${x},${y + 1}`,
    `${x - 1},${y + 1}`,
  ]
}

const divmod = (value: number, lambda: number) => {
  return [Math.floor(value / lambda), value % lambda]
}

const getCleanedLines = (layout: string) => {
  return layout
    .replace(/ +/g, ' ')
    .split('\n')
    .map((entry) => {
      return entry.replace(/^ /, '')
    })
}

const getLines = (layout: string) => {
  return layout.split('\n')
}

const parseCoordinates = (coordinates: string) => {
  return coordinates.split(',').map((coordinate) => parseInt(coordinate, 10))
}

interface PositionTable {
  [key: string]: string
}

const getPositionTable = (
  layoutStr: string,
  xUnit: number,
  slanted: boolean,
): {
  [key: string]: string
} => {
  const positionTable: PositionTable = {}
  const lines = getLines(layoutStr)
  // eslint-disable-next-line no-restricted-syntax
  for (const [index, line] of lines.entries()) {
    // the way I illustrated keys above, each qwerty row is indented one space in from the last
    const slant = slanted ? index - 1 : 0
    const lineArray = line.split(' ')
    if (line) {
      // eslint-disable-next-line no-restricted-syntax
      for (const token of lineArray) {
        if (token) {
          const [x, remainder] = divmod(line.indexOf(token) - slant, xUnit)
          // eslint-disable-next-line max-depth
          if (remainder !== 0) {
            throw new Error(`unexpected x offset for ${token} in: ${layoutStr}`)
          }
          positionTable[`${x},${index}`] = token
        }
      }
    }
  }

  return positionTable
}

const getTokens = (layoutStr: string) => {
  let tokens: string[] = []
  const cleanedLines = getCleanedLines(layoutStr)
  cleanedLines.forEach((entry) => {
    if (entry && entry !== ' ') {
      const entryTemp = entry.split(' ')
      if (entryTemp[0] === '') {
        entryTemp.shift()
      }
      tokens = [...tokens, ...entryTemp]
    }
  })
  return tokens
}

// builds an adjacency graph as a dictionary: {character: [adjacentCharacters]}.
//     adjacent characters occur in a clockwise order.
//     for example:
//     * on qwerty layout, 'g' maps to ['fF', 'tT', 'yY', 'hH', 'bB', 'vV']
//     * on keypad layout, '7' maps to [null, null, null, '=', '8', '5', '4', null]
const buildGraph = (layoutStr: string, slanted: boolean) => {
  const tokens = getTokens(layoutStr)
  const tokenSize = tokens[0].length
  const xUnit = tokenSize + 1 // x position unit len is token len plus 1 for the following whitespace.
  const adjacencyFunc = slanted
    ? getSlantedAdjacentCoords
    : getAlignedAdjacentCoords

  const tokenLengthMismatch = tokens.every(
    (token) => token.length !== tokenSize,
  )

  if (tokenLengthMismatch) {
    throw new Error(`token length mismatch:\n ${layoutStr}`)
  }

  const positionTable = getPositionTable(layoutStr, xUnit, slanted) // maps from tuple (x,y) -> characters at that position.

  const adjacencyGraph: LooseObject = {}
  Object.entries(positionTable).forEach(([coordinates, chars]) => {
    const [x, y] = parseCoordinates(coordinates)
    const charsArray = chars.split('')
    const adjustedCoords = adjacencyFunc(x, y)
    charsArray.forEach((char) => {
      adjacencyGraph[char] = []
      adjustedCoords.forEach((coordinate) => {
        // position in the list indicates direction
        // (for qwerty, 0 is left, 1 is top, 2 is top right, ...)
        // for edge chars like 1 or m, insert null as a placeholder when needed
        // so that each character in the graph has a same-length adjacency list.
        adjacencyGraph[char].push(positionTable[coordinate] || null)
      })
    })
  })

  return adjacencyGraph
}
const getDirectories = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

const getFiles = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name)

export default class KeyboardAdjacencyGraph {
  run() {
    const scriptsFolder = path.join(__dirname, '..')
    const layoutsFolder = `${scriptsFolder}/keyboardLayouts`
    const languages = getDirectories(layoutsFolder)
    languages.forEach((language) => {
      const layouts = `${layoutsFolder}/${language}`
      const graphs: LooseObject = {}
      const files = getFiles(layouts)
      files.forEach((file) => {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        const fileData = require(`${layouts}/${file}`)
        const layout = fileData.default
        const graph = buildGraph(layout.layout, layout.slanted)

        const filename = file.split('.')[0]
        graphs[filename] = graph
      })
      const graphFile = path.join(
        __dirname,
        '../..',
        `packages/languages/${language}/src/adjacencyGraphs.json`,
      )

      fs.writeFileSync(graphFile, JSON.stringify(graphs))
    })

    return true
  }
}
