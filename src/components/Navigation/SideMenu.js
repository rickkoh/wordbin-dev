import React from 'react';
import { View, DeviceEventEmitter, Text, FlatList, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import Modal from 'react-native-modal';

import database from '../../services/Database';

import PillButton from '../PillButton';

import { TextInput } from 'react-native-gesture-handler';
import { colors } from '../../Styles';

class SideMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isModalVisible: false,
            newSeriesTitle: '',
        }
    }

    loadSeries = () => {
        database.getSeries().then(data => this.setState({data: data}));
    }

    // Add listeners
    componentWillMount() {
        DeviceEventEmitter.addListener("database_series_changed", () => this.loadSeries());
    }

    componentDidMount() {
        this.loadSeries();
    }

    render() {
        return(
            <View style={{flex: 1}}>
                <View style={{alignItems: 'center', padding: 20}}>
                    <PillButton
                        text="Add Series"
                        onPress={() => {
                            this.setState(prevState => ({
                                isModalVisible: true,
                            }))
                        }}
                    />
                </View>
                <View style={{flex: 0.75}}>
                    {this.state.data == undefined || this.state.data.length <= 0 ?
                    (<View></View>) :
                    (<View style={{borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.default.lightgray}}>
                        <FlatList
                            data={this.state.data}
                            renderItem={({item}) => 
                                <View style={{paddingLeft: 5, backgroundColor: colors.default.blue}}>
                                    <TouchableOpacity
                                        style={{padding: 10, paddingVertical: 12.5, backgroundColor: colors.default.backgroundColor}}
                                    >
                                        <Text>{item.series_title}</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>)}
                </View>
                <View style={{flex: 0.25}}>

                </View>

                <Modal  isVisible={this.state.isModalVisible}
                        onBackdropPress={() => {
                            console.log('test');
                            this.setState(prevState => ({
                                isModalVisible: false,
                                newSeriesTitle: '',
                            }
                            ))
                        }}
                        onShow={() => {
                            this.textInput.focus();
                        }}
                >
                    <View style={{backgroundColor: colors.default.backgroundColor, borderRadius: 10, padding: 15}}>
                        <Text style={{paddingHorizontal: 5, fontSize: 16}}>Name of series</Text>
                        <TextInput ref={(ref) => {this.textInput = ref}} style={{backgroundColor: colors.default.lightgray, padding: 10, marginVertical: 12.5, marginBottom: 15, borderRadius: 20}} value={this.state.newSeriesTitle}
                            onChangeText={(text) => this.setState({newSeriesTitle: text})}
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <TouchableOpacity style={{marginRight: 20}} text="Cancel" onPress={
                                () => {
                                    console.log('test');
                                    this.setState(prevState => ({
                                        isModalVisible: false,
                                        newSeriesTitle: '',
                                    }
                                    ))
                                }
                            }>
                                <Text style={{color: colors.default.lightred}}>Cancel</Text>
                            </TouchableOpacity>
                            
                            <PillButton
                                text="Add"
                                onPress={
                                () => {
                                    database.addSeries(this.state.newSeriesTitle);
                                    DeviceEventEmitter.emit("database_series_changed");
                                    this.setState(prevState => ({
                                        isModalVisible: false,
                                        newSeriesTitle: '',
                                    }
                                    ))
                                }
                            }/>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

export default withNavigation(SideMenu);