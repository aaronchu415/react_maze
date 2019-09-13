import React, { Component } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import Board from './components/Board';
import Game from './classes/board';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      game: this._initBoard()
    }
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

  handleBoardClick = (i, j) => {
    let clone = Object.assign(Object.create(Object.getPrototypeOf(this.state.game)), this.state.game)
    clone.clearBoardExceptWall()
    clone.Board.handleClick(i, j, 'Wall')
    let final_path = clone.runBFS()

    for (let cell of final_path) {
      cell.final_path = true;
    }

    this.setState({ game: clone })
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
        <Board board={this.state.game.Board.board} boardClick={this.handleBoardClick} />
      </div>
    );
  }
}

export default App;
