import React from 'react'
import StartRatingComponent from 'react-star-rating-component'
import Link from "next/link";


class ProductRatingStars extends React.Component {
  render() {
    if(!this.props.value) {
      return null;
    }

    const renderStarIcon = (startIndex, rating, name) => {
      const starsComponent = startIndex <= rating? <i className="fas fa-star"></i> : <i className="far fa-star"></i>;

      if (this.props.linkUrl) {
        return <div className="rating-stars">
          {starsComponent}
        </div>
      } else {
        return <span className="rating-stars">
          {starsComponent}
        </span>
      }
    };

    const renderStartIconHalf = (nextValue, prevValue, name) => {
      const starsComponent = <span>
        <span style={{position: 'absolute'}}><i className="far fa-star" /></span>
        <span><i className="fas fa-star-half" /></span>
      </span>;

      if (this.props.linkUrl) {
        return <div className="rating-stars">
          {starsComponent}
        </div>
      } else {
        return <span className="rating-stars">
          {starsComponent}
        </span>
      }
    };

    return <div className="rating-stars">
      <StartRatingComponent
        name="rating"
        value={this.props.value}
        renderStarIcon={renderStarIcon}
        renderStarIconHalf={renderStartIconHalf}
      />
    </div>
  }
}

export default ProductRatingStars