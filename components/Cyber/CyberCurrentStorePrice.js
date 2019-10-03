import React from 'react'
import {connect} from "react-redux";
import {Card, CardBody, Col, Row} from "reactstrap";
import {solotodoStateToPropsUtils} from "../../redux/utils";

import './CyberCurrentStorePrice.css'
import moment from "moment";
import {fetchJson} from "../../react-utils/utils";
import ProductTechSpecs
  from "../../react-utils/components/Product/ProductTechSpecs";
import {settings} from "../../settings";

class CyberCurrentStorePrice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: undefined
    }
  }

  componentDidMount() {
    this.componentUpdate()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.entity.id !== this.props.entity.id){
      this.componentUpdate()
    }
  }

  componentUpdate = () => {
    const product_id = this.props.entity.product.id;
    const url = `/products/${product_id}/`;
    fetchJson(url).then(product => {
      this.setState({
        product
      })
    })
  };

  render() {
    if (!this.state.product) {
      return null
    }

    const formattedRetrieveDate = moment(this.props.entity.active_registry.timestamp).format('DD [de] MMMM [a las ] HH:MM');
    const offerPrice = this.props.entity.active_registry.offer_price;
    const normalPrice = this.props.entity.active_registry.normal_price;
    const formattedOfferPrice = this.props.formatCurrency(offerPrice);
    const formattedNormalPrice = this.props.formatCurrency(normalPrice);
    return <Col sm="12" className="mt-4">
      <h2>{this.props.entity.name}</h2>
      <Card>
        <CardBody>
          <Row>
            <Col sm="5">
              <img style={{width:"100%"}} src={this.props.entity.picture_urls[0]}/>
              <div className="d-flex flex-column cyber-container">
                <div className="d-flex justify-content-center">
                  <strong>{this.props.preferredCountryStores.filter(store => store.url ===this.props.entity.store)[0].name.toUpperCase()}</strong><br/>
                </div>
                <div>
                  <div className="d-flex justify-content-center cyber-offer-price">
                    {formattedOfferPrice}
                  </div>
                </div>
                {normalPrice !== offerPrice?
                  <div className="d-flex justify-content-center">
                    <i>({formattedNormalPrice} con cualquier medio de pago)</i><br/>
                  </div> : null}
                <div className="d-flex mt-4">
                  <i className="cyber-disclaimer">Obtenido el {formattedRetrieveDate}. El precio del producto podría haber variado.</i>
                </div>
              </div>
            </Col>
            <Col sm="7">
              <div className="d-flex flex-column mt-3">
                <div id="technical-specifications-container">
                  <ProductTechSpecs product={this.state.product} websiteId={settings.websiteId}/>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>;
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores, formatCurrency} = solotodoStateToPropsUtils(state);
  return {
    preferredCountryStores,
    formatCurrency
  }
}

export default connect(mapStateToProps)(CyberCurrentStorePrice)