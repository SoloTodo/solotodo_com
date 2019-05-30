import React from 'react'
import Link from "next/link";

import TopBanner from "../TopBanner";
import ProductDetailRating from "./ProductDetailRating";
import ProductPicture from "./ProductPicture";
import ProductTechSpecs from "../../react-utils/components/Product/ProductTechSpecs";

import {settings} from '../../settings';
import ProductPricesTable from "./ProductPricesTable";

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
              entities={this.props.entities}
              storeEntries={this.props.storeEntries}
              numberFormat={this.props.numberFormat}
              preferredCurrency={this.props.preferredCurrency}
            />
            <div className="d-flex justify-content-end flex-wrap">
              <div>Product Alert Button</div>
            </div>
          </div>
        </div>
      </div>



      <Link href="/products?id=44843&slug=huawei-p20-lite-32-gb-4-gb-midnight-black" as="/products/44843-huawei-p20-lite-32-gb-4-gb-midnight-black">
        <a>Celular</a>
      </Link> <br/>
      <Link href="/products?id=36165&slug=huawei-nintendo-switch-joy-con-neon-negra" as="/products/36165-nintendo-switch-joy-con-neon-negra">
        <a>Switch</a>
      </Link>
    </div>
  }
}

export default ProductDetail