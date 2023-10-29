class Minesweeper {
    game_area = [];
    game_end = false;
    num_of_fields = 0;
    colors = ["blue","green","red","darkblue","brown","cyan","black","grey"];
    gameElement = document.createElement("div");
    
    constructor(rows, cols, mines, parent){
        this.rows = rows;
        this.cols = cols;
        this.mines = mines;
        this.parent = parent;
        this.parent.append(this.gameElement);
        this.styleElements();
        this.createGameArea();
        this.populateGameArea();
        this.drawGameArea();

        console.table(this.game_area);
    }

    styleElements(){
        this.parent.style.display = "flex";
        this.parent.style.justifyContent = "center";
        this.parent.style.alignItems = "center";
        this.gameElement.style.display = "grid";
        this.gameElement.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        this.gameElement.style.width = "fit-content";
        this.gameElement.style.backgroundColor = "rgb(200, 200, 200)";
        this.gameElement.style.borderTop = "3px solid rgb(170, 170, 170)";
        this.gameElement.style.borderLeft = "3px solid rgb(170, 170, 170)";
        this.gameElement.style.borderRight = "3px solid rgb(230, 230, 230)";
        this.gameElement.style.borderBottom = "3px solid rgb(230, 230, 230)";
        this.gameElement.style.fontWeight = "bold";
        this.gameElement.style.userSelect = "none";
        this.gameElement.style.fontFamily = "monospace";
        this.gameElement.style.fontSize = "1.5em";
    }

    random(num){
        return Math.floor(Math.random() * num);
    }

    createGameArea(){
        for(let r = 0; r < this.rows; r++){
            this.game_area[r] = [];
            for(let c = 0; c < this.cols; c++){
                this.game_area[r][c] = 0;
            }
        }
    }

    populateGameArea(){
        while(this.mines){
            const random_row = this.random(this.rows);
            const random_col = this.random(this.cols);
            if(this.game_area[random_row][random_col] === 0){
                this.game_area[random_row][random_col] = -1;
                for(let r = random_row-1; r <= random_row+1; r++){
                    for(let c = random_col-1; c <= random_col+1; c++){
                        if(typeof this.game_area[r] != "undefined" && typeof this.game_area[r][c] != "undefined" && this.game_area[r][c] != -1){
                            if(this.game_area[r][c] == 0){
                                this.num_of_fields++;
                            }
                            this.game_area[r][c] += 1;
                        }
                    }
                }
                this.mines--;
            }
        }
    }

    drawGameArea(){
        this.game_area.forEach((row, row_i) => {
            row.forEach((cell, cell_i) => {
                const c = document.createElement('div');
                c.style.width = "30px";
                c.style.aspectRatio = "1";
                c.style.backgroundColor = "rgb(200, 200, 200)";
                c.style.borderTop = "3px solid rgb(230, 230, 230)";
                c.style.borderLeft = "3px solid rgb(230, 230, 230)";
                c.style.borderRight = "3px solid rgb(170, 170, 170)";
                c.style.borderBottom = "3px solid rgb(170, 170, 170)";
                c.style.display = "flex";
                c.style.justifyContent = "center";
                c.style.alignItems = "center";
                c.dataset.row = row_i;
                c.dataset.col = cell_i;
                c.addEventListener('click', (e)=>{
                    this.checkCell(e);
                })
                this.gameElement.append(c);
            });
        });
    }

    checkCell(e){
        if(!this.gameEnd){
            const row = e.target.dataset.row;
            const col = e.target.dataset.col;
            const cell = this.game_area[row][col];
            e.target.style.border = "1px solid rgb(170, 170, 170)";
            switch(cell){
                case -1:
                    e.target.innerHTML = "X";
                    this.gameEnd = true;
                    this.printStatus("LOSE");
                    break;
                case 0:
                    this.openCellsAround(row, col);
                    break;
                default:
                    e.target.innerHTML = cell;
                    e.target.style.color = this.colors[cell-1];
                    e.target.dataset.open = "true";
                    this.num_of_fields--;
                    if(this.num_of_fields == 0){
                        this.gameEnd = true;
                        this.printStatus("WIN");
                    }
                    break;
            }
        }
    }

    openCellsAround(row, col){
        let checking = true;
        let cells = [[Number(row), Number(col)]];
        while(checking){
            let cell = cells.shift();
            if(typeof cell != "undefined"){
                const cell_up = this.findCell(cell[0]-1, cell[1]);
                const cell_down = this.findCell(cell[0]+1, cell[1]);
                const cell_left = this.findCell(cell[0], cell[1]-1);
                const cell_right = this.findCell(cell[0], cell[1]+1);

                if(cell_up && cell_up.dataset.open !== "true" && this.game_area[cell[0]-1][cell[1]] == 0){
                    cells.push([cell[0]-1, cell[1]]);
                    cell_up.dataset.open = "true";
                    cell_up.style.border = "1px solid rgb(170, 170, 170)";
                }
                
                if(cell_down && cell_down.dataset.open !== "true" && this.game_area[cell[0]+1][cell[1]] == 0){
                    cells.push([cell[0]+1, cell[1]]);
                    cell_down.dataset.open = "true";
                    cell_down.style.border = "1px solid rgb(170, 170, 170)";
                }
                
                if(cell_left && cell_left.dataset.open !== "true" && this.game_area[cell[0]][cell[1]-1] == 0){
                    cells.push([cell[0], cell[1]-1]);
                    cell_left.dataset.open = "true";
                    cell_left.style.border = "1px solid rgb(170, 170, 170)";
                }
    
                if(cell_right && cell_right.dataset.open !== "true" && this.game_area[cell[0]][cell[1]+1] == 0){
                    cells.push([cell[0], cell[1]+1]);
                    cell_right.dataset.open = "true";
                    cell_right.style.border = "1px solid rgb(170, 170, 170)";
                }
            }
            else{
                checking = false;
            }
        }
    }

    findCell(row, col){
        return document.querySelector(`div[data-row="${row}"][data-col="${col}"]`);
    }

    printStatus(msg){
        const e = document.createElement("p");
        e.innerHTML = msg;
        e.style.position = "fixed";
        e.style.top = "50%";
        e.style.width = "100%";
        e.style.paddingBlock = "3rem";
        e.style.fontSize = "5rem";
        e.style.backgroundColor = "rgba(0, 0, 0, 0.315)";
        e.style.textAlign = "center";
        e.style.transform = "translateY(-50%)";
        this.parent.append(e);
    }
}

new Minesweeper(10,10,10,document.body);