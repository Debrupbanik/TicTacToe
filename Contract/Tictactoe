// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TicTacToe {
    enum Player { None, X, O }
    enum GameState { WaitingForPlayer, InProgress, Finished }

    address public playerX;
    address public playerO;
    Player[3][3] public board;
    Player public currentPlayer;
    GameState public gameState;
    address public winner;

    modifier onlyPlayers() {
        require(msg.sender == playerX || msg.sender == playerO, "Not a player");
        _;
    }

    modifier gameInProgress() {
        require(gameState == GameState.InProgress, "Game not in progress");
        _;
    }

    constructor() {
        playerX = msg.sender;
        gameState = GameState.WaitingForPlayer;
        currentPlayer = Player.X;
    }

    function joinGame() external {
        require(gameState == GameState.WaitingForPlayer, "Game already started");
        require(msg.sender != playerX, "Player X already assigned");

        playerO = msg.sender;
        gameState = GameState.InProgress;
    }

    function makeMove(uint8 row, uint8 col) external onlyPlayers gameInProgress {
        require(row < 3 && col < 3, "Invalid position");
        require(board[row][col] == Player.None, "Cell already filled");

        if (msg.sender == playerX) {
            require(currentPlayer == Player.X, "Not your turn");
            board[row][col] = Player.X;
            currentPlayer = Player.O;
        } else {
            require(currentPlayer == Player.O, "Not your turn");
            board[row][col] = Player.O;
            currentPlayer = Player.X;
        }

        checkWinner();
    }

    function checkWinner() internal {
        for (uint8 i = 0; i < 3; i++) {
            // Rows
            if (board[i][0] != Player.None &&
                board[i][0] == board[i][1] &&
                board[i][1] == board[i][2]) {
                setWinner(board[i][0]);
                return;
            }

            // Columns
            if (board[0][i] != Player.None &&
                board[0][i] == board[1][i] &&
                board[1][i] == board[2][i]) {
                setWinner(board[0][i]);
                return;
            }
        }

        // Diagonals
        if (board[0][0] != Player.None &&
            board[0][0] == board[1][1] &&
            board[1][1] == board[2][2]) {
            setWinner(board[0][0]);
            return;
        }

        if (board[0][2] != Player.None &&
            board[0][2] == board[1][1] &&
            board[1][1] == board[2][0]) {
            setWinner(board[0][2]);
            return;
        }

        // Check for draw
        bool draw = true;
        for (uint8 r = 0; r < 3; r++) {
            for (uint8 c = 0; c < 3; c++) {
                if (board[r][c] == Player.None) {
                    draw = false;
                    break;
                }
            }
        }

        if (draw) {
            gameState = GameState.Finished;
        }
    }

    function setWinner(Player _player) internal {
        gameState = GameState.Finished;
        if (_player == Player.X) {
            winner = playerX;
        } else if (_player == Player.O) {
            winner = playerO;
        }
    }

    function getBoard() external view returns (Player[3][3] memory) {
        return board;
    }

    function resetGame() external {
        require(gameState == GameState.Finished, "Game not finished yet");
        require(msg.sender == playerX || msg.sender == playerO, "Only players can reset");

        delete board;
        currentPlayer = Player.X;
        gameState = GameState.InProgress;
        winner = address(0);
    }
}
