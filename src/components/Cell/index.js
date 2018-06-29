import React from 'react';

import styles from './style.scss';

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

export default Cell;
