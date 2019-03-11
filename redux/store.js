import { createStore, applyMiddleware, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import {
  createResponsiveStoreEnhancer
} from "redux-responsive";

import {createReducer} from './reducers';

export function initializeStore(initialState, isMobile=false) {
  const enhancers = [
    createResponsiveStoreEnhancer({calculateInitialState: false})
  ];

  const middleware = [thunk];
  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  );

  return createStore(
    createReducer(isMobile),
    initialState,
    composeWithDevTools(composedEnhancers)
  )
}
