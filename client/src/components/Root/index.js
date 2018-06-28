import React from 'react';
import ReactDOM from 'react-dom';

import Cell from '../Cell';

import styles from './style.scss';

const CellMatrix = ({cells}) => {
  const cellElements = [];
  cells.forEach(cellsRow => {
    cellsRow.forEach(cell => {
      const key = `cell-${cell.rowIndex}-${cell.columnIndex}`;
      cellElements.push(
        <Cell
          key={key}
          age={cell.age}
          columnIndex={cell.columnIndex}
          rowIndex={cell.rowIndex}
        />
      );
    });
  });

  return (
    <div className={styles.cellMatrix}>{cellElements}</div>
  );
};

export default class Root extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        <CellMatrix cells={this.props.cellMatrix.cells} />
      </div>
    );
  }
}
