import React, {Component} from 'react'
import ImageGallery from 'react-image-gallery';
import {connect} from "react-redux";
import './ProductPicture.css';


class ProductPicture extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageSrc: `${props.product.url}picture/?width=1000&height=520`
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(this.props.product.url !== nextProps.product.url){
      this.setState({
        imageSrc: `${nextProps.product.url}picture/?width=1000&height=520`
      })
    }
  }

  handleScreenChange = fullscreenElement => {
    const imageSrc = fullscreenElement ? this.props.product.pictureUrl :
        `${this.props.product.url}picture/?width=1000&height=520`;

    this.setState({
      imageSrc
    })
  };

  render() {
    const images = [
      {
        original: this.state.imageSrc,
        thumbnail: `${this.props.product.url}picture/?width=200&height=200`
      }
    ];

    const position = this.props.isMediumOrSmaller ? 'bottom' : 'left';
    const showThumbnails = images.length > 1;

    return <ImageGallery
        showPlayButton={false}
        items={images}
        thumbnailPosition={position}
        showThumbnails={showThumbnails}
        onScreenChange={this.handleScreenChange}
    />
  }
}

function mapStateToProps(state) {
  return {
    isMediumOrSmaller: state.browser.lessThan.medium
  }
}

export default connect(mapStateToProps)(ProductPicture)
