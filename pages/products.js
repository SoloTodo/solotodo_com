import React from 'react'
import Head from "next/head";
import Router, {withRouter} from 'next/router'
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

    const {user, categories, preferredCountryStores} = solotodoStateToPropsUtils(reduxState);
    const productId = query.id;

    const productsUrl = settings.apiResourceEndpoints.products;

    let product;

    try {
      product = await fetchJson(`${productsUrl}${productId}/`);
    } catch (e) {
      if (res) {
        console.log('error');
        res.statusCode=404;
        res.end('Not found');
        return
      }
    }

    const givenSlug = query.slug;
    const expectedSlug = product.slug;

    if (givenSlug !== expectedSlug) {
      if (res) {
        res.writeHead(302, {
          Location: `/products/${productId}-${expectedSlug}`
        });
        res.end()
      } else {
        const href = `/products?id=${productId}&slug=${expectedSlug}`;
        const as = `/products/${productId}-${expectedSlug}`;

        Router.push(href, as)
      }
    }

    let storesUrl = '';
    for (let store of preferredCountryStores) {
      storesUrl += `&stores=${store.id}`
    }

    const category = categories.filter(localCategory => localCategory.url === product.category)[0];
    const availableEntities = await fetchJson(`${productsUrl}available_entities/?ids=${productId}${storesUrl}`);
    const entities = availableEntities.results[0].entities.filter(entity => entity.active_registry.cell_monthly_payment === null);

    const {storeEntries} = await ProductPricesTable.getInitialProps(preferredCountryStores, entities);

    return {
      product,
      category,
      entities,
      storeEntries,
      user
    }
  }

  render() {
    const product = this.props.product;
    const category = this.props.category;
    const entities = this.props.entities;
    const storeEntries = this.props.storeEntries;

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
              user={this.props.user}
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