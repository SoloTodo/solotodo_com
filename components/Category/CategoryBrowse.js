import React from 'react'
import {connect} from "react-redux";
import {toast} from 'react-toastify';
import { Accordion, AccordionItem } from 'react-sanfona';
import Menu from 'react-burger-menu/lib/menus/slide'

import {fetchJson} from "../../react-utils/utils";
import {
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";
import ApiFormDiscreteRangeField from "../../react-utils/api_forms/ApiFormDiscreteRangeField";
import ApiFormNext from "../../react-utils/api_forms/ApiFormNext";
import ApiFormContinuousRangeField from "../../react-utils/api_forms/ApiFormContinouousRangeField";
import CategoryBrowseResults from "../../components/Category/CategoryBrowseResults";
import {formatCurrency} from "../../react-utils/utils";
import {settings} from '../../settings'

import CategoryResultCount from "./CategoryBrowseResultCount";
import Loading from "../Loading";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import TopBanner from "../TopBanner";
import {
  ApiFormPriceRangeFieldNext,
  ApiFormTextFieldNext,
  ApiFormChoiceFieldNext,
  ApiFormPaginationFieldNext
} from "../../react-utils/api_forms/ApiFormFieldsNext";

const getFormLayout = async (category, country) => {
  // Obtain layout of the form fields
  const all_form_layouts = await fetchJson(settings.apiResourceEndpoints.category_specs_form_layouts + '?category=' + category.id + '&website=' + settings.websiteId);
  const processed_form_layouts = all_form_layouts
    .map(layout => {
      let priority = 0;
      if (layout.website === settings.ownWebsiteUrl) {
        priority = 2
      } else if (layout.website === null) {
        priority = 1
      }
      return {
        ...layout,
        priority
      }
    });

  processed_form_layouts.sort((a, b) => b.priority - a.priority);

  return processed_form_layouts[0] || null;
};

const processFormLayout = (formLayout, priceRange, usdCurrency, conversionCurrency, numberFormat) => {
  formLayout.fieldsets = formLayout.fieldsets.map((fieldset, idx) => ({
    id: fieldset.id,
    label: fieldset.label,
    expanded: idx === 0 ? true : undefined,
    filters: fieldset.filters.filter(filter =>
      !filter.country || filter.country === country.url
    )
  }));

  const filtersLayout = [
    {
      id: 'offer_price_usd',
      label: 'Precio',
      expanded: true,
      filters: [{
        name: 'offer_price_usd',
        component: ApiFormPriceRangeFieldNext,
        props: {
          key: "offer_price_usd",
          name: "offer_price_usd",
          min: priceRange.min,
          max: priceRange.max,
          p80th: priceRange.p80th,
          currency: usdCurrency,
          conversionCurrency: conversionCurrency,
          numberFormat: numberFormat,
        },
        renderer: node => <div className="pl-2 pr-2">
          {node}
        </div>
      }]
    },
    {
      id: 'keywords',
      label: 'Palabras clave',
      expanded: true,
      filters: [{
        name: 'search',
        component: ApiFormTextFieldNext,
        props: {
          key: "search",
          name: "search",
          placeholder: "Palabras clave",
          debounceTimeout: 3000
          // debounceTimeout: isExtraSmall ? 3000 : 1500
        }
      }]
    }
  ];

  for (const fieldset of formLayout.fieldsets) {
    const fieldSetFilters = [];
    for (const filter of fieldset.filters) {
      const filterChoiceIdToNameDict = {};
      let originalFilterChoices = undefined;

      if (filter.type === 'exact') {
        originalFilterChoices = filter.choices || [{id: 0, name: 'No'}, {id: 1, name: 'Sí'}]
      } else {
        originalFilterChoices = filter.choices || []
      }

      for (const choice of originalFilterChoices) {
        filterChoiceIdToNameDict[choice.id] = choice.name;
      }

      let filterComponent = null;

      if (filter.type === 'exact') {
        filterComponent = {
          component: ApiFormChoiceFieldNext,
          props: {
            key: filter.id,
            name: filter.name,
            choices: originalFilterChoices,
            placeholder: filter.label,
            multiple: Boolean(filter.choices)
          }
        };
      } else if (filter.type === 'lte') {
        filterComponent = {
          component: ApiFormChoiceFieldNext,
          props: {
            key: filter.id,
            name: filter.name,
            apiField: filter.name + '_1',
            urlField: filter.name + '_end',
            choices: originalFilterChoices,
            placeholder: filter.label,
          }
        }
      } else if (filter.type === 'gte') {
        filterComponent = {
          component: ApiFormChoiceFieldNext,
          props: {
            key: filter.id,
            name: filter.name,
            apiField: filter.name + '_0',
            urlField: filter.name + '_start',
            choices: originalFilterChoices,
            placeholder: filter.label,
          }
        };
      } else if (filter.type === 'range') {
        if (filter.continuous_range_step) {
          // Continous (weight....)
          filterComponent = {
            component: ApiFormContinuousRangeField,
            props: {
              key: filter.id,
              name: filter.name,
              label: filter.label,
              choices: rawFilterAggs,
              step: filter.continuous_range_step,
              unit: filter.continuous_range_unit,
              resultCountSuffix: "resultados"
            },
            renderer: node => <div className="pl-2 pr-2">{node}</div>
          };
        } else {
          // Discrete (screen size...)

          const filterChoices = originalFilterChoices.map(choice => ({
            ...choice,
            label: choice.name,
            value: parseFloat(choice.value)
          }));

          filterComponent = {
            component: ApiFormDiscreteRangeField,
            props: {
              key: filter.id,
              name: filter.name,
              label: filter.label,
              choices: filterChoices,
              resultCountSuffix: "resultados"
            },
            renderer: node => <div className="pl-2 pr-2">{node}</div>
          }
        }
      }

      fieldSetFilters.push({
        ...filter,
        component: filterComponent,
      })
    }

    filtersLayout.push({
      id: fieldset.id,
      label: fieldset.label,
      filters: fieldSetFilters
    })
  }

  const orderingChoices = [
    {
      id: 'offer_price_usd',
      name: 'Precio'
    },
    {
      id: 'leads',
      name: 'Popularidad'
    }
  ];

  for (const orderingChoice of formLayout.orders) {
    const use = orderingChoice.suggested_use;

    if (use === 'ascending') {
      orderingChoices.push({
        id: orderingChoice.name,
        name: orderingChoice.label
      })
    }

    if (use === 'descending') {
      orderingChoices.push({
        id: '-' + orderingChoice.name,
        name: orderingChoice.label
      })
    }

    if (use === 'both') {
      orderingChoices.push({
        id: orderingChoice.name,
        name: `${orderingChoice.label} (asc.)`
      });

      orderingChoices.push({
        id: '-' + orderingChoice.name,
        name: `${orderingChoice.label} (desc.)`
      })
    }
  }

  const orderingComponent = {
    component: ApiFormChoiceFieldNext,
    props: {
      key: "ordering",
      name: "ordering",
      id: "ordering",
      choices: orderingChoices,
      required: true
    }
  };

  return {
    filtersLayout: filtersLayout,
    ordering: orderingComponent
  };
};

const getGlobalFieldRanges = async (category, stores) => {
  // Make an empty call to the endpoint to obtain the global min / max and 80th percentile values
  const endpoint = CategoryBrowse.apiEndpoint(category, stores);

  const json = await fetchJson(endpoint);
  return {
    min: Math.floor(parseFloat(json.price_ranges.normal_price_usd.min)),
    max: Math.ceil(parseFloat(json.price_ranges.normal_price_usd.max)),
    p80th: Math.floor(parseFloat(json.price_ranges.normal_price_usd['80th']))
  };
};


class CategoryBrowse extends React.Component {
  static async getInitialProps(category, reduxState) {
    const {preferredCountry, preferredCountryStores, currencies, preferredNumberFormat} = solotodoStateToPropsUtils(reduxState);

    const promises = [
      getFormLayout(category, preferredCountry),
      getGlobalFieldRanges(category, preferredCountryStores)
    ];

    const results = await Promise.all(promises);

    const rawFormLayout = results[0];
    const priceRange = results[1];

    const usdCurrency = currencies.filter(currency => currency.id === settings.usdCurrencyId)[0];
    const conversionCurrency = currencies.filter(currency => currency.url === preferredCountry.currencyUrl)[0];

    const formLayout = processFormLayout(rawFormLayout, priceRange, usdCurrency, conversionCurrency, preferredNumberFormat);

    return {
      formLayout: formLayout,
      priceRange: priceRange
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      formLayout: props.formLayout,
      formValues: {},
      productsPage: undefined,
      resultsAggs: {},
      priceRange: props.priceRange,
      isMobileMenuOpen: false
    }
  }

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };

  toggleMobileMenu = evt => {
    evt.preventDefault();
    this.setState({
      isMobileMenuOpen: true
    })
  };

  handleMenuStateChange = state => {
    this.setState({
      isMobileMenuOpen: state.isOpen
    })
  };

  setProductsPage = json => {
    if (json) {
      this.setState({
        productsPage: {
          count: json.payload.count,
          results: json.payload.results
        },
        resultsAggs: json.payload.aggs,
        isMobileMenuOpen: false
      })
    } else {
      // Only reset the actual results to keep the old filter aggregations
      this.setState({
        productsPage: null,
        isMobileMenuOpen: false
      })
    }
  };

  static apiEndpoint = (category, stores) => {
    const categoryBrowseParams = settings.categoryBrowseParameters;

    let endpoint = `categories/${category.id}/browse/?page_size=${settings.categoryBrowseResultsPerPage}`;

    if (categoryBrowseParams.bucketField) {
      endpoint += '&bucket_field=' + categoryBrowseParams.bucketField
    }

    for (const store of stores) {
      endpoint += '&stores=' + store.id
    }

    return endpoint;
  };

  componentDidMount() {
    const category = this.props.category;
    const country = this.props.country;


  }

  handleFieldsetChange = (fieldset, expanded) => {
    const newFieldsets = this.state.formLayout.fieldsets.map(stateFieldset => {
      const newExpanded = stateFieldset.id === fieldset.id ? expanded : stateFieldset.expanded;

      return {
        ...stateFieldset,
        expanded: newExpanded
      }
    });

    this.setState({
      formLayout: {
        ...this.state.formLayout,
        fieldsets: newFieldsets
      }
    })
  };

  render() {
    const country = this.props.ApiResourceObject(this.props.country);
    const categoryBrowseParams = settings.categoryBrowseParameters;

    const formLayout = this.state.formLayout;

    // if (formLayout === null) {
    //   return <Redirect to="/" />
    // }

    const products = this.state.productsPage || null;
    const apiFormFields = ['ordering', 'offer_price_usd', 'search', 'page'];

    const endpoint = CategoryBrowse.apiEndpoint(this.props.category, this.props.stores);

    const filtersComponent = <Accordion allowMultiple={true}>
      {processedFormLayout.map(fieldset => (
        <AccordionItem
          key={fieldset.id}
          title={fieldset.label}
          expanded={fieldset.expanded}
          titleTag={'legend'}
          onExpand={() => this.handleFieldsetChange(fieldset, true)}
          onClose={() => this.handleFieldsetChange(fieldset, false)}
        >
          {fieldset.filters.map(filter => (
            <div key={filter.name} className="pt-2">
              {filter.component}
            </div>
          ))}
        </AccordionItem>
      ))}
    </Accordion>;

    const priceFormatter = (value, currency) => {
      return formatCurrency(value, currency, country.currency, numberFormat.thousandsSeparator, numberFormat.decimalSeparator)
    };

    const topBanner = <TopBanner category={this.props.category.name} /> || null;

    return (
      <div className="row">
        <div id="page-wrap" className="flex-grow">
          {this.props.isExtraSmall &&
          <Menu pageWrapId="page-wrap"
                outerContainerId="outer-container"
                isOpen={this.state.isMobileMenuOpen}
                onStateChange={(state) => this.handleMenuStateChange(state)}
          >
            <div id="category-browse-filters-mobile">
              {filtersComponent}
            </div>
          </Menu>
          }

          <ApiFormNext
            endpoints={[endpoint]}
            fields={apiFormFields}
            onResultsChange={this.setProductsPage}
            onFormValueChange={this.handleFormValueChange}
            anonymous={true}
          >
            {this.props.isExtraSmall &&
            <div className="pt-2 pb-2" id="mobile-filter-and-ordering">
              <div className="col-12 d-flex justify-content-between">
                <div>
                  <a className="btn" href="." onClick={this.toggleMobileMenu}>
                    <i className="fas fa-filter mr-3">&nbsp;</i>
                    Filtros
                  </a>
                </div>
                <div className="mobile-ordering">
                  {orderingComponent}
                </div>
              </div>
            </div>
            }

            {this.props.isExtraSmall ?
              <div className="mobile-top-banner-container">{topBanner}</div> : topBanner
            }
            <div className="d-flex pt-2 pl-2 pr-2" id="filters-and-results">
              {this.props.isExtraSmall ||
              <div id="category-browse-filters">
                <div className="card">
                  <div
                    className="card-block padded-card-block category-browse">
                    {filtersComponent}
                  </div>
                </div>
              </div>
              }
              <div className="flex-grow" id="category-browse-results-card">
                <div className="card pl-1 pr-1 pt-2">
                  <div className="d-flex justify-content-between align-items-start font-weight-light">
                    <div className="pl-2">
                      <h1 className="mb-0">{this.props.category.name}</h1>
                      <CategoryResultCount
                        resultCount={products && products.count}
                        page={this.state.formValues.page}
                        resultsPerPage={settings.categoryBrowseResultsPerPage}/>
                    </div>

                    {this.props.isExtraSmall ||
                    <div className="d-flex flex-column align-items-end flex-grow category-browse-ordering-container mr-2">
                      <span className="category-browse-result-count mb-1">Ordenar por</span>
                      <div className="flex-grow ml-2">
                        {orderingComponent}
                      </div>
                    </div>
                    }
                  </div>

                  {products ? <CategoryBrowseResults
                    results={products}
                    page={this.state.formValues.page}
                    priceFormatter={priceFormatter}
                    categoryBrowseParams={categoryBrowseParams}
                  /> : <Loading type="light" />}

                  <div className="d-flex category-browse-pagination justify-content-around mt-2 mb-3">
                    <ApiFormPaginationFieldNext
                      pageSize={{id: settings.categoryBrowseResultsPerPage}}
                      resultCount={this.state.productsPage && this.state.productsPage.count}
                      previousLabel={this.props.isExtraSmall ? 'Ant' : 'Anterior'}
                      nextLabel={this.props.isExtraSmall ? 'Sig' : 'Siguiente'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ApiFormNext>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {ApiResourceObject} = apiResourceStateToPropsUtils(state);
  const {preferredCountryStores, preferredCountry} = solotodoStateToPropsUtils(state);

  return {
    ApiResourceObject,
    currencies: filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies'),
    isExtraSmall: state.browser.is.extraSmall,
    stores: preferredCountryStores,
    country: preferredCountry
  }
}

export default connect(mapStateToProps)(CategoryBrowse);