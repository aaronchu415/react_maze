import React, { Component } from 'react';
import './Cell.css'

class Cell extends Component {
  state = {}


  render() {
    const { cell } = this.props
    let cellClass = cell.type;

    if (cell.type !== 'Start' && cell.type !== 'End') {
      if (cell.final_path) {
        cellClass = 'final_path'
      } else if (cell.current) {
        cellClass = 'current'
      } else if (cell.visited) {
        cellClass = 'visited'
      }
    }

    return (<td onClick={() => this.props.click(this.props.cell.i, this.props.cell.j)} className={cellClass}>

    </td>);
  }
}

export default Cell;
