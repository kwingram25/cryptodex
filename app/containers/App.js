import React, { Component } from 'react';
import MainSection from '../components/MainSection';

import '../static/styles/cryptocoins.css';
import '../static/styles/coins.css';

export default class App extends Component {
  render() {
    const { props } = this;
    return (
      <MainSection {...props} />
    );
  }
}
