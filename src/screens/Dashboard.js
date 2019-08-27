import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform, StyleSheet, View, Alert, Image, Modal, NetInfo } from 'react-native';
import { Container, Header, Content, Footer, Spinner, FooterTab, Separator, Button, Icon, Text, Card, CardItem, Body, Right, ListItem, Left, Thumbnail, Label, Item, Input } from 'native-base';
import ScreenFooter from './Footer';
import axios from 'axios';
import { UPLOADS_URL, USER_ID } from '../../App';
import styles from '../styles/index';
import AuthenticateLogin from './AuthenticateLogin'
import { deleteUser, deleteCentralUrl, saveCentralUrl } from '../actions/user';
import { removeJobcards } from '../actions/jobcard';
import JobcardIcon from '../assets/tools.png';
import userIcon from '../assets/user.png';
import powerIcon from '../assets/power.png';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen'
import CheckOfflineImages from './CheckOfflineImages'
import {NavigationEvents} from 'react-navigation';
import {PermissionsAndroid} from 'react-native';
import RNRestart from 'react-native-restart';
import logoImage from '../assets/logo.png'

export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			allJobcards: null,
			settingsInfo: null,
			isLoading: true,
			isLoggedIn: false,
			jobcardTitle: null,
			modalVisible: false,
			userEmail: null,
			centralUrlSelected: null
		};
		this.LogOut = this.LogOut.bind(this);
		this.getJobCards = this.getJobCards.bind(this);
		this.getSettingsInfo = this.getSettingsInfo.bind(this);
		this.getStorageValue = this.getStorageValue.bind(this);
		this.setModalVisible = this.setModalVisible.bind(this);
		this.changeCentralUrl = this.changeCentralUrl.bind(this);
		this.requestCameraPermission = this.requestCameraPermission.bind(this);
		this.checkCameraPermission = this.checkCameraPermission.bind(this);
      }
	static navigationOptions = {
		header: null,
	};

	
	setModalVisible() {
		this.setState({ modalVisible: !this.state.modalVisible})
	}

	checkCameraPermission() {
		PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA).then(response => {
			if(response) {
				// Alert.alert('Permission Allowed')
			} else {
				this.requestCameraPermission()
			}
		})
	}
	async requestCameraPermission() {
		try {
			const granted = await PermissionsAndroid.requestMultiple(
				[
					PermissionsAndroid.PERMISSIONS.CAMERA,
					PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
					PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
				],
				{
				title: 'Cool Photo App Camera Permission',
				message:
					'Cool Photo App needs access to your camera ' +
					'so you can take awesome pictures.',
				buttonNeutral: 'Ask Me Later',
				buttonNegative: 'Cancel',
				buttonPositive: 'OK',
				},
			).then(response => {
				if(response) {
					RNRestart.Restart();
				}
			});
			// if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			// 	Alert.alert('Your application is about to restart')
			// 	RNRestart.Restart();
			// 	console.log('You can use the camera');
			// } else {
			// 	console.log('Camera permission denied');
			// }
		} catch (err) {
			console.warn(err);
		}
			
		// return false
		// if(!PermissionsAndroid.PERMISSIONS.CAMERA) {
		// 	try {
		// 		const granted = await PermissionsAndroid.request(
		// 			PermissionsAndroid.PERMISSIONS.CAMERA,
		// 			{
		// 			title: 'Cool Photo App Camera Permission',
		// 			message:
		// 				'Cool Photo App needs access to your camera ' +
		// 				'so you can take awesome pictures.',
		// 			buttonNeutral: 'Ask Me Later',
		// 			buttonNegative: 'Cancel',
		// 			buttonPositive: 'OK',
		// 			},
		// 		);
		// 		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
		// 			Alert.alert('Your application is about to restart')
		// 			RNRestart.Restart();
		// 			console.log('You can use the camera');
		// 		} else {
		// 			console.log('Camera permission denied');
		// 		}
		// 	} catch (err) {
		// 		console.warn(err);
		// 	}
		// }
	}

	changeCentralUrl() {
		Alert.alert(
            'Change Web Central Server URL',
            'Are you sure?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {text: 'OK', onPress: () => {
				this.setModalVisible()
				this.props.deleteUser()
				this.props.removeJobcards()
				this.props.deleteCentralUrl()
				this.props.navigation.navigate('SelectUrl')
              }},
            ],
            {cancelable: true},
		  );
	}

	LogOut() {
		Alert.alert(
            'Change Registered User',
            'Are you sure?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {text: 'OK', onPress: () => {
				this.setModalVisible()
				this.props.deleteUser()
				this.props.removeJobcards()
				this.props.navigation.navigate('Login')
              }},
            ],
            {cancelable: true},
          );
	}

	getJobCards() {
		axios.get(API_URL + '/getJobCards', {
			params: {
				user_id: USER_ID
			}
		 }).then(response => {
			 this.setState({ allJobcards: response.data })
		 })
	}

	getSettingsInfo() {
		axios.get(API_URL + '/getSettingsInfo', {
		 }).then(response => {
			 this.setState({ settingsInfo: response.data })
		 })
	}
	
	getStorageValue() {
		AsyncStorage.getItem('userId').then(id => {
			if(id) {
				SplashScreen.hide()
				this.setState({ isLoading: false, isLoggedIn: true })
			} else {
				this.setState({ isLoading: false })
				SplashScreen.hide()
			}
		})
		AsyncStorage.getItem('userEmail').then(email => {
			if(email) {
				this.setState({ userEmail: email})
			}
		})
		AsyncStorage.getItem('CentralUrlSelected').then(centralUrlSelected => {
			if(URL) {
				this.setState({ centralUrlSelected: centralUrlSelected})
                API_URL = URL + '/api'
            }
		})
		// AsyncStorage.getItem('CentralUrlSelected').then(centralUrlSelected => {
		// 	if(centralUrlSelected) {
		// 		this.setState({ centralUrlSelected: centralUrlSelected})
		// 		this.props.saveCentralUrl(centralUrlSelected)
		// 	}
		// })
	}
	componentDidMount(){
		// this.getSettingsInfo()
		this.getStorageValue()
		this.checkCameraPermission()
	}
	render() {
		const {navigate} = this.props.navigation;
		const { isLoading, isLoggedIn } = this.state

		function CompanyName(props){
			const settingsInfo = props.settingsInfo
			if (settingsInfo) {
				return (
					<Text style={{ fontWeight: 'bold', marginLeft: 5, fontSize: 12, padding: 10, color: '#fff' }}>{settingsInfo.company_name}</Text>
				)
			} else {
				return (
					<Text></Text>
				)
			}
		}

		function CompanyImage(props){
			const settingsInfo = props.settingsInfo
			if (settingsInfo) {
				let uri = '"'+ UPLOADS_URL + settingsInfo.company_logo + '"'
				return (
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#F5FCFF', alignSelf: 'center'}}>
						{/* <Text>{uri}</Text> */}
						<Image style={{ height:null,width:null,flex:0.5,resizeMode:'contain' } } source={{uri: 'http://172.98.203.103/uploads/98315ml1.png'}}></Image>
					</View>
				)
			} else {
				return (
					<Text>.</Text>
				)
			}
		}

		function CompanyImage2(props){
			const settingsInfo = props.settingsInfo
			if (settingsInfo) {
				let uri = ''+ UPLOADS_URL + settingsInfo.company_logo + ''
				return (
					<Image style={{ height: 70, width: 70 } } source={{uri: uri}}></Image>
				)
			} else {
				return (
					<Text>.</Text>
				)
			}
		}

		function Line() {
			return (
				<View style={{borderBottomColor: '#696969', borderBottomWidth: 1}} />
			)
		}
		return (
			<Container>
				<AuthenticateLogin navigation={this.props.navigation}/>
				<NavigationEvents onDidFocus={() => this.getStorageValue()} />
				{ (!isLoading && isLoggedIn) ? 
					<Container style={{ paddingTop: 0}}>
						<Header style={{ height: 70}}>
							<Left>
								<Image style={{ height: 50, width: 90 }} source={ logoImage}></Image>
							</Left>
							<Body style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
								{/* <CompanyName settingsInfo={this.state.settingsInfo}	/> */}
								<Text style={{ paddingTop: 10, color: '#fff', fontWeight: 'bold', fontSize: 12}}>NETBROWSE JOBCARD MANAGEMENT</Text>
								<Button onPress={ this.setModalVisible}>
									<Icon style={{ color: 'white'}} name="settings"></Icon>
								</Button>
							</Body>
						</Header>
						<CheckOfflineImages successfullyUpdate={ () => {console.log(' ')}}/>
						<Content style={{ backgroundColor: '#eff0f1' }}>
							<ListItem style={{ marginTop: 5, marginRight: 15, borderWidth: 1, backgroundColor: '#fff', padding: 30}} button onPress={ () => { navigate('Jobcard')} } thumbnail noBorder>
								<Left>
									<TouchableWithoutFeedback>
										<Thumbnail square style={{ height: 70, width: 70}} source={ JobcardIcon }/>
									</TouchableWithoutFeedback>
								</Left>
								<Body>
									<Text>My Work List</Text>
									{/* <Text>{ this.state.jobcardTitle }</Text> */}
								</Body>
							</ListItem>
							
							{/* <ListItem style={{ marginTop: 5, marginRight: 15, borderWidth: 1, backgroundColor: '#fff', padding: 30}} button onPress={ () => { navigate('Profile')} } thumbnail noBorder>
								<Left>
									<TouchableWithoutFeedback onPress={ this.ClickJobCard}>
										<Thumbnail square style={{ height: 70, width: 70}} source={ userIcon }/>
									</TouchableWithoutFeedback>	
								</Left>
								<Body>
									<Text>My Profile</Text>
								</Body>
							</ListItem>
	
							<ListItem style={{ marginTop: 5, marginRight: 15,borderWidth: 1, backgroundColor: '#fff', padding: 30}} button onPress={ this.LogOut } thumbnail noBorder>
								<Left>
									<TouchableWithoutFeedback onPress={ this.ClickJobCard}>
										<Thumbnail square style={{ height: 70, width: 70}} source={ powerIcon }/>
									</TouchableWithoutFeedback>	
								</Left>
								<Body>
									<Text>Logout</Text>
								</Body>
							</ListItem> */}
							
						</Content>
						<ScreenFooter navigation={this.props.navigation}></ScreenFooter>
						{/* MODAL POPUP FOR LOGOUT AND CHANGE URL */}
						<Modal
							animationType="slide"
							transparent={true}
							visible={this.state.modalVisible}
							onRequestClose={() => {
								this.setModalVisible(!this.state.modalVisible);
							}}>
							<View
								style={{ 
									backgroundColor: 'white',
									color: 'black',
								}}
							> 
								<View style={{  flexDirection: 'row', textAlign: 'center', padding: 15}}>
									<Text style={{ fontSize: 17}}>
										Preferences
									</Text>
									<Right>
										<Text
											style={{ color: 'blue'}}
											onPress={() => {
											this.setModalVisible(!this.state.modalVisible);
										}}>
											Done
										</Text>
									</Right>
								</View>
								<Card>
									<CardItem>
										<Body>
											<Label style={{ color: '#281483'}}>Web Central URL</Label>
											<Item style={{ margin: 10}}>
											<Input value={this.state.centralUrlSelected} />
											</Item>
											<Button
												onPress={this.changeCentralUrl}
												style={{ textAlign: 'center', marginTop: 3, borderRadius: 0, padding: 2, backgroundColor: '#3f51b5'}}>
												<Text style={{ color: '#fff'}}>Change Web Server Central URL</Text>
											</Button>
										</Body>
									</CardItem>
								</Card>
								<Card>
									<CardItem>
										<Body>
											<Label style={{ color: '#281483'}}>Registered User</Label>
											<Item style={{ margin: 10}}>
												<Input value={this.state.userEmail} />
											</Item>
											<Button
												onPress={ this.LogOut }
												style={{ textAlign: 'center', marginTop: 3, borderRadius: 0, padding: 2, backgroundColor: '#3f51b5'}}>
												<Text style={{ color: '#fff'}}>Change Register User</Text>
											</Button>
										</Body>
									</CardItem>
								</Card>
								{/* <View style={{ width: '100%', textAlign: 'center', padding: 20 }}>
									<Text
										onPress={() => {
										this.setModalVisible(!this.state.modalVisible);
									}}>
										Cancel
									</Text>
								</View> */}
							</View>
						</Modal>
						{/* MODAL POPUP FOR LOGOUT AND CHANGE URL */}
					</Container>
					:
						<Spinner style={{ height: 140}} color="red"/>
				}
			</Container>
		);
	}
}

Dashboard.propTypes = {
	deleteUser: PropTypes.func,
	saveCentralUrl: PropTypes.func,
	removeJobcards: PropTypes.func,
	CentralUrlSelected: PropTypes.func
}

const mapStateToProps = (state) => ({
	user: state.user
})

export default connect(mapStateToProps, {deleteUser, deleteCentralUrl, saveCentralUrl, removeJobcards })(Dashboard)