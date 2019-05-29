import React from 'react'
import Link from "next/link";

import {settings} from '../../settings'
import TopBanner from "../TopBanner";
import ProductDetailRating from "./ProductDetailRating";
import ProductPicture from "./ProductPicture";

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
      </div>
    </div>
  }
}

export default ProductDetail