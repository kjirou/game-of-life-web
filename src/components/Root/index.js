import React from 'react';
import ReactDOM from 'react-dom';

import Cell from '../Cell';

import styles from './style.scss';

// The reason for this being a variable is that, "'" breaks JSX syntax at my vim/GitHub environment...
const appName = "Conway's Game of Life";

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.title}>{appName}</div>
    </div>
  );
};

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

const ControlPanel = () => {
  return (
    <div className={styles.controlPanel}>CP</div>
  );
};

export default class Root extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        <Header />
        <div className={styles.game}>
          <CellMatrix cells={this.props.cellMatrix.cells} />
          <ControlPanel />
        </div>
      </div>
    );
  }
}
