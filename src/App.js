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
    }
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).addEventListener('touchstart', (e) => {
      e.preventDefault();
      console.log("touchstart triggered");
    });
  }

  _initBoard() {

    let COL = 50;
    let ROW = 50;

    if (window.innerWidth <= 576) {
      ROW = 20;
      COL = 15;
    }
    else if (window.innerWidth <= 768) {
      ROW = 30;
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
    console.log('down', e, i, j)


    //get current cell and its type if it is start or end then set selection
    let curr_cell = this.state.game.Board.board[i][j];
    let curr_type = curr_cell.type

    //set the type to selection and make drag true
    this.setState({ drag: true, selection: curr_type })

    //if drag is not intiated then 'click' on board
    if (!this.state.drag) this.handleBoardClick(i, j, this.state.selection);

  }

  handleMouseUp = () => {

    console.log('up')

    //on mouse up set drag to false, also reset selection to wall
    this.setState({ drag: false, selection: 'Wall' })
  }

  handleDrag = (i, j) => {

    console.log('drag', i, j)

    //if drag is on, then set to current selection
    if (this.state.drag) {
      this.handleBoardClick(i, j, this.state.selection);
    }
  }

  handleTouchMove = (e, i, j) => {

    let elem = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    let x = elem.id.split('-')[0]
    let y = elem.id.split('-')[1]

    let [prevX, prevY] = this.state.recentlyPressed

    if (prevX === x && prevY === y) return

    console.log('move', x, y, this.state.drag, elem)


    if (this.state.drag) {
      this.handleBoardClick(x, y, this.state.selection);
      this.setState({ recentlyPressed: [x, y] })
    }


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
        <Board boardTouchMove={this.handleTouchMove} boardDrag={this.handleDrag} boardMouseUp={this.handleMouseUp} boardMouseDown={this.handleMouseDown} board={this.state.game.Board.board} boardClick={this.handleBoardClick} />
      </div>
    );
  }
}

export default App;
