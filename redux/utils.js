import { settings } from '../settings'
import {formatCurrency} from "../react-utils/next_utils";

import {convertIdToUrl, listToObject} from "../react-utils/utils";
import {filterApiResourceObjectsByType} from "../react-utils/ApiResource";

export function solotodoStateToPropsUtils(state) {
  const user = state.apiResourceObjects[settings.ownUserUrl] || null;
  const countries = filterApiResourceObjectsByType(state.apiResourceObjects, 'countries');
  const allStores = filterApiResourceObjectsByType(state.apiResourceObjects, 'stores')
  // Only consider active stores
  const stores = allStores.filter(store => store.last_activation);
  const categories = filterApiResourceObjectsByType(state.apiResourceObjects, 'categories');
  const currencies = filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies');

  const storesDict = listToObject(stores, 'url');

  const country = state.apiResourceObjects[settings.defaultCountryUrl];
  const preferredStoresUrls = user ? user.preferred_stores : state.preferredStoreIds.map(storeId => convertIdToUrl(storeId, 'stores'));
  const preferredStores = preferredStoresUrls.map(storeUrl => storesDict[storeUrl]).filter(store => store);

  const preferredCountryStores = preferredStores.filter(store => store.country === country.url && !settings.storeBlacklist.includes(store.id));
  const countryStores = stores.filter(store => store.country === country.url && !settings.storeBlacklist.includes(store.id));

  const numberFormat = state.apiResourceObjects[country.number_format];
  const preferredCurrency = state.apiResourceObjects[country.currency];

  const preferredExcludeRefurbished = Boolean(user ? user.preferred_exclude_refurbished : state.preferredExcludeRefurbished);

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
    allStores,
    stores,
    preferredCountry: country,
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