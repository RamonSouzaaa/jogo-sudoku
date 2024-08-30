const app = {};
const TABLE = document.getElementById("tabuleiro");
let borderTable = 3;
let timerGame = {};
let MATRIX = [];

let dataGame = {
    nickname: "",
    level: {},
    errors: 0,
    keepPlay: true,
    timer: {
        hour: 0,
        minute: 0,
        seconds: 0
    }
}

const Levels = {
    Eazy: {
        type: "Fácil",
        quant: 20,
        errors: 5,
    },
    Medium: {
        type: "Médio",
        quant: 40,
        errors: 4,
    },
    Hard: {
        type: "Difícil",
        quant: 60,
        errors: 3,
    },
}

function makeMatrix(){
    let index = 0;
    for (let i=0; i<=80; i++){
        MATRIX[i] = {
            id: index,
            row: 0,
            col: 0,
            number: 0
        };
        index++;
    }
}

function setDataTable(){
    let id=0;
    for(let i=0; i<9; i++) {
        let elementRow = document.createElement("tr");
        for(let j=0; j<9; j++) {
            let elementColumn = document.createElement("td");
            elementColumn.setAttribute("id", id);
            elementColumn.setAttribute("width", "50");
            elementColumn.setAttribute("height", "50");
            elementColumn.setAttribute("onclick", `currentCellSelected(${id})`);
            elementColumn.innerText = app.settings.sudoku[i][j];
            elementRow.appendChild(elementColumn);
            MATRIX[id].row = i;
            MATRIX[id].col = j;
            MATRIX[id].number = app.settings.sudoku[i][j];
            id++;
        }
        TABLE.appendChild(elementRow);
    }
    TABLE.style.border = `${borderTable}px solid rgb(42, 158, 211)`;
    let level = document.forms.jogo.nivel.value;
    switch(level){
        case Levels.Eazy.type:
            removeDataTableByLevel(Levels.Eazy.quant);
            break;
        case Levels.Medium.type:
            removeDataTableByLevel(Levels.Medium.quant);
            break;    
        case Levels.Hard.type:
            removeDataTableByLevel(Levels.Hard.quant);
            break; 
        default:
            removeDataTableByLevel(Levels.Eazy.quant);
            break;
    }

    setBorderTable();
}

function removeDataTableByLevel(level) {
    let numbersRan = [];
    for(let i=1; i<=level; i++) {
        let ran = app.settings.generateNumber(0, MATRIX.length-1);
        while(numbersRan.indexOf(ran) >= 0) {
            ran = app.settings.generateNumber(0, MATRIX.length-1);
        }     
        document.getElementById(ran).innerText = "";
        numbersRan.push();
    }
    
}

function currentCellSelected(id){
    if(!dataGame.keepPlay) {
        return;
    }

    let cell = document.getElementById(id);

    if(document.querySelector('.invalidNumberToCell') !== undefined && document.querySelector('.invalidNumberToCell') !== null) {
        document.querySelector('.invalidNumberToCell').classList.remove('invalidNumberToCell');
    }

    if(cell.innerText === "" || cell.innerText === undefined || cell.innerText === null) {
        document.querySelectorAll('.currentCell').forEach(item => item.classList.remove('currentCell'));
        cell.classList.add('currentCell');
    }
    
}

function setNumberCell(number) {
    if(document.querySelector('.currentCell') === null){
        return;
    }

    let id = parseInt(document.querySelector('.currentCell').id);
    document.querySelector('.currentCell').classList.remove('currentCell');
    
    if(isValidNumberToCell(id, number)) {
        document.getElementById(id).innerText = number;
        checkHasVictory();
    } else {
        document.getElementById(id).classList.add('invalidNumberToCell');
        countErrors();
    }
}
 
function isValidNumberToCell(id, number){
    return MATRIX.find(item => item.id == id).number === number;
}

function countErrors(){
    dataGame.errors++;    
    document.getElementById("errors").innerText = `${dataGame.level.errors}\\${dataGame.errors}`
    checkKeepPlay();
}

function checkKeepPlay(){
    if(dataGame.errors > dataGame.level.errors){
        alert("Fim de jogo");
        dataGame.keepPlay = false;
        clearInterval(timerGame);
    }
}

function checkHasVictory(){
    let cells = document.querySelectorAll("td");
    let exists = true;

    for(let item of cells ){
        if(item.innerText.toString().trim().length == 0){
            exists = false;
        }
    }

    if(exists) {
        alert(`Parabéns ${dataGame.nickname} você conseguiu concluir em  ${formatTimeNumber(dataGame.timer.hour)}:${formatTimeNumber(dataGame.timer.minute)}:${formatTimeNumber(dataGame.timer.seconds)} !!`);
        dataGame.keepPlay = false;
        clearInterval(timerGame);
    }
}

function setDataGame(){
    document.getElementById("nick").innerText = dataGame.nickname;
    document.getElementById("errors").innerText = `${dataGame.level.errors}\\${dataGame.errors}`;
    document.getElementById("level").innerText = dataGame.level.type;
}

function setBorderTable() {
    let cells = document.querySelectorAll("td");
    let ignoreIndex = 8;
    
    for(let i=0; i<=cells.length-1; i++) {
        cells[i].style.border = "1px solid rgb(170, 168, 168)";

        if(i % 3 == 2) {
            if(i == ignoreIndex){
                ignoreIndex+=9;
            }else{
                cells[i].style.borderRight = `${borderTable}px solid rgb(42, 158, 211)`;
            }
        }
    }
    
    for(let i=0; i<=8; i++) {
        TABLE.childNodes[2].childNodes[i].style.borderBottom = `${borderTable}px solid rgb(42, 158, 211)`;
    }

    for(let i=0; i<=8; i++) {
        TABLE.childNodes[5].childNodes[i].style.borderBottom = `${borderTable}px solid rgb(42, 158, 211)`;
    }
}

function setTimer() {

    if(dataGame.timer.seconds === 60){
        dataGame.timer.minute+=1;
        dataGame.timer.seconds=0;
    }
    
    if(dataGame.timer.minute === 60){
        dataGame.timer.hour+=1;
        dataGame.timer.minute=0;
    }

    if(dataGame.timer.hour===24){
        dataGame.timer.hour=0;
    }

    dataGame.timer.seconds+=1;

    document.getElementById("timer").innerText = formatTimeNumber(dataGame.timer.hour) + ":" + formatTimeNumber(dataGame.timer.minute) + ":" + formatTimeNumber(dataGame.timer.seconds);
}

function formatTimeNumber(number) {
    return number < 10 ? `0${number}` : number
}

function start() {
    if(document.forms.jogo.nickname.value.length === 0){
        alert("Informe o nickname!");
        return;
    }

    document.getElementById("formJogo").setAttribute("hidden", "");

    setDataTable();
    dataGame.nickname = document.forms.jogo.nickname.value;
    let level = document.forms.jogo.nivel.value;
    switch(level){
        case Levels.Eazy.type:
            dataGame.level = Levels.Eazy;
            break;
        case Levels.Medium.type:
            dataGame.level = Levels.Medium;
            break;    
        case Levels.Hard.type:
            dataGame.level = Levels.Hard;
            break; 
        default:
            dataGame.level = Levels.Eazy;
            break;
    }
    setDataGame();
    
    document.getElementById("dadosJogo").removeAttribute("hidden");
    document.getElementById("dadosTabuleiro").removeAttribute("hidden");

    timerGame = setInterval(setTimer, 1000);
}

function quit(){
    if(confirm("Tem certeza que deseja desistir?")){
        location.reload();
    }
}

makeMatrix();