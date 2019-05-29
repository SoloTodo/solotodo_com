import React from 'react'
import ProductRatingStars from "./ProductRatingStars";
import Link from "next/link";

class ProductDetailRating extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
       ratingsData: undefined
     }
  }

  componentWillMount() {
    this.componentUpdate(this.props.product)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.product.id !== nextProps.product.id) {
      this.componentUpdate(nextProps.product)
    }
  }

  componentUpdate(product) {
    fetch(`${product.url}average_rating/`).then(res => res.json()).then(ratingsData => {
      this.setState({ratingsData})
    })
  }


  render() {
    const ratingsData = this.state.ratingsData;

    if (!ratingsData || !ratingsData.count) {
      return null
    }

    return <div className="d-flex flex-row mt-1">
      <ProductRatingStars
        value={ratingsData.average}
        linkUrl={`/products/${this.props.product.id}/ratings`}
      />
      <div className="pl-1 text-muted product-rating-label">
        {ratingsData.count} evaluaciones
      </div>

    </div>
  }
}

export default ProductDetailRating