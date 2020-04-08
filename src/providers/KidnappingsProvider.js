import React from 'react';
import Environment from 'environment';

export const KidnappingsContext = React.createContext();

export class KidnappingsProvider extends React.Component {
  // TODO
  state = {
    name: 'defaultValue'
  };

  componentDidMount() {
    fetch(Environment.dbNomicsUrl + 'TODO', { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        // TODO
        // this.setState({ name: json[0].firstname })
      })
      .catch(err => {
        // TODO
        // this.setState({ name: `failed to get data from : ${Environment.testUrl}`  })
      });
  }

  render() {
    return (
      <KidnappingsContext.Provider value={this.state}>
        {this.props.children}
      </KidnappingsContext.Provider>
    );
  }
};
