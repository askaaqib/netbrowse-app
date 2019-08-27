import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Button, FlatList, Alert } from 'react-native';
import ListItem from '../components/ListItem';
import { connect } from 'react-redux';
import { addPlace } from '../actions/place';
import AsyncStorage from '@react-native-community/async-storage';
import styles from '../styles/index';
import Login from './Login';

export class Home extends Component {
	constructor(props) {
        super(props);
		this.state = {
			userStatus: 'logged_out'
		};
    }
	state = {
		placeName: '',
		places: []
	}

    static navigationOptions = {
		title: 'Welcome',
	};

	placeSubmitHandler = () => {
		if(this.state.placeName.trim() === '') {
		  return;
		}
		this.props.add(this.state.placeName);
	}

	placeNameChangeHandler = (value) => {
		this.setState({
		  placeName: value
		});    
	}
	
	placesOutput = () => {
		return (
		 <FlatList style = { styles.listContainer }
		   data = { this.props.places }
		   keyExtractor={(item, index) => index.toString()}
		   renderItem = { info => (
			 <ListItem 
			   placeName={ info.item.value }
			 />
		   )}
		 />
	   )
	}
	componentDidMount(){
		AsyncStorage.getItem("userId").then((value) => {
			if(value) {
				this.setState({ userStatus: 'logged_in'})
			} else {
				this.setState({ userStatus: 'logged_out'})
			} 
		})
	}
	render() {
		const {navigate} = this.props.navigation;
		return (
			<React.Fragment>
				<Button title="Login" onPress={() => navigate('Login', {name: 'Jane'})}/>
				{/* <Button title="My Jobcards" onPress={() => navigate('Jobcard', {name: 'Jane'})}/> */}
				{/* <View style={ styles.container }>
					<View style = { styles.inputContainer }>
						<TextInput
							placeholder = "Search Places"
							style = { styles.placeInput }
							value = { this.state.placeName }
							onChangeText = { this.placeNameChangeHandler }
						></TextInput>
						<Button
							title = 'Add' 
							style = { styles.placeButton }
							onPress = { this.placeSubmitHandler }
						/>
						</View>
						<View style = { styles.listContainer }>
						{ this.placesOutput() }
					</View>
				</View> */}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	places: state.places.places
})

const mapDispatchToProps = dispatch => {
	return {
		add: (name) => {
		dispatch(addPlace(name))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
// export default Home;
