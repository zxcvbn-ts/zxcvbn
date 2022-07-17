export default {
  4: [
    // for length-4 strings, eg 1191 or 9111, two ways to split:
    [1, 2], // 1 1 91 (2nd split starts at index 1, 3rd at index 2)
    [2, 3], // 91 1 1
  ],
  5: [
    [1, 3], // 1 11 91
    [2, 3], // 11 1 91
    //  [2, 3], // 91 1 11    <- duplicate previous one
    [2, 4], // 91 11 1    <- New and must be added as bug fix
  ],
  6: [
    [1, 2], // 1 1 1991
    [2, 4], // 11 11 91
    [4, 5], // 1991 1 1
  ],
  //  1111991
  7: [
    [1, 3], // 1 11 1991
    [2, 3], // 11 1 1991
    [4, 5], // 1991 1 11
    [4, 6], // 1991 11 1
  ],
  8: [
    [2, 4], // 11 11 1991
    [4, 6], // 1991 11 11
  ],
}
