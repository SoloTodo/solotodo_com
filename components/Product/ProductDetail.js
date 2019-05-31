import React from 'react'
import Link from "next/link";
import ReactDisqusComments from 'react-disqus-comments';

import TopBanner from "../TopBanner";
import ProductDetailRating from "./ProductDetailRating";
import ProductPicture from "./ProductPicture";
import ProductTechSpecs from "../../react-utils/components/Product/ProductTechSpecs";

import {settings} from '../../settings';
import ProductPricesTable from "./ProductPricesTable";
import ProductAlertButton from "./ProductAlertButton";
import ProductStaffActionsButton from "./ProductStaffActionsButton";
import ProductBenchmarks from "./ProductBenchmarks";

class ProductDetail extends React.Component {
  render() {
    const product = this.props.product;
    const category = this.props.category;

    return <div>
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
        </div>
        <div id="product-detail-specs" className="product-detail-cell">
          <div id="technical-specifications-container" className="content-card">
            <ProductTechSpecs product={product} websiteId={settings.websiteId}/>
          </div>
        </div>
        <div id="product-detail-prices" className="product-detail-cell">
          <div id="product-prices-table" className="content-card">
            <ProductPricesTable
              category={category}
              entities={this.props.entities}
              storeEntries={this.props.storeEntries}/>

            <div className="d-flex justify-content-end flex-wrap">
              {this.props.user && this.props.user.is_staff &&
              <ProductStaffActionsButton product={product}/>}
              <ProductAlertButton
                entity={this.props.entities[0]}
                product={this.props.product}/>
              <Link href={`/product_ratings/new?product_id=${product.id}`} as={`/products/${product.id}/ratings/new`}>
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
        </div>
        }
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

      <Link href="/products?id=44843&slug=huawei-p20-lite-32-gb-4-gb-midnight-black" as="/products/44843-huawei-p20-lite-32-gb-4-gb-midnight-black">
        <a>Celular</a>
      </Link> <br/>
      <Link href="/products?id=36165&slug=nintendo-switch-joy-con-neon-negra" as="/products/36165-nintendo-switch-joy-con-neon-negra">
        <a>Switch</a>
      </Link>
    </div>
  }
}

export default ProductDetail