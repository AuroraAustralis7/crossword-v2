import { useEffect, useState } from "react";
import "./App.css";
import CrosswordReader from "./crosswordReader.ts";

type AppProps = {
  cellSize: number;
};

function App({ cellSize }: AppProps) {
  const [won, setWon] = useState(false);
  const [selectedCell, setSelectedCell] = useState(0);

  const [lastKey, setLastKey] = useState("");

  // Puzzle info variables
  const [puzzleSolution, setPuzzleSolution] = useState<string[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [rowLength, setRowLength] = useState(0);
  const [numberLabelGrid, setNumberLabelGrid] = useState<number[]>([])

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
        const loadingPuzzleSolution = loadingPuzzle.grid.cells.flatMap((row) => {
          return row.map((cell) => cell.solution ?? "N/A");
        })
        setPuzzleSolution(loadingPuzzleSolution);
        // console.log(puzzleSolution);
        setRowCount(loadingPuzzle.grid.height);
        setRowLength(loadingPuzzle.grid.width);
        setGrid(
          loadingPuzzle.grid.cells.flatMap((row) => {
            return row.map((_) => "");
          }),
        );

        // number init
        setNumberLabelGrid(loadingPuzzle.grid.cells.flatMap((row) => {
          return row.map((cell) => cell.number ?? -1);
        }));
        // console.log(numberPlacer(loadingPuzzleSolution, loadingPuzzle.clues.across, loadingPuzzle.clues.down, loadingPuzzle.grid.width, loadingPuzzle.grid.height))
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

  function answerCheck() {
    return (
      grid.length === puzzleSolution.length &&
      grid.every((cell, index) => {
        const solutionCell = puzzleSolution[index] === "N/A"
          ? ""
          : puzzleSolution[index];

        return cell === solutionCell;
      })
    );
  }

  return (
    <>
      <div className="all">
        <div>
          <div>
            <h2>
              {crosswordInfo?.title}
            </h2>
            <h2>
              {crosswordInfo?.author}
            </h2>
          </div>
          <div
            className="grid"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${rowLength}, ${cellSize}px)`,
            }}
          >
            {grid.map((cellInput, cellInputIndex) => (
              <div
                className="container"
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                }}>
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
                <p
                  className="numberOverlay"
                  style={{
                    fontSize: "10px",
                    userSelect: 'none'
                  }}>
                  {numberLabelGrid[cellInputIndex] != -1 ? numberLabelGrid[cellInputIndex] : ""}
                </p>
              </div>

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
                  setWon(true);
                } else {
                  setWon(false);
                }
              }}
            >
              Submit
            </button>
          </div>
          <div
            style={{
              paddingTop: "5px",
            }}
          >
            <p>
              Status: {won ? "Completed" : "Not done yet"}
            </p>
          </div>
        </div>
        <div className="clues">
          <div>
            <h3>
              Across:
            </h3>
            <ul>
              {
                crosswordInfo?.clues.across.map((clue) => {
                  return (
                    <li>
                      {clue.number}: {clue.text}
                    </li>
                  )
                })
              }
            </ul>
          </div>
          <div>
            <h3>
              Down:
            </h3>
            <ul>
              {
                crosswordInfo?.clues.down.map((clue) => {
                  return (
                    <li>
                      {clue.number}: {clue.text}
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
