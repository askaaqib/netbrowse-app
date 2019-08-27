import React, { Component } from 'react';
import { Alert, Image, View, Modal, TouchableWithoutFeedback, NetInfo, TouchableHighlight, PermissionsAndroid } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Icon, Text, Form, Item, Input, Label, Button, Card, CardItem, Body, H1, H2, H3, Spinner } from 'native-base';
import axios from 'axios';
// import { API_URL, LOCAL_URL, URL } from '../../App';
import ImagePicker from 'react-native-customized-image-picker'
import OtherImagePicker from 'react-native-image-picker';
import styles from '../styles';
import { saveOfflineImages } from '../actions/jobcard';
import ImageViewer from 'react-native-image-zoom-viewer';
import ScreenFooter from './Footer';
import AsyncStorage from '@react-native-community/async-storage';
import AuthenticateLogin from './AuthenticateLogin'
const LIGHT_BLUE = '#5666c2';
const BLUE = '#3f51b5';
const WHITE = '#fff';
const BLACK = '#000';
const GRAY = '#e8e8e8';
const UPLOAD_WIDTH = '50%';
const VIEW_WIDTH = '50%';
import CheckOfflineImages from './CheckOfflineImages';
import RNRestart from 'react-native-restart';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export class JobcardEdit extends React.Component {
    _isMounted = false;
    
    constructor(props) {
        super(props);
        this.state = {
            jobcardDetail: null,
            id: null,
            jobcard_num: null,
            description: null,
            facility_name: null,
            labour_paid: null,
            materials_paid: null,
            status: null,
            travelling_paid: null,
            priority: null,
            before_pictures: null,
            after_pictures: null,
            attachment_receipt: null,
            photo: null,
            isModalOpened: false,  //Controls if modal is opened or closed
            currentImageIndex: 0,
            viewerType: null,
            before_pics_urls: [],
            after_pics_urls: [],
            attachment_pics_urls: [],
            isUploading: false,
            showBeforePictures: false,
            showAfterPictures: false,
            showAttachmentPictures: false,
            internetConnection: false,
            isLoading: true,
            modalVisible: false,
            typePicture: null,
            URL: null,
            API_URL: null,
            cameraPermission: true,
            locationPermission: true,
            storagePermission: true,
            index: null
        };
		this.getJobcard = this.getJobcard.bind(this);
		this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.uploadImage = this.uploadImage.bind(this);
		this.removePic = this.removePic.bind(this);
		this.updateJobcard = this.updateJobcard.bind(this);
		this.togglePictures = this.togglePictures.bind(this);
        this.editForm = this.editForm.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.pictureUpload = this.pictureUpload.bind(this);
        this.requestCameraPermission = this.requestCameraPermission.bind(this);
        this.checkAllPermissions = this.checkAllPermissions.bind(this);
    }
    
    static navigationOptions = {
        title: 'Edit My Work',
        headerTitleStyle: {
            color: GRAY
        },
        headerStyle: {
            backgroundColor: BLUE
        },
        headerTintColor : GRAY
    };
    
    setModalVisible(visible, type) {
        this.setState({modalVisible: visible, typePicture: type});
    }
    async checkAllPermissions() {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA).then(response => {
            if(!response) {
                this.setState({ cameraPermission: false})
            }  
        })
        PermissionsAndroid.check(PermissionsAndroid.ACCESS_COARSE_LOCATION.CAMERA).then(response => {
            if(!response) {
                this.setState({ locationPermission: false})
            }  
        })
        PermissionsAndroid.check(PermissionsAndroid.READ_EXTERNAL_STORAGE.CAMERA).then(response => {
            if(!response) {
                this.setState({ storagePermission: false})
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
                    return true
                }
            });
        } catch (err) {
            console.warn(err);
        }
    }
    
    async pictureUpload(type) {
        this.setState({ modalVisible: false})
        const { cameraPermission, locationPermission, storagePermission } = this.state
        if(!cameraPermission || !locationPermission || !storagePermission) {
            this.requestCameraPermission()
        } else {
            if(type == 'single') {
                try {
                    const granted = await PermissionsAndroid.request(
                      PermissionsAndroid.PERMISSIONS.CAMERA,
                      {
                        title: 'Cool Photo App Camera Permission',
                        message:
                          'Cool Photo App needs access to your camera ' +
                          'so you can take awesome pictures.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                      },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                      console.log('You can use the camera');
                      OtherImagePicker.launchCamera({ mediaType: 'photo', noData: true}, (image) => {
                          var images = []
                          let uriParts = image.path.split('/');
                          image.name = uriParts[uriParts.length - 1]
                          images.push(image)
                        //   console.log(images)
                        //   console.log(image)
                        //   Alert.alert('Something', JSON.stringify(images))
                        // images.map((image, idx) => {
                        //     let pathParts = image.path.split('file://');
                        //     let uriParts = image.path.split('/');
                        //     image.uri = image.path
                        //     image.path = pathParts[1]
                        //     image.type = image.mime
                        //     image.fileSize = image.size
                        //     image.fileName = uriParts[uriParts.length - 1]
                        // });
                        this.uploadImage(images, this.state.id, this.state.typePicture)
                      })
                    //   ImagePicker.openCamera({
                    //     mediaType: 'photo',
                    //   }).then(images => {
                    //         images.map((image, idx) => {
                    //             let pathParts = image.path.split('file://');
                    //             let uriParts = image.path.split('/');
                    //             image.uri = image.path
                    //             image.path = pathParts[1]
                    //             image.type = image.mime
                    //             image.fileSize = image.size
                    //             image.fileName = uriParts[uriParts.length - 1]
                    //             image.name = uriParts[uriParts.length - 1]
                    //         });
                    //      this.uploadImage(images, this.state.id, this.state.typePicture)
                    //   });
                    } else {
                      console.log('Camera permission denied');
                    }
                  } catch (err) {
                    console.warn(err);
                  }
            }
            if(type == 'multiple') {
                ImagePicker.openPicker({
                    multiple: true
                  }).then(images => {
                    this.uploadImage(images, this.state.id, this.state.typePicture)
                    images.map((image, idx) => {
                        let pathParts = image.path.split('file://');
                        let uriParts = image.path.split('/');
                        image.uri = image.path
                        image.path = pathParts[1]
                        image.type = image.mime
                        image.fileSize = image.size
                        image.fileName = uriParts[uriParts.length - 1]
                        image.name = uriParts[uriParts.length - 1]
                    });
                });
            }
        }
    }

    editForm() {
        this.props.navigation.navigate('JobcardEditForm', { data: this.state})
    }
    
    togglePictures(type) {
        if(type === 'before_pictures') {
            this.props.navigation.navigate('BeforePicturesList', {
                id: this.state.id,
                beforePictures: this.state.before_pictures,
                before_pics_urls: this.state.before_pics_urls,
                URL: this.state.URL,
                API_URL: this.state.API_URL
            })
            if(this._isMounted) {
                this.setState({ showBeforePictures: !this.state.showBeforePictures})
            }
        }
        if(type === 'after_pictures') {
            this.props.navigation.navigate('AfterPicturesList', {
                id: this.state.id,
                afterPictures: this.state.after_pictures,
                after_pics_urls: this.state.after_pics_urls,
                URL: this.state.URL,
                API_URL: this.state.API_URL
            })
            if(this._isMounted) {
                this.setState({ showAfterPictures: !this.state.showAfterPictures})
            }
        }
        if(type === 'attachment_receipt') {
            this.props.navigation.navigate('AttachmentPicturesList', {
                id: this.state.id,
                attachmentPictures: this.state.attachment_receipt,
                attachment_pics_urls: this.state.attachment_pics_urls,
                URL: this.state.URL,
                API_URL: this.state.API_URL
            })
            if(this._isMounted) {
                this.setState({ showAttachmentPictures: !this.state.showAttachmentPictures})
            }    
        }
    }
    
    updateJobcard(jobcard_id, data) {
        var postdata = {
            id: data.id,
            jobcard_num: data.jobcard_num,
            description: data.description,
            facility_name: data.facility_name,
            priority: data.priority
        }
        AsyncStorage.getItem('CentralUrlSelected').then(URL => {
            if(URL) {
                var API_URL = URL + '/api';
                axios.post(API_URL + '/updateJobcard', {
                    postdata
                }).then(response  => {
                    if(response.data.status) {
                        this.getJobcard(this.state.id);
                        this.props.navigation.navigate('Dashboard')
                    }
                }).catch(error => {
                    Alert.alert('Something Went Wrong', 'Unable to Update Jobcard, Please Try Again!')
                })
            }
        })
    }
    
    removePic(image_name, type) {
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
                            this.getJobcard(this.state.id);   
                        }).catch(error => {})
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

    handleChoosePhoto = (jobcard_id, type) => {
        this.setModalVisible(true, type);
        return false
        ImagePicker.openCamera({
            mediaType: 'photo',
          }).then(image => {});
        return false
        ImagePicker.openPicker({
            multiple: true
          }).then(images => {
            this.uploadImage(images, jobcard_id, type)
            images.map((image, idx) => {
                let pathParts = image.path.split('file://');
                let uriParts = image.path.split('/');
                image.uri = image.path
                image.path = pathParts[1]
                image.type = image.mime
                image.fileSize = image.size
                image.fileName = uriParts[uriParts.length - 1]
                image.name = uriParts[uriParts.length - 1]
            });
        });
    }

    uploadImage = async (files, jobcard_id, type) => {
        AsyncStorage.getItem('CentralUrlSelected').then(URL => {
            if(URL) {
                var API_URL = URL + '/api';
                NetInfo.isConnected.fetch().then(isConnected => {
                    if(!isConnected)
                    {
                        AsyncStorage.getItem('userId').then(userId => {
                        this.props.saveOfflineImages(files, type, jobcard_id, userId)
                        })
                        Alert.alert('Status Offline', 'Your changes have been saved offline and will be updated when Internet available')
                    } else {
                        let uploadData = new FormData();
                        uploadData.append('jobcard_id', jobcard_id)
                        uploadData.append('type', type)
            
                        for (let i = 0; i < files.length; i++) {
                            uploadData.append('images[]', files[i]);
                        }
                        axios({
                            method: 'post',
                            url: API_URL + '/uploadJobcardPhoto',
                            data: uploadData, 
                            headers: { "Content-Type": "multipart/form-data",
                            "cache-control": "no-cache",
                            "Postman-Token": "8bdabec9-2814-4e70-85e9-a43a9f30b174" },
                            "processData": false,
                            "contentType": false,
                            "mimeType": "multipart/form-data", 
                        })
                        .then(response => {
                            if(response.data.status) {
                                Alert.alert('Success', 'Successfully Uploaded')
                                this.setState({isLoading: true})
                                this.getJobcard(this.state.id)
                                } 
                        })
                        .catch(function (error) {
                            Alert.alert('Error', error)
                        });
                    }
                })
            }
        })
    }
    
    getJobcard(id) {
        var data = null 
        AsyncStorage.getItem('CentralUrlSelected').then(URL => {
            if(URL) {
                var API_URL = URL + '/api';
                if(this._isMounted) {
                    this.setState({ URL: URL, API_URL: API_URL})
                }
                NetInfo.isConnected.fetch().then(isConnected => {
                    if(!isConnected)
                    {
                        Connection = true
                        AsyncStorage.getItem('allJobcards').then(jobcard => {
                            index = this.props.navigation.getParam('index')
                            var jobcard = JSON.parse(jobcard)
                            data = jobcard[index]
                            if (data) {
                                // Alert.alert('response', JSON.stringify(data))
                                var before_pics = data.before_pictures
                                before_pics = before_pics ? JSON.parse(before_pics) : []
                                var after_pics = data.after_pictures
                                after_pics = after_pics ? JSON.parse(after_pics) : []
                                var attachment_pics = data.attachment_receipt
                                attachment_pics = attachment_pics ? JSON.parse(attachment_pics) : []
                                /********* AFTER IMAGES URL  **********/
                                var after_pics_urls = [];
                                if(after_pics.length > 0) {
                                    after_pics.map((item, index) => {
                                        after_pics_urls.push({url: URL + item.image_name})
                                    })
                                }
                                /********* BEFORE IMAGES URL  **********/
                                var before_pics_urls = [];
                                if(before_pics.length > 0) {
                                    before_pics.map((item, index) => {
                                        before_pics_urls.push({url: URL + item.image_name})
                                    })
                                }
                                /********* ATTACHMENT IMAGES URL  **********/
                                var attachment_pics_urls = [];
                                if(attachment_pics.length > 0) {
                                    attachment_pics.map((item, index) => {
                                        attachment_pics_urls.push({url: URL + item.image_name})
                                    })
                                }
                                if(this._isMounted) {
                                    this.setState({
                                        jobcardDetail: data,
                                        id: data.id,
                                        jobcard_num: data.jobcard_num,
                                        description: data.description,
                                        facility_name: data.facility_name,
                                        priority: data.priority,
                                        status: data.status,
                                        labour_paid: data.labour_paid,
                                        materials_paid: data.materials_paid,
                                        travelling_paid: data.travelling_paid,
                                        before_pictures: before_pics,
                                        after_pictures: after_pics,
                                        attachment_receipt: attachment_pics,
                                        before_pics_urls: before_pics_urls,
                                        after_pics_urls: after_pics_urls,
                                        attachment_pics_urls: attachment_pics_urls,
                                        isLoading: false,
                                        index: index
                                    })
                                }
                            }
                        })
                        
                    } else {
                        axios.get(API_URL + '/getJobcard', {
                            params: {
                                id: id
                            }
                        }).then(response => {
                            if(response.data) {
                                data = response.data
                                if (data) {
                                    // Alert.alert('response', JSON.stringify(data))
                                    var before_pics = response.data.before_pictures
                                    before_pics = before_pics ? JSON.parse(before_pics) : []
                                    var after_pics = response.data.after_pictures
                                    after_pics = after_pics ? JSON.parse(after_pics) : []
                                    var attachment_pics = response.data.attachment_receipt
                                    attachment_pics = attachment_pics ? JSON.parse(attachment_pics) : []
                                    /********* AFTER IMAGES URL  **********/
                                    var after_pics_urls = [];
                                    if(after_pics.length > 0) {
                                        after_pics.map((item, index) => {
                                            after_pics_urls.push({url: URL + item.image_name})
                                        })
                                    }
                                    /********* BEFORE IMAGES URL  **********/
                                    var before_pics_urls = [];
                                    if(before_pics.length > 0) {
                                        before_pics.map((item, index) => {
                                            before_pics_urls.push({url: URL + item.image_name})
                                        })
                                    }
                                    /********* ATTACHMENT IMAGES URL  **********/
                                    var attachment_pics_urls = [];
                                    if(attachment_pics.length > 0) {
                                        attachment_pics.map((item, index) => {
                                            attachment_pics_urls.push({url: URL + item.image_name})
                                        })
                                    }
                                    if(this._isMounted) {
                                        this.setState({
                                            jobcardDetail: data,
                                            id: data.id,
                                            jobcard_num: data.jobcard_num,
                                            description: data.description,
                                            facility_name: data.facility_name,
                                            priority: data.priority,
                                            status: data.status,
                                            labour_paid: data.labour_paid,
                                            materials_paid: data.materials_paid,
                                            travelling_paid: data.travelling_paid,
                                            before_pictures: before_pics,
                                            after_pictures: after_pics,
                                            attachment_receipt: attachment_pics,
                                            before_pics_urls: before_pics_urls,
                                            after_pics_urls: after_pics_urls,
                                            attachment_pics_urls: attachment_pics_urls,
                                            isLoading: false
                                        })
                                    }
                                }
                            }
                        })
                        
                    }
                    /********* IF CONNECTION Exists *********/ 
                /********* IF DATA EXISTS *********/ 
                })
            }
        })
	}

    componentWillUnmount() {
		this._isMounted = false;
    }
    
    componentDidMount(){
		this._isMounted = true;
        const jobcardId = this.props.navigation.getParam('id')
        this.getJobcard(jobcardId);
        this.checkAllPermissions();
    }
    
    
	render() {
		const {navigate} = this.props.navigation;
        const {photo, viewerType, attachment_pics_urls, before_pics_urls, after_pics_urls, isLoading } = this.state;
        NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected) {
                if(this._isMounted) {
                    this.setState({ internetConnection: true }) 
                }
            } else {
                if(this._isMounted) {
                    this.setState({ internetConnection: false }) 
                }
            }
        })
        /* BEFORE PICTURES SHOW IMAGES LIST */
        function BeforePicturesList(props) {
            const list = props.beforePictures
            const showList = props.showBeforePictures
            if(showList) {
                if(list && list.length > 0) {
                    const listBeforePictures = list.map((item, index) => 
                        <TouchableWithoutFeedback key={ index } onPress={() => {props.click(index, 'before')}}>
                            <View style={styles.imageBox}>
                                <Button small danger style={styles.imageBoxCloseBtn} onPress={() => { props.removeClick(item.image_name, 'before_pictures')}}>
                                    <Icon name="close-circle"></Icon>
                                </Button>
                                <Image
                                    source={{ uri: URL + item.image_name, width: 150, height: 150 }}
                                    style={{ zIndex: -1, margin: 5 }}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    );
                    return (
                        <View style={styles.beforePicsContainer}>
                            {listBeforePictures}
                        </View>
                    )
                } else {
                    return (
                        <Text>No Before Pictures Found</Text>
                    )
                }
            } else {
                return (
                    <Text></Text>
                )
            }
        }
        
        /* AFTER PICTURES SHOW IMAGES LIST */
        function AfterPicturesList(props) {
            const list = props.afterPictures
            const showList = props.showAfterPictures
            if(showList) {
                if(list && list.length > 0) {
                    const listAfterPictures = list.map((item, index) => 
                        <TouchableWithoutFeedback key={ index } onPress={() => {props.click(index, 'after')}}>
                            <View style={styles.imageBox}>
                                <Button small danger style={styles.imageBoxCloseBtn} onPress={() => { props.removeClick(item.image_name, 'after_pictures')}}>
                                    <Icon name="close-circle"></Icon>
                                </Button>
                                <Image
                                    source={{ uri: URL + item.image_name, width: 150, height: 150 }}
                                    style={{ zIndex: -1, margin: 5 }}
                                />
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
            } else {
                return (
                    <Text></Text>
                )
            }
        }

        /* ATTACHMENT PICTURES SHOW IMAGES LIST */
        function AttachmentPicturesList(props) {
            const list = props.attachmentPictures
            const showList = props.showAttachmentPictures
            if(showList) {
                if(list && list.length > 0) {
                const listAttachmentPictures = list.map((item, index) => 
                    <TouchableWithoutFeedback key={ index } onPress={() => {props.click(index, 'attachment')}}>
                        <View style={styles.imageBox}>
                            <Button small danger style={styles.imageBoxCloseBtn} onPress={() => { props.removeClick(item.image_name, 'attachment_receipt')}}>
                                <Icon name="close-circle"></Icon>
                            </Button>
                            <Image
                                source={{ uri: URL + item.image_name, width: 150, height: 150 }}
                                style={{ zIndex: -1, margin: 5 }}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                );
                return (
                    <View style={styles.attachmentPicsContainer}>
                        {listAttachmentPictures}
                    </View>
                )
            } else {
                return (
                    <Text>No Attachment Pictures Found</Text>
                )
            }
            } else {
                return (
                    <Text></Text>
                )
            }
        }

		return (
			<Container style={{ paddingTop: 0}}>
                { !isLoading ?
                <Container>
				<AuthenticateLogin jobcardId={this.state.id} getJobcard={this.getJobcard} navigation={this.props.navigation}/>
                <CheckOfflineImages successfullyUpdate={ () => {console.log(' ')}}/>
				<Content style={[ styles.jobcardEditContainer, this.state.modalVisible ? { opacity: 0.5} : '']}>
                    {/*************** JOBCARD DESCRIPTION CARD ***************/}
                    <Card style={{ borderWidth: 1, borderColor: '#000' }}>
                        <CardItem style={{ textAlign: 'center', borderRadius: 10, backgroundColor: '#fff' }} button onPress={() => this.editForm()}>
                            <Body style={{textAlign: 'center', padding: 20}}>
                                <Text style={{ fontWeight: 'bold', fontSize:25, color: BLACK}}> {this.state.jobcard_num}</Text>
                                <Text style={{ padding: 6, color: BLACK}}>
                                { this.state.description}
                                </Text>
                                <Text style={{ padding: 6, color: BLACK}}>
                                    <Text style={{ fontWeight: 'bold', color: BLACK}}>Facility Name</Text>
                                    : {this.state.facility_name}
                                </Text>
                                <Text style={{ padding: 6, color: BLACK}}>
                                    <Text style={{ fontWeight: 'bold', color: BLACK}}>Priority</Text>
                                    : {  this.state.priority}
                                </Text>
                                <Text style={{ padding: 6, color: BLACK}}>
                                    <Text style={{ fontWeight: 'bold', color: BLACK}}>Labour Paid</Text>
                                    : ${ this.state.labour_paid ? this.state.labour_paid : '0.00' }
                                </Text>
                                <Text style={{ padding: 6, color: BLACK}}>
                                    <Text style={{ fontWeight: 'bold', color: BLACK}}>Material Paid</Text>
                                    : ${ this.state.materials_paid ? this.state.materials_paid : '0.00'}
                                </Text>
                                <Text style={{ padding: 6, color: BLACK}}>
                                    <Text style={{ fontWeight: 'bold', color: BLACK}}>Travelling Paid</Text>
                                    : ${ this.state.travelling_paid ? this.state.travelling_paid : '0.00' }
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    {/*************** JOBCARD DESCRIPTION CARD ***************/}

                    {/*************** BEFORE PICTURES CARD ***************/}
                    <View style={{ marginTop: 10, position: 'relative', flexDirection: "row",justifyContent: 'center'}}>
                        <Card style={{ width: UPLOAD_WIDTH, borderRadius: 10, backgroundColor: BLUE }}>
                            <CardItem
                                style={{ textAlign: 'center', borderRadius: 10, backgroundColor: BLUE }}
                                button onPress={() => this.handleChoosePhoto(this.state.id, 'before_pictures')}
                            >
                                <Body style={{ textAlign: 'center', padding: 2}}>
                                    <Text style={{ fontSize: 12, color: WHITE}}>Take Before Pictures</Text>
                                </Body>
                            </CardItem>
                        </Card>
                        { this.state.internetConnection && 
                            <Card style={{ width: VIEW_WIDTH, borderRadius: 10, backgroundColor: BLUE }}>
                                <CardItem
                                    style={{ borderRadius: 10, backgroundColor: BLUE }}
                                    button onPress={() => { this.togglePictures('before_pictures') }}
                                >
                                    <Body style={{ flexDirection: "row",justifyContent: 'center', padding: 2}}>
                                        <Text style={{ fontSize: 12,color: WHITE}}>View</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        }
                        
                    </View>
                    {/*************** BEFORE PICTURES CARD ***************/}
                    
                    {/*************** AFTER PICTURES CARD ***************/}
                    <View style={{ marginTop: 10, position: 'relative', flexDirection: "row",justifyContent: 'center'}}>
                        <Card style={{ width: UPLOAD_WIDTH, borderRadius: 10, backgroundColor: BLUE }}>
                            <CardItem
                                style={{ textAlign: 'center', borderRadius: 10, backgroundColor: BLUE }}
                                button onPress={() => this.handleChoosePhoto(this.state.id, 'after_pictures')}
                            >
                                <Body style={{textAlign: 'center', padding: 2}}>
                                    <Text style={{ fontSize: 12, color: WHITE}}>Take After Pictures</Text>
                                </Body>
                            </CardItem>
                        </Card>
                        { this.state.internetConnection &&
                            <Card style={{ width: VIEW_WIDTH, borderRadius: 10, backgroundColor: BLUE }}>
                                <CardItem
                                    style={{ textAlign: 'center', borderRadius: 10, backgroundColor: BLUE }}
                                    button onPress={() => { this.togglePictures('after_pictures') }}
                                >
                                    <Body style={{flexDirection: "row",justifyContent: 'center', padding: 2}}>
                                        <Text style={{ fontSize: 12,color: WHITE}}>View</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        }
                    </View>
                    {/*************** AFTER PICTURES CARD ***************/}

                    {/*************** ATTACHMENT PICTURES CARD ***************/}
                    <View style={{ marginTop: 10, position: 'relative', flexDirection: "row", justifyContent: 'center'}}>
                        <Card style={{ width: UPLOAD_WIDTH, borderRadius: 10, backgroundColor: BLUE }}>
                            <CardItem
                                style={{ textAlign: 'center', borderRadius: 10, backgroundColor: BLUE }}
                                button onPress={() => this.handleChoosePhoto(this.state.id, 'attachment_receipt')}
                            >
                                <Body style={{textAlign: 'center', padding: 2}}>
                                    <Text style={{ fontSize: 12,color: WHITE}}>Take Attachment Pictures</Text>
                                </Body>
                            </CardItem>
                        </Card>
                        { this.state.internetConnection &&
                            <Card style={{ width: VIEW_WIDTH, borderRadius: 10, backgroundColor: BLUE }}>
                                <CardItem
                                    style={{ textAlign: 'center', borderRadius: 10, backgroundColor: BLUE }}
                                    button onPress={() => { this.togglePictures('attachment_receipt') }}
                                >
                                    <Body style={{ flexDirection: "row",justifyContent: 'center', padding: 2}}>
                                        <Text style={{ fontSize: 12, color: WHITE }}>View</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        }
                    </View>
                    {/*************** ATTACHMENT PICTURES CARD ***************/}

                    <Form>
                        {/************ MODAL IMAGE VIEWER SECTION  ************/}
                        <Modal visible={this.state.isModalOpened} transparent={false}>
                            <Button onPress={this.closeModal}>
                                <Icon name="close-circle"></Icon>
                            </Button>
                            { viewerType && viewerType === 'before' && 
                                <ImageViewer imageUrls={before_pics_urls} index={this.state.currentImageIndex}/>
                            }
                            { viewerType && viewerType === 'after' && 
                                <ImageViewer imageUrls={after_pics_urls} index={this.state.currentImageIndex}/>
                            }
                            { viewerType && viewerType === 'attachment' && 
                                <ImageViewer imageUrls={attachment_pics_urls} index={this.state.currentImageIndex}/>
                            }    
                        </Modal>
                        {/************ MODAL IMAGE VIEWER SECTION  ************/}
                    </Form>
				</Content>
                <ScreenFooter navigation={this.props.navigation}></ScreenFooter>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <View style={{  display: 'flex', flexWrap: 'wrap', marginLeft: '3%', marginRight: '3%', flexDirection: 'row', backgroundColor: 'white', marginTop: '30%', color: 'black', borderWidth: 2, borderColor: '#eee' }}>
                        <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row'}}>
                            <View style={{ textAlign: 'center', padding: 20 }}>
                                <Text onPress={() => { this.pictureUpload('single');  }}>
                                    <Icon style={{ color: 'blue', marginRight: 8}} name="camera"/>
                                    Capture Image from Camera
                                </Text>
                            </View>
                            <View style={{ textAlign: 'center', padding: 20 }}>
                                <Text onPress={() => { this.pictureUpload('multiple') }}>
                                    <Icon style={{ color: 'blue'}} name="image"/>
                                    Upload Images from Gallery
                                </Text>
                            </View>
                            <View style={{ width: '100%', textAlign: 'center', padding: 20 }}>
                                <Text
                                    onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible, null);
                                }}>
                                    Cancel
                                </Text>
                            </View>
                        </View> 
                        
                    </View>
                </Modal>
                </Container>
                :
                  <Spinner color="red"/>
                }
			</Container>
		);
	}
}

JobcardEdit.propTypes = {
	saveOfflineImages: PropTypes.func
}

const mapStateToProps = (state) => ({
	user: state.user,
	jobcard: state.jobcard
})

export default connect(mapStateToProps, { saveOfflineImages })(JobcardEdit)
