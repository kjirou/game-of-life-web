import GameOfLife from 'game-of-life-logic';
import produce from 'immer';
import * as React from 'react';
import ReactDOM from 'react-dom';

import DoNothingErrorBoundary from './components/DoNothingErrorBoundary';
import Root from './components/Root';
import {
  findClickMode,
  findInterval,
  findSampleLifePattern,
  getNextIntervalId,
  toClickModeChoice,
} from './constants';


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
    this._placeLifes(rowIndex, columnIndex, findSampleLifePattern(sampleId).dots);
  }

  _isRunning() {
    return Boolean(this._timerId);
  }

  _mapToProps() {
    return {
      cellMatrix: this._cellMatrix,
      intervalData: findInterval(this._intervalId),
      isRunning: this._isRunning(),
      selectedClickModeChoice: toClickModeChoice(findClickMode(this._clickModeId)),

      //
      // Event handlers
      //

      onCellClick: ({rowIndex, columnIndex}) => {
        if (this._clickModeId === 'dot') {
          this._cellMatrix.cells[rowIndex][columnIndex] = produce(
            this._cellMatrix.cells[rowIndex][columnIndex],
            draftCell => {
              draftCell.age = draftCell.age > 0 ? 0 : 1;
            }
          );
        } else if (this._clickModeId === 'blinker') {
          this._placeSampleLifePattern(rowIndex, columnIndex, 'blinker');
        } else if (this._clickModeId === 'clock') {
          this._placeSampleLifePattern(rowIndex, columnIndex, 'clock');
        }
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
        if (this._isRunning()) {
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
        this._intervalId = getNextIntervalId(this._intervalId);
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
    if (this._isRunning()) {
      throw new Error('It has already started');
    }

    const task = () => {
      this._tickGameOfLife();
      this.render();
    }

    this._timerId = setInterval(task, findInterval(this._intervalId).interval);
  }

  _stop() {
    clearInterval(this._timerId);
    this._timerId = null;
  }
}
