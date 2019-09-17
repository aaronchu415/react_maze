class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;

    //Blank , Wall , Start, End
    this.type = 'Blank';
    this.visited = false;
    this.current = false;
    this.final_path = false;

  }

  isStart() {
    return this.type === 'Start';
  }
  isWall() {
    return this.type === 'Wall';
  }
  isBlank() {
    return this.type === 'Blank';
  }
  isEnd() {
    return this.type === 'End';
  }
  isVisited() {
    return this.visited;
  }
  isCurrent() {
    return this.current;
  }
}

class Board {
  constructor(COL, ROW) {
    this.board = this._createBoard(COL, ROW);
  }

  findValidNextPath(cell) {

    let neighbors = this.findNeighbors(cell);

    return neighbors.filter(cell => cell.type !== 'Wall');

  }

  findNeighbors(cell) {

    let n = [];
    let i = cell.i
    let j = cell.j

    //up
    if ((i - 1) >= 0) {
      n.push(this.board[i - 1][j])
    }

    //down
    if ((i + 1) <= this.board.length - 1) {
      n.push(this.board[i + 1][j]);
    }

    //left
    if ((j - 1) >= 0) {
      n.push(this.board[i][j - 1]);
    }

    //right
    if ((j + 1) <= this.board[i].length - 1) {
      n.push(this.board[i][j + 1]);
    }

    return n;
  }

  _createBoard(COL, ROW) {
    let board = [];

    for (let i = 0; i < ROW; i++) {
      let currRow = [];
      for (let j = 0; j < COL; j++) {
        currRow.push(new Cell(i, j));
      }
      board.push(currRow);
    }

    return board;
  }

  handleClickWall(i, j, newType) {


    let cell = this.board[i][j];

    //if same type then change to blank
    if (cell.type === newType) {
      cell.type = 'Blank';
    } else {
      cell.type = newType;
    }
  }

  handleClickStartEnd(i, j, newType, oldCell) {

    //if newCell is oldCell return
    if (oldCell && oldCell.i === i && oldCell.j === j) {
      return
    }
    //set old cell to blank
    if (oldCell) oldCell.type = 'Blank'

    //set current cell to newType
    let currCell = this.board[i][j];
    currCell.type = newType

  }

}

export default class Game {

  constructor(COL, ROW) {
    this.Board = new Board(COL, ROW);
    this.start = [1, 1];
    this.end = [ROW - 1, COL - 1];

    //set start
    this.Board.handleClickStartEnd(this.start[0], this.start[1], 'Start', null);

    //set end
    this.Board.handleClickStartEnd(this.end[0], this.end[1], 'End', null);

  }

  _isStartOrEnd(i, j) {

    let is_start_or_end = false

    // i,j is equal to start or end corrds
    if (Number(i) === Number(this.start[0]) && Number(j) === Number(this.start[1])) is_start_or_end = true
    if (Number(i) === Number(this.end[0]) && Number(j) === Number(this.end[1])) is_start_or_end = true

    return is_start_or_end
  }

  handleClick(i, j, newType) {
    if (newType === 'Wall' || newType === 'Blank') {
      if (!this._isStartOrEnd(i, j)) {
        this.Board.handleClickWall(i, j, 'Wall')
      }
    }
    else if (newType === 'Start') {

      //change old start to new start
      let old_start = this.Board.board[this.start[0]][this.start[1]]
      this.Board.handleClickStartEnd(i, j, 'Start', old_start)
      //reset new start
      this.start = [i, j]
    } else if (newType === 'End') {

      //change old end to new end
      let old_end = this.Board.board[this.end[0]][this.end[1]]
      this.Board.handleClickStartEnd(i, j, 'End', old_end)
      //reset new start
      this.end = [i, j]
    }
  }

  randomizeBoard() {
    for (let i = 0; i < this.Board.board.length; i++) {
      for (let j = 0; j < this.Board.board[i].length; j++) {
        let cell = this.Board.board[i][j]
        if (!cell.isStart() && !cell.isEnd()) {
          if ((Math.floor(Math.random() * 10)) <= 2) {
            cell.type = 'Wall';
          }
        }
      }
    }
  }

  clearBoardExceptWall() {
    for (let i = 0; i < this.Board.board.length; i++) {
      for (let j = 0; j < this.Board.board[i].length; j++) {
        let cell = this.Board.board[i][j]
        cell.visited = false
        cell.current = false
        cell.final_path = false
      }
    }
  }

  runAlgo(algo_name, command) {

    if (algo_name === 'BFS') {
      if (command === 'init') return this.runBFSVisualize(command)
      else if (command === 'run') {
        let i = 0;

        while (i <= 30) {

          let result = this.runBFSVisualize(command)
          if (result) return true
          i++
        }
      }
    }

  }

  runBFSVisualize(action) {

    if (action === 'init') {
      let startCell = this.Board.board[this.start[0]][this.start[1]];
      this.q = [startCell];
      this.q_path = [[startCell]];
      this.final_path = []

      //mark as visited
      startCell.visited = true;
      //mark as current
      startCell.current = true;

    } else if (action === 'run') {

      if (this.q.length > 0) {
        let curr = this.q.shift();
        let curr_path = this.q_path.shift();

        if (curr.isEnd()) {
          curr.current = false;
          this.final_path = [...curr_path]
          this.q = []
          this.q_path = []

          return true
        }

        let valid_paths = this.Board.findValidNextPath(curr);

        for (let path of valid_paths) {

          //if not visited
          if (!path.isVisited()) {

            this.q.push(path);
            this.q_path.push([...curr_path, path]);
            //mark as visited
            path.visited = true;
            //mark as current
            path.current = true;
          }
        }
        //remove current
        curr.current = false;

      }
    }

    // var interval = setInterval(() => {
    //   if (q.length > 0) {
    //     let curr = q.shift();
    //     console.log(curr)
    //     let curr_path = q_path.shift();

    //     if (curr.isEnd()) {
    //       curr.current = false;
    //       final_path = [...curr_path]
    //       q = []
    //       q_path = []
    //     }

    //     let valid_paths = this.Board.findValidNextPath(curr);

    //     for (let path of valid_paths) {

    //       //if not visited
    //       if (!path.isVisited()) {
    //         q.push(path);
    //         q_path.push([...curr_path, path]);
    //         //mark as visited
    //         path.visited = true;
    //         //mark as current
    //         path.current = true;
    //       }
    //     }

    //     //remove current
    //     curr.current = false;
    //   }
    //   else {
    //     clearInterval(interval);
    //   }
    // }, 500);

    return false
  }

  runBFS() {

    let startCell = this.Board.board[this.start[0]][this.start[1]];
    let q = [startCell];
    let q_path = [[startCell]];

    //mark as visited
    startCell.visited = true;
    //mark as current
    startCell.current = true;

    while (q.length > 0) {
      let curr = q.shift();
      let curr_path = q_path.shift();

      if (curr.isEnd()) {
        curr.current = false;
        return curr_path;
      }

      let valid_paths = this.Board.findValidNextPath(curr);

      for (let path of valid_paths) {

        //if not visited
        if (!path.isVisited()) {
          q.push(path);
          q_path.push([...curr_path, path]);
          //mark as visited
          path.visited = true;
          //mark as current
          path.current = true;
        }
      }

      //remove current
      curr.current = false;

    }

    return [];

  }

}



// let game = new Game(5, 5);
// game.randomizeBoard()
// console.log(game.Board.board)
// console.log(game.runBFSVisualize())
