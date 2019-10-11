import React from 'react'
import Link from "next/link";
import Router, {withRouter} from "next/dist/client/router";
import ReactPaginate from "react-paginate";
import queryString from "query-string";
import moment from "moment";

import {solotodoStateToPropsUtils} from "../redux/utils";
import {fetchJson} from "../react-utils/utils";

import TopBanner from "../components/TopBanner";
import ProductRatingStars from "../components/Product/ProductRatingStars";
import Loading from "../components/Loading";
import Head from "next/head";


class StoreRatings extends React.Component {
  static async getInitialProps(ctx) {
    const {res, query, reduxStore, asPath} = ctx;
    const reduxState = reduxStore.getState();

    const {user, preferredCountryStores} = solotodoStateToPropsUtils(reduxState);
    const storeId = parseInt(query.id);
    const store = preferredCountryStores.filter(s => s.id === storeId)[0];;


    let page = queryString.parse(asPath.split('?')[1])['page'] || 1;

    if (!store) {
      if (res) {
        res.statusCode = 404;
        res.end('Not found');
        return
      }
    }

    const ratings = await fetchJson(`ratings/?page_size=10&stores=${store.id}&page=${page}`);

    return {
      store,
      ratings,
      page,
      user
    }
  }

  onPageChange = selection => {
    const nextPage = selection.selected;
    const nextHref = `/store_ratings?id=${this.props.store.id}&page=${nextPage+1}`;
    const nextAs = `/stores/${this.props.store.id}/ratings?page=${nextPage+1}`;
    Router.push(nextHref, nextAs)
  };

  render() {
    const store = this.props.store;
    const userIsStaff = this.props.user && this.props.user.is_staff;

    const ratings = this.props.ratings.results;
    const pageCount = Math.ceil(this.props.ratings.count/10);
    const previousLabel = <span>&lsaquo;</span>;
    const nextLabel = <span>&rsaquo;</span>;

    return <React.Fragment>
      <Head>
        <title key="title">{store.name} - Ratings - SoloTodo</title>
      </Head>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div>
              <div className="row">
                <TopBanner category="Any"/>
                <div className="col-12">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">Tiendas</li>
                      <li className="breadcrumb-item">{store.name}</li>
                      <li className="breadcrumb-item active" aria-current="page">Ratings</li>
                    </ol>
                  </nav>
                </div>

                <div className="col-12">
                  <h1>Ratings {store.name}</h1>
                </div>

                <div className="col-12">
                  <div className="d-flex flex-row justify-content-end">
                    <ReactPaginate
                      forcePage={this.props.page - 1}
                      pageCount={pageCount}
                      pageRangeDisplayed={3}
                      marginPagesDisplayed={2}
                      containerClassName="pagination"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      activeClassName="active"
                      previousClassName="page-item"
                      nextClassName="page-item"
                      previousLinkClassName="page-link"
                      nextLinkClassName="page-link"
                      disabledClassName="disabled"
                      breakClassName="page-item disabled"
                      breakLinkClassName="page-link"
                      previousLabel={previousLabel}
                      nextLabel={nextLabel}
                      hrefBuilder={page => `?page=${page}`}
                      onPageChange={this.onPageChange}/>
                  </div>
                </div>

                <div className="col-12 rating-container">
                  {ratings? ratings.map(rating => (
                      <div key={rating.id} className="content-card mb-3">
                        <dl>
                          {userIsStaff && <dt>ID</dt>}
                          {userIsStaff && <dd>{rating.id}</dd>}
                          <dt>Fecha</dt>
                          <dd>{moment(rating.creation_date).format('lll')}</dd>
                          <dt>Producto comprado</dt>
                          <dd><Link href={`/products/view?id=${rating.product.id}&slug=${rating.product.slug}`} as={`/products/${rating.product.id}-${rating.product.slug}`}>
                            <a>{rating.product.name}</a>
                          </Link></dd>
                          <dt>Evaluación de la tienda</dt>
                          <dd><ProductRatingStars value={rating.store_rating}/></dd>
                          <dt className="no-float">Comentarios del producto</dt>
                          <dd>{rating.store_comments}</dd>
                        </dl>
                      </div>
                    )) :
                    <Loading/>}
                </div>

                <div className="col-12">
                  <div className="d-flex flex-row justify-content-end">
                    <ReactPaginate
                      forcePage={this.props.page - 1}
                      pageCount={pageCount}
                      pageRangeDisplayed={3}
                      marginPagesDisplayed={2}
                      containerClassName="pagination"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      activeClassName="active"
                      previousClassName="page-item"
                      nextClassName="page-item"
                      previousLinkClassName="page-link"
                      nextLinkClassName="page-link"
                      disabledClassName="disabled"
                      breakClassName="page-item disabled"
                      breakLinkClassName="page-link"
                      previousLabel={previousLabel}
                      nextLabel={nextLabel}
                      hrefBuilder={page => `?page=${page}`}
                      onPageChange={this.onPageChange}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  }
}

export default withRouter(StoreRatings)