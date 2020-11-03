import scoreReducer from './score';
import playingReducer from './playing';
import strikeReducer from './strike';
import { combineReducers } from 'redux'

const reducers = combineReducers({
  strike: strikeReducer,
  playing: playingReducer,
  score: scoreReducer
});

export default reducers;