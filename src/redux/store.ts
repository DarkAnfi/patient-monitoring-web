import { createStore, combineReducers, compose, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from './reducers/auth';
import { uiReducer } from './reducers/ui';


declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const reducers = combineReducers<RootState>({
  auth: authReducer,
  ui: uiReducer,
});

export const store: Store<RootState, any> = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));