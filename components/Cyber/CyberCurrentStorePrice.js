import React from 'react'
import {connect} from "react-redux";
import {Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import {solotodoStateToPropsUtils} from "../../redux/utils";

import './CyberCurrentStorePrice.css'

class CyberCurrentStorePrice extends React.Component {
  render() {
    const offerPrice = this.props.entity.active_registry.offer_price;
    const normalPrice = this.props.entity.active_registry.normal_price;
    const formattedOfferPrice = this.props.formatCurrency(offerPrice);
    const formattedNormalPrice = this.props.formatCurrency(normalPrice);
    return <Col sm={{size:8, offset: 2}} className="mt-4">
      <Card>
        <CardHeader><h2>{this.props.entity.name}</h2></CardHeader>
        <CardBody>
          <Row>
            <Col sm="5">
              <img style={{width:"100%"}} src={this.props.entity.picture_urls[0]}/>
            </Col>
            <Col sm="7" className="d-flex justify-content-center align-items-center">
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