import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { STATUS_BAR_HEIGHT, colors } from '../Styles';

class FlatListWithCollapsibleHeader extends React.Component {
    
    containerPaddingTop = this.props.containerPaddingTop != undefined ? this.props.containerPaddingTop : 0;
    containerPaddingBottom = this.props.containerPaddingBottom != undefined ? this.props.containerPaddingBottom : 0;
    navHeight = this.props.navHeight != undefined ? this.props.navHeight : 0;
    NAVBAR_HEIGHT = this.navHeight + this.containerPaddingTop + this.containerPaddingBottom + STATUS_BAR_HEIGHT + 5;

    constructor(props) {
        super(props);

        const scrollAnim = new Animated.Value(0);
        const offsetAnim = new Animated.Value(0);

        this.state={
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
                this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
            )
        }
    }

    componentDidMount() {
        this.state.scrollAnim.addListener(({ value }) => {

            const diff = value - this._scrollValue;

            this._scrollValue = value;

            this._clampedScrollValue = Math.min(
                Math.max(this._clampedScrollValue + diff, 0),
                this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
            )
        })

        this.state.offsetAnim.addListener(({ value }) => {
            this._offsetValue = value;
        })
    }

    componentWillUnmount() {
        this.state.scrollAnim.removeAllListeners();
        this.state.offsetAnim.removeAllListeners();
    }

    _onMomentumScrollEnd = () => {
        const toValue = this._scrollValue > this.NAVBAR_HEIGHT &&
                        this._clampedScrollValue > (this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2
                        ? this._offsetValue + this.NAVBAR_HEIGHT
                        : this._offsetValue - this.NAVBAR_HEIGHT

        Animated.timing(this.state.offsetAnim, {
            toValue,
            duration: 350,
            useNativeDriver: true,
        }).start();
    }

    render() {

        const { clampedScroll } = this.state;

        const navbarTranslate = clampedScroll.interpolate({
            inputRange: [0, this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
            outputRange: [0, -(this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
            extrapolate: 'clamp',
        })

        return(
            <View style={styles.container}>
                <Animated.FlatList
                    data={this.props.data}
                    renderItem={this.props.renderItem}
                    style={[this.props.style]}
                    contentContainerStyle={[{paddingTop: this.NAVBAR_HEIGHT}, this.props.contentContainerStyle]}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
                        { useNativeDriver: true },
                    )}
                />
                <Animated.View style={[styles.navBar, {height: this.props.navHeight, marginTop: this.containerPaddingTop + STATUS_BAR_HEIGHT, marginBottom: this.containerPaddingBottom}, { transform: [{ translateY: navbarTranslate }]}]}>
                    {this.props.header}
                </Animated.View>
                <View style={styles.statusBar}></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    statusBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: STATUS_BAR_HEIGHT,
        backgroundColor: colors.default.white,
    },
    navBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    boxWithShadow: {
        marginBottom: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    }
})

export default FlatListWithCollapsibleHeader;
