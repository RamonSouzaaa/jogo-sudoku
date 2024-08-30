import puzzle from './js/puzzle.js';
const SUDOKU = await puzzle.createSudoku();

export default {
    sudoku: SUDOKU,
    generateNumber: puzzle.generateNumber
}



