import {useEffect, useState} from "react";
import ScoreBoard from "./components/ScoreBoard";

const width = 8;
const candyColors = ["lightskyblue", "lightgreen", "salmon", "khaki", "lightpink", "lightgray"];

function App() {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);

  const checkForColumnOFFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i+width, i+width * 2, i+width * 3]
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === '';

      if(columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 4);
        columnOfFour.forEach(square => currentColorArrangement[square] = '');
        return true;
      }
    }
  }

  const checkForRowOFFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3]
      const decidedColor = currentColorArrangement[i];
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64];
      const isBlank = currentColorArrangement[i] === '';

      if(notValid.includes(i)) continue

      if(rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 4);
        rowOfFour.forEach(square => currentColorArrangement[square] = '');
        return true;
      }
    }
  }

  const checkForColumnOFThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i+width, i+width * 2]
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === '';

      if(columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 3);
        columnOfThree.forEach(square => currentColorArrangement[square] = '');
        return true;
      }
    }
  }

  const checkForRowOFThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2]
      const decidedColor = currentColorArrangement[i];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
      const isBlank = currentColorArrangement[i] === '';

      if(notValid.includes(i)) continue

      if(rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 3);
        rowOfThree.forEach(square => currentColorArrangement[square] = '');
        return true;
      }
    }
  }

  const moveIntoSquareBelow = () => {
    for(let i = 0; i <= 55; i++){
      const firstRow = [0,1,2,3,4,5,6,7];
      const isFirstRow = firstRow.includes(i);

      if(isFirstRow && currentColorArrangement[i] === "") {
        let randomNumber = Math.floor(Math.random() * candyColors.length);
        currentColorArrangement[i] = candyColors[randomNumber];
      }

      if((currentColorArrangement[i + width]) === "") {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = "";
      }
    }
  }

  const dragStart = (e) => {
    setSquareBeingDragged(e.target)
  }
  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target);
  }
  const dragEnd = (e) => {
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute("data-id"))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute("data-id"))

    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.style.backgroundColor;
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.style.backgroundColor;

    const validMoves = [
        squareBeingDraggedId - 1,
        squareBeingDraggedId - width,
        squareBeingDraggedId + 1,
        squareBeingDraggedId + width
    ]

    const validMove = validMoves.includes(squareBeingReplacedId)

    const isAColumnOFFour = checkForColumnOFFour();
    const isAColumnOFThree = checkForColumnOFThree();
    const isARowOFFour = checkForRowOFFour();
    const isARowOFThree = checkForRowOFThree();

    if(squareBeingReplacedId && validMove && (isARowOFFour || isAColumnOFFour || isARowOFThree || isAColumnOFThree)){
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    } else {
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.style.backgroundColor;
      currentColorArrangement[squareBeingDraggedId] =squareBeingDragged.style.backgroundColor;
      setCurrentColorArrangement([...currentColorArrangement])
    }
  }

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i=0; i < width * width; i++) {
      const randomColor= candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  }

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOFFour();
      checkForRowOFFour();
      checkForColumnOFThree();
      checkForRowOFThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100)
    return () => clearInterval(timer);
  }, [checkForColumnOFFour, checkForRowOFFour, checkForColumnOFThree, checkForRowOFThree, moveIntoSquareBelow, currentColorArrangement]);

  return (
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <div key={index} style={{backgroundColor: candyColor}}
               data-id={index}
               draggable={true}
               onDragStart = {dragStart}
               onDragOver={(e) => e.preventDefault()}
               onDragEnter={(e) => e.preventDefault()}
               onDragLeave={(e) => e.preventDefault()}
               onDrop={dragDrop}
               onDragEnd={dragEnd}/>
        ))}
      </div>
      <ScoreBoard score={scoreDisplay}/>
    </div>
  );
}

export default App;
