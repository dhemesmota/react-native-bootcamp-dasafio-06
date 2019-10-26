import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { WebView } from 'react-native-webview';

// import { Container } from './styles';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    repository: [],
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const repository = navigation.getParam('repository');

    this.setState({ repository });
  }

  render() {
    const { repository } = this.state;
    return (
      <WebView source={{ uri: repository.html_url }} style={{ flex: 1 }} />
    );
  }
}
