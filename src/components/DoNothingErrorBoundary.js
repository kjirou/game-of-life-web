import * as React from 'react';

export default class DoNothingErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidCatch() {
  }

  render() {
    return this.props.children;
  }
}
