import { SAVE_JOBCARDS, SAVE_OFFLINE_IMAGES, SAVE_OFFLINE_JOBCARD, REMOVE_JOBCARDS } from '../actions/types';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';

const initialState = {
  allJobcards: null
};

const jobcardReducer = (state = initialState, action) => {
  switch(action.type) {
    case SAVE_OFFLINE_IMAGES:
        // save jobcardId and email in Storage
        if(action.images) {
          // AsyncStorage.removeItem('OfflineImages['+ action.userId + ']')
          AsyncStorage.getItem('OfflineImages['+ action.userId + ']', (err, result) => {
            if (result !== null) {
              // Alert.alert('Data found', result)
              // console.log('Data Found', result);
              var myArray = {id: action.jobcard_id, type: action.imageType, images: action.images}
              var newIds = JSON.parse(result);
              newIds.push(myArray)
              // Alert.alert('Result', newIds[0]["id"].toString())
              AsyncStorage.setItem('OfflineImages['+ action.userId + ']', JSON.stringify(newIds));
            } else {
              // console.log('Data Not Found');
              var myArray = [{id: action.jobcard_id, type: action.imageType, images: action.images}]
              AsyncStorage.setItem('OfflineImages['+ action.userId + ']', JSON.stringify(myArray));
            }
          });
          
            // AsyncStorage.setItem('OfflineImages['+ action.userId + ']['+ action.jobcard_id +']', JSON.stringify({id: action.jobcard_id, type: action.imageType, images: action.images}))
        } 
        return {
          ...state
        }
    case SAVE_OFFLINE_JOBCARD: 
          if(action.data) {
            // AsyncStorage.removeItem('OfflineJobcards['+ action.userId + ']')
            
            AsyncStorage.getItem('OfflineJobcards['+ action.userId + ']', (err, result) => {
              if (result !== null) {
                var myArray = {id: action.jobcard_id, data: action.data }
                var newIds = JSON.parse(result);
                newIds.map((item, index) => {
                  if(item) {
                    if(item.id == action.jobcard_id) {
                      delete(newIds[index])
                    }
                  }
                })
                newIds.push(myArray)
                var filtered = newIds.filter(function (el) {
                  return el != null;
                })
                AsyncStorage.setItem('OfflineJobcards['+ action.userId + ']', JSON.stringify(filtered));
              } else {
                var myArray = [{id: action.jobcard_id, data: action.data }]
                AsyncStorage.setItem('OfflineJobcards['+ action.userId + ']', JSON.stringify(myArray));
              }
            });
        }
      return {
        ...state
      }    
    case SAVE_JOBCARDS:
        // Alert.alert('SAVE JOBCARDS', JSON.stringify(action.jobcards))
      // save jobcardId and email in Storage
      if(action.jobcards) {
          AsyncStorage.setItem('allJobcards', JSON.stringify(action.jobcards))
      } 
      return {
        ...state
      }
    case REMOVE_JOBCARDS:
        AsyncStorage.removeItem('allJobcards')
      return {
        ...state
      }      
    default:
      return state;
  }
}

export default jobcardReducer;