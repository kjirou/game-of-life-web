import React from 'react';
import ReactDOM from 'react-dom';

import styles from './style.scss';

export default class Root extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        ROOT!!
      </div>
    );
  }
}
