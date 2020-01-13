import { settings } from '../settings'
import {formatCurrency} from "../react-utils/next_utils";

import {convertIdToUrl, listToObject} from "../react-utils/utils";
import {filterApiResourceObjectsByType} from "../react-utils/ApiResource";

export function solotodoStateToPropsUtils(state) {
  const user = state.apiResourceObjects[settings.ownUserUrl] || null;
  const countries = filterApiResourceObjectsByType(state.apiResourceObjects, 'countries');
  // Only consider active stores. Also manually exclude "Travel Tienda" store as it is exclusive to clients of Banco de Chile
  const stores = filterApiResourceObjectsByType(state.apiResourceObjects, 'stores').filter(store => store.last_activation && store.id !== 231);
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

  const preferredExcludeRefurbished = Boolean(user ? user.preferred_exclude_refurbished : state.preferredExcludeRefurbished);

  console.log(preferredCurrency);

  const _formatCurrency = (value, valueCurrency) => {
    if (!valueCurrency) {
      valueCurrency = preferredCurrency;
    }
    return formatCurrency(value, valueCurrency, preferredCurrency, numberFormat.thousands_separator, numberFormat.decimal_separator)
  };

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
    preferredExcludeRefurbished,
    formatCurrency: _formatCurrency,
    preferredNumberFormat: numberFormat,
  };
}