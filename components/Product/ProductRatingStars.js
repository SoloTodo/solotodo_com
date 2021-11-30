import React from 'react'
import StartRatingComponent from 'react-star-rating-component'
import Link from "next/link";


class ProductRatingStars extends React.Component {
  render() {
    if(!this.props.value) {
      return null;
    }

    // Round value to the "nearest 0.5" (0, 0.5, 1.0, 1.5, 2.0, ...)
    const adjustedValue = Math.round(this.props.value * 2) / 2

    const renderStarIcon = (startIndex, rating) => {
      const starsComponent = startIndex <= rating?
        <i className="fas fa-star"/> : <i className="far fa-star"/>;

      if (this.props.linkAs) {
        return <Link href={this.props.linkHref} as={this.props.linkAs}>
          <a className="rating-star">
            {starsComponent}
          </a>
        </Link>
      } else {
        return <span className="rating-star">
          {starsComponent}
        </span>
      }
    };

    const renderStarIconHalf = () => {
      const starsComponent = <span>
        <span style={{position: 'absolute'}}><i className="far fa-star" /></span>
        <span><i className="fas fa-star-half" /></span>
      </span>;

      if (this.props.linkAs) {
        return <Link href={this.props.linkHref} as={this.props.linkAs}>
          <a className="rating-star">
            {starsComponent}
          </a>
        </Link>
      } else {
        return <span className="rating-star">
          {starsComponent}
        </span>
      }
    };

    return <div className="rating-stars">
      <StartRatingComponent
        name="rating"
        value={adjustedValue}
        renderStarIcon={renderStarIcon}
        renderStarIconHalf={renderStarIconHalf}
        editing={false}
      />
    </div>
  }
}

export default ProductRatingStars