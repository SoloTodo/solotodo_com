import { setCookie, destroyCookie } from 'nookies'
import fetch from 'isomorphic-unfetch'
import moment from "moment";
import {
  fetchAuth,
  listToObject,
  areListsEqual, fetchJson
} from '../react-utils/utils';
import {
  ApiResourceObject,
  filterApiResourceObjectsByType
} from '../react-utils/ApiResource';
import { settings } from '../settings'

export const initializeUser = (authToken, state, ctx) => async dispatch => {
  let user = null;

  if (authToken) {
    try {
      user = await fetchAuth(authToken, settings.ownUserUrl);
      dispatch({
        type: 'updateApiResourceObject',
        apiResourceObject: user
      });
    } catch (err) {
      // The token is not valid, invalidate the local user in case there is one
      dispatch(invalidateLocalUser(ctx));
    }
  } else {
    // Annonymous user or if the user is logging out
    // Invalidate the local user in case it is logging out
    dispatch(invalidateLocalUser(ctx));
  }

  await dispatch(validatePreferredCountry(authToken, state, ctx));
  await dispatch(validatePreferredStores(authToken, state, ctx));
};

const invalidateLocalUser = ctx => dispatch => {
  destroyCookie(ctx, 'authToken');
  dispatch({
    type: 'deleteApiResourceObject',
    url: settings.ownUserUrl
  })
};

export const updatePreferredCountry = (country, user, authToken) => dispatch => {
  if (user) {
    const fullUser = ApiResourceObject(user, {});
    fullUser.preferredCountry = country;
    fullUser.save(authToken, dispatch)
  } else {
    dispatch({
      type: 'setPreferredCountry',
      preferredCountry: country.id
    });
  }

  return dispatch(updateNavigation(country.url));
};

export const updatePreferredStores = (storeIds, user, authToken) => dispatch => {
  if (user) {
    const preferredStoreUrls = storeIds.map(storeId => `${settings.apiResourceEndpoints.stores}${storeId}/`);

    const petition = {
      preferred_stores: preferredStoreUrls
    };

    return fetchAuth(authToken, 'users/me/', {
      method: 'PATCH',
      body: JSON.stringify(petition)
    }).then(
      newUser => {
        dispatch({
          type: 'updateApiResourceObject',
          apiResourceObject: newUser
        });
      })
  } else {
    return dispatch(setPreferredStores(storeIds))
  }
};

export const setAuthToken = authToken => dispatch => {
  dispatch({
    type: 'setAuthToken',
    authToken
  });
};

//////////////////////////
// Utility methods
//////////////////////////

const updateLocalUser = user => dispatch => {
  dispatch({
    type: 'updateApiResourceObject',
    apiResourceObject: user
  })
};

