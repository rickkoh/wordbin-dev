import React from 'react';
import { Animated, Platform, StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';

import Header from './Header';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import WordCard from './WordCard';

import { headerStyles, colors } from '../Styles';

import database from '../services/Database';

const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });
const NAVBAR_HEIGHT = 44 + STATUS_BAR_HEIGHT + 10;

class FlatListWithCollapsibleHeader extends React.Component {
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
                NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
            )
        }
    }

    componentDidMount() {
        this.loadData().then(data => this.setState({data: data}))

        this.state.scrollAnim.addListener(({ value }) => {

            const diff = value - this._scrollValue;

            this._scrollValue = value;

            this._clampedScrollValue = Math.min(
                Math.max(this._clampedScrollValue + diff, 0),
                NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
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

    loadData = (opts, args) => {

        entities = {}

        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }

        if (opts == "tag") {
            // "tag", [tag_id]
            return new Promise(async (resolve, reject) => {
                await database.getWordsByTags(args[0]).then(async data => {
                    entities.Words = data;
                    await clip(data);
                })
                .then(() => resolve(entities))
                .catch(error => reject(error))
            })
        } else {
            // default
            return new Promise(async (resolve, reject) => {
                await database.getWords().then(async data => {
                    entities.Words = data;
                    await clip(data);
                })
                .then(() => resolve(entities))
                .catch(error => reject(error))
            })
        }

        // Clip word data
        async function clip(data) {
            await asyncForEach(data, async (word, word_index) => {
                await database.getWordTags(word.word_id).then(async data => {
                    entities.Words[word_index].Tags = data;
                })
                .catch(error => reject(error))
                await database.getMeanings(word.word_id).then(async data => {
                    entities.Words[word_index].Meanings = data;
                    await asyncForEach(data, async (meaning, meaning_index) => {
                        await database.getWordSynonym(meaning.meaning_id).then(async data => {
                            entities.Words[word_index].Meanings[meaning_index].Synonyms = data;
                        })
                        .catch(error => reject(error))
                    })
                })
                .catch(error => reject(error))
            })
        }

    }

    _onMomentumScrollEnd = () => {
        const toValue = this._scrollValue > NAVBAR_HEIGHT &&
                        this._clampedScrollValue > (NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2
                        ? this._offsetValue + NAVBAR_HEIGHT
                        : this._offsetValue - NAVBAR_HEIGHT
        
        Animated.timing(this.state.offsetAnim, {
            toValue,
            duration: 350,
            useNativeDriver: true,
        }).start();
    }

    render() {
        
        const { clampedScroll } = this.state;

        const navbarTranslate = clampedScroll.interpolate({
            inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
            outputRange: [0, -(NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
            extrapolate: 'clamp',
        })
        console.log(this.state.data);

        return(
            <View style={styles.container}>
                {this.state.data != undefined ?  
                <Animated.FlatList
                    data={this.state.data.Words}
                    renderItem={({item}) => <WordCard word={item} onCardPress={this.props.onCardPress}/>}
                    contentContainerStyle={styles.contentContainer}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
                        { useNativeDriver: true },
                    )}
                />
                : null}
                <Animated.View style={[styles.navbar, { transform: [{ translateY: navbarTranslate }]}]}>
                    <View style={[styles.boxWithShadow, {height: 44, borderRadius: 10, marginHorizontal: 10, marginTop: STATUS_BAR_HEIGHT+10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white'}]}>
                        <TouchableOpacity
                            style={{marginLeft: 10}}
                            onPress={() => this.props.navigation.openDrawer()}
                        >
                            <Icon name='menu' color={colors.default.primaryColor}/>
                        </TouchableOpacity>
                        <Text style={headerStyles.headerTitle} onPress={() => this.refreshData()}>
                            Home
                        </Text>
                        <TouchableOpacity
                            onPress={() => this._menu.show()}
                            style={{marginRight: 10}}>
                            <Icon name='grid' type="entypo" color={colors.default.primaryColor}/>
                            <Menu ref={(ref) => this._menu = ref}
                                style={{backgroundColor: 'black'}}
                            >
                                <MenuItem onPress={this.hideMenu}><Text style={{color: 'white'}}>Alphabet</Text></MenuItem>
                                <MenuItem onPress={this.hideMenu}><Text style={{color: 'white'}}>Latest</Text></MenuItem>
                                <MenuItem onPress={this.hideMenu}><Text style={{color: 'white'}}>Earliest</Text></MenuItem>
                                <MenuDivider color={colors.default.lightgray} />
                                <MenuItem onPress={this.hideMenu}><Text style={{color: 'white'}}>Custom</Text></MenuItem>
                            </Menu>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <View style={{position: 'absolute', height: STATUS_BAR_HEIGHT, top: 0, left: 0, right: 0, backgroundColor: 'white'}}></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        paddingTop: NAVBAR_HEIGHT,
        justifyContent: 'center',
    },
    navbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: NAVBAR_HEIGHT,
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