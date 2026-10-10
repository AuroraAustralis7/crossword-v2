import { useState } from "react";
import wordCheck from "./wordCheck.ts";

{
  /*
    10/6/26:
    WHAT STILL NEEDS TO BE DONE:
    onChange and updating the grid whenever a word
    is correct!

    10/7/26:
    WHAT STILL NEEDS TO BE DONE:
    Hints and the numbers for each word
  */
}

type cellProps = {
  answer: string | null;
  input: string;
  correct: boolean;
  dimension: string;
  onChange: (value: string) => void;
};

type answerGridProps = {
  answerGrid: (string | null)[][];
  cellDimension: string;
};

function Cell({ answer, input, correct, dimension, onChange }: cellProps) {
  return (
    <input
      maxLength={1}
      data-answer={answer}
      value={input.toUpperCase()}
      data-valid={correct}
      onChange={(event) => onChange(event.target.value.toUpperCase())}
      style={{
        fontSize: "16px",
        width: dimension,
        height: dimension,
        textAlign: "center",
        outline: "none",
        border: "1px solid black",
        boxSizing: "border-box",
        flex: "0 0 auto",
        backgroundColor:
          answer === null ? "black" : correct ? "LightGreen" : "white",
        userSelect: "none",
      }}
      readOnly={answer === null}
    />
  );
}

function App(props: answerGridProps) {
  const ROWS = props.answerGrid.length;
  const COLS = props.answerGrid[0].length;
  const [grid, setGrid] = useState(
    Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => "")),
  );

  return (
    <>
      {grid.map((row, rowIndex) => (
        <div
          style={{
            height: props.cellDimension,
            display: "flex",
          }}
        >
          {row.map((_: any, colIndex: number) => {
            const [verticalCorrect, horizontalCorrect] = wordCheck(
              grid,
              props.answerGrid,
              rowIndex,
              colIndex,
            );
            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                answer={props.answerGrid[rowIndex][colIndex]}
                input={grid[rowIndex][colIndex]}
                correct={verticalCorrect || horizontalCorrect}
                dimension={props.cellDimension}
                onChange={(value) => {
                  setGrid((currentGrid) =>
                    currentGrid.map((row, currentRowIndex) =>
                      currentRowIndex === rowIndex
                        ? row.map((col, currentColIndex) => {
                            return currentColIndex === colIndex ? value : col;
                          })
                        : row,
                    ),
                  );
                }}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default App;
