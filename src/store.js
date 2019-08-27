import { createStore, combineReducers } from 'redux';
import placeReducer from './reducers/placeReducer';
import userReducer from './reducers/userReducer';
import jobcardReducer from './reducers/jobcardReducer';

const rootReducer = combineReducers({
  places: placeReducer,
  user: userReducer,
  jobcard: jobcardReducer
});

const configureStore = () => {
  return createStore(rootReducer);
}

export default configureStore;