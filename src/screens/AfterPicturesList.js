import React, { Component } from 'react';
import { Alert, Image, View, Modal, TouchableWithoutFeedback, ActivityIndicator, AsyncStorage } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Icon, Text, Form, Item, Input, Label, Button, Card, CardItem, Body, H1, H2, H3 } from 'native-base';
import axios from 'axios';
// import { API_URL, URL } from '../../App';
import { saveUser } from '../actions/user';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from '../styles/index';
import ImageViewer from 'react-native-image-zoom-viewer';
import ScreenFooter from './Footer';
const LIGHT_BLUE = '#5666c2';
const BLUE = '#3f51b5';
const WHITE = '#fff';
const GRAY = '#e8e8e8';

export class AfterPicturesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          afterPictures: null,
          after_pics_urls: null,
          id: null,
          loading: false,
          isModalOpened: false,  //Controls if modal is opened or closed
          currentImageIndex: 0,
          viewerType: null,
          URL: null,
          API_URL: null
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
		this.removePic = this.removePic.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
    }
    static navigationOptions = {
        title: 'Jobcard after Pictures',
        headerTitleStyle: {
            color: GRAY
        },
        headerStyle: {
            backgroundColor: BLUE
        },
        headerTintColor : GRAY
    };
    
    componentWillMount() {}
    
    componentDidMount() {
        this.setState({
            afterPictures: this.props.navigation.getParam('afterPictures'),
            after_pics_urls: this.props.navigation.getParam('after_pics_urls'),
            id: this.props.navigation.getParam('id'),
            URL: this.props.navigation.getParam('URL'),
            API_URL: this.props.navigation.getParam('API_URL')
        })
    }
    
    componentWillUnmount() {}

    handleBackButtonClick() {}

    removePic(image_name, type, index) {
        Alert.alert(
            'Delete Image',
            'Are you sure? this action will be not be reverted',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {text: 'OK', onPress: () => {
                AsyncStorage.getItem('CentralUrlSelected').then(URL => {
                    if(URL) {
                        var API_URL = URL + '/api';
                        axios.post(API_URL + '/deleteJobcardPic', {
                            id: this.state.id,
                            image_name: image_name,
                            type: type
                        }).then(response => {
                            this.state.afterPictures.splice(index, 1)
                            this.state.after_pics_urls.splice(index, 1)
                            this.setState({
                                attachmentPictures: this.state.attachmentPictures,
                                after_pics_urls: this.state.after_pics_urls
                            })
                            // this.props.navigation.navigate('JobcardEdit')
                        }).catch(error => {
                            Alert.alert('Error', error)
                        })
                    }
                })
              }},
            ],
            {cancelable: true},
          );
        
    }

    openModal(index, type) {
        this.setState({
            isModalOpened: true,
            viewerType: type,
            currentImageIndex: index
        })
    }

    closeModal() {
        this.setState({isModalOpened: false, currentImageIndex: 0 })
    }
    
	render() {
        const {navigate} = this.props.navigation;
        const afterPictures = this.props.navigation.getParam('afterPictures')
        const after_pics_urls = this.props.navigation.getParam('after_pics_urls')
        function AfterPicturesList(props) {
            const list = props.afterPictures
            const URL = props.URL
            // const showList = props.showafterPictures
            if(list && list.length > 0) {
                const listAfterPictures = list.map((item, index) => 
                    <TouchableWithoutFeedback key={ index } onPress={() => {props.click(index, 'after')}}>
                        <View style={styles.imageBox}>
                            <Button small danger style={styles.imageBoxCloseBtn} onPress={() => { props.removeClick(item.image_name, 'after_pictures', index)}}>
                                <Icon name="close-circle"></Icon>
                            </Button>
                            { URL && 
                                <Image
                                    source={{ uri: URL + item.image_name, width: 190, height: 190 }}
                                    style={{ zIndex: -1, margin: 5 }}
                                />
                            }
                            
                        </View>
                    </TouchableWithoutFeedback>
                );
                return (
                    <View style={styles.afterPicsContainer}>
                        {listAfterPictures}
                    </View>
                )
            } else {
                return (
                    <Text>No After Pictures Found</Text>
                )
            }
        }

		return (
            <Container>
                <Content>
                    <AfterPicturesList
                        removeClick={this.removePic}
                        click={this.openModal}
                        afterPictures={afterPictures}
                        URL={this.state.URL}
                    />
                    
                    {/************ MODAL IMAGE VIEWER SECTION  ************/}
                    <Modal visible={this.state.isModalOpened} transparent={false}>
                        <Button onPress={this.closeModal}>
                            <Icon name="close-circle"></Icon>
                        </Button>
                            <ImageViewer imageUrls={after_pics_urls} index={this.state.currentImageIndex}/>
                    </Modal>
                    {/************ MODAL IMAGE VIEWER SECTION  ************/}
                </Content>
                <ScreenFooter navigation={this.props.navigation}></ScreenFooter>
            </Container>
		);
	}
}

AfterPicturesList.propTypes = {
	saveUser: PropTypes.func
}

const mapStateToProps = (state) => ({
	user: state.user
})

export default connect(mapStateToProps, { saveUser })(AfterPicturesList)
