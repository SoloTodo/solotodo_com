import { combineReducers } from 'redux';
import moment from "moment";
import {
  apiResourceObjectsReducer,
  loadedBundleReducer
} from '../react-utils/redux/reducers'

function preferredCountryReducer(state, action) {
  if (typeof state === 'undefined') {
    return null
  }

  if (action.type === 'setPreferredCountry') {
    return action.preferredCountry
  }

  return state
}

function preferredStoresReducer(state, action) {
  if (typeof state === 'undefined') {
    return []
  }

  if (action.type === 'setPreferredStores') {
    return action.preferredStores
  }

  return state
}

function preferredStoresLastUpdatedReducer(state, action) {
  if (typeof state === 'undefined') {
    return null
  }

  if (action.type === 'setPreferredStores') {
    if (action.preferredStores) {
      return moment()
    } else {
      return null
    }
  }

  return state
}

export const reducer = combineReducers({
  // authToken: authTokenReducer,
  preferredCountry: preferredCountryReducer,
  preferredStores: preferredStoresReducer,
  preferredStoresLastUpdated: preferredStoresLastUpdatedReducer,
  apiResourceObjects: apiResourceObjectsReducer,
  // loadedResources: loadedResourcesReducer,
  loadedBundle: loadedBundleReducer,
  // browser: createResponsiveStateReducer({
  //   extraSmall: 575,
  //   small: 767,
  //   medium: 991,
  //   large: 1199,
  //   extraLarge: 1499
  // }),
});