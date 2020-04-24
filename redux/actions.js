import { setCookie, destroyCookie } from 'nookies'
import moment from 'moment'
import {
  fetchAuth,
  areListsEqual,
  fetchJson,
  convertIdToUrl
} from '../react-utils/utils';
import { settings } from '../settings'
import {
  getPreferredExcludeRefurbished,
  getPreferredStores,
  persistUser
} from "../utils";

export const login = (authToken, state) => dispatch => {
  setCookie(null, 'authToken', authToken, {
    maxAge: 60 * 60 * 24 * 14,
    path: "/"
  });
  return dispatch(initializeUser(authToken, state));
};

export const initializeUser = (authToken, state, ctx) => async dispatch => {
  let user = null;

  if (authToken) {
    try {
      user = await fetchAuth(authToken, settings.ownUserUrl);
    } catch (err) {
      // The token is not valid, do nothing as user is already null
    }
  }

  const preferredStores = getPreferredStores(user, state);
  const preferredExcludeRefurbished = getPreferredExcludeRefurbished(user, state);

  if (user) {
    let userChanges = {};

    if (!areListsEqual(user.preferred_stores, preferredStores.map(store => store.url))) {
      userChanges['preferred_stores'] = preferredStores.map(store => store.url);
    }

    if (user.preferred_exclude_refurbished !== preferredExcludeRefurbished) {
      userChanges['preferred_exclude_refurbished'] = preferredExcludeRefurbished
    }

    if (Object.keys(userChanges).length > 0) {
      user = await persistUser(authToken, userChanges);
    }

    // Update the local user BEFORE nullifying the session preferences so that
    // the preferences are available between dispatches.

    dispatch(setLocalUser(user));
    dispatch(setSessionPreferredStoreIds(null, ctx));
    dispatch(setSessionPreferredExcludeRefurbished(null, ctx));
  } else {
    if (!areListsEqual(state.preferredStoreIds, preferredStores.map(store => store.id))) {
      dispatch(setSessionPreferredStoreIds(preferredStores.map(store => store.id), ctx));
    }

    if (state.preferredExcludeRefurbished !== preferredExcludeRefurbished) {
      dispatch(setSessionPreferredExcludeRefurbished(preferredExcludeRefurbished, ctx))
    }

    // Delete the local user AFTER setting the new prefereces so that
    // the preferences are available between dispatches.
    dispatch(invalidateLocalUser(ctx));
  }
};

export const invalidateLocalUser = ctx => dispatch => {
  destroyCookie(ctx, 'authToken');
  dispatch({
    type: 'deleteApiResourceObject',
    url: settings.ownUserUrl
  })
};

export const updatePreferredStores = (storeIds, user, authToken) => dispatch => {
  if (user) {
    const preferredStoreUrls = storeIds.map(storeId => convertIdToUrl(storeId, 'stores'));

    const petition = {
      preferred_stores: preferredStoreUrls
    };

    return fetchAuth(authToken, 'users/me/', {
      method: 'PATCH',
      body: JSON.stringify(petition)
    }).then(
      newUser => {
        dispatch(setLocalUser(newUser));
      })
  } else {
    return dispatch(setSessionPreferredStoreIds(storeIds))
  }
};

export const updatePreferredExcludeRefurbished = (preferred_exclude_refurbished, user, authToken) => dispatch => {
  if (user) {
    const userChanges = {
      preferred_exclude_refurbished: preferred_exclude_refurbished
    };

    persistUser(authToken, userChanges).then(updatedUser => {
      dispatch(setLocalUser(updatedUser));
    });
  } else {
    dispatch(setSessionPreferredExcludeRefurbished(preferred_exclude_refurbished));
  }
};


//////////////////////////
// Utility methods
//////////////////////////

const setLocalUser = user => dispatch => {
  dispatch({
    type: 'updateApiResourceObject',
    apiResourceObject: user
  })
};

export const updateNavigation = countryUrl => dispatch => {
  return fetchJson(countryUrl + 'navigation/').then(navigation => {
    dispatch({
      type: 'setNavigation',
      navigation
    });
  })
};


/************************************
 * Store validation utility actions *
 ************************************/

const setSessionPreferredStoreIds = (preferredStoreIds, ctx) => dispatch => {
  if (preferredStoreIds) {
    setCookie(ctx, 'preferredStoreIds', JSON.stringify(preferredStoreIds), {
      path: '/',
      maxAge: 60 * 60 * 24 * 14
    });
    setCookie(ctx, 'preferredStoresLastUpdated', moment().format(), {
      path: '/',
      maxAge: 60 * 60 * 24 * 14
    })
  } else {
    destroyCookie(ctx, 'preferredStoreIds');
    destroyCookie(ctx, 'preferredStoresLastUpdated');
  }

  return dispatch({
    type: 'setPreferredStoreIds',
    preferredStoreIds: preferredStoreIds
  });
};

/***************************************
 * Exclude refurbished utility actions *
 ***************************************/

const setSessionPreferredExcludeRefurbished = (preferredExcludeRefurbished, ctx) => dispatch => {
  if (preferredExcludeRefurbished === null) {
    destroyCookie(ctx, 'preferredExcludeRefurbished');
  } else {
    setCookie(ctx, 'preferredExcludeRefurbished', JSON.stringify(preferredExcludeRefurbished), {
      path: '/',
      maxAge: 60 * 60 * 24 * 14
    });
  }

  return dispatch({
    type: 'setPreferredExcludeRefurbished',
    preferredExcludeRefurbished: Boolean(preferredExcludeRefurbished)
  });
};


