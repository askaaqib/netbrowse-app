import React, { Component } from 'react';
import { View, Alert, NetInfo } from 'react-native';
import { Text, Button, Toast, Spinner } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
// import { API_URL } from '../../App';
import {NavigationEvents} from 'react-navigation';

export default class CheckOfflineImages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            offlineDataSaved: false,
            offlineImagesData: null,
            offlineJobcardsData: null,
            userId: null,
            isOnline: false,
            isLoading: false
        };
		this.getOfflineUploads = this.getOfflineUploads.bind(this);
		this.syncOfflineImages = this.syncOfflineImages.bind(this);
      }
	static navigationOptions = {
        header: null
	};

	getOfflineUploads() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected)
            {
                this.setState({ isOnline: true})
            }
        })
        var imagesSavedFound = false
        var jobcardSavedFound = false
        AsyncStorage.getItem('userId').then(id => {
			if(id) {
                this.setState({ userId: id})
                AsyncStorage.getItem('OfflineImages['+ id + ']').then(images => {
                    if(images) {
                        this.setState({ offlineImagesData: images })
                        imagesSavedFound = true
                    }
                })
                AsyncStorage.getItem('OfflineJobcards['+ id + ']').then(jobcards => {
                    if(jobcards) {
                        this.setState({ offlineJobcardsData: jobcards })
                        jobcardSavedFound = true
                    }
                    if (imagesSavedFound || jobcardSavedFound) {
                        this.setState({ offlineDataSaved: true })
                    }
                })
			}
        })
        
    }
    
    syncOfflineImages() {
        // Hide 
        this.setState({ isLoading: true})
        let jobcardUploadData = new FormData();
        var allJobcardsData = this.state.offlineJobcardsData
        var allJobcardsDataParsed = JSON.parse(this.state.offlineJobcardsData)
        jobcardUploadData.append("data", allJobcardsData)
        if(allJobcardsDataParsed && allJobcardsDataParsed.length > 0) {
            AsyncStorage.getItem('CentralUrlSelected').then(URL => {
                if(URL) {
                    var API_URL = URL + '/api';
                    axios({
                        method: 'post',
                        url: API_URL + '/saveOfflineJobcards',
                        data: jobcardUploadData, 
                        headers: { "Content-Type": "multipart/form-data",
                        "cache-control": "no-cache",
                        "Postman-Token": "8bdabec9-2814-4e70-85e9-a43a9f30b174" },
                        "processData": false,
                        "contentType": false,
                        "mimeType": "multipart/form-data", 
                    })
                    .then(response => {
                        if(response.data.status) {
                                AsyncStorage.removeItem('OfflineJobcards['+ this.state.userId + ']')
                                this.setState({ offlineJobcardsData: null, offlineDataSaved: false, isLoading: false })
                                Alert.alert('Changes Saved', 'Your changes have been successfully saved.')
                                this.props.successfullyUpdate()
                            } 
                    })
                    .catch(function (error) {
                        Alert.alert('Error', error)
                    });
                }
            })
        }
       

        let uploadData = new FormData();
        var allData = JSON.parse(this.state.offlineImagesData)
        if (allData && allData.length > 0) {
            var allTypes = []
            allData.map((item, index) => {
                var imageType = item.type
                allTypes.push(imageType)
                var jobcardId = item.id
                if(item.images) {
                    item.images.map((imageItem, imageIndex) => {
                        imageItem.imageType = imageType
                        imageItem.jobcardId = jobcardId
                        uploadData.append('images['+ jobcardId +']['+ imageType + '][]', imageItem);
                    })
                }
            })
            AsyncStorage.getItem('CentralUrlSelected').then(URL => {
                if(URL) {
                    var API_URL = URL + '/api';
                    axios({
                        method: 'post',
                        url: API_URL + '/saveOfflineImages',
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
                                AsyncStorage.removeItem('OfflineImages['+ this.state.userId + ']')
                                this.setState({ offlineImagesData: null, offlineDataSaved: false, isLoading: false })
                                Alert.alert('Changes Saved', 'Your changes have been successfully saved.')
                                this.props.successfullyUpdate()
                            } 
                    })
                    .catch(function (error) {
                        Alert.alert('Error', error.toString())
                    });
                }
            })
        }  
        
    }
	componentDidMount(){
		this.getOfflineUploads()
	}
	render() {
        const { offlineDataSaved, isOnline, isLoading } = this.state
        return (
            <View>
                <NavigationEvents onDidFocus={() => this.getOfflineUploads()} />
                { offlineDataSaved && isOnline && !isLoading && 
                        <Text onPress={this.syncOfflineImages } style={{  textAlign: 'center', backgroundColor: 'green', color: 'white', fontSize: 13, padding: 18 }}>
                            Your Changes are pending, Click here to upload your changes
                        </Text>
                }
                { isLoading && 
                    <Spinner />
                } 
            </View>
		);
	}
}
