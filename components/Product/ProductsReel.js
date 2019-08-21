import React, {Component} from 'react';
import {connect} from "react-redux";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import {settings} from '../../settings';
import {areObjectListsEqual, fetchJson} from "../../react-utils/utils";
import Slider from 'react-slick'
import ProductShortDescription from "./ProductShortDescription";
import Loading from "../Loading";

class ProductsReel extends Component {
  static async getInitialProps(stores, ordering) {
    let storesUrl = '';

    for (const store of stores) {
      storesUrl += '&stores=' + store.id;
    }

    let url = 'ordering=' + ordering + '&websites=' + settings.websiteId + storesUrl;
    const productsResults = await fetchJson('products/browse/?' + url);

    return {
      productEntries: productsResults.results
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      productEntries: props.initialProductEntries
    }
  }

  componentDidMount() {
    if (!this.state.productEntries) {
      this.componentUpdate()
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const newPreferredStores = this.props.preferredCountryStores;
    const oldPreferredStores = prevProps.preferredCountryStores;

    if (!areObjectListsEqual(oldPreferredStores, newPreferredStores)) {
      this.componentUpdate()
    }
  }

  componentUpdate() {
    ProductsReel.getInitialProps(this.props.preferredCountryStores, this.props.ordering).then(updatedProducts => {
        this.setState({
          productEntries: updatedProducts.productEntries
        })
      });
  }

  render() {
    if (!this.state.productEntries) {
      return <Loading />
    }

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
        {this.state.productEntries.map(productEntry => {
          return <div key={productEntry.product.id} className="products-reel__item">
            <ProductShortDescription productEntry={productEntry} />
            <div className="ribbon">
              <span className="ordering-ribbon">{this.props.ribbonFormatter(productEntry.metadata[this.props.ordering])}</span>
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
