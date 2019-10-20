import React from 'react';
import { View, DeviceEventEmitter, Text, FlatList, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import Modal from 'react-native-modal';

import database from '../../services/Database';
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
        database.getSeries(null,
            (data) => {
                this.setState({data: data})
            });
    }

    componentWillMount() {
        DeviceEventEmitter.addListener("database_changed", () => this.loadSeries());
    }

    componentDidMount() {
        this.loadSeries();
    }

    render() {
        // Begin writing here
        return(
            <View>
                <FlatList
                    data={this.state.data}
                    renderItem={({item}) => 
                        <View>
                            <Text>{item.series_title}</Text>
                        </View>
                    }
                    keyExtractor={(item, index) => index.toString()}
                />
                <TouchableOpacity onPress={() => {
                    this.seriesInput.focus();
                    this.setState(prevState => ({
                        isModalVisible: true,
                    }))
                }}>
                    <Text>Add Series</Text>
                </TouchableOpacity>

                <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => {
                    console.log('test');
                    this.setState(prevState => ({
                        isModalVisible: false,
                        newSeriesTitle: '',
                    }
                    ))
                }}>
                    <View style={{backgroundColor: colors.default.backgroundColor, borderRadius: 10, padding: 15}}>
                        <Text style={{marginLeft: 5}}>Name of series</Text>
                        <TextInput ref={(ref) => {this.seriesInput = ref}} style={{backgroundColor: colors.default.lightgray, padding: 10, paddingVertical: 7.5, marginVertical: 10, borderRadius: 20}} value={this.state.newSeriesTitle}
                            onChangeText={(text) => this.setState({newSeriesTitle: text})}
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5}}>
                            <TouchableOpacity onPress={
                                () => {
                                    console.log('test');
                                    this.setState(prevState => ({
                                        isModalVisible: false,
                                        newSeriesTitle: '',
                                    }
                                    ))
                                }
                            }>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={
                                () => {
                                    database.addSeries(this.state.newSeriesTitle);
                                    DeviceEventEmitter.emit("database_changed");
                                    this.setState(prevState => ({
                                        isModalVisible: false,
                                        newSeriesTitle: '',
                                    }
                                    ))
                                }
                            }>
                                <Text style={{marginLeft: 20}}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

export default withNavigation(SideMenu);