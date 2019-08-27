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
			per_page: 10
		};
		this.LogOut = this.LogOut.bind(this);
		// this.getJobCards = this.getJobCards.bind(this);
		this.getSettingsInfo = this.getSettingsInfo.bind(this);
		this.getStorageValue = this.getStorageValue.bind(this);
		this.searchJobcard = this.searchJobcard.bind(this);
		this.handleSearchText = this.handleSearchText.bind(this);
		this.syncJobcards = this.syncJobcards.bind(this);
		// this._handleLoadMore = this._handleLoadMore.bind(this);
		// this._fetchAllJobcards = this._fetchAllJobcards.bind(this);
		// this._handleLoadMore = this._handleLoadMore.bind(this);
		// this._handleRefresh = this._handleRefresh.bind(this);
      }
	static navigationOptions = () => ({
		title: 'My Work List'
	});

	
	handleSearchText(val) {
		if (this._isMounted) {
			this.setState({ searchText: val})
		}
		this._handleRefresh()
	}

	searchJobcard() {
		// this.getJobCards(this.state.searchText)
	}

	LogOut() {
		this.props.navigation.navigate('Login')
	}

	syncJobcards() {
		// this.setState({ searchText: null })
		this._handleRefresh()
		// this.getJobCards()
		// if (this.state.searchText) {
		// 	this.getJobCards(this.state.searchText)
		// } else {
		// 	this.getJobCards()
		// }
	}
	_fetchAllJobcards = () => {
		const { page } = this.state;
		const URL = `/beers?page=${page}&per_page=10`;
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
						AsyncStorage.getItem('userId').then(id => {
							AsyncStorage.getItem('userRole').then(role => {
								if(role == 'Administrator') {
									axios.get(API_URL + '/getAllJobCards', {
										params: {
											search: this.state.searchText,
											page: page,
											per_page: this.state.per_page
										}
									}).then(response => {
										console.log('response', response)
										// new code
										if(!this.state.searchText) {
											if (this._isMounted) {
												this.setState((prevState, nextProps) => ({
													allJobcards:
													page === 1
														? Array.from(response.data)
														: [...this.state.allJobcards, ...response.data],
													loading: false, loadingMore: false,
													isLoading: false,refreshing: false
												}));
											}
											this.props.saveJobcards(response.data)
										}	else {
											this.setState((prevState, nextProps) => ({allJobcards: response.data,
												loading: false,loadingMore: false, isLoading: false, refreshing: false
											}));
										}
									})
								}
							})
						})
					}
				})
			}
		})
	  };
	
	_handleRefresh = () => {
		this.setState(
			{
			page: 1,
			refreshing: true
			},
			() => {
			this._fetchAllJobcards();
			}
		);
	};
	
	_handleLoadMore = () => {
		this.setState(
		  (prevState, nextProps) => ({
			page: prevState.page + 1,
			loadingMore: true
		  }),
		  () => {
			this._fetchAllJobcards();
		  }
		);
	};

	_renderFooter = () => {
		if (!this.state.loadingMore) return null;
	
		return (
		  <View
			style={{
			  position: 'relative',
			  width: width,
			  height: height,
			  paddingVertical: 20,
			  borderTopWidth: 1,
			  marginTop: 10,
			  marginBottom: 10
			}}
		  >
			<ActivityIndicator animating size="large" />
		  </View>
		);
	};

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
		// this.getJobCards()
		this._fetchAllJobcards()
		this.getSettingsInfo()
		this.getStorageValue()
		SplashScreen.hide()
	}
	render() {
		const {navigate} = this.props.navigation;
		const { isLoading, isConnected } = this.state;

		return (
			<Container style={{ paddingTop: 0}}>
				<AuthenticateLogin navigation={this.props.navigation}/>
				{/* <CheckOfflineImages successfullyUpdate={() => { this.getJobCards() }}/> */}
				{/* <CheckOfflineImages successfullyUpdate={() => { this._handleRefresh() }}/> */}
				{/* <NavigationEvents onDidFocus={() => {this._handleRefresh(); this.setState({ searchText: null })}} /> */}
				{/* <NavigationEvents onDidFocus={() => {this.getJobCards(); this.setState({ searchText: null })}} /> */}
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
					{/* { isLoading ?
						<Spinner color="red"/>
						:
						<JobcardsList jobcardList={this.state.allJobcards} />
					} */}
					{ !this.state.loading ? 
						<FlatList
							contentContainerStyle={{
							flex: 1,
							flexDirection: 'column',
							height: '100%',
							width: '100%'
							}}
							numColumns={2}
							data={this.state.allJobcards}
							renderItem={({ item }) => (
							<View>
								<Text>{ item.jobcard_num }</Text>
							</View>
							)}
							keyExtractor={item => item.id.toString()}
							// ListHeaderComponent={this._renderHeader}
							ListFooterComponent={this._renderFooter}
							onRefresh={this._handleRefresh}
							refreshing={this.state.refreshing}
							onEndReached={this._handleLoadMore}
							onEndReachedThreshold={0.5}
							initialNumToRender={10}
						/>
						: 
						<View>
							<Text style={{ alignSelf: 'center' }}>Loading beers</Text>
							<ActivityIndicator />
						</View>
					}
					{ !this.state.loading && this.state.allJobcards.length == 0 &&
						<Text style={{ margin: 5, textAlign: 'center', padding: 5, backgroundColor: '#5666c2', color: '#fff'}}>No Jobcards Found</Text>
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