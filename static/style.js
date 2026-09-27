const cells = document.querySelectorAll(".cell");/**Button cells */
const statusText = document.getElementById("status");/**For status */
const resetButton = document.getElementById("reset");/**For reset Button */

/**Create empty board List that indicates when empty or not */
let board = ["","","","","","","","",""];

/**Create default current player */
let currentPlayer = "X";
let isGameActive = true;

/**Below indicates winning conditions for X and AI */
let winningConditions = [
  [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8]
];

/**Loop via all the cells buttons */
cells.forEach((cell)=>{
  cell.addEventListener("click",handleCellClick);
});/**handleCellClick is a callback function */


/**Create eventListener for resetButton */
resetButton.addEventListener("click", resetBoard);/**resetBoard is a callback function */


//CALLBACK(HELPER) FUNCTIONS

//CallBack function for Cells
function handleCellClick(e){
  //e is used to target the attribute called data-index
  const index = e.target.getAttribute("data-index");

   //ckecking the conditionality
  if (board[index] !== "" || !isGameActive || currentPlayer !== "X") return;

  board[index] = currentPlayer;

  //send the currentPlayer to html
  e.target.textContent = currentPlayer;

  //call checkResult function here
  checkResult();
}


function checkResult(){
  let roundWon = false;
   
  //checking conditional statement for declaring a winner
  for (let condition of winningConditions){
    let [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }
  //if roundWon is true
  if (roundWon) {
    statusText.textContent = `player ${currentPlayer} Wins`;
    isGameActive = false;

    //callBack function for sending score to flask
    sendScoreToFlask(currentPlayer);
    return;
  }

  //checking if the game board is full
  if (!board.includes("")) {
    statusText.textContent = "It's a Draw";
    isGameActive = false;
    sendScoreToFlask("Draw");
    return;
  }

  //Switch turn i.e btw player X or AI
  //Apply ternary operator
  currentPlayer = currentPlayer === "X" ? "O": "X";
  statusText.textContent = `player ${currentPlayer}'s Turn`;

  if(currentPlayer === "O" && isGameActive) {
    setTimeout(aiMove, 1000);
  }

}


function aiMove() {
  let emptyCells = board.map((val,idx)=> (val === "" ? idx : null)).filter((val) => val !== null);

  if (emptyCells.length === 0 || !isGameActive) return

  //pick random empty slot for AI
  let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[randomIndex] = "O";
  cells[randomIndex].textContent = "O";

  checkResult();
}



function sendScoreToFlask(winner) {
  //use fetch to get the api o record win in the python
  fetch('/api/record_win', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      winner: winner
    })
  }).then(res => res.json()).then(data => {
    document.getElementById('p-wins').textContent = data.stats.player_wins;
    document.getElementById('ai-wins').textContent = data.stats.ai_wins;
    document.getElementById('draws').textContent = data.stats.draws;
  })
}



//Function or reset button
function resetBoard() {
  board = ["","","","","","","","",""];
  isGameActive = true;
  currentPlayer = "X";
  statusText.textContent = "Player X's Turn";
  cells.forEach(cell => cell.textContent = "");
}