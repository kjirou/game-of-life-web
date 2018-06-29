import React from 'react';
import ReactDOM from 'react-dom';

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

const Cell = ({age, columnIndex, rowIndex}) => {
  const classNames = [styles.cell];
  if (age > 0) {
    classNames.push(styles.isAlive);
  }

  const inlineStyle = {
    top: rowIndex * 10,
    left: columnIndex * 10,
  };

  return (
    <div className={classNames.join(' ')} style={inlineStyle}></div>
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

const Button = ({label, onClick}) => {
  return (
    <div className={styles.button} onClick={onClick}>{label}</div>
  );
};

const ControlPanel = ({
  onRunnningButtonClick,
  onRunnningSpeedButtonClick,
}) => {
  return (
    <React.Fragment>
      <div className={styles.controlPanel}>
        <div className={styles.commandTitle}>Running</div>
        <div className={styles.command}>
          <Button onClick={onRunnningButtonClick} label={'ON/OFF'} />
        </div>
        <div className={styles.commandTitle}>Running Speed</div>
        <div className={styles.command}>
          <Button onClick={onRunnningSpeedButtonClick} label={'Fast,Slow,..'} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default class Root extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        <Header />
        <div className={styles.game}>
          <CellMatrix cells={this.props.cellMatrix.cells} />
          <ControlPanel
            onRunnningButtonClick={this.props.onRunnningButtonClick}
            onRunnningSpeedButtonClick={this.props.onRunnningSpeedButtonClick}
            />
        </div>
      </div>
    );
  }
}
