import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform, StyleSheet, View, Alert, Image, NetInfo, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Card, CardItem, Body, Right, H3, Input, Item, Left, Spinner } from 'native-base';
import ScreenFooter from './Footer';
import axios from 'axios';
import { UPLOADS_URL } from '../../App';
import styles from '../styles/index';
import AuthenticateLogin from './AuthenticateLogin'
import { saveJobcards } from '../actions/jobcard';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CheckOfflineImages from './CheckOfflineImages';
import JobcardSearch from './JobcardSearch';
import SplashScreen from 'react-native-splash-screen'
import {NavigationEvents} from 'react-navigation';

let USER_ID = 0;
const { width, height } = Dimensions.get('window');

export class JobcardsList extends React.Component {
	_isMounted = false;
    constructor(props) {
			super(props);
			this.state = {
			allJobcards: [],
			settingsInfo: null,
			searchText: null,
			isLoading: true,
			isConnected: false,
			jobcardTitle: null,
			data: [],
			page: 1,
			loading: true,
			loadingMore: false,
			filtering: false,
			refreshing: false,
			error: null,
			per_page: 10,
			total_pages: null
		};
		this.LogOut = this.LogOut.bind(this);
		this.getJobCards = this.getJobCards.bind(this);
		this.getSettingsInfo = this.getSettingsInfo.bind(this);
		this.getStorageValue = this.getStorageValue.bind(this);
		this.searchJobcard = this.searchJobcard.bind(this);
		this.handleSearchText = this.handleSearchText.bind(this);
		this.syncJobcards = this.syncJobcards.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.previousPage = this.previousPage.bind(this);
      }
	static navigationOptions = () => ({
		title: 'My Work List'
	});
	
	handleSearchText(val) {
		if (this._isMounted) {
			this.setState({ searchText: val}, () => {
				if(!this.state.searchText) {
					this.syncJobcards()
				}
			})
		}
	}
	searchJobcard() {
		this.getJobCards(this.state.searchText)
	}

	LogOut() {
		this.props.navigation.navigate('Login')
	}

	syncJobcards() {
		// this.setState({ searchText: null })
		this.setState({ page: 1}, () => {
			this.getJobCards(null, 'sync')
		})
	}
	
	nextPage() {
		this.setState({ page: this.state.page + 1}, () => {
			this.getJobCards()
		})
	}

	previousPage() {
		this.setState({ page: this.state.page - 1}, () => {
			this.getJobCards()
		})
	}

