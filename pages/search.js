import React from 'react'
import {connect} from "react-redux";
import {withRouter} from "next/router";
import TopBanner from "../components/TopBanner";
import Head from "next/head";

import {solotodoStateToPropsUtils} from "../redux/utils";
import {settings} from "../settings";

import ApiFormNext from "../react-utils/api_forms/ApiFormNext";
import {ApiFormTextFieldNext, ApiFormPaginationFieldNext, ApiFormChoiceFieldNext} from "../react-utils/api_forms/ApiFormFieldsNext";
import CategoryBrowseResults from "../components/Category/CategoryBrowseResults";
import Loading from "../components/Loading";


class ProductSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      productsPage: undefined,
      resultsAggs: {},
      categoryChoices: undefined
    }
  }

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };

  setCategoryChoices(categoryBuckets) {

    if (this.state.categoryChoices) {
      return {}
    }

    const categoryChoices = categoryBuckets.map(categoryBucket => ({
      id: categoryBucket.id,
      name: `${this.props.categories.filter(category => category.id === categoryBucket.id)[0].name} (${categoryBucket.doc_count})`
    }));

    return {
      categoryChoices
    }
  }

  setProductsPage = json => {
    if (json) {

      const results = json.payload.results.map(result => ({
        bucket: result.product.id,
        product_entries: [result]
      }));

      const categoryChoices = this.setCategoryChoices(json.payload.metadata.category_buckets);

      this.setState({
        productsPage: {
          count: json.payload.count,
          results: results,
        },
        resultsAggs: json.payload.aggs,
        ...categoryChoices
      })
    } else {
      // Only reset the actual results to keep the old filter aggregations
      this.setState({
        productsPage: null,
      })
    }
  };

  render() {
    let endpoint = `products/es_browse/?page_size=${settings.categoryBrowseResultsPerPage}`;

    for (const store of this.props.preferredCountryStores) {
      endpoint += `&stores=${store.id}`
    }

    const products = this.state.productsPage || null;
    const choices = [
      {id: 'relevance',
        name: 'Relevancia'},
      {id: 'offer_price_usd',
        name: 'Precio'},
      {id: 'leads',
        name: 'Popularidad'},
      {id: 'discount',
        name: 'Descuento'},
    ];

    return <React.Fragment>
      <Head>
        <title>{`${this.state.formValues.search}`} - SoloTodo</title>
      </Head>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div>
              <div className="row">
                <TopBanner category="Any"/>
                <div className="col-12">
                  <ApiFormNext
                    endpoints={[endpoint]}
                    fields={['page', 'search', 'categories', 'ordering']}
                    onResultsChange={this.setProductsPage}
                    onFormValueChange={this.handleFormValueChange}>
                    <div className="row">
                      <div className="col-12">
                        <h1>Resultados de la búsqueda</h1>
                        <p><span className="font-weight-bold">Palabras clave:</span> {this.state.formValues.search}</p>
                        <ApiFormTextFieldNext
                          name="search"
                          placeholder="Palabras clave"
                          value={this.state.formValues.search}
                          hidden={true}/>
                        <div className="content-card">
                          <div className="d-flex justify-content-between mb-2">
                            <div className="d-flex flex-column align-items-start flex-grow category-browse-ordering-container mr-2">
                              <span className="category-browse-result-count mb-1 ml-2">Categoría</span>
                              <div className="flex-grow ml-2">
                                <ApiFormChoiceFieldNext
                                  name="categories"
                                  choices={this.state.categoryChoices? this.state.categoryChoices : []}
                                  multiple={true}
                                  value={this.state.formValues.category}/>
                              </div>
                            </div>
                            <div className="d-flex flex-column align-items-end flex-grow category-browse-ordering-container mr-2">
                              <span className="category-browse-result-count mb-1">Ordenar por</span>
                              <div className="flex-grow ml-2">
                                <ApiFormChoiceFieldNext
                                  name="ordering"
                                  choices={choices}
                                  value={this.state.formValues.ordering}
                                  required={true}/>
                              </div>
                            </div>
                          </div>
                          {products?
                            <CategoryBrowseResults
                              results={products}
                              page={this.state.formValues.page}
                              priceFormatter={this.props.formatCurrency}/> :
                            <Loading type={"light"}/>}
                        </div>

                        <div className="d-flex category-browse-pagination justify-content-around mt-2 mb-3">
                          <ApiFormPaginationFieldNext
                            page={this.state.formValues.page}
                            pageSize={{id: settings.categoryBrowseResultsPerPage}}
                            resultCount={this.state.productsPage && this.state.productsPage.count}
                            previousLabel="Anterior"
                            nextLabel="Siguiente"/>
                        </div>
                      </div>
                    </div>
                  </ApiFormNext>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {categories, preferredCountryStores, preferredCountry, formatCurrency} = solotodoStateToPropsUtils(state);

  return {
    preferredCountry,
    preferredCountryStores,
    formatCurrency,
    categories
  }
}

export default withRouter(connect(mapStateToProps)(ProductSearch))