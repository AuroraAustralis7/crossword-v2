import { useEffect, useState } from "react";
import "./App.css";
import CrosswordReader from "./crosswordReader.ts";

type AppProps = {
  cellSize: number;
};

function App({ cellSize }: AppProps) {
  const [selectedCell, setSelectedCell] = useState(0);

  const [lastKey, setLastKey] = useState("");

  // Puzzle info variables
  let puzzleTitle: string | undefined = "";
  let puzzleAuthor: string | undefined = "";
  const [puzzleSolution, setPuzzleSolution] = useState<string[]>([]);
  const [cellCount, setCellCount] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [rowLength, setRowLength] = useState(0);

  // grid init
  const [grid, setGrid] = useState<string[]>([]);

  // crossword info init
  type CrosswordInfoType = Awaited<ReturnType<typeof CrosswordReader>>;

  const [crosswordInfo, setCrosswordInfo] = useState<CrosswordInfoType | null>(
    null,
  );

  useEffect(() => {
    const asyncPuzzleLoader = async () => {
      try {
        const loadingPuzzle = await CrosswordReader();
        setCrosswordInfo(loadingPuzzle);
        puzzleTitle = loadingPuzzle.title;
        puzzleAuthor = loadingPuzzle.author;
        setPuzzleSolution(
          loadingPuzzle.grid.cells.flatMap((row) => {
            return row.map((cell) => cell.solution ?? "N/A");
          }),
        );
        // console.log(puzzleSolution);
        setCellCount(loadingPuzzle.grid.height * loadingPuzzle.grid.width);
        setRowCount(loadingPuzzle.grid.height);
        setRowLength(loadingPuzzle.grid.width);
        setGrid(
          loadingPuzzle.grid.cells.flatMap((row) => {
            return row.map((cell) => "");
          }),
        );
        console.log(loadingPuzzle);
      } catch {
        console.error("Unable to read crossword file. Lock in.");
      }
    };

    asyncPuzzleLoader();
  }, []);

  /*
      This useEffect() hook updates the most recent key.
    */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[a-z]$/i.test(e.key)) {
        setLastKey(e.key.toUpperCase());
      } else {
        return;
      }
      setGrid((currentGrid) =>
        currentGrid.map((cell, index) =>
          puzzleSolution[index] === "N/A"
            ? ""
            : index === selectedCell
              ? e.key.toUpperCase()
              : cell,
        ),
      );
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCell]);

  /*
      This useEffect() hook clears the most recent key
      shortly after it is typed.
    */
  useEffect(() => {
    if (lastKey === "") return;

    const timeoutId = setTimeout(() => {
      setLastKey("");
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [lastKey]);

  // console.log(lastKey);
  // console.log(grid);

  function numbersGrid() {
    const solutionGrid = puzzleSolution;

    let numberGrid = [];
  }

  function answerCheck() {
    return grid == puzzleSolution;
  }

  return (
    <>
      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${rowLength}, ${cellSize}px)`,
        }}
      >
        {grid.map((cellInput, cellInputIndex) => (
          <button
            key={`${cellInputIndex}`}
            className="cell"
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              fontSize: `${cellSize * 0.5}px`,
              backgroundColor:
                puzzleSolution[cellInputIndex] === "N/A"
                  ? "black"
                  : cellInputIndex === selectedCell
                    ? "lightGreen"
                    : "white",
            }}
            onClick={() => {
              setSelectedCell(cellInputIndex);
            }}
          >
            {puzzleSolution[cellInputIndex] === "N/A" ? "" : cellInput}
          </button>
        ))}
      </div>
      <div
        style={{
          paddingTop: "5px",
        }}
      >
        <button
          style={{
            width: `${rowCount * cellSize}px`,
            height: "20px",
          }}
          onClick={() => {
            if (answerCheck()) {
              console.log("WON!");
            } else {
              console.log("NOT YET!");
            }
          }}
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default App;
