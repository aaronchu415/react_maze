import React, { Component } from 'react';
import Cell from './Cell';


class Board extends Component {

  renderRow(row) {
    return (
      <tr>
        {row.map(cell => <Cell click={(i, j) => this.props.boardClick(i, j)} cell={cell}></Cell>)}
      </tr>
    )
  }

  render() {
    const { board } = this.props;
    return (
      <table class="table table-bordered table-dark">
        <tbody>
          {board.map(row => this.renderRow(row))}
        </tbody>
      </table>
    );
  }
}

export default Board;
