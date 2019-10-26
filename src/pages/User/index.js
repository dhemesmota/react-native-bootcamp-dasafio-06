import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Loading,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  RepositoryButton,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
    refreshing: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false });
  }

  loadMore = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { page, stars } = this.state;

    const next = page + 1;

    const response = await api.get(`/users/${user.login}/starred?page=${next}`);

    this.setState({ stars: [...stars, ...response.data], page: next });
  };

  refreshList = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false, page: 1 });
  };

  handleNavigate = repository => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading>
            <ActivityIndicator />
          </Loading>
        ) : (
          <Stars
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <RepositoryButton onPress={() => this.handleNavigate(item)}>
                  <OwnerAvatar
                    source={{ uri: item.owner && item.owner.avatar_url }}
                  />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </RepositoryButton>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