	 getJobCards(search = null, sync = null) {
		const { page, per_page } = this.state;
		AsyncStorage.getItem('CentralUrlSelected').then(URL => {
			if(URL) {
				var API_URL = URL + '/api';
				NetInfo.isConnected.fetch().then(isConnected => {
					// CHECK IF INTERNET IS CONNECTED OR NOT
					if(isConnected)
					{
						if (this._isMounted) {
							this.setState({ isConnected: true, isLoading: true })  
						}
						// CHECK IF USER EXISTS
						AsyncStorage.getItem('userId').then(id => {
							AsyncStorage.getItem('userRole').then(role => {
								if(role == 'Administrator') {
									if(sync || search) {
										axios.get(API_URL + '/getAllJobCards', {
											params: {
												search: search
											}
										}).then(response => {
											// this.setState({ isLoading: false })
											var data = response.data
											
											if(response.data.length > 10) {
												this.setState({ total_pages: Math.ceil((data.length) / this.state.per_page)})
												var offset = (this.state.page * this.state.per_page) - this.state.per_page;
												data = response.data.slice(offset, 	this.state.page * this.state.per_page)
											}
											if(!search) {
												this.props.saveJobcards(response.data)
											}
											if (this._isMounted) {
												this.setState({ allJobcards: data, isLoading: false })
											}
										})
									} else {
										AsyncStorage.getItem('allJobcards').then(jobcard => {
											if(jobcard) {
												if (this._isMounted) {
													var storedData = JSON.parse(jobcard)
													this.setState({ total_pages: Math.ceil((storedData.length) / this.state.per_page)})
													var offset = (this.state.page * this.state.per_page) - this.state.per_page;
													data = storedData.slice(offset, 	this.state.page * this.state.per_page)
													this.setState({ allJobcards: data, isLoading: false })
												}
											}  else {
												this.setState({ allJobcards:[], isLoading: false})
											}
										})	
									}
									
								} else {
									USER_ID = id
									if(sync || search) {
										// SEND REQUEST TO GET JOBCARDS
										axios.get(API_URL + '/getJobCards', {
											params: {
												user_id: USER_ID,
												search: search
											}
										}).then(response => {
											var data = response.data
											
											if(response.data.length > 10) {
												this.setState({ total_pages: Math.ceil((data.length) / this.state.per_page)})
												var offset = (this.state.page * this.state.per_page) - this.state.per_page;
												data = response.data.slice(offset, 	this.state.page * this.state.per_page)
											}
											if(!search) {
												this.props.saveJobcards(response.data)
											}
											if (this._isMounted) {
												this.setState({ allJobcards: data, isLoading: false })
											}
										})
									}  else {
										AsyncStorage.getItem('allJobcards').then(jobcard => {
											if(jobcard) {
												if (this._isMounted) {
													var storedData = JSON.parse(jobcard)
													this.setState({ total_pages: Math.ceil((storedData.length) / this.state.per_page)})
													var offset = (this.state.page * this.state.per_page) - this.state.per_page;
													data = storedData.slice(offset, 	this.state.page * this.state.per_page)
													this.setState({ allJobcards: data, isLoading: false })
												}
											} else {
												this.setState({ allJobcards:[], isLoading: false})
											}
										})	
									}
									
								}
							})
						})
					} else {
						// CHECK IF JOBCARDS EXISTS IN STORAGE THEN GET FROM STORAGE
						var data = []
							AsyncStorage.getItem('allJobcards').then(jobcard => {
								if(jobcard) {
									if (this._isMounted) {
										var storedData = JSON.parse(jobcard)
										this.setState({ total_pages: Math.ceil((storedData.length) / this.state.per_page)})
										var offset = (this.state.page * this.state.per_page) - this.state.per_page;
										data = storedData.slice(offset, 	this.state.page * this.state.per_page) 
										this.setState({ allJobcards: data, isLoading: false })  
									}
								} else {
									this.setState({ allJobcards: [], isLoading: false })  
								}
							})
					}
				})
			}
		})
	}

	getSettingsInfo() {
		AsyncStorage.getItem('CentralUrlSelected').then(URL => {
			if(URL) {
				var API_URL = URL + '/api';
				axios.get(API_URL + '/getSettingsInfo', {
				}).then(response => {
					if (this._isMounted) {
						this.setState({ settingsInfo: response.data })
					}
				})
			}
		})		
	}
	
	getStorageValue() {
		AsyncStorage.getItem('userId').then(id => {
			if(id) {
				AsyncStorage.getItem('OfflineJobcards['+ id +']').then(images => {
					if(images) {
						// Alert.alert('these are the jobcards', images)
					}
				})
			} else {
				this.props.navigation.navigate('Login')
			}
		})
		AsyncStorage.getItem('userRole').then(role => {
			if(role == 'Administrator') {
				this.setState({ jobcardTitle: 'Jobcards' })
			} else {
				this.setState({jobcardTitle: 'My Work'})
			}
		})
	}
	
	componentWillUnmount() {
		this._isMounted = false;
	}

