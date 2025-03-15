let completedGrid = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

let currentPuzzle = [];
let selectedCell = null;
let initialPuzzle = [];
let highlightedNumber = null;
let gameStarted = false;

function generatePuzzle(grid, numEmptyCells) {
    let puzzle = JSON.parse(JSON.stringify(grid));
    let initial = JSON.parse(JSON.stringify(grid));

    let emptyCount = 0;
    while (emptyCount < numEmptyCells) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);

        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            initial[row][col] = 0;
            emptyCount++;
        }
    }

    return [puzzle, initial];
}

function createSudokuBoard(puzzle, initial) {
    let table = document.getElementById('sudoku-board');
    table.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement('td');
            cell.id = `cell-container-${i}-${j}`;
            let input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.id = `cell-${i}-${j}`;

            if (puzzle[i][j] === 0) {
                input.value = '';
            } else {
                input.value = puzzle[i][j];
            }

            if (initial[i][j] !== 0) {
                input.disabled = true;
            }

            cell.addEventListener('click', function() {
                selectCell(i, j);
            });

            input.addEventListener('input', function() {
                validateAndSet(input, i, j);
            });

            if (initial[i][j] !== 0) {
                input.classList.add('initial-value');
            }

            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    currentPuzzle = JSON.parse(JSON.stringify(puzzle));
    initialPuzzle = JSON.parse(JSON.stringify(initial));
}

function createNumberPad() {
    let numberPad = document.getElementById('number-pad');
    numberPad.innerHTML = '';

    for (let i = 1; i <= 9; i++) {
        let button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', function() {
            let number = i;
            highlightNumber(number);

            if (selectedCell && !selectedCell.disabled) {
                selectedCell.value = number;
                validateAndSet(selectedCell, selectedCell.parentNode.id.split('-')[2], selectedCell.parentNode.id.split('-')[3]);
            }
        });
        numberPad.appendChild(button);
    }
}

function validateAndSet(inputElement, row, col) {
    let value = inputElement.value;

    inputElement.classList.remove('error', 'bold');

    if (value && (isNaN(value) || parseInt(value) < 1 || parseInt(value) > 9)) {
        inputElement.value = '';
        currentPuzzle[row][col] = 0;
    } else if (value) {
        value = parseInt(value);

        if (value !== completedGrid[row][col]) {
            inputElement.classList.add('error');
            currentPuzzle[row][col] = value;
        } else {
            inputElement.classList.add('bold');
            currentPuzzle[row][col] = value;
            if (checkWinCondition()) {
                document.getElementById('message').textContent = 'Congratulations! You solved the Sudoku!';
            }
        }
    } else {
        currentPuzzle[row][col] = 0;
    }

    clearNumberHighlighting();
}

function selectCell(row, col) {
    clearHighlighting();

    selectedCell = document.getElementById(`cell-${row}-${col}`);

    for (let i = 0; i < 9; i++) {
        document.getElementById(`cell-container-${row}-${i}`).classList.add('highlighted');
        document.getElementById(`cell-container-${i}-${col}`).classList.add('highlighted');
    }

    clearNumberHighlighting();
}

function clearHighlighting() {
    let highlighted = document.querySelectorAll('.highlighted');
    highlighted.forEach(cell => cell.classList.remove('highlighted'));
}

function highlightNumber(number) {
    clearNumberHighlighting();

    highlightedNumber = number;

    let inputs = document.querySelectorAll('#sudoku-board input');
    inputs.forEach(input => {
        if (input.value == number) {
            input.classList.add('number-highlight');
        }
    });
}

function clearNumberHighlighting() {
    let highlightedNumbers = document.querySelectorAll('.number-highlight');
    highlightedNumbers.forEach(input => input.classList.remove('number-highlight'));
    highlightedNumber = null;
}


function checkWinCondition() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (currentPuzzle[i][j] !== completedGrid[i][j]) {
                return false;
            }
        }
    }
    return true;
}

document.getElementById('start-game').addEventListener('click', function() {
    let [puzzle, initial] = generatePuzzle(completedGrid, 40);

    initialPuzzle = initial;

    createSudokuBoard(puzzle, initial);
    createNumberPad();
    document.getElementById('message').textContent = '';

    document.getElementById('sudoku-board').style.display = 'table';
    document.getElementById('number-pad').style.display = 'block';

    if (!gameStarted) {
        this.textContent = 'Restart';
        gameStarted = true;
    }

});