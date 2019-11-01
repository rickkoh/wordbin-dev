import React, { Component } from 'react';
import { Animated, Image, ScrollView, Platform, StyleSheet, View, Text, ListView, ImageBackground } from 'react-native';

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
      console.log('Scroll value: ' + value);
      // Value definition
      // Difference = new value - current scroll value
      const diff = value - this._scrollValue;
      // Set new scroll value
      this._scrollValue = value;

      // Figure out what's clamped value

      // Clamped scroll value = old clamped scroll value + difference

      // Clamped scroll value starts from 0
      // Sometimes it can get negative?

      // When the difference is greater than the navbar height
      // Clamped scroll value = navbar height

      // When the difference is lesser than the navbar height
      // Clamped scroll value = difference height

      // Clamped scroll value is now at 124
      // The more I scroll down, the higher the difference, height will remain the same

      // Clamped scroll value will decrease when you scroll up
      // As long as you scroll up, it will be lesser than 124 immediately
      // So this is where you can set the "additional" value that you want to set

      // How do we add the additional value
      // Expected behavior: Scroll a bit more first then start showing the navbar instead of just showing it straight away, add a little delay

      // Clamped value is adjusting itself every second2

      // Set a value thress hold
      this._clampedScrollValue = Math.min(
        Math.max(this._clampedScrollValue + diff, 0),
        NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
      );
    });

    // Value of offset will be adjust accordingly
    // Whats a offset Anim?
    this.state.offsetAnim.addListener(({ value }) => {
      console.log(value);
      this._offsetValue = value;
    });
  }

  componentWillUnmount() {
    this.state.scrollAnim.removeAllListeners();
    this.state.offsetAnim.removeAllListeners();
  }
  
  // Expected behavior
  // Let go then decide
  // 

  _onScrollEndDrag = () => {
    console.log('scroll end drag');
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
  };

  _onMomentumScrollBegin = () => {
    console.log('scroll begin');
    this.state.offsetAnim.stopAnimation();
    clearTimeout(this._scrollEndTimer);
  };

  _onMomentumScrollEnd = () => {
    // Understand scrollValue and clampedScrollValue
    console.log(this._scrollValue); // Position of pixel stopped in the listview
    console.log(this._clampedScrollValue); // Clamped Scroll Value is the amount of scroll value stuck on the header
    console.log(this._offsetValue);
    console.log(this._scrollValue > NAVBAR_HEIGHT + STATUS_BAR_HEIGHT); // What factor is this?
    console.log(this._clampedScrollValue > ((NAVBAR_HEIGHT + STATUS_BAR_HEIGHT) / 2) + STATUS_BAR_HEIGHT); // 
    const toValue = this._scrollValue > NAVBAR_HEIGHT + STATUS_BAR_HEIGHT &&
      this._clampedScrollValue > ((NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2) + STATUS_BAR_HEIGHT
      ? this._offsetValue + NAVBAR_HEIGHT // close
      : this._offsetValue - NAVBAR_HEIGHT; // open

    console.log(toValue);

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
          onMomentumScrollBegin={this._onMomentumScrollBegin}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          onScrollEndDrag={this._onScrollEndDrag}
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