import { useEffect, useState } from "react";
import "./App.css";
import CrosswordReader from "./crosswordReader.ts";

type AppProps = {
  cellSize: number;
};

function App({ cellSize }: AppProps) {
  const [won, setWon] = useState(false);
  const [selectedCell, setSelectedCell] = useState(0);

  // user info
  const [lastKey, setLastKey] = useState("");
  const [vertical, setVertical] = useState(true);

  // Puzzle info variables
  const [puzzleSolution, setPuzzleSolution] = useState<string[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [rowLength, setRowLength] = useState(0);
  const [numberLabelGrid, setNumberLabelGrid] = useState<number[]>([]);

  // grid init
  const [grid, setGrid] = useState<string[]>([]);

  // crossword info init
  type CrosswordInfoType = Awaited<ReturnType<typeof CrosswordReader>>;

  const [crosswordInfo, setCrosswordInfo] = useState<CrosswordInfoType | null>(
    null,
  );

  /*
    check crossword info from .puz file
  */

  useEffect(() => {
    const asyncPuzzleLoader = async () => {
      try {
        const loadingPuzzle = await CrosswordReader();
        setCrosswordInfo(loadingPuzzle);
        const loadingPuzzleSolution = loadingPuzzle.grid.cells.flatMap(
          (row) => {
            return row.map((cell) => cell.solution ?? "N/A");
          },
        );
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
        setNumberLabelGrid(
          loadingPuzzle.grid.cells.flatMap((row) => {
            return row.map((cell) => cell.number ?? -1);
          }),
        );
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
      let key = e.key.toUpperCase();
      if (/^[a-z]$/i.test(e.key)) {
        setLastKey(key);
        if (vertical) {
          let newCell = selectedCell;
          if (puzzleSolution[newCell] != "N/A") {
            newCell = (newCell + rowLength) % (rowLength * rowCount);
          }
          let maxSteps = 0;
          while (puzzleSolution[newCell] == "N/A" && maxSteps < rowCount) {
            newCell = (newCell + rowLength) % (rowLength * rowCount);
            maxSteps++;
          }
          setSelectedCell(newCell);
        } else {
          let newCell = selectedCell;
          if (puzzleSolution[newCell] != "N/A") {
            newCell =
              (((newCell % rowLength) + 1) % rowLength) +
              newCell -
              (newCell % rowLength);
          }
          let maxSteps = 0;
          while (puzzleSolution[newCell] == "N/A" && maxSteps < rowLength) {
            newCell =
              (((newCell % rowLength) + 1) % rowLength) +
              newCell -
              (newCell % rowLength);
            maxSteps++;
          }
          setSelectedCell(newCell);
        }
      } else if (key === "BACKSPACE") {
        key = "";
        setLastKey(key);
        if (vertical) {
          let newCell = selectedCell;
          if (puzzleSolution[newCell] != "N/A") {
            const wrap = rowLength * rowCount;
            newCell = (newCell - rowLength + wrap) % (rowLength * rowCount);
          }
          let maxSteps = 0;
          while (puzzleSolution[newCell] == "N/A" && maxSteps < rowCount) {
            const wrap = rowLength * rowCount;
            newCell = (newCell - rowLength + wrap) % wrap;
            maxSteps++;
          }
          setSelectedCell(newCell);
        } else {
          let newCell = selectedCell;
          if (puzzleSolution[newCell] != "N/A") {
            newCell =
              (((newCell % rowLength) - 1 + rowLength) % rowLength) +
              newCell -
              (newCell % rowLength);
          }
          let maxSteps = 0;
          while (puzzleSolution[newCell] == "N/A" && maxSteps < rowLength) {
            newCell =
              (((newCell % rowLength) - 1 + rowLength) % rowLength) +
              newCell -
              (newCell % rowLength);
            maxSteps++;
          }
          setSelectedCell(newCell);
        }
      } else if (key === "TAB") {
        if (vertical) {
          let newCell = selectedCell;
          if (puzzleSolution[newCell] != "N/A") {
            newCell = (newCell + rowLength) % (rowLength * rowCount);
          }
          let maxSteps = 0;
          while (puzzleSolution[newCell] == "N/A" && maxSteps < rowCount) {
            newCell = (newCell + rowLength) % (rowLength * rowCount);
            maxSteps++;
          }
          setSelectedCell(newCell);
        } else {
          let newCell = selectedCell;
          if (puzzleSolution[newCell] != "N/A") {
            newCell =
              (((newCell % rowLength) + 1) % rowLength) +
              newCell -
              (newCell % rowLength);
          }
          let maxSteps = 0;
          while (puzzleSolution[newCell] == "N/A" && maxSteps < rowLength) {
            newCell =
              (((newCell % rowLength) + 1) % rowLength) +
              newCell -
              (newCell % rowLength);
            maxSteps++;
          }
          setSelectedCell(newCell);
        }
        return;
      } else if (key === "ARROWDOWN") {
        let newCell = selectedCell;
        if (puzzleSolution[newCell] != "N/A") {
          newCell = (newCell + rowLength) % (rowLength * rowCount);
        }
        let maxSteps = 0;
        while (puzzleSolution[newCell] == "N/A" && maxSteps < rowCount) {
          newCell = (newCell + rowLength) % (rowLength * rowCount);
          maxSteps++;
        }
        setSelectedCell(newCell);
        return;
      } else if (key === "ARROWRIGHT") {
        let newCell = selectedCell;
        if (puzzleSolution[newCell] != "N/A") {
          newCell =
            (((newCell % rowLength) + 1 + rowLength) % rowLength) +
            newCell -
            (newCell % rowLength);
        }
        let maxSteps = 0;
        while (puzzleSolution[newCell] == "N/A" && maxSteps < rowLength) {
          newCell =
            (((newCell % rowLength) + 1 + rowLength) % rowLength) +
            newCell -
            (newCell % rowLength);
          maxSteps++;
        }
        setSelectedCell(newCell);
        return;
      } else if (key === "ARROWUP") {
        let newCell = selectedCell;
        if (puzzleSolution[newCell] != "N/A") {
          newCell =
            (newCell - rowLength + rowLength * rowCount) %
            (rowLength * rowCount);
        }
        let maxSteps = 0;
        while (puzzleSolution[newCell] == "N/A" && maxSteps < rowCount) {
          newCell =
            (newCell - rowLength + rowLength * rowCount) %
            (rowLength * rowCount);
          maxSteps++;
        }
        setSelectedCell(newCell);
        return;
      } else if (key === "ARROWLEFT") {
        let newCell = selectedCell;
        if (puzzleSolution[newCell] != "N/A") {
          newCell =
            (((newCell % rowLength) - 1 + rowLength) % rowLength) +
            newCell -
            (newCell % rowLength);
        }
        let maxSteps = 0;
        while (puzzleSolution[newCell] == "N/A" && maxSteps < rowLength) {
          newCell =
            (((newCell % rowLength) - 1 + rowLength) % rowLength) +
            newCell -
            (newCell % rowLength);
          maxSteps++;
        }
        setSelectedCell(newCell);
        return;
      } else {
        return;
      }
      setGrid((currentGrid) =>
        currentGrid.map((cell, index) =>
          puzzleSolution[index] === "N/A"
            ? ""
            : index === selectedCell
              ? key
              : cell,
        ),
      );
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCell, vertical]);

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

  /*
    Checks the currently input letters in the grid against the answer grid
  */

  function answerCheck() {
    return (
      grid.length === puzzleSolution.length &&
      grid.every((cell, index) => {
        const solutionCell =
          puzzleSolution[index] === "N/A" ? "" : puzzleSolution[index];

        return cell === solutionCell;
      })
    );
  }

  function fillWithAnswers() {
    setGrid(
      puzzleSolution.map((cell) => {
        return cell === "N/A" ? "" : cell;
      }),
    );
  }

  const gridLength = rowLength * cellSize;

  return (
    <>
      <div className="all">
        <div
          style={{
            padding: "5px 30px 5px 10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div
            className="leftSideGroup"
            style={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="header">
              <h2>{crosswordInfo?.title}</h2>
              <h2>{crosswordInfo?.author}</h2>
            </div>
            <div
              className="grid"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${rowLength}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${rowCount}, ${cellSize}px)`,
                width: "fit-content",
                margin: "0 auto",
              }}
            >
              {grid.map((cellInput, cellInputIndex) => (
                <div
                  className="container"
                  key={`${cellInputIndex}`}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    paddingBottom: "2px",
                  }}
                >
                  <button
                    className="cell"
                    disabled={puzzleSolution[cellInputIndex] === "N/A"}
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      fontSize: `${cellSize * 0.5}px`,
                      backgroundColor:
                        puzzleSolution[cellInputIndex] === "N/A"
                          ? "#2e2e2e"
                          : cellInputIndex === selectedCell
                            ? "#4fe34f"
                            : (vertical &&
                                  cellInputIndex % rowLength ==
                                    selectedCell % rowLength) ||
                                (!vertical &&
                                  Math.floor(cellInputIndex / rowLength) ==
                                    Math.floor(selectedCell / rowLength))
                              ? "#a6f2a6"
                              : "white",
                    }}
                    onClick={() => {
                      if (cellInputIndex === selectedCell) {
                        setVertical(!vertical);
                      }
                      setSelectedCell(cellInputIndex);
                    }}
                  >
                    {puzzleSolution[cellInputIndex] === "N/A" ? "" : cellInput}
                  </button>
                  <p
                    className="numberOverlay"
                    style={{
                      fontSize: `${cellSize * 0.25}px`,
                      userSelect: "none",
                    }}
                  >
                    {numberLabelGrid[cellInputIndex] != -1
                      ? numberLabelGrid[cellInputIndex]
                      : ""}
                  </p>
                </div>
              ))}
            </div>

            {
              // MOBILE CLUE VIEWER SECTION
              // THIS DIVIDER IS HERE TO PREVENT CONFUSION WHILE READING.
              // THIS SECTION IS NOT SUPPOSED TO BE VISIBLE ON PC AND WHEN IMPLEMENTED SHOULD HAVE "display: none" ON!!!!
            }
            <div
              style={{
                display: "flex",
                flex: "row",
                width: `${gridLength}px`,
              }}
            >
              <button
                style={{
                  width: `${cellSize * 1.5}px`,
                  height: `${cellSize * 1.5}px`,
                }}
              >
                <img
                  src="/chevron-left.svg"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                ></img>
              </button>
              <button
                style={{
                  width: `${12 * cellSize * 1.5}px`,
                  height: `${cellSize * 1.5}px`,
                }}
              >
                CLUE PLACEHOLDER
              </button>
              <button
                style={{
                  width: `${cellSize * 1.5}px`,
                  height: `${cellSize * 1.5}px`,
                }}
              >
                <img
                  src="/chevron-right.svg"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                ></img>
              </button>
            </div>

            {
              // SUBMIT BUTTON SECTION
              // THIS DIVIDER IS HERE TO PREVENT CONFUSION WHILE READING.
            }
            <div
              style={{
                paddingTop: "5px",
                display: "flex",
                flex: "row",
                gap: "20px",
                alignItems: "center",
                justifyContent: "center",
                verticalAlign: "middle",
              }}
            >
              <button
                className="submitButton"
                tabIndex={-1}
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
              <p className="winStatus">
                Status: {won ? "Completed" : "Not done yet"}
              </p>
            </div>
          </div>
        </div>

        {
          // CLUES SECTION START
          // THIS COMMENT IS HERE AS A CLEAR DIVIDER SO I DO NOT GET MIXED UP.
          // HELL. READING MY OWN CODE IS HELL.
        }

        <div className="clues">
          <div
            className="cluesAcrossContainer"
            style={{
              height: `${cellSize * (rowCount / 2)}px`,
            }}
          >
            <h4
              style={{
                textAlign: "center",
                marginBottom: "5px",
              }}
            >
              Across:
            </h4>
            <div className="cluesAcross">
              <ul>
                {crosswordInfo?.clues.across.map((clue) => {
                  return (
                    <li className="clue">
                      <button
                        tabIndex={-1}
                        onClick={() => {
                          let correctIndex = 0;
                          for (let i = 0; i < numberLabelGrid.length; i++) {
                            if (numberLabelGrid[i] == clue.number) {
                              correctIndex = i;
                            }
                          }
                          setVertical(false);
                          setSelectedCell(correctIndex);
                        }}
                      >
                        {clue.number}: {clue.text}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div
            className="cluesDownContainer"
            style={{
              height: `${cellSize * (rowCount / 2)}px`,
            }}
          >
            <h4
              style={{
                textAlign: "center",
                marginBottom: "5px",
              }}
            >
              Down:
            </h4>
            <div className="cluesDown">
              <ul>
                {crosswordInfo?.clues.down.map((clue) => {
                  return (
                    <li className="clue">
                      <button
                        tabIndex={-1}
                        onClick={() => {
                          let correctIndex = 0;
                          for (let i = 0; i < numberLabelGrid.length; i++) {
                            if (numberLabelGrid[i] == clue.number) {
                              correctIndex = i;
                            }
                          }
                          setVertical(true);
                          setSelectedCell(correctIndex);
                        }}
                      >
                        {clue.number}: {clue.text}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <button onClick={fillWithAnswers}>Complete grid</button>
      </div>
    </>
  );
}

export default App;
