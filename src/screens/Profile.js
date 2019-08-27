import React, { Component  } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert, TouchableWithoutFeedback, NetInfo } from 'react-native';
import { Container, Header, Content, Footer, Form, Item, View, Input, Label, FooterTab, Button, Icon, Text, Card, CardItem, Body, Right } from 'native-base';
import axios from 'axios';
import { connect } from 'react-redux';
// import { API_URL } from '../../App';
import {NavigationEvents} from 'react-navigation';
import ScreenFooter from './Footer';
import AuthenticateLogin from './AuthenticateLogin'
let USER_ID = 0;

export class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: null,
            name: null,
            email: null,
            oldPassword: null,
            password: null,
            confirmPassword: null,
            showOldPassword: true,
            showNewPassword: true,
            showNewConfirmPassword: true,
            isConnected: false
        };
		this.getUserInfo = this.getUserInfo.bind(this);
		this.updateUserInfo = this.updateUserInfo.bind(this);
		this.getStorageValue = this.getStorageValue.bind(this);
		this.changeOldPwdType = this.changeOldPwdType.bind(this);
		this.handleChange = this.handleChange.bind(this);
        
      }
    static navigationOptions = {
        title: 'My Profile',
	};  
    handleChange(value, type) {
        if(type == 'old') {
            this.setState({oldPassword: value})
        }
    }
    getUserInfo() {
        AsyncStorage.getItem('userId').then(id => {
			if(id) {
                USER_ID = id
                AsyncStorage.getItem('CentralUrlSelected').then(URL => {
                    if(URL) {
                        var API_URL = URL + '/api';
                        axios.get(API_URL + '/getUserInfo', {
                            params: {
                                user_id: USER_ID
                            }
                        }).then(response => {
                            this.setState({ 
                                userInfo: response.data,
                                name: response.data.name,
                                email: response.data.email
                                })
                        }).catch(error => {
                            Alert.alert('Error', error.toString())
                        })
                    }
                })
            }
		})
    }
    componentDidMount(){
        this.getStorageValue()
        this.getUserInfo()
        NetInfo.isConnected.fetch().then(isConnected => {
			// CHECK IF INTERNET IS CONNECTED OR NOT
			if(isConnected)
            { 
                this.setState({ isConnected: true})
            }
        })
    }
    changeOldPwdType = () => {
        if (this.state.showOldPassword) {
            this.setState({
                showOldPassword: false
            })
        } else {
            this.setState({
                showOldPassword: true
            })
        }   
        
    }
    updateUserInfo = () => {
        const { name, email, password, confirmPassword, oldPassword } = this.state;
        if (!name || !email) {
            Alert.alert('Error', 'Please enter required fields')
            return false
        }
        if(password || confirmPassword) {
            if (password !== confirmPassword) {
                Alert.alert('Passwords do no match', 'Please try again')
                return false
            }
            if(!oldPassword) {
                Alert.alert('Error', 'Please enter old password to Update')
                return false
            }
        }
        
        axios.post(API_URL + '/updateUserInfo', {
            user_id: USER_ID,
            name: name,
            email: email,
            old_password: oldPassword,
            new_password: password
		 }).then(response => {
            if (response.data.status == 200) {
                Alert.alert('Response', 'Successfully updated')
                this.setState({
                    oldPassword: null,
                    password: null,
                    confirmPassword: null
                })
            } 
            if(response.data.status == 300) {
                Alert.alert('Something Went Wrong, Please try again')
            }
            if(response.data.status == 404) {
                Alert.alert('Credentials Do Not Match')
            }
		 })
    }

    getStorageValue() {
		AsyncStorage.getItem('userId').then(id => {
			if(id) {
                USER_ID = id
            } else {
				this.props.navigation.navigate('Login')
			}
		})
    }
    
    
    
	render() {
        const {navigate} = this.props.navigation;
        const { isConnected } = this.state;

        function OldPassword(props) {
            const { oldPassword, showOldPassword } = props
            if (oldPassword) {
                if (showOldPassword) {
                    return (
                        <Item floatingLabel>
                            <Label>Old Password</Label>
                            <Input
                                name="oldPassword"
                                secureTextEntry={showOldPassword}
                                getRef={input => { this.firstNameRef = input; }}
                                onChangeText={ (oldPassword) => props.changePassword(oldPassword) }
                                value={oldPassword }
                            />
                            <Icon style={{ color: '#000'}} name="eye" onPress={props.changeOldPwdType}></Icon>
                        </Item>
                    )
                } else {
                    return (
                        <Item floatingLabel>
                            <Label>Old Password</Label>
                            <Input
                                name="oldPassword"
                                getRef={input => { this.firstNameRef = input; }}
                                secureTextEntry={showOldPassword}
                                onChangeText={ (oldPassword) => props.changePassword(oldPassword) }
                                value={oldPassword }
                            />
                            <Icon style={{ color: '#000'}} name="eye-off" onPress={props.changeOldPwdType}></Icon>
                        </Item>
                    )
                }
            } else {
                return (
                    <Item floatingLabel>
                        <Label>Old Password</Label>
                        <Input
                            name="oldPassword"
                            getRef={input => { this.firstNameRef = input; }}
                            secureTextEntry={showOldPassword}
                            onChangeText={ (oldPassword) => props.changePassword(oldPassword) }
                            value={oldPassword }
                        />
                    </Item>
                )
            }
            
        }
        
        
		return (
            <Container style={{ padding: 0}}>
				<AuthenticateLogin navigation={this.props.navigation}/>
                <Content style={{ padding: 20 }}>
                    <Form>
                        <Item fixedLabel>
                            <Label>Name</Label>
                            <Input
                                name="name"
                                onChangeText={ (name) => this.setState({name: name}) }
                                value={this.state.name }
                            />
                        </Item>
                        
                        <Item fixedLabel>
                            <Label>Email</Label>
                            <Input
                                name="email"
                                onChangeText={ (email) => this.setState({email: email}) }
                                value={this.state.email }
                            />
                        </Item>
                        
                        {/* <OldPassword changeOldPwdType={this.changeOldPwdType} changePassword={(OldPassword) => { this.handleChange(OldPassword, 'old') }} oldPassword={this.state.oldPassword} showOldPassword={this.state.showOldPassword}></OldPassword> */}
                        <Item floatingLabel>
                            <Label>Old Password</Label>
                            <Input
                                name="oldPassword"
                                // secureTextEntry={this.state.showOldPassword}
                                onChangeText={ (oldPassword) => this.setState({oldPassword: oldPassword}) }
                                value={this.state.oldPassword }
                            />
                        </Item>
                              
                        <Item floatingLabel>
                            <Label>New Password</Label>
                            <Input
                                name="password"
                                onChangeText={ (password) => this.setState({password: password}) }
                                value={this.state.password }
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Confirm Password</Label>
                            <Input
                                name="confirmPassword"
                                onChangeText={ (confirmPassword) => this.setState({confirmPassword: confirmPassword}) }
                                value={this.state.confirmPassword }
                            />
                        </Item>
                        <Button
                            onPress={() => this.updateUserInfo()}
                            style={{ marginTop: 15 }}
                            full
                            disabled={!isConnected}
                        >
                            <Text>Update</Text>
                        </Button>
                        { !isConnected && 
                            <Text style={{ textAlign: 'center', backgroundColor: 'red', color: 'white', fontSize: 13, marginTop: 5, padding: 4}}>Unable to update without any internet connection</Text>
                        }
                    </Form>
                {/* <Text>{ this.state.userInfo ? JSON.stringify(this.state.userInfo) : 'No User Info'}</Text> */}
                </Content>
				<ScreenFooter navigation={this.props.navigation}></ScreenFooter>
            </Container>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user
})

export default connect(mapStateToProps)(Profile)
