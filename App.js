import React, { Component } from 'react';
// import { Text} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import HomeScreen  from './src/screens/Home';
import JobcardListScreen  from './src/screens/JobcardsList';
import LoginScreen  from './src/screens/Login';
import DashboardScreen  from './src/screens/Dashboard';
import ProfileScreen  from './src/screens/Profile';
import JobcardEditScreen  from './src/screens/JobcardEdit';
import BeforePicturesListScreen  from './src/screens/BeforePicturesList';
import AfterPicturesListScreen  from './src/screens/AfterPicturesList';
import AttachmentPicturesListScreen  from './src/screens/AttachmentPicturesList';
import JobcardEditFormScreen  from './src/screens/EditForm';
import SelectUrlScreen  from './src/screens/SelectUrl';

export const URL = 'http://172.98.203.103';
// export const URL = 'http://10.0.3.2:8000';
export const LOCAL_URL = 'http://localhost:8000';
export const USER_ID = 27;
// export const API_URL = URL + '/api';
export const UPLOADS_URL = URL + '/uploads/';
export var API_URL = '';

console.disableYellowBox = true

const MainNavigator = createStackNavigator({
  Dashboard: {screen: DashboardScreen },
  SelectUrl: {screen: SelectUrlScreen },
  Jobcard: {screen: JobcardListScreen},
  Login: {screen: LoginScreen},
  Profile: {screen: ProfileScreen},
  JobcardEdit: {screen: JobcardEditScreen},
  AfterPicturesList: {screen: AfterPicturesListScreen},
  BeforePicturesList: {screen: BeforePicturesListScreen},
  AttachmentPicturesList: {screen: AttachmentPicturesListScreen},
  JobcardEditForm: {screen: JobcardEditFormScreen},
});

const App = createAppContainer(MainNavigator);

export default App
