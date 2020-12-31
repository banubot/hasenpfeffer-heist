import scoreReducer from './score';
import playingReducer from './playing';
import strikeReducer from './strike';
import logReducer from './log'
import { combineReducers } from 'redux'

const reducers = combineReducers({
  strike: strikeReducer,
  playing: playingReducer,
  score: scoreReducer,
  log: logReducer
});

export default reducers;