	componentDidMount(){
		this._isMounted = true;
		this.getJobCards(null, 'sync')
		this.getSettingsInfo()
		this.getStorageValue()
		SplashScreen.hide()
	}
	render() {
		const {navigate} = this.props.navigation;
		const { isLoading, isConnected } = this.state;
		function JobcardsList(props) {
			const list = props.jobcardList
			if(list && list.length > 0) {

				const listJobcards = list.map((item, index) => 
					<Card style={{ borderWidth: 2, margin: 12}} key={index}>
						<CardItem button onPress={() => navigate('JobcardEdit', {id: item.id, index: index })} >
							<Body>
								<Text style={{ fontSize: 20, fontWeight: 'bold', color: 'blue'}}>
									{item.jobcard_num}
								</Text>
								<Text
								style={{

									textTransform: 'uppercase'}}
								>
									{item.problem_type}
								</Text>
							</Body>
									
							<Right>
								<Text style={{ color: '#888'}}>{item.date}</Text>
								<Text style={{ color: '#3f51b5'}}>{item.status}</Text>
							</Right>
							{/* <Right>
								<Button onPress={() => navigate('JobcardEdit', {id: item.id, index: index })} style={{ float:'right', margin: 0, padding: 0}}>
									<Icon style={{ marginRight: 0}} name="create"/>
									<Text>Edit</Text>
								</Button>
							</Right> */}
						</CardItem>
						<CardItem button onPress={() => navigate('JobcardEdit', {id: item.id, index: index })}>
							<Body>
								<Text>{item.description}</Text>
							</Body>
						</CardItem>
						{ item.get_district &&
							<CardItem button onPress={() => navigate('JobcardEdit', {id: item.id, index: index })} footer>
								<Text>District: {item.get_district.name}</Text>
							</CardItem>
						}
					</Card>
					// <Text>{ item.jobcard_num}</Text>
				);
				return (
					<View style={{ padding: 4}}>
						{listJobcards}
					</View>
				)
			} else {
				return (
					<Text style={{ margin: 5, textAlign: 'center', padding: 5, backgroundColor: '#5666c2', color: '#fff'}}>No Jobcards Found</Text>
				)
			}
		}

		function Pagination(props) {
			var pages = props.totalPages
			var allData = props.allData
			var current_page = props.currentPage
			if(pages > 1) {
				var data = [];
				if(current_page > 1) {
					data.push({ key: 'Previous'}, { key: 'Next'})
				} else {
					data.push({ key: 'Next'})
				}
				
				return (
					<View style={{ flex:1, flexDirection: 'row'}}>
						<FlatList
							contentContainerStyle={{ flex:1, flexDirection: 'row'}}
							data={data}
							renderItem={({item}) => (
								<View style={{ margin: 5, padding: 3, backgroundColor: '#fff', borderColor: '#484848', borderWidth: 1, borderRadius: 1}}>
									{ item.key == 'Next' ? 
										<Text onPress={ () => props.nextPage() }>{item.key }</Text>
										:
										<Text onPress={ () => props.previousPage() }>{item.key}</Text>
									} 
								</View>
							)}
						/>
					</View>
				)
			} else {
				return (<Text></Text>)
			}
			
		}

		function CompanyName(props){
			const settingsInfo = props.settingsInfo
			if (settingsInfo) {
				return (
					<Text style={{ padding: 10, color: '#fff' }}>{settingsInfo.company_name}</Text>
				)
			} else {
				return (
					<Text>.</Text>
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
						<Image style={{ alignSelf: 'stretch',  height: 250, width: 500 } } source={{uri: 'http://172.98.203.103/uploads/98315ml1.png'}}></Image>
					</View>
				)
			} else {
				return (
					<Text>.</Text>
				)
			}
		}

		return (
			<Container style={{ paddingTop: 0}}>
				<AuthenticateLogin navigation={this.props.navigation}/>
				<CheckOfflineImages successfullyUpdate={() => { this.syncJobcards() }}/>
				<NavigationEvents onDidFocus={() => {this.syncJobcards(); this.setState({ searchText: null })}} />
				<Header style={{ height: 50 }}>
					<Left>
						<Button onPress={this.syncJobcards}>
							<Icon name="sync"></Icon>
						</Button>
					</Left>
					<Body>
						<Text style={{ padding: 10, color: '#fff' }}>{this.state.jobcardTitle}</Text>
					</Body>
				</Header>
				<Content style={{ backgroundColor: '#eee'}}>
					{ isConnected &&
						<Item style={{ backgroundColor: '#fff'}}>
							<Input
								onChangeText={(val) => {this.handleSearchText(val)}}
								style={{ margin: 10, width: 150, borderRadius: 2, borderWidth:1}}
								value={this.state.searchText}
								placeholder="Search"
							/>
							<Button onPress={this.searchJobcard} style={{ height: 50, marginTop: 10 }}>
								<Text>Search</Text>
							</Button>
						</Item>
					}
					{/* <JobcardSearch searchJobcard={this.searchJobcard} /> */}
					{ isLoading ?
						<Spinner color="red"/>
						:
						<JobcardsList jobcardList={this.state.allJobcards} />
					}
					{ !isLoading &&
						<Pagination allData={this.state.allJobcards} previousPage={this.previousPage} nextPage={this.nextPage} currentPage={this.state.page} totalPages={this.state.total_pages} />
					}
				</Content>
				<ScreenFooter navigation={this.props.navigation}></ScreenFooter>
			</Container>
		);
	}
}

JobcardsList.propTypes = {
	saveJobcards: PropTypes.func
}

const mapStateToProps = (state) => ({
	user: state.user,
	jobcard: state.jobcard
})

export default connect(mapStateToProps, {saveJobcards })(JobcardsList)