import React from 'react';
import ReactDOM from 'react-dom';

import {generateClickModeChoices} from '../../constants';

import styles from './style.scss';

// The reason for this being a variable is that, "'" breaks JSX syntax at my vim/GitHub environment...
const appName = "Conway's Game of Life";

const clickModeChoices = generateClickModeChoices();

const Header = () => {
  return (
    <div className={styles.header}>
      <span className={styles.title}>{appName}</span>
      <a className={styles.gitHubLink} href="https://github.com/kjirou/game-of-life-web">GitHub</a>
    </div>
  );
};

const Cell = ({
  age,
  columnIndex,
  onClick,
  rowIndex,
}) => {
  const classNames = [styles.cell];
  if (age > 0) {
    classNames.push(styles.isAlive);
  }

  const inlineStyle = {
    top: rowIndex * 10,
    left: columnIndex * 10,
  };

  return (
    <div
      className={classNames.join(' ')}
      onClick={() => {
        onClick({rowIndex, columnIndex});
      }}
      style={inlineStyle}
      />
  );
};

const CellMatrix = ({
  cells,
  onCellClick,
}) => {
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
          onClick={onCellClick}
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

const Select = ({
  choices,
  onChange,
  selectedValue,
}) => {
  return (
    <select
      className={styles.select}
      onChange={onChange}
      value={selectedValue}
      >
    {
      choices.map(({label, value}, index) => {
        return <option key={'choice' + index} value={value}>{label}</option>;
      })
    }
    </select>
  );
};

const ControlPanel = ({
  intervalData,
  isRunning,
  onClickModeChange,
  onRandomButtonClick,
  onRunnningButtonClick,
  onRunnningSpeedButtonClick,
  selectedClickModeChoice,
}) => {
  return (
    <div className={styles.controlPanel}>
      <div className={styles.commandTitle}>Running</div>
      <div className={styles.command}>
        <Button onClick={onRunnningButtonClick} label={isRunning ? 'On' : 'Off'} />
      </div>
      <div className={styles.commandTitle}>Running Speed</div>
      <div className={styles.command}>
        <Button onClick={onRunnningSpeedButtonClick} label={intervalData.label} />
      </div>
      <div className={styles.commandTitle}>Click Mode</div>
      <div className={styles.command}>
        <Select
          choices={clickModeChoices}
          onChange={onClickModeChange}
          selectedValue={selectedClickModeChoice.value}
          />
      </div>
      <div className={styles.commandTitle}>Sample placement</div>
      <div className={styles.command}>
        <Button onClick={onRandomButtonClick} label="Random" />
      </div>
    </div>
  );
};

const Root = ({
  cellMatrix,
  intervalData,
  isRunning,
  onCellClick,
  onClickModeChange,
  onRandomButtonClick,
  onRunnningButtonClick,
  onRunnningSpeedButtonClick,
  selectedClickModeChoice,
}) => {
  return (
    <div className={styles.root}>
      <Header />
      <div className={styles.game}>
        <CellMatrix
          cells={cellMatrix.cells}
          onCellClick={onCellClick}
          />
        <ControlPanel
          intervalData={intervalData}
          isRunning={isRunning}
          onClickModeChange={onClickModeChange}
          onRandomButtonClick={onRandomButtonClick}
          onRunnningButtonClick={onRunnningButtonClick}
          onRunnningSpeedButtonClick={onRunnningSpeedButtonClick}
          selectedClickModeChoice={selectedClickModeChoice}
          />
      </div>
    </div>
  );
};

export default Root;
