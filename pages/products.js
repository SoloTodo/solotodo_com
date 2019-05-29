import React from 'react'
import Head from "next/head";
import ProductDetail from "../components/Product/ProductDetail";
import {solotodoStateToPropsUtils} from "../redux/utils";
import {fetchJson} from "../react-utils/utils";
import {settings} from "../settings";

class Products extends React.Component {
  static async getInitialProps(ctx) {
    const { res, query, reduxStore, asPath } = ctx;
    const reduxState = reduxStore.getState();

    const {categories} = solotodoStateToPropsUtils(reduxState);
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

    const product = await fetchJson(settings.apiResourceEndpoints.products + productId);
    const category = categories.filter(localCategory => localCategory.url === product.category)[0];

    return {
      product,
      category,
    }
  }

  render() {
    const product = this.props.product;
    const category = this.props.category;

    return <React.Fragment>
      <Head>
      </Head>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <ProductDetail
              product={product}
              category={category}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  }
}

export default Products