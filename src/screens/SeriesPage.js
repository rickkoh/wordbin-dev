import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import FlatListWithCollapsibleHeader from '../components/FlatListWithCollapsibleHeader';

export default class SeriesPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatListWithCollapsibleHeader>

        </FlatListWithCollapsibleHeader>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});