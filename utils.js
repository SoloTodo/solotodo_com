import fetch from 'isomorphic-unfetch'
import {convertIdToUrl, fetchAuth} from "./react-utils/utils";
import {settings} from "./settings";
import {filterApiResourceObjectsByType} from "./react-utils/ApiResource";
import withTracker from './react-utils/components/GoogleAnalyticsNextJsTracker'
import moment from "moment";


export const parseBrowsePathToNextJs = path => {
  const nextRegex = /\/([^?]+)\??([^\/]*)/;
  const groups = nextRegex.exec(path);

  return {
    href: `/browse?category_slug=${groups[1]}&${groups[2]}`,
    as: path
  }
};

export const getPreferredCountry = async (user, state, ctx) => {
  if (user && state.apiResourceObjects[user.preferred_country]) {
    return state.apiResourceObjects[user.preferred_country]
  }

  const sessionPreferredCountryUrl = state.preferredCountryId ?
    convertIdToUrl(state.preferredCountryId, 'countries') : null;
  const sessionPreferredCountry = sessionPreferredCountryUrl ?
    state.apiResourceObjects[sessionPreferredCountryUrl] :
    null;

  if (sessionPreferredCountry) {
    return sessionPreferredCountry
  }

  let clientIp = settings.customIp;

  if (!clientIp && ctx && ctx.req) {
    clientIp = ctx.req.headers['x-forwarded-for'] || ctx.req.connection.remoteAddress;
  }

  const countryByIpArgs = clientIp ? `?ip=${clientIp}` : '';
  const countryByIpUrl = `${settings.endpoint}countries/by_ip/${countryByIpArgs}`;

  return await fetch(countryByIpUrl)
    .then(res => res.json())
    .then(json => {
      return json.url ? json : state.apiResourceObjects[settings.defaultCountryUrl];
    });
};

export const getPreferredStores = (user, state) => {
  const stores = filterApiResourceObjectsByType(state.apiResourceObjects, 'stores').filter(store => store.last_activation);
  const sessionPreferredStoreIds = state.preferredStoreIds;

  let currentPreferredStoreUrls = null;

  if (user && user.preferred_stores.length) {
    currentPreferredStoreUrls = user.preferred_stores
  } else if (!user && sessionPreferredStoreIds) {
    currentPreferredStoreUrls = sessionPreferredStoreIds.map(storeId => convertIdToUrl(storeId, 'stores'))
  }

  const validCurrentPreferredStoreUrls = currentPreferredStoreUrls ?
    stores.filter(store => currentPreferredStoreUrls.includes(store.url)).map(store => store.url) : null;

  let preferredStoresLastUpdated = user ? moment(user.preferred_stores_last_updated) : state.preferredStoresLastUpdated;

  if (!preferredStoresLastUpdated) {
    // date of first version. Existing stores are guaranteed have activation dates before this.
    preferredStoresLastUpdated = moment('2018-01-01T00:00:00+00:00')
  }

  const storesActivatedSinceLastVisitUrls = stores.filter(store => {
    const storeLastActivation = moment(store.last_activation);
    return storeLastActivation.isAfter(preferredStoresLastUpdated);
  }).map(store => store.url);

  let newPreferredStores = undefined;

  if (validCurrentPreferredStoreUrls) {
    newPreferredStores = stores.filter(store =>
      validCurrentPreferredStoreUrls.includes(store.url) ||
      storesActivatedSinceLastVisitUrls.includes(store.url))
  } else {
    newPreferredStores = stores
  }

  return newPreferredStores;
};

export const persistUser = async (authToken, userChanges) => {
  return await fetchAuth(authToken, 'users/me/', {
    method: 'PATCH',
    body: JSON.stringify(userChanges)
  });
};

export function withSoloTodoTracker(WrappedComponent, mapPropsToGAField){
  const trackPageHandler = props => {
    const analyticsParams = {
      page_title: 'SoloTodo'
    };

    if (mapPropsToGAField) {
        const soloTodoProps = mapPropsToGAField(props);

        if (soloTodoProps.category) {
          analyticsParams.dimension2 = soloTodoProps.category;
        }
        if (soloTodoProps.product) {
          analyticsParams.dimension3 = soloTodoProps.product;
        }
        if (soloTodoProps.pageTitle) {
          analyticsParams.page_title = `${soloTodoProps.pageTitle} - SoloTodo`;
        }
    }

    window.gtag('config', settings.googleAnalyticsId, analyticsParams)
  };

  return withTracker(WrappedComponent, trackPageHandler, true)
}