import React, { Component } from 'react';
import {NavigationEvents} from 'react-navigation';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
		this.getStorageValue = this.getStorageValue.bind(this);
      }
	static navigationOptions = {
        header: null
	};

	getStorageValue() {
		AsyncStorage.getItem('CentralUrlSelected').then(url_selected => {
			if(url_selected) {
				AsyncStorage.getItem('userId').then(id => {
					if(id) {} else {
						this.props.navigation.navigate('Login')
					}
				})
			} else {
				this.props.navigation.navigate('SelectUrl')
			}
		})

		// AsyncStorage.getItem('userId').then(id => {
		// 	if(id) {
		// 	} else {
		// 		this.props.navigation.navigate('Login')
		// 	}
		// })
		var route = this.props.navigation.state.routeName
		if(route === 'JobcardEdit') {
			this.props.getJobcard(this.props.jobcardId)
		}
	}
	componentDidMount(){
		this.getStorageValue()
	}
	render() {
        return (
            <NavigationEvents onDidFocus={() => this.getStorageValue()} />
		);
	}
}
