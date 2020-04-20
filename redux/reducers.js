import { combineReducers } from 'redux';
import moment from "moment";
import {
  createResponsiveStateReducer
} from "redux-responsive";
import {
  apiResourceObjectsReducer,
  loadedBundleReducer
} from '../react-utils/redux/reducers'

function preferredStoreIdsReducer(state, action) {
  if (typeof state === 'undefined') {
    return []
  }

  if (action.type === 'setPreferredStoreIds') {
    return action.preferredStoreIds
  }

  return state
}

function preferredStoresLastUpdatedReducer(state, action) {
  if (typeof state === 'undefined') {
    return null
  }

  if (action.type === 'setPreferredStoreIds') {
    if (action.preferredStoreIds) {
      return moment()
    } else {
      return null
    }
  }

  return state
}

function preferredExcludeRefurbished(state, action) {
  if (typeof state === 'undefined') {
    return null
  }

  if (action.type === 'setPreferredExcludeRefurbished') {
    return action.preferredExcludeRefurbished
  }

  return state
}

function navigationReducer(state, action) {
  if (typeof state === 'undefined') {
    return []
  }

  if (action.type === 'setNavigation') {
    if (action.navigation) {
      return action.navigation
    } else {
      return []
    }
  }

  return state
}

function categoryBrowsePriceRangesReducer(state, action) {
  if (typeof state === 'undefined') {
    return []
  }

  if (action.type === 'addCategoryBrowsePriceRange') {
    return [
      ...state,
      {
        storeIds: action.storeIds,
        categoryId: action.categoryId,
        priceRange: action.priceRange
      }
    ]
  }

  return state
}

export const createReducer = isMobile => combineReducers({
  preferredStoreIds: preferredStoreIdsReducer,
  preferredStoresLastUpdated: preferredStoresLastUpdatedReducer,
  preferredExcludeRefurbished: preferredExcludeRefurbished,
  apiResourceObjects: apiResourceObjectsReducer,
  loadedBundle: loadedBundleReducer,
  navigation: navigationReducer,
  categoryBrowsePriceRanges: categoryBrowsePriceRangesReducer,
  browser: createResponsiveStateReducer({
    extraSmall: 575,
    small: 767,
    medium: 991,
    large: 1199,
    extraLarge: 1499
  }, {
    initialMediaType: isMobile ? 'extraSmall' : 'large'
  })
});