import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Alert, Image  } from 'react-native';
import { Container, Header, Content, Item, Form, Input, Button, Card, CardItem, Body, Label, Icon, Spinner, ActionSheet, Root, Left, H1, H2, H3 } from "native-base";
import axios from 'axios';
import { saveUser, saveCentralUrl } from '../actions/user';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoginAvatar from '../assets/login.png';
import styles from '../styles/index';
import { BackHandler } from 'react-native';
import {NavigationEvents} from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import logoImage from '../assets/logo.png';

export class SelectUrl extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          central_url: "",
          CentralUrlsList: [],
          error: null,
          loading: false,
          clicked: null
        };
        this.connectWebCentral = this.connectWebCentral.bind(this);
        this.showActionSheet = this.showActionSheet.bind(this);
        this.getCentralUrls = this.getCentralUrls.bind(this);
      }
    static navigationOptions = {
        header: null
    };
    
    connectWebCentral() {
        if(!this.state.central_url) {
            Alert.alert('Error', 'Web Central URL is Required')
            return false
        } else {
            var url = this.state.central_url
            if(!url.includes('http')) {
                Alert.alert('Error', 'Please Add URL with http')
                return false
            }
            this.props.saveCentralUrl(this.state.central_url)
            this.props.navigation.navigate('Login')
        }
    }
    
    showActionSheet() {
        const { CentralUrlsList } = this.state
        if(CentralUrlsList.length > 0) {
            var CancelIndex = CentralUrlsList.length - 1
            ActionSheet.show(
                {
                    options: CentralUrlsList,
                    cancelButtonIndex: CancelIndex,
                    title: "Recent URLs",
                },
                buttonIndex => {
                    if (CentralUrlsList[buttonIndex] !== 'Cancel') {
                        this.setState({ central_url: CentralUrlsList[buttonIndex] });
                    }
                }
                )
        } else {
            Alert.alert('Not Found', 'No Recent Urls Found')
        }
        
    }
    getCentralUrls() {
        AsyncStorage.getItem('CentralUrls', (err, result) => {
            if(result) {
                var resultt = JSON.parse(result)
                resultt.push("Cancel")
                this.setState({ CentralUrlsList: resultt})
            }
        })
    }
    componentDidMount() {
        this.getCentralUrls()
        SplashScreen.hide()
    }

	render() {
        const {navigate} = this.props.navigation;
        const { CentralUrlsList } = this.state;
		return (
            <Container style={ styles.loginContainer }>
				<NavigationEvents onDidFocus={() => this.getCentralUrls()} />
                <Header>
                     <Left>
                        <Image style={{ height: 50, width: 110 }} source={ logoImage}></Image>
                    </Left>
                    <Body>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12, marginLeft: 20}}>NETBROWSE JOBCARD MANAGEMENT</Text>
                    </Body>
                </Header>
                <Content>
                <Card>
                    <CardItem>
                    <Body>
                        <Label style={{ color: '#281483'}}>Web Central URL <Text style={{ color: 'red'}}>*</Text></Label>
                        <Item style={{ margin: 10}}>
                            <Input
                                style={{ borderWidth: 1, borderColor: 'black'}}
                                onChangeText={(central_url) => this.setState({central_url})}
                                value={this.state.central_url}
                            />
                        </Item>
                        <View style={{ flexWrap: 'wrap', flexDirection: 'column'}}>
                            <Button onPress={ this.connectWebCentral} style={{ textAlign: 'center', width: 200, margin:12, borderRadius: 0, padding: 70, backgroundColor: '#281483'}}>
                                <Text style={{ color: '#fff'}}>Connect</Text>
                            </Button>
                            {  CentralUrlsList && CentralUrlsList.length > 0 &&   
                                 <Root>
                                    <Button
                                        style={{ textAlign: 'center', width: 200, margin:12, borderWidth: 1, borderColor: 'blue', padding: 45, backgroundColor: '#fff'}}
                                        onPress={this.showActionSheet}
                                    >
                                        <Text style={{ color: 'blue'}}>Recent URLs</Text>
                                    </Button>
                                </Root>

                            }
                        </View>
                    </Body>
                    </CardItem>
                </Card>
                {/* <Root>
                    <Button
                        onPress={() =>
                        ActionSheet.show(
                        {
                            options: BUTTONS,
                            cancelButtonIndex: CANCEL_INDEX,
                            destructiveButtonIndex: DESTRUCTIVE_INDEX,
                            title: "Testing ActionSheet"
                        },
                        buttonIndex => {
                            this.setState({ clicked: BUTTONS[buttonIndex] });
                        }
                        )}
                    >
                        <Text>Actionsheet</Text>
                    </Button>
                </Root> */}
                </Content>
            </Container>
		);
	}
}

SelectUrl.propTypes = {
    saveUser: PropTypes.func,
    saveCentralUrl: PropTypes.func
}

const mapStateToProps = (state) => ({
	user: state.user
})

export default connect(mapStateToProps, { saveUser, saveCentralUrl })(SelectUrl)
