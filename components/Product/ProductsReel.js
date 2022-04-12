import React, {Component} from 'react';
import {connect} from "react-redux";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import {settings} from '../../settings';
import {areObjectListsEqual, fetchJson} from "../../react-utils/utils";
import Slider from 'react-slick'
import ProductShortDescription from "./ProductShortDescription";
import Loading from "../Loading";

class ProductsReel extends Component {
  static async getInitialProps(stores, excludeRefurbished, ordering) {
    let storesUrl = '';

    for (const store of stores) {
      storesUrl += '&stores=' + store.id;
    }

    let url = 'ordering=' + ordering + '&websites=' + settings.websiteId + storesUrl;
    const productsResults = await fetchJson(`products/browse/?exclude_refurbished=${excludeRefurbished}&` + url);

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

    if (!areObjectListsEqual(oldPreferredStores, newPreferredStores) ||
      prevProps.preferredExcludeRefurbished !== this.props.preferredExcludeRefurbished) {
      this.componentUpdate()
    }
  }

  componentUpdate() {
    ProductsReel.getInitialProps(this.props.preferredCountryStores, this.props.preferredExcludeRefurbished, this.props.ordering).then(updatedProducts => {
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
          return <div key={productEntry.product_entries[0].product.id} className="products-reel__item">
            <ProductShortDescription productEntry={productEntry.product_entries[0]} />
            <div className="ribbon">
              <span className="ordering-ribbon">{this.props.ribbonFormatter(productEntry.product_entries[0].metadata.score)}</span>
            </div>
          </div>
        })}
      </Slider>
    </div>
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores, preferredExcludeRefurbished} = solotodoStateToPropsUtils(state);

  return {
    preferredCountryStores,
    preferredExcludeRefurbished,
    mediaType: state.browser.mediaType
  }
}

export default connect(mapStateToProps)(ProductsReel);
