import GameOfLife from 'game-of-life-logic';
import * as React from 'react';
import ReactDOM from 'react-dom';
import {default as produce, setAutoFreeze} from 'immer';

import DoNothingErrorBoundary from './components/DoNothingErrorBoundary';
import Root from './components/Root';

setAutoFreeze(false);

export default class App {
  constructor(destination) {
    this._destination = destination;

    this._cellMatrix = App._createCellMatrix(48, 48);
    this._timerId = null;
  }

  static _createCellMatrix(rowLength, columnLength) {
    const cells = [];
    for (let rowIndex = 0; rowIndex < rowLength; rowIndex++) {
      const cellsRow = [];
      for (let columnIndex = 0; columnIndex < columnLength; columnIndex++) {
        cellsRow.push({
          age: 0,
          columnIndex,
          rowIndex,
        });
      }
      cells.push(cellsRow);
    }

    return {
      rowLength,
      columnLength,
      cells,
    };
  }

  _tickGameOfLife() {
    // TODO: 悪くないライブラリだけど連携処理で重いし、せっかくだし自分で書いてみる
    const gol = new GameOfLife(this._cellMatrix.rowLength, this._cellMatrix.columnLength);
    const zeroOneMatrix = this._cellMatrix.cells.map(cellsRow => {
      return cellsRow.map(cell => cell.age > 0 ? 1 : 0);
    });
    gol.copyMatrixAt(0, 0, zeroOneMatrix);
    gol.tick();
    this._cellMatrix.cells = produce(this._cellMatrix.cells, draftCells => {
      gol.matrix.forEach((zeroOneRow, rowIndex) => {
        zeroOneRow.forEach((zeroOne, columnIndex) => {
          const draftCell = draftCells[rowIndex][columnIndex];
          draftCell.age = zeroOne === 1 ? draftCell.age + 1 : 0;
        });
      });
    });
  }

  _placeLifes(rowIndex, columnIndex, zeroOneMatrix) {
    this._cellMatrix.cells = produce(this._cellMatrix.cells, draftCells => {
      zeroOneMatrix.forEach((zeroOneRow, relativeRowIndex) => {
        zeroOneRow.forEach((zeroOne, relativeColumnIndex) => {
          const draftCellRow = draftCells[rowIndex + relativeRowIndex];
          if (!draftCellRow) {
            return;
          }
          const draftCell = draftCellRow[columnIndex + relativeColumnIndex];
          if (!draftCell) {
            return;
          }
          draftCell.age = zeroOne;
        });
      });
    });
  }

  _placeSampleLifePattern(rowIndex, columnIndex, sampleId) {
    const lifes = {
      'blinker': [
        [1, 1, 1],
      ],
      'clock': [
        [0, 1, 0, 0],
        [0, 0, 1, 1],
        [1, 1, 0, 0],
        [0, 0, 1, 0],
      ],
    }[sampleId];

    this._placeLifes(rowIndex, columnIndex, lifes);
  }

  _mapToProps() {
    return {
      cellMatrix: this._cellMatrix,
      onRunnningButtonClick: () => {
        console.log('onRunnningButtonClick!');
      },
      onRunnningSpeedButtonClick: () => {
        console.log('onRunnningSpeedButtonClick!');
      },
    };
  }

  render() {
    ReactDOM.render(
      (
        <DoNothingErrorBoundary>
          <Root
            {...this._mapToProps()}
          />
        </DoNothingErrorBoundary>
      ),
      this._destination
    );
  }

  start(interval = 1000) {
    if (this._timerId) {
      throw new Error('It has already started');
    }

    const task = () => {
      this._tickGameOfLife();
      this.render();
    }

    setTimeout(() => {
      task();
      this._timerId = setInterval(task, interval);
    }, 0);
  }

  stop() {
    clearInterval(this._timerId);
  }
}
