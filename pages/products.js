import React from 'react'
import Head from "next/head";
import {withRouter} from 'next/router'
import ProductDetail from "../components/Product/ProductDetail";
import ProductPricesTable from "../components/Product/ProductPricesTable"
import {solotodoStateToPropsUtils} from "../redux/utils";
import {fetchJson} from "../react-utils/utils";
import {settings} from "../settings";
import {withSoloTodoTracker} from "../utils";

class Products extends React.Component {
  static async getInitialProps(ctx) {
    const { res, query, reduxStore, asPath } = ctx;
    const reduxState = reduxStore.getState();

    const {categories, preferredCountryStores, numberFormat, preferredCurrency} = solotodoStateToPropsUtils(reduxState);
    const productId = query.id;
    const productSlug = query.slug;

    if (!productId || !productSlug) {
      if (res) {
        res.statusCode = 404;
        res.end('Not found');
        return
      } else {
        return {
          statusCode: 404
        }
      }
    }

    const productsUrl = settings.apiResourceEndpoints.products;
    let storesUrl = '';
    for (let store of preferredCountryStores) {
      storesUrl += `&stores=${store.id}`
    }

    const product = await fetchJson(`${productsUrl}${productId}`);
    const category = categories.filter(localCategory => localCategory.url === product.category)[0];
    const availableEntities = await fetchJson(`${productsUrl}available_entities/?ids=${productId}${storesUrl}`);
    const entities = availableEntities.results[0].entities.filter(entity => entity.active_registry.cell_monthly_payment === null);

    const {storeEntries} = await ProductPricesTable.getInitialProps(preferredCountryStores, entities);

    return {
      product,
      category,
      entities,
      storeEntries,
      numberFormat,
      preferredCurrency
    }
  }

  render() {
    const product = this.props.product;
    const category = this.props.category;
    const entities = this.props.entities;
    const storeEntries = this.props.storeEntries;
    const preferredCountry = this.props.preferredCountry;

    return <React.Fragment>
      <Head>
      </Head>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <ProductDetail
              product={product}
              category={category}
              entities={entities}
              storeEntries={storeEntries}
              preferredCountry={preferredCountry}
              numberFormat={this.props.numberFormat}
              preferredCurrency={this.props.preferredCurrency}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  }
}

function mapPropsToGAField(props) {
  return {
    category: props.category.name,
    product: props.product.name,
    pageTitle: props.product.name
  }
}

const TrackedProducts = withSoloTodoTracker(Products, mapPropsToGAField);
export default withRouter(TrackedProducts)