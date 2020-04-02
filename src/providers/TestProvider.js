import React from 'react';

export const TestContext = React.createContext();

export class TestProvider extends React.Component {
  state = {
    name: 'defaultValue'
  };

  componentDidMount() {
    fetch('http://localhost:3001/users', { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        this.setState({ name: json[0].firstname })
      })
      .catch(err => {
        this.setState({ name: "failed to get data" })
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
