import React, { Component } from 'react';
import Cell from './Cell';


class Board extends Component {

  renderRow(row) {
    return (
      <tr>
        {row.map(cell => <Cell drag={(i, j) => this.props.boardDrag(i, j)} mUp={(i, j) => this.props.boardMouseUp(i, j)} mDown={(i, j) => this.props.boardMouseDown(i, j)} click={(i, j) => this.props.boardClick(i, j)} cell={cell}></Cell>)}
      </tr>
    )
  }

  render() {
    const { board } = this.props;
    return (
      <table class="table table-bordered">
        <tbody>
          {board.map(row => this.renderRow(row))}
        </tbody>
      </table>
    );
  }
}

export default Board;
