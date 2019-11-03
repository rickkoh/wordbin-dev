import React, { Component } from 'react';
import { Animated, Platform, StyleSheet, View, Text, ListView, ImageBackground } from 'react-native';

import data from './data';

const NAVBAR_HEIGHT = 64+80;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });

const AnimatedListView = Animated.createAnimatedComponent(ListView);

// Content
// Scrolling Animation
// Scrolling Setting
// Custom Scroll Animation
// Package it into a component
// Refine it using updated components

export default class SeriesPage extends Component {
  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);

    this.state = {
      dataSource: dataSource.cloneWithRows(data),
      scrollAnim,
      offsetAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          offsetAnim,
        ),
        0,
        NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
      ),
    };
  }

  _clampedScrollValue = 0;
  _offsetValue = 0;
  _scrollValue = 0;

  componentDidMount() {
    // Add listener
    this.state.scrollAnim.addListener(({ value }) => {

        clearTimeout(this._onMomentumScrollEnd);

        const diff = value - this._scrollValue;
        this._scrollValue = value;

        this._clampedScrollValue = Math.min(
            Math.max(this._clampedScrollValue + diff, 0),
            NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
        );
    });

    // Offset value = distance from the offset position
    // Update offset value
    this.state.offsetAnim.addListener(({ value }) => {
        console.log(value);
        this._offsetValue = value;
    });
  }

componentWillUnmount() {
    // Remove the listeners
    this.state.scrollAnim.removeAllListeners();
    this.state.offsetAnim.removeAllListeners();
}
  
 _onScrollEndDrag = () => {
    console.log('scroll end drag');
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
 };

_onMomentumScrollEnd = () => {

      console.log(this._scrollValue + " scroll value"); // Position of pixel stopped in the listview
      console.log(this._clampedScrollValue + " clamped value"); // Clamped Scroll Value is the amount of scroll value stuck on the header
      console.log(this._offsetValue + " offset value"); // Figure out what is offset
      console.log(this._scrollValue > NAVBAR_HEIGHT + STATUS_BAR_HEIGHT); // More than navbar
      console.log(this._clampedScrollValue > ((NAVBAR_HEIGHT + STATUS_BAR_HEIGHT) / 2) + STATUS_BAR_HEIGHT); // Clamped value more than half of the navbar
      const toValue = this._scrollValue > NAVBAR_HEIGHT + STATUS_BAR_HEIGHT &&
          this._clampedScrollValue > ((NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2) + STATUS_BAR_HEIGHT
            ? this._offsetValue + NAVBAR_HEIGHT // open
            : this._offsetValue - NAVBAR_HEIGHT; // close
  
    // Value that tells you whether it is going to collapse
    console.log(toValue + " to value");

    Animated.timing(this.state.offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  _renderRow = (rowData, sectionId, rowId) => {
    return (
      <ImageBackground key={rowId} style={styles.row} source={{ uri: rowData.image }} resizeMode="cover">
        <Text style={styles.rowText}>{rowData.title}</Text>
      </ImageBackground>
    );
  };

  render() {
    const { clampedScroll } = this.state;

    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [0, -(NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
      extrapolate: 'clamp',
    });
    const navbarOpacity = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.fill}>
        <AnimatedListView
          contentContainerStyle={styles.contentContainer}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          scrollEventThrottle={1}
          onScrollEndDrag={this._onScrollEndDrag}
          // So animated event essentially helps you retrieve the scrolling data
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
            { useNativeDriver: true },
          )}
        />
        <Animated.View style={[styles.navbar, { transform: [{ translateY: navbarTranslate }]}]}>
            <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: 'pink'}}>
                <Text>Test</Text>
            </View>
        </Animated.View>
        <View style={{position: 'absolute', height: STATUS_BAR_HEIGHT, top:0, left: 0, right: 0, backgroundColor: 'white'}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderBottomColor: 'pink',
    borderBottomWidth: 1,
    height: NAVBAR_HEIGHT,
    flexDirection: 'row',
  },
  contentContainer: {
    paddingTop: NAVBAR_HEIGHT,
  },
  title: {
    color: '#333333',
  },
  row: {
    height: 300,
    width: null,
    marginBottom: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  rowText: {
    color: 'white',
    fontSize: 18,
  },
});
