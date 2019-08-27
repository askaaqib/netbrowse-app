import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform, StyleSheet, View, Alert, Image, NetInfo } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Card, CardItem, Body, Right, H3, Input, Item, Left } from 'native-base';
import { saveJobcards } from '../actions/jobcard';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
let USER_ID = 0;

export class JobcardSearch extends React.Component {
	_isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            isOnline: false,
            searchText: null
        };
        this.handleSearchText = this.handleSearchText.bind(this)
      }
    
    handleSearchText(val) {
        this.setState({ searchText: val})
    }  

	componentDidMount(){
        NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected)
            {
                this.setState({ isOnline: true})
            }
        })
	}
	render() {
		const {isOnline} = this.state
		
		return (
			<View>
                { isOnline &&
                    <Item style={{ backgroundColor: '#fff'}}>
                        <Input
                            onChangeText={this.handleSearchText}
                            style={{ margin: 10, width: 150, borderRadius: 2, borderWidth:1}}
                            placeholder="Search"
                        />
                        <Button onPress={this.props.searchJobcard(this.state.searchText)} style={{ height: 50, marginTop: 10 }}>
                            <Text>Search</Text>
                        </Button>
                    </Item>
                }
			</View>
		);
	}
}

JobcardSearch.propTypes = {
	saveJobcards: PropTypes.func
}

const mapStateToProps = (state) => ({
	user: state.user,
	jobcard: state.jobcard
})

export default connect(mapStateToProps, {saveJobcards })(JobcardSearch)