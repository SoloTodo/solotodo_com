import React from 'react'
import {withRouter} from "next/router";
import queryString from 'query-string';
import Link from "next/link";

import {convertIdToUrl, fetchJson} from "../../react-utils/utils";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import {settings} from "../../settings";
import TopBanner from "../../components/TopBanner";
import Loading from "../../components/Loading";
import moment from "moment";
import ProductRatingStars from "../../components/Product/ProductRatingStars";


class ProductRatings extends React.Component {
  static async getInitialProps(ctx) {
    const {res, query, reduxStore, asPath} = ctx;
    const reduxState = reduxStore.getState();

    const {user, categories, preferredCountryStores} = solotodoStateToPropsUtils(reduxState);
    const productId = query.id;

    let page = queryString.parse(asPath.split('?')[1])['page'] || 1;

    const productsUrl = settings.apiResourceEndpoints.products;

    let product;

    try {
      product = await fetchJson(`${productsUrl}${productId}/`);
    } catch (e) {
      if (res) {
        res.statusCode = 404;
        res.end('Not found');
        return
      }
    }

    const ratings = await fetchJson(`ratings/?page_size=10&products=${product.id}&page=${page}`);
    const category = categories.filter(localCategory => localCategory.url === product.category)[0];

    return {
      product,
      ratings,
      category,
      preferredCountryStores,
      user
    }
  }

  render() {
    const product = this.props.product;
    const stores = this.props.preferredCountryStores;
    const category = this.props.category;
    const userIsStaff = this.props.user && this.props.user.is_staff;
    const pageSize = 10;

    const ratings = this.props.ratings.results;

    return <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div>
            <div className="row">
              <TopBanner category={category.name}/>
              <div className="col-12">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link  href={`/browse?category_slug=${category.slug}`} as={`/${category.slug}`}>
                        <a>{category.name}</a>
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link href= {`/products/view?id=${product.id}&slug=${product.slug}`} as={`/products/${product.id}-${product.slug}`}>
                        <a>{product.name}</a>
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">Ratings</li>
                  </ol>
                </nav>
              </div>

              <div className="col-12">
                <h1>Ratings {product.name}</h1>
              </div>

              <div className="col-12 rating-container">
                {ratings? ratings.map(rating => (
                  <div key={rating.id} className="content-card mb-3">
                    <dl>
                      {userIsStaff && <dt>ID</dt>}
                      {userIsStaff && <dd>{rating.id}</dd>}
                      <dt>Fecha</dt>
                      <dd>{moment(rating.creation_date).format('lll')}</dd>
                      <dt>Tienda de compra</dt>
                      <dd>{stores.filter(store => store.url === rating.store)[0].name}</dd>
                      <dt>Evaluación del producto</dt>
                      <dd><ProductRatingStars value={rating.product_rating}/></dd>
                      <dt className="no-float">Comentarios del producto</dt>
                      <dd>{rating.product_comments}</dd>
                    </dl>
                  </div>
                )) :
                <Loading/>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}

export default withRouter(ProductRatings)