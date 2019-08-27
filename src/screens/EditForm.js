import React, { Component } from 'react';
import { Alert, Image, View, Modal, TouchableWithoutFeedback, ActivityIndicator, NetInfo } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Icon, Text, Form, Item, Input, Label, Button, Card, CardItem, Body, H1, H2, H3, Textarea, Picker } from 'native-base';
import axios from 'axios';
// import { API_URL, URL } from '../../App';
import { saveOfflineJobcard } from '../actions/jobcard';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from '../styles/index';
import ImageViewer from 'react-native-image-zoom-viewer';
import ScreenFooter from './Footer';
import AsyncStorage from '@react-native-community/async-storage';
const LIGHT_BLUE = '#5666c2';
const BLUE = '#3f51b5';
const WHITE = '#fff';
const GRAY = '#e8e8e8';
import CheckOfflineImages from './CheckOfflineImages'

export class AttachmentPicturesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            jobcard_num: null,
            description: null,
            facility_name: null,
            priority: null,
            labour_paid: null,
            materials_paid: null,
            travelling_paid: null,
            status: null,
            index: null
        };
        this.updateJobcard = this.updateJobcard.bind(this);
    }
    static navigationOptions = {
        title: 'Edit My Work',
        headerTitleStyle: {
            color: GRAY
        },
        headerStyle: {
            backgroundColor: BLUE
        },
        headerTintColor : GRAY
    };
    
    componentWillMount() {}
    
    componentDidMount() {
        var data = this.props.navigation.getParam('data')
        this.setState({
            id: data.id,
            jobcard_num: data.jobcard_num,
            description: data.description,
            facility_name: data.facility_name,
            priority: data.priority,
            labour_paid: data.labour_paid,
            materials_paid: data.materials_paid,
            travelling_paid: data.travelling_paid,
            status: data.status,
            index: data.index
        })
        AsyncStorage.getItem('userRole').then(role => {
            this.setState({ userRole: role })
        })
    }
    
    componentWillUnmount() {}

    handleBackButtonClick() {}

    updateJobcard(data) {

        var postdata = {
            id: data.id,
            jobcard_num: data.jobcard_num,
            description: data.description,
            facility_name: data.facility_name,
            priority: data.priority,
            status: data.status
        }
        NetInfo.isConnected.fetch().then(isConnected => {
            if(!isConnected)
            {
                AsyncStorage.getItem('userId').then(userId => {
                    this.props.saveOfflineJobcard(data, data.id, userId)
                    Alert.alert(
                        'Status Offline',
                        'Your changes have been saved offline and will be updated when Internet available',
                        [
                            {text: 'OK', onPress: () => { this.props.navigation.navigate('JobcardEdit', {id: this.state.id, index: this.state.index } )}},
                        ],
                        {cancelable: false},
                    );
                    // Alert.alert('Status Offline', 'Your changes have been saved offline and will be updated when Internet available')
                })
            } else {
                AsyncStorage.getItem('CentralUrlSelected').then(URL => {
                    if(URL) {
                        var API_URL = URL + '/api';
                        axios.post(API_URL + '/updateJobcard', {
                            postdata
                        }).then(response  => {
                            if(response.data.status) {
                                Alert.alert('Success', 'Successfully Updated')
                                // this.getJobcard(this.state.id);
                                // this.props.navigation.navigate('JobcardEdit')
                            }
                        }).catch(error => {
                            Alert.alert('Something Went Wrong', 'Unable to Update Jobcard, Please Try Again!')
                        })
                    }
                })
            }
        })
    }
    
	render() {
        const {navigate} = this.props.navigation;
        const { userRole, status } = this.state
        return (
            <Container>
                <CheckOfflineImages/>
                <Content>
                    <Form>
                        <Item style={{ marginTop: 5}} fixedLabel>
                            <Label style={{ borderWidth: 3, borderColor: '#eee', padding: 10, backgroundColor: '#eee'}}>Number</Label>
                            <Input
                                name="jobcard_num"
                                onChangeText={ (jobcard_num) => this.setState({jobcard_num: jobcard_num}) }
                                value={this.state.jobcard_num }
                                style={{  borderColor: '#09464480'}}
                            />
                        </Item>
                        <View style={{ margin: 3, padding: 10}}>
                            <Label style={{ padding: 10, backgroundColor: '#eee'}}>Description</Label>
                            <Textarea
                                name="description"
                                rowSpan={5}
                                bordered
                                onChangeText={ (description) => this.setState({description: description}) }
                                value={this.state.description }
                            />
                        </View>
                        
                        <Item style={{ marginTop: 5}} fixedLabel>
                            <Label style={{ borderWidth: 3, borderColor: '#eee', padding: 10, backgroundColor: '#eee'}}>Facility Name</Label>
                            <Input
                                name="facility_name"
                                onChangeText={ (facility_name) => this.setState({facility_name: facility_name}) }
                                value={this.state.facility_name }
                            />
                        </Item>
                        <Item style={{ marginTop: 5}} fixedLabel>
                            <Label style={{ borderWidth: 3, borderColor: '#eee', padding: 10, backgroundColor: '#eee'}}>Priority</Label>
                            <Input
                                name="priority"
                                onChangeText={ (priority) => this.setState({priority: priority}) }
                                value={this.state.priority }
                            />
                        </Item>
                        { userRole && userRole == 'Technician/SubContractor' && 
                            <Item style={{ marginTop: 5}} fixedLabel>
                                <Label style={{ borderWidth: 3, borderColor: '#eee', padding: 10, backgroundColor: '#eee'}}>Status</Label>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholder="Select your SIM"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.status}
                                    onValueChange={(status) => this.setState({status: status}) }
                                >
                                    {/* <Picker.Item label="Received" value="Received" /> */}
                                    {/* <Picker.Item label="Assigned" value="Assigned" /> */}
                                    <Picker.Item label="On Hold" value="On Hold" />
                                    <Picker.Item label="Completed" value="Completed" />
                                    {/* <Picker.Item label="Submitted for vetting" value="Submitted for vetting" /> */}
                                    {/* <Picker.Item label="Paid" value="Paid" /> */}
                                    {/* <Picker.Item label="Cancelled" value="Cancelled" /> */}
                                </Picker>
                            </Item>
                        }
                        { userRole && userRole == 'Administrator' && 
                            <Item style={{ marginTop: 5}} fixedLabel>
                                <Label style={{ borderWidth: 3, borderColor: '#eee', padding: 10, backgroundColor: '#eee'}}>Status</Label>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholder="Select your SIM"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.status}
                                    onValueChange={(status) => this.setState({status: status}) }
                                >
                                    <Picker.Item label="Received" value="Received" />
                                    <Picker.Item label="Assigned" value="Assigned" />
                                    <Picker.Item label="On Hold" value="On Hold" />
                                    <Picker.Item label="Completed" value="Completed" />
                                    <Picker.Item label="Submitted for vetting" value="Submitted for vetting" />
                                    <Picker.Item label="Paid" value="Paid" />
                                    <Picker.Item label="Cancelled" value="Cancelled" />
                                </Picker>
                            </Item>
                        }
                        
                        <View>
                            <Button style={{ margin: 10}} onPress={() => this.updateJobcard(this.state)}>
                                <Text>Update</Text>
                            </Button>
                        </View>
                    </Form>
                </Content>
                <ScreenFooter navigation={this.props.navigation}></ScreenFooter>
            </Container>
		);
	}
}

AttachmentPicturesList.propTypes = {
	saveOfflineJobcard: PropTypes.func
}

const mapStateToProps = (state) => ({
    user: state.user,
    jobcard: state.jobcard
})

export default connect(mapStateToProps, { saveOfflineJobcard })(AttachmentPicturesList)
