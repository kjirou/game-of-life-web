import GameOfLife from 'game-of-life-logic';
import * as React from 'react';
import ReactDOM from 'react-dom';
import {default as produce, setAutoFreeze} from 'immer';

import DoNothingErrorBoundary from './components/DoNothingErrorBoundary';
import Root from './components/Root';
import {
  findClickMode,
  toClickModeChoice,
} from './constants';

setAutoFreeze(false);

const INTERVALS = {
  veryFast: {
    interval: 100,
    label: 'Very fast',
  },
  fast: {
    interval: 500,
    label: 'Fast',
  },
  slow: {
    interval: 1000,
    label: 'Slow',
  },
};
const INTERVALS_ORDER = [
  'slow',
  'fast',
  'veryFast',
];


export default class App {
  constructor(destination) {
    this._destination = destination;

    this._cellMatrix = App._createCellMatrix(48, 48);
    this._timerId = null;
    this._intervalId = 'fast';
    this._clickModeId = 'dot';
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

  _getIntervalData() {
    return INTERVALS[this._intervalId];
  }

  _getNextIntervalId() {
    const currentIndex = INTERVALS_ORDER.indexOf(this._intervalId);
    const nextIndex = (currentIndex + 1) % INTERVALS_ORDER.length;
    return INTERVALS_ORDER[nextIndex];
  }

  _isRunning() {
    return Boolean(this._timerId);
  }

  _mapToProps() {
    return {
      cellMatrix: this._cellMatrix,
      intervalData: this._getIntervalData(),
      isRunning: this._isRunning(),
      selectedClickModeChoice: toClickModeChoice(findClickMode(this._clickModeId)),

      //
      // Event handlers
      //

      onCellClick: ({rowIndex, columnIndex}) => {
        this._cellMatrix.cells[rowIndex][columnIndex] = produce(
          this._cellMatrix.cells[rowIndex][columnIndex],
          draftCell => {
            draftCell.age = draftCell.age > 0 ? 0 : 1;
          }
        );
        this.render();
      },

      onClickModeChange: (event) => {
        this._clickModeId = event.target.value;
        this.render();
      },

      onRandomButtonClick: () => {
        const birthrate = 1 / 3;
        this._cellMatrix.cells = produce(this._cellMatrix.cells, draftCells => {
          draftCells.forEach(draftCellsRow => {
            draftCellsRow.forEach(draftCell => {
              draftCell.age = Math.random() < birthrate ? 1 : 0;
            });
          });
        });
        this.render();
      },

      onRunnningButtonClick: () => {
        if (this._timerId) {
          this._stop();
        } else {
          this._start();
        }
        this.render();
      },

      onRunnningSpeedButtonClick: () => {
        const isRunning = this._isRunning();
        if (isRunning) {
          this._stop();
        }
        this._intervalId = this._getNextIntervalId();
        if (isRunning) {
          this._start();
        }
        this.render();
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

  _start() {
    if (this._timerId) {
      throw new Error('It has already started');
    }

    const task = () => {
      this._tickGameOfLife();
      this.render();
    }

    this._timerId = setInterval(task, this._getIntervalData().interval);
  }

  _stop() {
    clearInterval(this._timerId);
    this._timerId = null;
  }
}
