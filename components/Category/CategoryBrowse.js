import React from 'react'
import {connect} from "react-redux";
import { Accordion, AccordionItem } from 'react-sanfona';
import Menu from 'react-burger-menu/lib/menus/slide'
import classNames from 'classnames';

import {
  areObjectListsEqual,
  convertIdToUrl,
  fetchJson
} from "../../react-utils/utils";
import ApiFormNext from "../../react-utils/api_forms/ApiFormNext";
import CategoryBrowseResults from "../../components/Category/CategoryBrowseResults";
import {settings} from '../../settings'

import CategoryResultCount from "./CategoryBrowseResultCount";
import Loading from "../Loading";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import TopBanner from "../TopBanner";
import {
  ApiFormPriceRangeFieldNext,
  ApiFormTextFieldNext,
  ApiFormChoiceFieldNext,
  ApiFormPaginationFieldNext,
  ApiFormDiscreteRangeFieldNext,
  ApiFormContinuousRangeFieldNext, ApiFormTreeFieldNext
} from "../../react-utils/api_forms/ApiFormFieldsNext";
import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";


class CategoryBrowse extends React.Component {
  static async getInitialProps(category, reduxState, asPath) {
    const {preferredCountry, preferredCountryStores, preferredExcludeRefurbished, currencies, preferredNumberFormat, preferredCurrency} = solotodoStateToPropsUtils(reduxState);

    const formLayouts = filterApiResourceObjectsByType(reduxState.apiResourceObjects, 'category_specs_form_layouts');
    const websiteUrl = convertIdToUrl(settings.websiteId, 'websites');

    const promises = [];

    let formLayout = formLayouts.filter(formLayout => formLayout.category === category.url && formLayout.website === websiteUrl)[0];

    if (formLayout) {
      promises.push(formLayout)
    } else {
      promises.push(getFormLayout(category))
    }

    const storeIds = preferredCountryStores.map(store => store.id);
    let priceRange = reduxState.categoryBrowsePriceRanges.filter(
      localPriceRange => localPriceRange.categoryId === category.id &&
        JSON.stringify(localPriceRange.storeIds) === JSON.stringify(storeIds)
    )[0];

    if (priceRange) {
      promises.push(priceRange.priceRange)
    } else {
      promises.push(getGlobalFieldRanges(category, preferredCountryStores, preferredExcludeRefurbished))
    }
    const result = await Promise.all(promises);

    if (!formLayout) {
      formLayout = result[0]
    }

    if (priceRange) {
      priceRange = priceRange.priceRange
    } else {
      priceRange = result[1]
    }

    const usdCurrency = currencies.filter(currency => currency.id === settings.usdCurrencyId)[0];

    const {initialFormData, initialSearchResults} = await this.getInitialFormDataAndSearchResults(
      usdCurrency, preferredCurrency, preferredCountry, formLayout, priceRange, preferredNumberFormat, category, preferredCountryStores, preferredExcludeRefurbished, asPath);

    return {
      category,
      formLayout,
      priceRange,
      initialFormData,
      usdCurrency,
      initialProductsPageState: this.getNewProductsPageState(initialSearchResults[0])
    }
  }

