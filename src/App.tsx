import { useState } from "react";
import wordCheck from "./wordCheck.ts";

{
  /*
    10/6/26:
    WHAT STILL NEEDS TO BE DONE:
    onChange and updating the grid whenever a word
    is correct!
  */
}

type cellProps = {
  answer: String | null;
  input: String;
  correct: boolean;
};

type answerGridProps = {
  answerGrid: (string | null)[][];
};

function Cell({ answer, input, correct }: cellProps) {
  return (
    <input
      maxLength={1}
      data-answer={answer}
      data-input={input}
      data-valid={correct}
      style={{
        fontSize: "25px",
        width: "50px",
        height: "50px",
        textAlign: "center",
        backgroundColor: answer === null ? "black" : "white",
      }}
      readOnly={answer === null}
    />
  );
}

function App(props: answerGridProps) {
  const ROWS = 3;
  const COLS = 3;
  const [grid, setGrid] = useState(
    Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => "")),
  );

  return (
    <>
      {grid.map((row, rowIndex) => (
        <div style={{ height: "50px" }}>
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
                input=""
                correct={verticalCorrect || horizontalCorrect}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default App;
