import { SAVE_USER, DELETE_USER, SAVE_CENTRAL_URL, DELETE_CENTRAL_URL  } from '../actions/types';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
  userId: null,
  userEmail: null,
  CentralUrlSelected: null,
  CentralUrls: null
};

const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case SAVE_USER:
      // save userId and email in Storage
      if(action.userId) {
          AsyncStorage.setItem('userId', action.userId.toString())
      }
      if(action.userEmail) {
        AsyncStorage.setItem('userEmail', action.userEmail)
      }  
      if(action.userRole) {
        AsyncStorage.setItem('userRole', action.userRole)
      }  
      return {
        ...state,
        userId: action.userId,
        userEmail: action.userEmail,
        userRole: action.userRole
      };
    case SAVE_CENTRAL_URL:
      // save userId and email in Storage
      // AsyncStorage.removeItem('CentralUrls')

      AsyncStorage.getItem('CentralUrls', (err, result) => {
        if(result !== null) {
          var newResult = JSON.parse(result);
          newResult.push(action.central_url)
          function onlyUnique(value, index, self) { 
              return self.indexOf(value) === index;
          }
          var unique = newResult.filter( onlyUnique );
          AsyncStorage.setItem('CentralUrls', JSON.stringify(unique));
          AsyncStorage.setItem('CentralUrlSelected', action.central_url);
          return {
            ...state,
            CentralUrlSelected: action.central_url,
            CentralUrls: JSON.stringify(unique)
          };
        } else {
          var myArray = [action.central_url]
          AsyncStorage.setItem('CentralUrls', JSON.stringify(myArray));
          AsyncStorage.setItem('CentralUrlSelected', action.central_url);
          return {
            ...state,
            CentralUrlSelected: action.central_url,
            CentralUrls: JSON.stringify(myArray)
          };
        }
      });  
    case DELETE_USER:
        AsyncStorage.removeItem('userEmail')
        AsyncStorage.removeItem('userId')
        AsyncStorage.removeItem('userRole')
        return {
          ...state,
          userId: null,
          userEmail: null
        };
      case DELETE_CENTRAL_URL:
        AsyncStorage.removeItem('userEmail')
        AsyncStorage.removeItem('userId')
        AsyncStorage.removeItem('userRole')
        AsyncStorage.removeItem('CentralUrlSelected')
        return {
          ...state,
          userId: null,
          userEmail: null
        };     
    default:
      return state;
  }
}

export default userReducer;