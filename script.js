
const resetBtn = document.querySelector('.resetBtn');
const goBackBtn = document.querySelector('.go_backBtn');
const swapBtn = document.querySelector('.swapBtn');
const startBtn = document.querySelector('.startBtn');

const player = (name, sign, code) => {
    let _score = 0;
    let _pName = name;
    let _sign = sign;
    let _code = code;


    const addPoint = () => _score += 1;

    const getPoints = () => _score;

    const getName = () => _pName;

    const getSign = () => _sign;

    const getCode = () => _code;

    const setSign = (sign) => _sign = sign;

    return {addPoint, getName, getPoints, getSign, getCode, setSign};
}

let playerOne = null, playerTwo = null;

const displayContent = ((doc) => {

    const playerOneName = doc.querySelector('#player_one');
    const playerOneName_input = doc.querySelector("input[id='player_one']");
    const playerOneScore = doc.querySelector('#pOneScore');
    const playerTwoName = doc.querySelector('#player_two');
    const playerTwoName_input = doc.querySelector("input[id='player_two']");
    const playerTwoScore = doc.querySelector('#pTwoScore');
    const game = doc.querySelector('.game');
    const currentAction = doc.querySelector('.current_action');
    const boxes = doc.querySelectorAll('.box');

    const initGame = () => {
        startBtn.style.display = 'none';
    
        game.style.display = 'flex';
        playerOneName_input.style.display = 'none';
        playerTwoName_input.style.display = 'none';
    
        playerOneName.textContent = `${playerOne.getName()} (${playerOne.getSign()})`;
        playerTwoName.textContent = `${playerTwo.getName()} (${playerTwo.getSign()})`;

        startMessage("X");
    }
    
    const moveToGame = () =>  {
        playerOne = player(playerOneName_input.value || "Player One", "X", 'pOne');
        playerTwo = player(playerTwoName_input.value || "Player Two", "O", 'pTwo');
    
        initGame();
    }

    const resetGame = () => {
        gameLogic.resetBoard();
        resetBoard();

        startMessage("X");
    }
    
    const deinitGame = () =>  {
        startBtn.style.display = 'block';
    
        game.style.display = 'none';
        playerOneName_input.style.display = 'block';
        playerTwoName_input.style.display = 'block';
    
        playerOneName.textContent = 'Player One (X)';
        playerTwoName.textContent = 'Player Two (O)';
    
        playerOneName_input.value = '';
        playerTwoName_input.value = '';

        playerOneScore.textContent = '0';
        playerTwoScore.textContent = '0';

        resetGame();
    }
    
    const moveBack = () =>  {
        deinitGame();
    
        playerOne = player('Player One', 'X', 'pOne');
        playerTwo = player('Player Two', 'O', 'pOne');
    }

    const displayCurrentMove = (message) => {
        currentAction.textContent = message;
    }

    const addSymbolToBoard = (sign, target) => {
        let boxClass = null;

        if(sign === 'X')
            boxClass = 'box_x';
        else boxClass = 'box_o';

        target.classList.add(boxClass);
    }

    const resetBoard = () => {
        for(let i = 0; i < boxes.length; i++) {
            if(boxes[i].getAttribute('class') === 'box box_x')
                boxes[i].classList.remove('box_x');
            if(boxes[i].getAttribute('class') === 'box box_o')
                boxes[i].classList.remove('box_o');    
        }
    }

    const startMessage = (sign) => {
        [p1, p2] = gameLogic.getPlayer(sign);
        displayCurrentMove(`It's ${p1.getName()}'s turn!`);
    }

    const changeScore = (player) => {
        const idOne = playerOneScore.getAttribute('id');
        if(idOne.includes(player.getCode()))
            playerOneScore.textContent = `${player.getPoints()}`;
        else 
            playerTwoScore.textContent = `${player.getPoints()}`;
    }

    const swapSigns = () => {
        if(playerOne.getSign() === "X") {
            playerOne.setSign("O");
            playerTwo.setSign("X");
        }
        else {
            playerOne.setSign("X");
            playerTwo.setSign("O");
        }
        
        playerOneName.textContent = `${playerOne.getName()} (${playerOne.getSign()})`;
        playerTwoName.textContent = `${playerTwo.getName()} (${playerTwo.getSign()})`;

        resetGame();
    }

    for(let i = 0; i < boxes.length; i++) {
        boxes[i].addEventListener('click', () => {
            gameLogic.playRound(i, boxes[i])
        })
    }

    return {moveToGame, moveBack, displayCurrentMove, addSymbolToBoard, resetBoard, changeScore, resetGame, swapSigns};

})(document);


const gameLogic = (() => {
    let board = new Array(9);
    let current = null;
    let round = 1;
    let isOver = false;
    let winningCombo = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const playRound = (position, target) => {
        if(checkBoxAvailable(position) === false || isOver === true) {
            return;
        }
        else {

            whoIsCurrent(round);
            const [ currentPlayer, otherPlayer ] = getPlayer(current);

            board[position] = current;
            displayContent.addSymbolToBoard(current, target);

            if(checkIfWin(current) === true) {
                displayContent.displayCurrentMove(`${currentPlayer.getName()} won the round! 🥳 `);
                currentPlayer.addPoint();
                displayContent.changeScore(currentPlayer);
                isOver = true;
                return;
            }

            round += 1;

            if(round == 10) {
                displayContent.displayCurrentMove("It's a tie! 🤝");
                isOver = true;
                return;
            }
            displayContent.displayCurrentMove(`It's ${otherPlayer.getName()}'s turn!`);
        }
    }

    const getPlayer = (sign) => {
        if(playerOne.getSign() === sign)
            return [ playerOne, playerTwo ];
        else return [ playerTwo, playerOne ];
    }
    
    const checkBoxAvailable = (position) => {
        if(board[position] == "X" || board[position] == "O")
            return false;

        return true;
    }

    const checkIfWin = (sign) => {
        return winningCombo.some((combo) => combo.every((e) => board[e] === sign));
    }

    const resetBoard = () => {
        round = 1;
        current = "X";
        isOver = false;
        for(let i = 0; i < board.length; i++) {
            board[i] = null;
        }
    }

    const whoIsCurrent = (currentRound) => {
        if(currentRound % 2 == 1)
            current = "X";
        else current = "O";
    }

    return {getPlayer, playRound, resetBoard};
}

)();


startBtn.addEventListener('click', () => {
    displayContent.moveToGame()
});
goBackBtn.addEventListener('click', () => {
    displayContent.moveBack()
});

resetBtn.addEventListener('click', () => {
    displayContent.resetGame()
})

swapBtn.addEventListener('click', () => {
    displayContent.swapSigns()
})

