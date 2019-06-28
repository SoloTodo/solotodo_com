import React from 'react'
import StarRatingComponent from 'react-star-rating-component'


class RatingStarsEditable extends React.Component {
  render() {
    const renderStarIcon = (startIndex, rating, name) => {
      const starsComponent = startIndex <= rating ? <i className="fas fa-star"></i> : <i className="far fa-star"></i>;

      return <span className="rating-stars">
        {starsComponent}
      </span>
    };

    const renderStarIconHalf = (nextValue, prevValue, name) => {
      return <span className="rating-stars">
        <span>
        <span style={{position: 'absolute'}}><i className="far fa-star" /></span>
        <span><i className="fas fa-star-half" /></span>
      </span>
      </span>
    };

    return <div className="rating-stars">
      <StarRatingComponent
        name={this.props.name}
        value={this.props.value}
        renderStarIcon={renderStarIcon}
        renderStarIconHalf={renderStarIconHalf}
        onStarClick={this.props.onStarClick}/>
    </div>
  }
}

export default RatingStarsEditable