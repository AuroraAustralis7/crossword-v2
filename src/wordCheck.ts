function wordCheck(
  inputGrid: string[][],
  answerGrid: (string | null)[][],
  row: number,
  col: number,
) {
  let farthestUp = row;
  let farthestDown = row;
  let farthestLeft = col;
  let farthestRight = col;

  while (farthestUp >= 0 && answerGrid[farthestUp][col] != null) {
    farthestUp -= 1;
  }
  while (
    farthestDown < answerGrid.length &&
    answerGrid[farthestDown][col] != null
  ) {
    farthestDown += 1;
  }
  while (farthestLeft >= 0 && answerGrid[row][farthestLeft] != null) {
    farthestLeft -= 1;
  }
  while (
    farthestRight < answerGrid[0].length &&
    answerGrid[row][farthestRight] != null
  ) {
    farthestRight += 1;
  }

  let upWordCorrect = true;
  let downWordCorrect = true;
  let leftWordCorrect = true;
  let rightWordCorrect = true;

  for (let r = row; r > farthestUp; r--) {
    if (inputGrid[r][col] != answerGrid[r][col]) {
      upWordCorrect = false;
      break;
    }
  }

  for (let r = row; r < farthestDown; r++) {
    if (inputGrid[r][col] != answerGrid[r][col]) {
      downWordCorrect = false;
      break;
    }
  }

  for (let c = col; c > farthestLeft; c--) {
    if (inputGrid[row][c] != answerGrid[row][c]) {
      leftWordCorrect = false;
      break;
    }
  }

  for (let c = col; c < farthestRight; c++) {
    if (inputGrid[row][c] != answerGrid[row][c]) {
      rightWordCorrect = false;
      break;
    }
  }

  let verticalWordCorrect = upWordCorrect && downWordCorrect;
  let horizontalWordCorrect = leftWordCorrect && rightWordCorrect;

  return [verticalWordCorrect, horizontalWordCorrect];
}

export default wordCheck;
