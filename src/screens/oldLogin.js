import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Alert, Image, AsyncStorage } from 'react-native';
import { Container, Header, Content, Item, Form, Input, Button, Label, Icon, Spinner } from "native-base";
import axios from 'axios';
import { API_URL } from '../../App';
import { saveUser } from '../actions/user';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoginAvatar from '../assets/login.png';
import styles from '../styles/index';
import { BackHandler } from 'react-native';
import {NavigationEvents} from 'react-navigation';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          email: "",
          password: "",
          error: null,
          loading: false
        };
        this.LogIn = this.LogIn.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      }
    static navigationOptions = {
        headerLeft: null
    };
    
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    LogIn = (email, password) => {
        if (!email || !password) {
            Alert.alert('Error', 'Please Enter Required Fields', [{ text: 'OK'} ], {cancelable: true},)
            return false
        }
        this.setState({ loading: true})
        axios.post(API_URL + '/login', {
           email: email,
           password: password
        }).then(response => {
            if (response.data.status == 200) {
                let userrId = response.data.userId
                let role = response.data.role
                // Alert.alert('Error', userrId.toString(), [{ text: 'OK'} ], {cancelable: true},)
                /************ SAVE USER ID TO LOCAL STORAGE ************/
                this.props.saveUser(userrId, email, role)
                /************ SAVE USER ID TO LOCAL STORAGE ************/
                const {navigate} = this.props.navigation;
                setTimeout(() => {
                    //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
                    this.setState({ loading: false})
                    navigate('Dashboard', {userId: userrId})
                }, 2000);
            }
            if (response.data.status == 400) {
                this.setState({ loading: false})
                Alert.alert('Error', 'User not found. Please Try Again', [{ text: 'OK'} ], {cancelable: false},)
            }
            if (response.data.status == 404) {
                this.setState({ loading: false})
                Alert.alert('Error', 'Credentials do not match. Please Try Again', [{ text: 'OK'} ], {cancelable: false},)
            }
        }).catch(error => {
            this.setState({ loading: false})
            Alert.alert('Error', error.toString())
            // Alert.alert('Error', 'Error', [{ text: 'Cancel', style: 'cancel'}, { text: 'OK'} ], {cancelable: false},)
            this.setState({ error: error});
        })
    }

    handleBackButtonClick() {
        // AsyncStorage.getItem('userId').then(id => {
		// 	if(id) {
		// 		Alert.alert('user is logged in', id.toString())
		// 	} else {
		// 		this.props.navigation.navigate('Login')
		// 	}
		// })
        // this.props.navigation.goBack(null);
        return true;
    }

	render() {
		const {navigate} = this.props.navigation;
		return (
            <Container style={ styles.loginContainer }>
                <View style={styles.loginImageBlock}>
                    <Image style={styles.loginAvatar } source={ LoginAvatar}></Image>
                </View>
                <Content>
                    <View style={{ padding: 40, backgroundColor: "white"}}>
                        <View style={{ marginBottom: 16}}>
                            <Item floatingLabel >
                                <Label>Email</Label>
                                <Input autoCapitalize="none" autoCorrect={false} onChangeText={(email) => this.setState({email})} />
                            </Item>
                        </View>
                        
                        <View style={{ marginBottom: 16}}>
                            <Item floatingLabel>
                                <Label>Password</Label>
                                <Input
                                secureTextEntry={true}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(password) => this.setState({password})}
                                />
                            </Item>
                        </View>

                        <Button disabled={this.state.loading ? true : false} style={ styles.loginButton } full success onPress={() => this.LogIn(this.state.email, this.state.password)}>
                            { !this.state.loading ?
                                <Text style={{ color: '#fff' }}>Login</Text>
                                : <Spinner color="#fff"/>
                            }
                        </Button>
                    </View>
                </Content>
            </Container>
		);
	}
}

Login.propTypes = {
	saveUser: PropTypes.func
}

const mapStateToProps = (state) => ({
	user: state.user
})

export default connect(mapStateToProps, { saveUser })(Login)
