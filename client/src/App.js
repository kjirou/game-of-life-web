import * as React from 'react';
import ReactDOM from 'react-dom';
import {default as produce, setAutoFreeze} from 'immer';

import DoNothingErrorBoundary from './components/DoNothingErrorBoundary';
import Root from './components/Root';

setAutoFreeze(false);

export default class App {
  constructor(destination) {
    this._destination = destination;
  }

  _generateRootProps() {
    return {
    };
  }

  mount() {
    ReactDOM.render(
      (
        <DoNothingErrorBoundary>
          <Root
            {...this._generateRootProps()}
          />
        </DoNothingErrorBoundary>
      ),
      this._destination
    );
  }
}