  static getInitialFormDataAndSearchResults(usdCurrency, preferredCurrency, preferredCountry, formLayout, priceRange, preferredNumberFormat, category, preferredCountryStores, preferredExcludeRefurbished, asPath) {
    const processedFormLayout = processFormLayout(formLayout, priceRange, usdCurrency, preferredCurrency, preferredNumberFormat, preferredCountry);
    const endpoint = this.apiEndpoint(category, preferredCountryStores, preferredExcludeRefurbished);
    return ApiFormNext.getInitialProps(processedFormLayout, asPath, [endpoint], fetchJson);
  }

  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      searchResults: props.initialProductsPageState,
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.existingFormLayout) {
      this.props.saveFormLayout(this.props.formLayout);
    }

    if (this.props.initialProductsPageState !== prevProps.initialProductsPageState) {
      this.setState({
        searchResults: this.props.initialProductsPageState
      })
    }

    if (!this.props.existingPriceRange) {
      const storeIds = this.props.stores.map(store => store.id);
      this.props.saveCategoryBrowsePriceRange(this.props.category, storeIds, this.props.priceRange);
    }

    if (!areObjectListsEqual(this.props.stores, prevProps.stores) || this.props.excludeRefurbished !== prevProps.excludeRefurbished) {
      const asPath = `${window.location.pathname}${window.location.search}`;

      CategoryBrowse.getInitialFormDataAndSearchResults(
        this.props.usdCurrency,
        this.props.preferredCurrency,
        this.props.preferredCountry,
        this.props.formLayout,
        this.props.priceRange,
        this.props.numberFormat,
        this.props.category,
        this.props.stores,
        this.props.excludeRefurbished,
        asPath)
        .then(({initialFormData, initialSearchResults}) => {
          this.setState({
            searchResults: CategoryBrowse.getNewProductsPageState(initialSearchResults[0])
          })
        });
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      formLayout: props.formLayout
    };
  }

  handleFormValueChange = formValues => {
    this.setState({
      formValues,
      isMobileMenuOpen: false
    })
  };

  toggleMobileMenu = evt => {
    evt.preventDefault();
    this.setState({
      isMobileMenuOpen: !this.state.isMobileMenuOpen
    })
  };

  handleMenuStateChange = state => {
    this.setState({
      isMobileMenuOpen: state.isOpen
    })
  };

  static getNewProductsPageState(json) {
    if (json) {
      return {
        productsPage: {
          count: json.count,
          results: json.results
        },
        resultsAggs: json.aggs
      }
    } else {
      // Only reset the actual results to keep the old filter aggregations
      return {
        productsPage: null,
      }
    }
  }

  setProductsPage = json => {
    const productsPageStateChanges = CategoryBrowse.getNewProductsPageState(json && json.payload);
    this.setState({
      ...productsPageStateChanges,
      isMobileMenuOpen: false
    });
  };

  static apiEndpoint = (category, stores, excludeRefurbished) => {
    const categoryBrowseParams = settings.categoryBrowseParameters[category.id] || {};

    let endpoint = `categories/${category.id}/browse/?exclude_refurbished=${excludeRefurbished}&page_size=${settings.categoryBrowseResultsPerPage}`;

    if (categoryBrowseParams.bucketField) {
      endpoint += '&bucket_field=' + categoryBrowseParams.bucketField
    }

    for (const store of stores) {
      endpoint += '&stores=' + store.id
    }

    return endpoint;
  };

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
    const {formLayout, searchResults} = this.state;
    const {numberFormat, priceRange, usdCurrency, category, stores, initialFormData, isExtraSmall, preferredCountry, excludeRefurbished, preferredCurrency} = this.props;
    const categoryBrowseParams = settings.categoryBrowseParameters[category.id];

    const {filtersLayout, ordering, pagination} = processFormLayout(formLayout, priceRange, usdCurrency, preferredCurrency, numberFormat, preferredCountry);
    const apiFormFields = ['ordering', 'page'];

    for (const fieldset of filtersLayout) {
      let fieldsetExpanded = false;

      for (const filter of fieldset.filters) {
        filter.props.initialValue = initialFormData[filter.props.name].fieldValues;
        filter.props.searchable = !isExtraSmall;

        apiFormFields.push(filter.name);

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

        const filterDocCountsDict = {};

        let filterAggs = [];
        const rawFilterAggs = searchResults.resultsAggs[filter.name];

        if (rawFilterAggs) {
          for (const filterDocCount of rawFilterAggs) {
            filterDocCountsDict[filterDocCount.id] = filterDocCount.doc_count
          }

          for (const choice of originalFilterChoices) {
            const choiceDocCount = filterDocCountsDict[choice.id];

            if (!choiceDocCount) {
              continue
            }

            filterAggs.push({
              ...choice,
              doc_count: choiceDocCount
            })
          }
        } else {
          filterAggs = originalFilterChoices
        }

        const value = this.state.formValues[filter.name];

        if (filter.type === 'exact') {
          let arrayValue = [];
          if (Array.isArray(value)) {
            arrayValue = value
          } else if (value) {
            arrayValue = [value]
          } else {
            arrayValue = null
          }

          let filterChoices = undefined;

          if (arrayValue && arrayValue.length) {
            fieldsetExpanded = true
          }

          if (filterAggs) {
            filterChoices = filterAggs.map(choice => ({
              ...choice,
              name: filterChoiceIdToNameDict[choice.id],
            }));

            if (arrayValue) {
              for (const selectedValue of arrayValue) {
                let valueInChoices = Boolean(filterChoices.filter(choice => choice.id.toString() === selectedValue.id.toString()).length);
                if (!valueInChoices) {
                  filterChoices.push({
                    ...selectedValue,
                    doc_count: 0
                  })
                }
              }
            }
          } else {
            filterChoices = originalFilterChoices
          }

          filter.props['choices'] = filterChoices;
        } else if (filter.type === 'lte') {
          let filterChoices = undefined;

          if (value) {
            fieldsetExpanded = true
          }

          if (filterAggs) {
            let ongoingResultCount = 0;

            filterChoices = filterAggs.map(choice => {
              ongoingResultCount += choice.doc_count;

              return {
                ...choice,
                name: `${filterChoiceIdToNameDict[choice.id]}`,
                doc_count: ongoingResultCount
              };
            });
          } else {
            filterChoices = originalFilterChoices
          }

          filter.props['choices'] = filterChoices;
        } else if (filter.type === 'gte') {
          let filterChoices = undefined;

          if (value) {
            fieldsetExpanded = true
          }

          if (filterAggs) {
            let totalResultCount = filterAggs.reduce((acum, elem) => acum + elem.doc_count, 0);

            filterChoices = filterAggs.map(choice => {
              let result = {
                ...choice,
                name: `${filterChoiceIdToNameDict[choice.id]}`,
                doc_count: totalResultCount
              };

              totalResultCount -= choice.doc_count;

              return result
            });
          } else {
            filterChoices = originalFilterChoices
          }

          filter.props['choices'] = filterChoices;
        } else if (filter.type === 'range') {
          if (filter.continuous_range_step) {
            // Continous (weight....)
            if (value && (value.startValue || value.endValue)) {
              fieldsetExpanded = true
            }

            filter.props['choices'] = rawFilterAggs;
          } else {
            // Discrete (screen size...)
            let filterChoices = undefined;

            if (value && (value.startId || value.endId)) {
              fieldsetExpanded = true
            }

            if (filterAggs) {
              filterChoices = filterAggs.map(choice => ({
                ...choice,
                label: `${filterChoiceIdToNameDict[choice.id]}`,
              }));
            } else {
              filterChoices = originalFilterChoices.map(choice => ({
                ...choice,
                label: choice.name,
                value: parseFloat(choice.value)
              }))
            }

            filter.props['choices'] = filterChoices
          }
        }
      }

      fieldset.expanded = fieldset.expanded || fieldsetExpanded
    }

    ordering.props.initialValue = initialFormData['ordering'].fieldValues;

    const products = searchResults.productsPage;
    const endpoint = CategoryBrowse.apiEndpoint(category, stores, excludeRefurbished);

    const filtersComponent = <Accordion allowMultiple={true}>
      {filtersLayout.map(fieldset => (
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
              <filter.component {...filter.props}/>
            </div>
          ))}
        </AccordionItem>
      ))}
    </Accordion>;

    const topBanner = <TopBanner category={category.name} /> || null;

    return (
      <div className="row">
        <ApiFormNext
          endpoints={[endpoint]}
          fields={apiFormFields}
          onResultsChange={this.setProductsPage}
          onFormValueChange={this.handleFormValueChange}
          anonymous={true}
          initialFormData={initialFormData}
          onPushUrl={() => {window.scrollTo(0, 0)}}
        >
          {isExtraSmall &&
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
          <div id="page-wrap" className={classNames('flex-grow', 'w-100', {'mobile-top-banner-container': isExtraSmall})}>
            {isExtraSmall &&
            <div className="pt-2 pb-2" id="mobile-filter-and-ordering">
              <div className="col-12 d-flex justify-content-between">
                <div>
                  <a className="btn" href="." onClick={this.toggleMobileMenu}>
                    <i className="fas fa-filter mr-3">&nbsp;</i>
                    Filtros
                  </a>
                </div>
                <div className="mobile-ordering">
                  <ordering.component {...ordering.props} />
                </div>
              </div>
            </div>
            }

            {topBanner}

            <div className="d-flex pt-2 pl-2 pr-2" id="filters-and-results">
              {isExtraSmall ||
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
                      <h1 className="mb-0">{category.name}</h1>
                      <CategoryResultCount
                        resultCount={products && products.count}
                        page={this.state.formValues.page || initialFormData.page.fieldValues}
                        resultsPerPage={settings.categoryBrowseResultsPerPage}/>
                    </div>

                    {isExtraSmall ||
                    <div className="d-flex flex-column align-items-end flex-grow category-browse-ordering-container mr-2">
                      <span className="category-browse-result-count mb-1">Ordenar por</span>
                      <div className="flex-grow ml-2">
                        <ordering.component {...ordering.props} />
                      </div>
                    </div>
                    }
                  </div>

                  {products ? <CategoryBrowseResults
                    results={products}
                    page={this.state.formValues.page}
                    priceFormatter={this.props.formatCurrency}
                    categoryBrowseParams={categoryBrowseParams}
                  /> : <Loading type="light" />}

                  <div className="d-flex category-browse-pagination justify-content-around mt-2 mb-3">
                    <pagination.component
                      {...pagination.props}
                      initialValue={initialFormData['page'].fieldValues}
                      resultCount={this.state.searchResults.productsPage && this.state.searchResults.productsPage.count}
                      previousLabel={isExtraSmall ? 'Ant' : 'Anterior'}
                      nextLabel={isExtraSmall ? 'Sig' : 'Siguiente'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ApiFormNext>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const {preferredCountry, preferredCountryStores, preferredNumberFormat, preferredExcludeRefurbished, preferredCurrency, formatCurrency} = solotodoStateToPropsUtils(state);

  const formLayouts = filterApiResourceObjectsByType(state.apiResourceObjects, 'category_specs_form_layouts');
  const websiteUrl = convertIdToUrl(settings.websiteId, 'websites');
  const existingFormLayout = formLayouts.filter(formLayout => formLayout.category === ownProps.category.url && formLayout.website === websiteUrl)[0];

  const storeIds = preferredCountryStores.map(store => store.id);
  const existingPriceRange = state.categoryBrowsePriceRanges.filter(
    localPriceRange => localPriceRange.categoryId === ownProps.category.id &&
      JSON.stringify(localPriceRange.storeIds) === JSON.stringify(storeIds)
  )[0];

  return {
    preferredCountry,
    excludeRefurbished: preferredExcludeRefurbished,
    isExtraSmall: state.browser.is.extraSmall,
    stores: preferredCountryStores,
    numberFormat: preferredNumberFormat,
    preferredCurrency,
    formatCurrency,
    existingFormLayout,
    existingPriceRange
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveFormLayout: formLayout => {
      return dispatch({
        type: 'updateApiResourceObject',
        apiResourceObject: formLayout
      })
    },
    saveCategoryBrowsePriceRange: (category, storeIds, priceRange) => {
      return dispatch({
        type: 'addCategoryBrowsePriceRange',
        categoryId: category.id,
        storeIds: storeIds,
        priceRange: priceRange,
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryBrowse);

const getFormLayout = async (category) => {
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

const processFormLayout = (formLayout, priceRange, usdCurrency, conversionCurrency, numberFormat, country) => {
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

      if (filter.name === 'grocery_categories') {
        filterComponent = {
          component: ApiFormTreeFieldNext,
          props: {
            key: filter.id,
            name: filter.name,
            choices: originalFilterChoices,
            placeholder: filter.label,
            multiple: Boolean(filter.choices)
          }
        };
      } else if (filter.type === 'exact') {
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
            apiField: filter.name + '_max',
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
            apiField: filter.name + '_min',
            urlField: filter.name + '_start',
            choices: originalFilterChoices,
            placeholder: filter.label,
          }
        };
      } else if (filter.type === 'range') {
        if (filter.continuous_range_step) {
          // Continous (weight....)
          filterComponent = {
            component: ApiFormContinuousRangeFieldNext,
            props: {
              key: filter.id,
              name: filter.name,
              label: filter.label,
              choices: originalFilterChoices,
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
            component: ApiFormDiscreteRangeFieldNext,
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
        ...filterComponent,
      })
    }

    filtersLayout.push({
      ...fieldset,
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
    },
    {
      id: 'discount',
      name: 'Descuento'
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
      required: true,
      searchable: false
    }
  };

  const paginationComponent = {
    component: ApiFormPaginationFieldNext,
    props: {
      pageSize: {id: settings.categoryBrowseResultsPerPage},
    }
  };

  return {
    filtersLayout: filtersLayout,
    ordering: orderingComponent,
    pagination: paginationComponent
  };
};

const getGlobalFieldRanges = async (category, stores, excludeRefurbished) => {
  // Make an empty call to the endpoint to obtain the global min / max and 80th percentile values
  const endpoint = CategoryBrowse.apiEndpoint(category, stores, excludeRefurbished);

  const json = await fetchJson(endpoint);

  if (!json.price_ranges) {
    return {
      min: null,
      max: null,
      p80th: null
    };
  }

  return {
    min: Math.floor(parseFloat(json.price_ranges.normal_price_usd.min)),
    max: Math.ceil(parseFloat(json.price_ranges.normal_price_usd.max)),
    p80th: Math.floor(parseFloat(json.price_ranges.normal_price_usd['80th']))
  };
};