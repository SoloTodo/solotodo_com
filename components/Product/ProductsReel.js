import React, {Component} from 'react';
import {connect} from "react-redux";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import {settings} from '../../settings';
import {areObjectListsEqual, fetchJson} from "../../react-utils/utils";
import Slider from 'react-slick'
import ProductShortDescription from "./ProductShortDescription";

class ProductsReel extends Component {
  static async getInitialProps(stores, ordering) {
    let storesUrl = '';

    for (const store of stores) {
      storesUrl += '&stores=' + store.id;
    }

    let url = 'ordering=' + ordering + '&websites=' + settings.websiteId + storesUrl;
    const productsResults = await fetchJson('products/browse/?' + url);

    return {
      productBuckets: productsResults.results
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      productBuckets: props.initialProductBuckets
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldPreferredStores = this.props.preferredCountryStores;
    const newPreferredStores = nextProps.preferredCountryStores;

    if (!areObjectListsEqual(oldPreferredStores, newPreferredStores)) {
      ProductsReel.getInitialProps(newPreferredStores, nextProps.ordering).then(updatedProducts => {
        this.setState({
          productBuckets: updatedProducts.productBuckets
        })
      });
    }
  }

  render() {
    const slidesToShowDict = {
      extraSmall: 1,
      small: 1,
      medium: 2,
      large: 3,
      extraLarge: 4,
      infinity: 5
    };

    const slidesToShow = slidesToShowDict[this.props.mediaType] || 1;

    const sliderSettings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: slidesToShow,
      slidesToScroll: 1,
    };

    return <div className="products-reel">
      <Slider {...sliderSettings}>
        {this.state.productBuckets.map(bucket => {
          return <div key={bucket.product_entries[0].product.id} className="products-reel__item">
            <ProductShortDescription productEntry={bucket.product_entries[0]} />
            <div className="ribbon">
              <span className="ordering-ribbon">{this.props.ribbonFormatter(bucket.product_entries[0].ordering_value)}</span>
            </div>
          </div>
        })}
      </Slider>
    </div>
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores} = solotodoStateToPropsUtils(state);

  return {
    preferredCountryStores,
    mediaType: state.browser.mediaType
  }
}

export default connect(mapStateToProps)(ProductsReel);