const updateNavigation = countryUrl => dispatch => {
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

const setSessionPreferredCountry = (preferredCountryId, ctx) => dispatch => {
  if (preferredCountryId) {
    setCookie(ctx, 'preferredCountry', preferredCountryId, {})
  } else {
    destroyCookie(ctx, 'preferredCountry');
  }

  dispatch({
    type: 'setPreferredCountry',
    preferredCountry: preferredCountryId
  })
};


const validatePreferredCountry = (authToken, state, ctx) => async dispatch => {
  const user = state.apiResourceObjects[settings.ownUserUrl];

  const persistUserPreferredCountry = country => {
    const fullUser = new ApiResourceObject(user, state.apiResourceObjects);
    fullUser.preferredCountry = country;
    return fullUser.save(authToken, dispatch);
  };

  const sessionPreferredCountryUrl = state.preferredCountry ?
    `${settings.apiResourceEndpoints.stores}${state.preferredCountry}/` :
    null;
  const sessionPreferredCountry = sessionPreferredCountryUrl ?
    state.apiResourceObjects[sessionPreferredCountryUrl] :
    null;

  // Valid DB user / session preferred country combination
  if (user && user.preferred_country && !sessionPreferredCountry) {
    return dispatch(updateNavigation(user.preferred_country));
  }

  // Annonymous user with a valid session preferred country
  if (!user && sessionPreferredCountry) {
    return dispatch(updateNavigation(sessionPreferredCountry.url));
  }

  let preferredCountryUrl = null;

  // DB User with a session preferred country. This is an invalid combination
  // that happens when the user has just logged in.
  if (user && sessionPreferredCountry) {
    // Invalidate the session preferred country
    dispatch(setSessionPreferredCountry(null, ctx));

    // If the preferred country of the DB user has not been set yet, use the
    // one in his current session.
    if (user.preferred_country) {
      preferredCountryUrl = user.preferred_country;
    } else {
      persistUserPreferredCountry(sessionPreferredCountry);
      preferredCountryUrl = sessionPreferredCountry.url
    }
  } else {
    const clientIp = settings.customIp || ctx.req.headers['x-forwarded-for'] || ctx.req.connection.remoteAddress;
    const countryByIpUrl = `${settings.endpoint}countries/by_ip/?ip=${clientIp}`;

    preferredCountryUrl = await fetch(countryByIpUrl)
      .then(res => res.json())
      .then(json => {
        const preferredCountry = json.url ? json : state.apiResourceObjects[settings.defaultCountry];

        if (user) {
          persistUserPreferredCountry(preferredCountry);
        } else {
          dispatch(setSessionPreferredCountry(preferredCountry.id, ctx))
        }

        return preferredCountry.url;
      })
  }

  return dispatch(updateNavigation(preferredCountryUrl));
};


/************************************
 * Store validation utility actions *
 ************************************/

const setPreferredStores = (preferredStoreUrls, ctx) => dispatch => {
  console.log('settingPreferredStores')
  // console.log(preferredStoreUrls.length)
  // console.log(ctx)
  if (preferredStoreUrls) {
    setCookie(ctx, 'preferredStores', JSON.stringify(preferredStoreUrls), {})
  } else {
    destroyCookie(ctx, 'preferredStores');
  }

  return dispatch({
    type: 'setPreferredStores',
    preferredStores: preferredStoreUrls
  });
};

const validatePreferredStores = (authToken, state, ctx) => dispatch => {
  const user = state.apiResourceObjects[settings.ownUserUrl];

  const persistUserPreferredStores = newPreferredStores => {
    fetchAuth(authToken, settings.ownUserUrl, {
      method: 'PATCH',
      body: JSON.stringify({preferred_stores: newPreferredStores.map(store => store.url)})
    }).then(updatedUser => {
      dispatch(updateLocalUser(updatedUser))
    });
  };

  const stores = filterApiResourceObjectsByType(state.apiResourceObjects, 'stores').filter(store => store.last_activation);
  const storesDict = listToObject(stores, 'url');
  const sessionPreferredStoresIds = state.preferredStores;

  let currentPreferredStoreUrls = null;

  if (user && user.preferred_stores.length) {
    currentPreferredStoreUrls = user.preferred_stores
  } else if (!user && sessionPreferredStoresIds) {
    currentPreferredStoreUrls = sessionPreferredStoresIds.map(storeId => `${settings.apiResourceEndpoints.stores}${storeId}/`)
  }

  const validCurrentPreferredStoreUrls = currentPreferredStoreUrls &&
    currentPreferredStoreUrls.filter(storeUrl => storesDict[storeUrl]);

  let preferredStoresLastUpdated = user ? moment(user.preferred_stores_last_updated) : state.preferredStoresLastUpdated;

  if (!preferredStoresLastUpdated) {
    // date of first version. Existing stores are guaranteed have activation dates before this.
    preferredStoresLastUpdated = moment('2018-01-01T00:00:00+00:00')
  }

  const newStoreUrls = stores.filter(store => {
    const storeLastActivation = moment(store.last_activation);
    return storeLastActivation.isAfter(preferredStoresLastUpdated);
  }).map(store => store.url);

  let newPreferredStores = undefined;

  if (validCurrentPreferredStoreUrls) {
    const newPreferredStoreUrls = [...validCurrentPreferredStoreUrls, ...newStoreUrls];
    newPreferredStores = stores.filter(store => newPreferredStoreUrls.includes(store.url))
  } else {
    newPreferredStores = stores
  }

  if (user && sessionPreferredStoresIds) {
    dispatch(setPreferredStores(null, ctx))
  }

  if (!areListsEqual(currentPreferredStoreUrls, newPreferredStores.map(store => store.url))) {
    if (user) {
      persistUserPreferredStores(newPreferredStores);
    } else {
      dispatch(setPreferredStores(newPreferredStores.map(store => store.id), ctx));
    }
  }
};