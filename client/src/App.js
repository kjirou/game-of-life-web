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
