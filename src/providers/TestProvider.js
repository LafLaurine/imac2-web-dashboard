import React from 'react';
import Environment from '../environment';

export const TestContext = React.createContext();

export class TestProvider extends React.Component {
  state = {
    name: 'defaultValue'
  };

  componentDidMount() {
    fetch(Environment.testUrl, { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        this.setState({ name: json[0].firstname })
      })
      .catch(err => {
        this.setState({ name: `failed to get data from : ${Environment.testUrl}`  })
      });
  }

  render() {
    return (
      <TestContext.Provider value={this.state}>
        {this.props.children}
      </TestContext.Provider>
    );
  }
};
