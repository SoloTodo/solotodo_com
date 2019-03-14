import { setCookie, destroyCookie } from 'nookies'
import {
  fetchAuth,
  areListsEqual,
  fetchJson,
  convertIdToUrl
} from '../react-utils/utils';
import { settings } from '../settings'
import {getPreferredCountry, getPreferredStores, persistUser} from "../utils";

export const login = (authToken, state) => dispatch => {
  setCookie(null, 'authToken', authToken, {});
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

  const preferredCountry = await getPreferredCountry(user, state, ctx);
  const preferredStores = getPreferredStores(user, state);

  if (user) {
    let userChanges = {};

    if (user.preferred_country !== preferredCountry.url) {
      userChanges['preferred_country'] = preferredCountry.url;
    }

    if (!areListsEqual(user.preferred_stores, preferredStores.map(store => store.url))) {
      userChanges['preferred_stores'] = preferredStores.map(store => store.url);
    }

    if (Object.keys(userChanges).length > 0) {
      user = await persistUser(authToken, userChanges);
    }

    // Update the local user BEFORE nullifying the session preferences so that
    // the preferences are available between dispatches.

    dispatch(setLocalUser(user));
    dispatch(setSessionPreferredCountryId(null, ctx));
    dispatch(setSessionPreferredStoreIds(null, ctx));
  } else {
    if (state.preferredCountryId !== preferredCountry.id) {
      dispatch(setSessionPreferredCountryId(preferredCountry.id, ctx));
    }

    if (!areListsEqual(state.preferredStoreIds, preferredStores.map(store => store.id))) {
      dispatch(setSessionPreferredStoreIds(preferredStores.map(store => store.id), ctx));
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

export const updatePreferredCountry = (country, user, authToken) => dispatch => {
  if (user) {
    const userChanges = {
      preferred_country: country.url
    };

    persistUser(authToken, userChanges).then(updatedUser => {
      dispatch(setLocalUser(updatedUser));
    });
  } else {
    dispatch(setSessionPreferredCountryId(country.id));
  }

  return dispatch(updateNavigation(country.url));
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

/**************************************
 * Country validation utility actions *
 **************************************/

const setSessionPreferredCountryId = (preferredCountryId, ctx) => dispatch => {
  if (preferredCountryId) {
    setCookie(ctx, 'preferredCountryId', preferredCountryId, {})
  } else {
    destroyCookie(ctx, 'preferredCountryId');
  }

  dispatch({
    type: 'setPreferredCountryId',
    preferredCountryId: preferredCountryId
  })
};

/************************************
 * Store validation utility actions *
 ************************************/

const setSessionPreferredStoreIds = (preferredStoreIds, ctx) => dispatch => {
  if (preferredStoreIds) {
    setCookie(ctx, 'preferredStoreIds', JSON.stringify(preferredStoreIds), {})
  } else {
    destroyCookie(ctx, 'preferredStoreIds');
  }

  return dispatch({
    type: 'setPreferredStoreIds',
    preferredStoreIds: preferredStoreIds
  });
};