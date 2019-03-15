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
import ApiFormPriceRangeField from "../../react-utils/api_forms/ApiFormPriceRangeField";
import ApiFormTextField from "../../react-utils/api_forms/ApiFormTextField";
import ApiFormChoiceField from "../../react-utils/api_forms/ApiFormChoiceField";
import ApiFormDiscreteRangeField from "../../react-utils/api_forms/ApiFormDiscreteRangeField";
import ApiForm from "../../react-utils/api_forms/ApiForm";
import ApiFormContinuousRangeField from "../../react-utils/api_forms/ApiFormContinouousRangeField";
import CategoryBrowseResults from "../../components/Category/CategoryBrowseResults";
import ApiFormPaginationField from "../../react-utils/api_forms/ApiFormPaginationField";
import {formatCurrency} from "../../react-utils/utils";
import {settings} from '../../settings'

import CategoryResultCount from "./CategoryBrowseResultCount";


class CategoryBrowse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formLayout: undefined,
      apiFormFieldChangeHandler: undefined,
      formValues: {},
      productsPage: undefined,
      resultsAggs: {},
      priceRange: undefined,
      isMobileMenuOpen: false
    }
  }

  setApiFormFieldChangeHandler = apiFormFieldChangeHandler => {
    this.setState({
      apiFormFieldChangeHandler
    })
  };

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

  apiEndpoint = () => {
    const category = this.props.category;
    const categoryBrowseParams = this.props.categoryBrowseParams;

    let endpoint = `categories/${category.id}/browse/?page_size=${this.props.resultsPerPage}`;

    if (this.props.categoryBrowseParams.apiEndpointSuffix) {
      endpoint += '&' + this.props.categoryBrowseParams.apiEndpointSuffix
    }

    if (categoryBrowseParams.bucketField) {
      endpoint += '&bucket_field=' + categoryBrowseParams.bucketField
    }

    for (const store of this.props.stores) {
      endpoint += '&stores=' + store.id
    }

    return endpoint;
  };

  componentDidMount() {
    const category = this.props.category;

    this.props.setTitle(category.name);

    const country = this.props.country;

    // Obtain layout of the form fields
    fetchJson(settings.apiResourceEndpoints.category_specs_form_layouts + '?category=' + category.id + '&website=' + this.props.websiteId)
        .then(all_form_layouts => {
          const processed_form_layouts = all_form_layouts
              .map(layout => {
                let priority = 0;
                if (layout.website === this.props.ownWebsiteUrl) {
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

          const formLayout = processed_form_layouts[0] || null;

          if (!formLayout) {
            toast.warn('No hay formulario de búsqueda definido para esta categoría');
          } else {
            formLayout.fieldsets = formLayout.fieldsets.map((fieldset, idx) => ({
              id: fieldset.id,
              label: fieldset.label,
              expanded: idx === 0 ? true : undefined,
              filters: fieldset.filters.filter(filter =>
                  !filter.country || filter.country === country.url
              )
            }))
          }

          this.setState({
            formLayout: formLayout,
          })
        });

    const endpoint = this.apiEndpoint();

    // Make an empty call to the endpoint to obtain the global min / max and 80th percentile values
    fetchJson(endpoint)
        .then(json => {
          this.setState({
            priceRange: {
              min: Math.floor(parseFloat(json.price_ranges.normal_price_usd.min)),
              max: Math.ceil(parseFloat(json.price_ranges.normal_price_usd.max)),
              p80th: Math.floor(parseFloat(json.price_ranges.normal_price_usd['80th']))
            }
          });
        });
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
    const numberFormat = country.numberFormat;
    const usdCurrency = this.props.currencies.filter(currency => currency.id === settings.usdCurrencyId)[0];
    const conversionCurrency = this.props.currencies.filter(currency => currency.url === country.currencyUrl)[0];
    const categoryBrowseParams = this.props.categoryBrowseParams;

    const formLayout = this.state.formLayout;
    const Loading = this.props.loading;

    if (typeof(formLayout) === 'undefined') {
      return <Loading />
    }

    if (formLayout === null) {
      return <Redirect to="/" />
    }

    const products = this.state.productsPage || null;

    const resultsAggs = this.state.resultsAggs;

    const apiFormFields = ['ordering', 'offer_price_usd', 'search', 'page'];
    const processedFormLayout = [
      {
        id: 'offer_price_usd',
        label: 'Precio',
        expanded: true,
        filters: [{
          name: 'offer_price_usd',
          component: <div className="pl-2 pr-2">
            <ApiFormPriceRangeField
                key="offer_price_usd"
                name="offer_price_usd"
                onChange={this.state.apiFormFieldChangeHandler}
                min={this.state.priceRange && this.state.priceRange.min}
                max={this.state.priceRange && this.state.priceRange.max}
                p80th={this.state.priceRange && this.state.priceRange.p80th}
                currency={usdCurrency}
                conversionCurrency={conversionCurrency}
                numberFormat={numberFormat}
            />
          </div>
        }]
      },
      {
        id: 'keywords',
        label: 'Palabras clave',
        expanded: true,
        filters: [{
          name: 'search',
          component: <ApiFormTextField
              key="search"
              name="search"
              placeholder="Palabras clave"
              onChange={this.state.apiFormFieldChangeHandler}
              debounceTimeout={this.props.isExtraSmall ? 3000 : 1500}
          />
        }]
      }
    ];

    for (const fieldset of formLayout.fieldsets) {
      let fieldsetExpanded = false;

      const fieldSetFilters = [];
      for (const filter of fieldset.filters) {
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
        const rawFilterAggs = resultsAggs[filter.name];

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

        let filterComponent = null;

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

          filterComponent = <ApiFormChoiceField
              key={filter.id}
              name={filter.name}
              choices={filterChoices}
              placeholder={filter.label}
              searchable={!this.props.isExtraSmall}
              onChange={this.state.apiFormFieldChangeHandler}
              multiple={Boolean(filter.choices)}
          />
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

          filterComponent = <ApiFormChoiceField
              key={filter.id}
              name={filter.name}
              apiField={filter.name + '_1'}
              urlField={filter.name + '_end'}
              choices={filterChoices}
              placeholder={filter.label}
              searchable={!this.props.isExtraSmall}
              onChange={this.state.apiFormFieldChangeHandler}
          />
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

          filterComponent = <ApiFormChoiceField
              key={filter.id}
              name={filter.name}
              apiField={filter.name + '_0'}
              urlField={filter.name + '_start'}
              choices={filterChoices}
              placeholder={filter.label}
              searchable={!this.props.isExtraSmall}
              onChange={this.state.apiFormFieldChangeHandler}
          />
        } else if (filter.type === 'range') {
          if (filter.continuous_range_step) {
            // Continous (weight....)
            if (value && (value.startValue || value.endValue)) {
              fieldsetExpanded = true
            }

            filterComponent = <div className="pl-2 pr-2">
              <ApiFormContinuousRangeField
                  key={filter.id}
                  name={filter.name}
                  label={filter.label}
                  onChange={this.state.apiFormFieldChangeHandler}
                  choices={rawFilterAggs}
                  step={filter.continuous_range_step}
                  unit={filter.continuous_range_unit}
                  resultCountSuffix="resultados"
              />
            </div>
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

            filterComponent = <div className="pl-2 pr-2">
              <ApiFormDiscreteRangeField
                  key={filter.id}
                  name={filter.name}
                  label={filter.label}
                  onChange={this.state.apiFormFieldChangeHandler}
                  choices={filterChoices}
                  resultCountSuffix="resultados"
              />
            </div>
          }
        }

        fieldSetFilters.push({
          ...filter,
          component: filterComponent,
        })
      }

      processedFormLayout.push({
        id: fieldset.id,
        label: fieldset.label,
        expanded: fieldset.expanded || fieldsetExpanded,
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

    const endpoint = this.apiEndpoint();

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

    const orderingComponent = <ApiFormChoiceField
        key="ordering"
        name="ordering"
        id="ordering"
        searchable={false}
        choices={orderingChoices}
        onChange={this.state.apiFormFieldChangeHandler}
        required={true}
    />;

    const priceFormatter = (value, currency) => {
      return formatCurrency(value, currency, country.currency, numberFormat.thousandsSeparator, numberFormat.decimalSeparator)
    };

    const topBanner = this.props.topBanner || null;

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

            <ApiForm
                endpoints={[endpoint]}
                fields={apiFormFields}
                onResultsChange={this.setProductsPage}
                onFormValueChange={this.handleFormValueChange}
                setFieldChangeHandler={this.setApiFormFieldChangeHandler}
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
                            resultsPerPage={this.props.resultsPerPage}/>
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
                        websiteId={this.props.websiteId}
                    /> : <Loading type="light" />}

                    <div className="d-flex category-browse-pagination justify-content-around mt-2 mb-3">
                      <ApiFormPaginationField
                          pageSize={{id: this.props.resultsPerPage}}
                          resultCount={this.state.productsPage && this.state.productsPage.count}
                          onChange={this.state.apiFormFieldChangeHandler}
                          previousLabel={this.props.isExtraSmall ? 'Ant' : 'Anterior'}
                          nextLabel={this.props.isExtraSmall ? 'Sig' : 'Siguiente'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ApiForm>
          </div>
        </div>
    )
  }
}

function mapStateToProps(state) {
  const {ApiResourceObject} = apiResourceStateToPropsUtils(state);

  return {
    ApiResourceObject,
    currencies: filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies'),
    isExtraSmall: state.browser.is.extraSmall
  }
}

export default connect(mapStateToProps)(CategoryBrowse);