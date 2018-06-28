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

  _tickGame() {
    // TODO: 悪くないライブラリだけど連携処理で重いし、せっかくだし自分で書いてみる
    const gol = new GameOfLife(this._cellMatrix.rowLength, this._cellMatrix.columnLength);
    const zeroOneMap = this._cellMatrix.cells.map(cellsRow => {
      return cellsRow.map(cell => cell.age > 0 ? 1 : 0);
    });
    gol.copyMatrixAt(0, 0, zeroOneMap);
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

  _mapToProps() {
    return {
      cellMatrix: this._cellMatrix,
    };
  }

  mount() {
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
}
