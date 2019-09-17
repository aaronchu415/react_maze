import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import NavBar from './components/NavBar';
import Board from './components/Board';
import Game from './classes/board';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      game: this._initBoard(),
      drag: false,
      selection: 'Wall',
      recentlyPressed: [-1, -1],
      prev_elem: null,
    }
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).addEventListener('touchstart', (e) => {
      e.preventDefault();
    });
  }

  _initBoard() {

    let COL = 50;
    let ROW = 50;

    if (window.outerWidth <= 320) {
      ROW = 19;
      COL = 10;
    }
    else if (window.outerWidth <= 375) {
      ROW = 29;
      COL = 12;
    }
    else if (window.outerWidth <= 576) {
      ROW = 20;
      COL = 15;
    }
    else if (window.outerWidth <= 768) {
      ROW = 39;
      COL = 20;
    }
    else if (window.outerWidth <= 1024) {
      ROW = 50;
      COL = 20;
    }

    let game = new Game(COL, ROW);
    game.randomizeBoard()
    let final_path = game.runBFS();

    for (let cell of final_path) {
      cell.final_path = true;
    }

    return game
  }

  _copyBoard() {
    return Object.assign(Object.create(Object.getPrototypeOf(this.state.game)), this.state.game)
  }

  handleBoardClick = (i, j, curr_type) => {

    //create copy of board
    let clone = this._copyBoard()
    //clear visited and current flags
    clone.clearBoardExceptWall()

    //modify current cell
    clone.handleClick(i, j, curr_type)

    //update final path
    let final_path = clone.runBFS()

    for (let cell of final_path) {
      cell.final_path = true;
    }

    this.setState({ game: clone })
  }

  handleMouseDown = (e, i, j) => {

    if (this.state.drag) {
      e.preventDefault()
      return
    }

    //get current cell and its type if it is start or end then set selection
    let curr_cell = this.state.game.Board.board[i][j];
    let curr_type = curr_cell.type

    //set the type to selection and make drag true
    this.setState({ drag: true, selection: curr_type })

    //if drag is not intiated then 'click' on board
    if (!this.state.drag) {
      this.setState({ recentlyPressed: [i, j] }, () => this.handleBoardClick(i, j, this.state.selection))
    }

  }

  handleMouseUp = () => {
    //on mouse up set drag to false, also reset selection to wall
    this.setState({ drag: false, selection: 'Wall' })
  }

  handleDrag = (i, j) => {

    //if drag is on, then set to current selection
    if (this.state.drag) {
      this.handleBoardClick(i, j, this.state.selection);
    }
  }

  handleTouchMove = (e, i, j) => {


    let elem = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);

    if (this.state.prev_elem === elem.id) return
    else this.setState({ prev_elem: elem.id })

    let x = elem.id.split('-')[0]
    let y = elem.id.split('-')[1]

    let [prevX, prevY] = this.state.recentlyPressed

    if (prevX === x && prevY === y) return


    if (this.state.drag) {

      this.setState({ recentlyPressed: [x, y] }, () => this.handleBoardClick(x, y, this.state.selection))
    }


  }

  handleVisualizeButton = () => {

    this.state.game.clearBoardExceptWall()
    this.state.game.runAlgo('BFS', 'init')

    var interval = setInterval(() => {

      let done = this.state.game.runAlgo('BFS', 'run')
      if (!done) {
        let clone = this._copyBoard()
        this.setState({ game: clone })
      }
      else {
        let clone = this._copyBoard()
        for (let cell of clone.final_path) {
          cell.final_path = true;
        }
        this.setState({ game: clone })
        clearInterval(interval);
      }
    }, 1);
  }

  // componentDidMount() {
  //   this.updateWindowDimensions();
  //   window.addEventListener('resize', this.updateWindowDimensions);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.updateWindowDimensions);
  // }

  // updateWindowDimensions = () => {
  //   this.setState({ width: window.innerWidth, height: window.innerHeight });
  // }

  render() {
    return (
      <div className="App">
        <NavBar />
        <button className='btn btn-primary' onClick={this.handleVisualizeButton}>Visualize</button>
        <Board boardTouchMove={this.handleTouchMove} boardDrag={this.handleDrag} boardMouseUp={this.handleMouseUp} boardMouseDown={this.handleMouseDown} board={this.state.game.Board.board} boardClick={this.handleBoardClick} />
      </div>
    );
  }
}

export default App;
