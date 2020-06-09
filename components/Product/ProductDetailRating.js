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

  componentDidMount() {
    this.componentUpdate(this.props.product)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.product.id !== this.props.product.id) {
      this.componentUpdate(this.props.product)
    }
  }

  componentUpdate(product) {
    fetch(`${product.url}average_rating/`).then(res => res.json()).then(ratingsData => {
      this.setState({ratingsData})
    })
  }

  render() {
    const ratingsData = this.state.ratingsData;
    const linkAs = `/products/${this.props.product.id}/ratings`;
    const linkHref = `/products/[slug]/ratings?slug=${this.props.product.id}`;

    if (!ratingsData || !ratingsData.count) {
      return null
    }

    return <div className="d-flex flex-row mt-1">
      <ProductRatingStars
        value={ratingsData.average}
        linkHref={linkHref}
        linkAs={linkAs}/>
      <Link href={linkHref} as={linkAs}>
        <a className="pl-1 text-muted product-rating-label">{ratingsData.count} evaluaciones</a>
      </Link>
    </div>
  }
}

export default ProductDetailRating