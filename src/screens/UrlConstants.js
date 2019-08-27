import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Alert, Image  } from 'react-native';
import { Container, Header, Content, Item, Form, Input, Button, Card, CardItem, Body, Label, Icon, Spinner, ActionSheet, Root, Left } from "native-base";
import axios from 'axios';
import { API_URL } from '../../App';
import { saveUser, saveCentralUrl } from '../actions/user';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoginAvatar from '../assets/login.png';
import styles from '../styles/index';
import { BackHandler } from 'react-native';
import {NavigationEvents} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import logoImage from '../assets/logo.png';

export let APP_URL = 'some url';

export class UrlConstants extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          central_url: "",
          CentralUrlSelected: [],
          error: null,
          loading: false,
          clicked: null
        };
      }
    static navigationOptions = {
        header: null
    };
    
    componentDidMount() {
        AsyncStorage.getItem('CentralUrlSelected', (err, url_selected) => {
            if(url_selected) {
                this.setState({ CentralUrlSelected: url_selected})
                APP_URL = url_selected
                console.log('App')
            }
        })
    }

	render() {
        const { CentralUrlsList } = this.state;
		return (
            <Text style={{ padding: 0, margin: 0}}></Text>
		);
	}
}

UrlConstants.propTypes = {
    saveUser: PropTypes.func,
    saveCentralUrl: PropTypes.func
}

const mapStateToProps = (state) => ({
	user: state.user
})

export default connect(mapStateToProps, { saveUser, saveCentralUrl })(UrlConstants)
