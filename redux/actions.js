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
  getPreferredCountry, getPreferredExcludeRefurbished,
  getPreferredStores,
  persistUser
} from "../utils";
import {fetchRequiredResources} from "../react-utils/redux/utils";
import {filterApiResourceObjectsByType} from "../react-utils/ApiResource";

export const loadFilteredRequiredResources = resources => dispatch => {
  return fetchRequiredResources(resources).then(bundle => {
    const countries = filterApiResourceObjectsByType(bundle, 'countries');
    const stores = filterApiResourceObjectsByType(bundle, 'stores').filter(store => store.last_activation);
    const countriesToRemove = [];

    for (const country of countries) {
      if (!stores.some(store => store.country === country.url)) {
        countriesToRemove.push(country.url)
      }
    }

    bundle = bundle.filter(bundleItem => !countriesToRemove.includes(bundleItem.url));

    dispatch({
      type: 'addBundle',
      apiResourceObjects: bundle
    });
  });
};

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
  const preferredCountry = await getPreferredCountry(user, state, ctx);
  const preferredStores = getPreferredStores(user, state);
  const preferredExcludeRefurbished = getPreferredExcludeRefurbished(user, state);

  if (user) {
    let userChanges = {};

    if (user.preferred_country !== preferredCountry.url) {
      userChanges['preferred_country'] = preferredCountry.url;
    }

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
    dispatch(setSessionPreferredCountryId(null, ctx));
    dispatch(setSessionPreferredStoreIds(null, ctx));
    dispatch(setSessionPreferredExcludeRefurbished(null, ctx));
  } else {
    if (state.preferredCountryId !== preferredCountry.id) {
      dispatch(setSessionPreferredCountryId(preferredCountry.id, ctx));
    }

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

  return dispatch(updateNavigation(country.url));
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
    setCookie(ctx, 'preferredCountryId', preferredCountryId, {
      maxAge: 60 * 60 * 24 * 14,
      path: '/'
    })
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


