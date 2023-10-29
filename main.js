// grid legend:
//      0  = empty
//     -1  = mine
//     1-8 = flag

const rows = 15;
const cols = 20;
const mines = 40;
const game_area = [];
let gameEnd = false;
let numFields = 0;

const colors = [
    "blue",
    "green",
    "red",
    "darkblue",
    "brown",
    "cyan",
    "black",
    "grey"
];


function createGameArea(rows, cols, mines, area){
    document.documentElement.style.setProperty('--cols', cols);
    for(let r = 0; r < rows; r++){
        area[r] = [];
        for(let c = 0; c < cols; c++){
            area[r][c] = 0;
        }
    }

    populateGameArea(rows, cols, mines, area)
    drawGameArea(area);
    console.table(area);
}


function random(num){
    return Math.floor(Math.random() * num);
}


function populateGameArea(rows, cols, mines, area){
    while(mines){
        const row = random(rows);
        const col = random(cols);
        if(area[row][col] === 0){
            area[row][col] = -1;
            for(let r = row-1; r <= row+1; r++){
                for(let c = col-1; c <= col+1; c++){
                    if(typeof area[r] != "undefined" && typeof area[r][c] != "undefined" && area[r][c] != -1){
                        if(area[r][c] == 0){
                            numFields++;
                        }
                        area[r][c] += 1;
                    }
                }
            }
            mines--;
        }
    }
}


function drawGameArea(area){
    area.forEach((row, row_i) => {
        row.forEach((cell, cell_i) => {
            const c = document.createElement('div');
            c.classList = 'cell';
            c.dataset.row = row_i;
            c.dataset.col = cell_i;
            c.addEventListener('click', checkCell)
            document.getElementById("gameArea").append(c);
        });
    });
}


function checkCell(){
    if(!gameEnd){
        const row = this.dataset.row;
        const col = this.dataset.col;
        const cell = game_area[row][col];
        this.classList.add("open");
        switch(cell){
            case -1:
                this.innerHTML = "X";
                gameEnd = true;
                printStatus("LOSE");
                break;
            case 0:
                openCellsAround(row, col);
                break;
            default:
                this.innerHTML = cell;
                this.style.color = colors[cell-1];
                numFields--;
                checkWin();
                break;
        }
    }
}


function openCellsAround(row, col){
    let checking = true;
    let cells = [[Number(row), Number(col)]];
    while(checking){
        let cell = cells.shift();
        if(typeof cell != "undefined"){
            if(findCell(cell[0]-1, cell[1]) && !findCell(cell[0]-1, cell[1]).classList.contains("open") && game_area[cell[0]-1][cell[1]] == 0){
                cells.push([cell[0]-1, cell[1]]);
                findCell(cell[0]-1, cell[1]).classList.add("open");
            }
            
            if(findCell(cell[0]+1, cell[1]) && !findCell(cell[0]+1, cell[1]).classList.contains("open") && game_area[cell[0]+1][cell[1]] == 0){
                cells.push([cell[0]+1, cell[1]]);
                findCell(cell[0]+1, cell[1]).classList.add("open");
            }
            
            if(findCell(cell[0], cell[1]-1) && !findCell(cell[0], cell[1]-1).classList.contains("open") && game_area[cell[0]][cell[1]-1] == 0){
                cells.push([cell[0], cell[1]-1]);
                findCell(cell[0], cell[1]-1).classList.add("open");
            }

            if(findCell(cell[0], cell[1]+1) && !findCell(cell[0], cell[1]+1).classList.contains("open") && game_area[cell[0]][cell[1]+1] == 0){
                cells.push([cell[0], cell[1]+1]);
                findCell(cell[0], cell[1]+1).classList.add("open");
            }
        }
        else{
            checking = false;
            
        }
    }
}


function findCell(row, col){
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}


function checkWin(){
    if(numFields == 0){
        gameEnd = true;
        printStatus("WIN");
    }
}


function printStatus(msg){
    const e = document.createElement("p");
    e.innerHTML = msg;
    e.classList.add("status");
    document.body.append(e);
}


createGameArea(rows,cols,mines,game_area);