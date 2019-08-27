import React, { Component } from 'react';
import { TouchableWithoutFeedback, Alert  } from 'react-native';
import { Container, Footer, FooterTab, Button, Icon, Text } from 'native-base';
import { deleteUser } from '../actions/user';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export class CustomFooter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
		this.LogOut = this.LogOut.bind(this);
      }
      static navigationOptions = {
            header: null
        };
	LogOut() {
		// Alert.alert('Logout clicked')
		this.props.deleteUser()
		this.props.navigation.navigate('Login')
	}

    componentDidMount(){}
    
	render() {
		const {navigate} = this.props.navigation;
		return (
			<Footer>
				<FooterTab>
					<Button vertical onPress={() => navigate('Dashboard')}>
						<Icon name="home" />
						<Text>Home</Text>
					</Button>
					{/* <Button vertical onPress={() => navigate('Profile')}>
						<Icon name="person" />
						<Text>My Profile</Text>
					</Button>
					<Button vertical onPress={() => this.LogOut()}>
						<Icon name="power" />
						<Text>Logout</Text>
					</Button> */}
				</FooterTab>
			</Footer>
		);
	}
}

Footer.propTypes = {
	deleteUser: PropTypes.func
}

const mapStateToProps = (state) => ({
	user: state.user
})

export default connect(mapStateToProps, { deleteUser })(CustomFooter)