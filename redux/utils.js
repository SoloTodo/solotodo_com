import { settings } from '../settings'
import {convertIdToUrl, listToObject} from "../react-utils/utils";
import {filterApiResourceObjectsByType} from "../react-utils/ApiResource";

export function solotodoStateToPropsUtils(state) {
  const user = state.apiResourceObjects[settings.ownUserUrl] || null;
  const countries = filterApiResourceObjectsByType(state.apiResourceObjects, 'countries');
  const stores = filterApiResourceObjectsByType(state.apiResourceObjects, 'stores').filter(store => store.last_activation);
  const categories = filterApiResourceObjectsByType(state.apiResourceObjects, 'categories');
  const currencies = filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies');

  const storesDict = listToObject(stores, 'url');

  const preferredCountryUrl = user ? user.preferred_country : convertIdToUrl(state.preferredCountryId, 'countries');
  const preferredCountry = state.apiResourceObjects[preferredCountryUrl];

  const preferredStoresUrls = user ? user.preferred_stores : state.preferredStoreIds.map(storeId => convertIdToUrl(storeId, 'stores'));
  const preferredStores = preferredStoresUrls.map(storeUrl => storesDict[storeUrl]).filter(store => store);

  const preferredCountryStores = preferredStores.filter(store => store.country === preferredCountry.url);
  const countryStores = stores.filter(store => store.country === preferredCountry.url);

  const numberFormat = state.apiResourceObjects[preferredCountry.number_format];
  const preferredCurrency = state.apiResourceObjects[preferredCountry.currency];

  // TODO Agregar funcion format currency

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
    preferredNumberFormat: numberFormat
  };
}