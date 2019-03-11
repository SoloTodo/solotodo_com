import { settings } from './settings'
import {convertIdToObjectUrl, listToObject} from "./react-utils/utils";
import {filterApiResourceObjectsByType} from "./react-utils/ApiResource";

export function solotodoStateToPropsUtils(state, ownProps) {
  const user = state.apiResourceObjects[settings.ownUserUrl] || null;
  const countries = filterApiResourceObjectsByType(state.apiResourceObjects, 'countries');
  const stores = filterApiResourceObjectsByType(state.apiResourceObjects, 'stores').filter(store => store.last_activation);
  const categories = filterApiResourceObjectsByType(state.apiResourceObjects, 'categories');
  const currencies = filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies');

  const storesDict = listToObject(stores, 'url');

  const preferredCountryUrl = user ? user.preferred_country : convertIdToObjectUrl(state.preferredCountry, 'countries');
  const preferredCountry = state.apiResourceObjects[preferredCountryUrl];

  const preferredStoresUrls = user ? user.preferred_stores : state.preferredStores.map(storeId => `${settings.apiResourceEndpoints.stores}${storeId}/`);
  console.log(preferredStoresUrls);
  const preferredStores = preferredStoresUrls.map(storeUrl => storesDict[storeUrl]).filter(store => store);

  const preferredCountryStores = preferredStores.filter(store => store.country === preferredCountry.url);
  const countryStores = stores.filter(store => store.country === preferredCountry.url);

  const numberFormat = state.apiResourceObjects[preferredCountry.number_format];
  const preferredCurrency = state.apiResourceObjects[preferredCountry.currency];

  return {
    user,
    countries,
    categories,
    currencies,
    stores,
    preferredCountry,
    preferredStores,
    preferredCountryStores,
    countryStores,
    preferredCurrency,
    numberFormat,
  };
}