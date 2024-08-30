let board = new Array();

function generateNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isValid(linha, coluna, numero, board) {
    //check row
    for(let i=0; i<9; i++){
        if(board[linha][i] == numero)
            return false;
    }
    
    //check col
    for(let i=0; i<9; i++){
        if(board[i][coluna] == numero)
            return false;
    }

    //check block
    let startRow = linha - linha % 3;
    let startCol = coluna - coluna % 3;

    let p = startRow;
    while(p < startRow + 2) {
        let l = startCol;
        while(l <= startCol + 2) {
            if(board[p][l] == numero)
                return false;

            l++;
        }
        p++;
    }

    return true;
}

function generateSudoku() {
    let isSudokuValid = true;
    board = new Array(9).fill(0).map(x => Array(9).fill(0));
    for(let i=0; i<9; i++) {
        for(let j=0; j<9; j++) {
            let ran = generateNumber(1, 9);
            if(isValid(i, j, ran, board)){
                board[i][j] = ran;    
            }else{
                fillNumber(i, j);
                if(board[i][j] == 0){
                    isSudokuValid = false;
                    break;
                }
            }
        }   
        if(!isSudokuValid){
            break;
        }
    }
    return isSudokuValid;
}

function fillNumber(linha, coluna){
    for(let i=1; i<=9; i++){
        if(isValid(linha, coluna, i, board)){
            board[linha][coluna] = i;
            break;
        }
    }
}

async function createSudoku() {
    let isSudokuValid = false;
    do {
        isSudokuValid = generateSudoku();
    }while(!isSudokuValid);
    return board;
}


export default {
    createSudoku: createSudoku,
    generateNumber: generateNumber
}