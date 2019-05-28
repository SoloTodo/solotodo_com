import React from 'react'
import Link from "next/link";

import {settings} from '../../settings'
import TopBanner from "../TopBanner";

class ProductDetail extends React.Component {
  render() {
    const product = this.props.product;
    const category = this.props.category;
    const bucketSettings = settings.bucketCategories[category];


    return <div>
      <div className="row">
        <TopBanner category={category.name}/>
        <div className="col-12">
          <nav aria-label>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link  href={`/browse?category_slug=${category.slug}`} as={`/${category.slug}`}>{category.name}</Link></li>
              <li className="breadcrumb-item active">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  }
}

export default ProductDetail