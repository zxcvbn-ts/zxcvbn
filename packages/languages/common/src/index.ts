import tempAdjacencyGraphs from './adjacencyGraphs.json'
import diceware from './diceware.json'
import passwords from './passwords.json'

const dictionary = { diceware, passwords }

// reinit the variable because the typescript compile will otherwise just reexport the json file which will break as it's a json file
const adjacencyGraphs = tempAdjacencyGraphs

export { dictionary, adjacencyGraphs }
