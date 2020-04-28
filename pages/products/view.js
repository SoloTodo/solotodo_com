import React from 'react'
import Head from "next/head";
import Link from "next/link";
import Router, {withRouter} from 'next/router'
import ReactDisqusComments from "react-disqus-comments";

import {fetchJson} from "../../react-utils/utils";
import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";

import {solotodoStateToPropsUtils} from "../../redux/utils";
import {getProductShortDescription, withSoloTodoTracker} from "../../utils";
import {settings} from "../../settings";
import {endpoint} from "../../endpoint";

import TopBanner from "../../components/TopBanner";
import ProductDetailRating from "../../components/Product/ProductDetailRating";
import ProductPicture from "../../components/Product/ProductPicture";
import ProductVariants from "../../components/Product/ProductVariants";
import ProductTechSpecs from "../../react-utils/components/Product/ProductTechSpecs";
import ProductStaffActionsButton from "../../components/Product/ProductStaffActionsButton";
import ProductPricesTable from "../../components/Product/ProductPricesTable"
import ProductAlertButton from "../../components/Product/ProductAlertButton";
import ProductBenchmarks from "../../components/Product/ProductBenchmarks";
import ProductAlternatives from "../../components/Product/ProductAlternatives";
import PricingHistory from "../../components/Product/PricingHistory";
import ProductAddToBudgetButton from "../../components/Product/ProductAddToBudgetButton";
import ProductVideo from "../../components/Product/ProductVideo";


class Products extends React.Component {
  static async getInitialProps(ctx) {
    const { res, query, reduxStore, asPath } = ctx;
    const reduxState = reduxStore.getState();

    const {user, categories, preferredCountryStores, currencies} = solotodoStateToPropsUtils(reduxState);
    const productId = query.id;

    const productsUrl = settings.apiResourceEndpoints.products;

    let product;

    try {
      product = await fetchJson(`${productsUrl}${productId}/`);
    } catch (e) {
      if (res) {
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
        const href = `/products/view?id=${productId}&slug=${expectedSlug}`;
        const as = `/products/${productId}-${expectedSlug}`;

        Router.push(href, as)
      }
    }

    const categoryTemplates = filterApiResourceObjectsByType(reduxState.apiResourceObjects, 'category_templates');
    const description = getProductShortDescription(product, categoryTemplates);

    const category = categories.filter(localCategory => localCategory.url === product.category)[0];

    return {
      product,
      description,
      category,
      preferredCountryStores,
      currencies,
      user
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      cheapestEntity: undefined
    }
  }

  componentDidMount() {
    const product = this.props.product;

    if (window.exponea && product.name.indexOf('LG') === 0) {
      const data = {
        product_id: product.id,
        title: product.name,
      };

      window.exponea.track('solotodo_visit', data);
    }
  }

  handleEntitiesChange = (entities) => {
    this.setState({
      cheapestEntity: entities[0]
    })
  };

  render() {
    const product = this.props.product;
    const category = this.props.category;
    const cheapestEntity = this.state.cheapestEntity;

    return <React.Fragment>
      <Head>
        <title key="title">{product.name} - SoloTodo</title>
        <meta property="og:type" content="product" />
        <link rel="canonical" href={`${settings.domain}/products/${product.id}-${product.slug}`} />
        <meta property="og:url" content={`${settings.domain}/products/${product.id}-${product.slug}`} />
        <meta property="og:title" content={product.name} />
        <meta name="description" property="og:description" content={this.props.description} />
        <meta property="og:image" content={`${endpoint}products/${product.id}/picture/?image_format=JPEG&quality=80&width=1200&height=650`} key="og_image" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="650" />
        <meta property="product:brand" content={product.specs.brand_unicode} />
        <meta property="product:condition" content="new" />
        <meta property="product:retailer_item_id" content={product.id} />
      </Head>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div>
              <div className="row">
                <TopBanner category={category.name}/>
                <div className="col-12">
                  <nav aria-label>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><Link  href={`/browse?category_slug=${category.slug}`} as={`/${category.slug}`}><a>{category.name}</a></Link></li>
                      <li className="breadcrumb-item active">{product.name}</li>
                    </ol>
                  </nav>
                </div>
                <div className="col-12">
                  <h1 className="mb-0">{product.name}</h1>
                </div>
                <div className="col-12 mb-2">
                  <ProductDetailRating product={product}/>
                </div>
              </div>

              <div id="product-detail-grid">
                <div className="product-detail-cell" id="product-detail-images">
                  <div id="image-container" className="content-card">
                    <ProductPicture product={product}/>
                  </div>
                  <ProductVariants
                    product={product}
                    category={category}
                    className="mt-3"/>
                </div>
                <div id="product-detail-specs" className="product-detail-cell">
                  <div id="technical-specifications-container" className="content-card">
                    <ProductTechSpecs product={product} websiteId={settings.websiteId}/>
                  </div>
                </div>
                <div id="product-detail-prices" className="product-detail-cell">
                  <div id="product-prices-table" className="content-card">
                    <ProductPricesTable
                      product={product}
                      category={category}
                      onEntitiesChange={this.handleEntitiesChange}/>
                    <div className="d-flex justify-content-end flex-wrap">
                      {this.props.user && this.props.user.is_staff &&
                      <ProductStaffActionsButton product={product}/>}
                      {category.budget_ordering &&
                      <ProductAddToBudgetButton
                        product={product}/>}
                      {cheapestEntity && <ProductAlertButton
                        entity={cheapestEntity}
                        product={this.props.product}/>}
                      <Link href={`/products/new_rating?id=${product.id}`} as={`/products/${product.id}/ratings/new`}>
                        <a className="ml-2 mt-2 btn btn-info btn-large">
                          ¿Lo compraste? ¡Danos tu opinión!
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>

                {settings.benchmarkCategories[category.id] &&
                <div id="product-detail-benchmarks" className="product-detail-cell">
                  <div className="content-card">
                    <ProductBenchmarks product={product} category={category}/>
                  </div>
                </div>}

                <div id="product-detail-video">
                  <ProductVideo product={product}/>
                </div>

                {cheapestEntity &&
                <ProductAlternatives product={product} category={category} entity={cheapestEntity}/>}

                <div id="product-detail-pricing-history" className="content-card">
                  <PricingHistory product={product}/>
                </div>

              </div>

              <div className="row">
                <div className="col-12 mt-3">
                  <div className="content-card">
                    <ReactDisqusComments
                      shortname={settings.disqusShortName}
                      identifier={product.id.toString()}
                      title={product.name}
                      url={`https://www.solotodo.com/products/${product.id}`}
                    />
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

function mapPropsToGAField(props) {
  return {
    category: props.category.name,
    product: props.product.name,
    pageTitle: props.product.name
  }
}

const TrackedProducts = withSoloTodoTracker(Products, mapPropsToGAField);
export default withRouter(TrackedProducts)