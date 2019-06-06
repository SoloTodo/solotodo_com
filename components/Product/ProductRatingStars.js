import React from 'react'
import StartRatingComponent from 'react-star-rating-component'
import Link from "next/link";


class ProductRatingStars extends React.Component {
  render() {
    if(!this.props.value) {
      return null;
    }

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
        value={this.props.value}
        renderStarIcon={renderStarIcon}
        renderStarIconHalf={renderStarIconHalf}
        editing={false}
      />
    </div>
  }
}

export default ProductRatingStars