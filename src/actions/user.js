import { SAVE_USER, DELETE_USER, SAVE_CENTRAL_URL, DELETE_CENTRAL_URL } from './types';
import AsyncStorage from '@react-native-community/async-storage';

export const saveUser = (userId,userEmail, userRole) => {
  return {
    type: SAVE_USER,
    userId: userId,
    userEmail: userEmail,
    userRole: userRole
  }
}

export const saveCentralUrl = (central_url) => {
  return {
    type: SAVE_CENTRAL_URL,
    central_url: central_url
  }
}

export const deleteUser = () => {
  return {
    type: DELETE_USER
  }
}

export const deleteCentralUrl = () => {
  return {
    type: DELETE_CENTRAL_URL
  }
}

export const API_URL = () => {
  AsyncStorage.getItem('CentralUrlSelected').then(URL => {
    if(URL) {
      return URL + '/api'
    }
  })
}
