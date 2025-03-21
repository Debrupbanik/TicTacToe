// app.js
const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "board",
    outputs: [
      {
        internalType: "enum TicTacToe.Player",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentPlayer",
    outputs: [
      {
        internalType: "enum TicTacToe.Player",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gameState",
    outputs: [
      {
        internalType: "enum TicTacToe.GameState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBoard",
    outputs: [
      {
        internalType: "enum TicTacToe.Player[3][3]",
        name: "",
        type: "uint8[3][3]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "joinGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "row",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "col",
        type: "uint8",
      },
    ],
    name: "makeMove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "playerO",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "playerX",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "resetGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "winner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

let provider;
let signer;
let ticTacToeContract;
let currentPlayer;

const gameStatus = document.getElementById("status-message");
const joinButton = document.getElementById("join-game-btn");
const resetButton = document.getElementById("reset-btn");
const board = document.getElementById("board");

async function initialize() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    ticTacToeContract = new ethers.Contract(contractAddress, abi, signer);

    // Check if player is connected
    const player = await signer.getAddress();
    currentPlayer = player;

    joinButton.addEventListener("click", joinGame);
    resetButton.addEventListener("click", resetGame);

    updateBoard();
  } else {
    alert("Please install MetaMask to play the game.");
  }
}

async function updateBoard() {
  const boardState = await ticTacToeContract.getBoard();
  const cells = board.getElementsByClassName("cell");

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cell = cells[row * 3 + col];
      const player = boardState[row][col];
      if (player === 1) {
        cell.innerText = "X";
        cell.disabled = true;
      } else if (player === 2) {
        cell.innerText = "O";
        cell.disabled = true;
      } else {
        cell.innerText = "";
        cell.disabled = false;
      }
    }
  }

  // Update game status
  const gameState = await ticTacToeContract.gameState();
  if (gameState === 0) {
    gameStatus.innerText = "Waiting for Player O...";
    joinButton.disabled = false;
  } else if (gameState === 1) {
    gameStatus.innerText = "Game in progress...";
    joinButton.disabled = true;
  } else if (gameState === 2) {
    const winner = await ticTacToeContract.winner();
    if (winner === "0x0000000000000000000000000000000000000000") {
      gameStatus.innerText = "It's a draw!";
    } else {
      gameStatus.innerText = `Player ${winner} wins!`;
    }
  }
}

async function joinGame() {
  try {
    const tx = await ticTacToeContract.joinGame();
    await tx.wait();
    gameStatus.innerText = "Game in progress...";
    updateBoard();
  } catch (error) {
    alert("Error joining the game: " + error.message);
  }
}

async function resetGame() {
  try {
    const tx = await ticTacToeContract.resetGame();
    await tx.wait();
    gameStatus.innerText = "Game reset. Waiting for Player O...";
    updateBoard();
  } catch (error) {
    alert("Error resetting the game: " + error.message);
  }
}

async function makeMove(row, col) {
  try {
    const tx = await ticTacToeContract.makeMove(row, col);
    await tx.wait();
    updateBoard();
  } catch (error) {
    alert("Error making move: " + error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initialize();

  board.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("cell") && target.innerText === "") {
      const [row, col] = target.id.split("-").slice(1).map(Number);
      makeMove(row, col);
    }
  });
});
