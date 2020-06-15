import React from 'react'
import {connect} from "react-redux";
import {Card, CardBody, CardHeader, Col, Row, Alert} from "reactstrap";
import moment from "moment";

import {fetchJson} from "../../react-utils/utils";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import CyberStorePricingHistoryChart from "./CyberStorePricingHistoryChart";


class CyberBestStoreHistoricPrice extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      bestStorePrice: undefined
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
    const store_id = this.props.preferredCountryStores.filter(store => store.url ===this.props.entity.store)[0].id;
    const url = `/products/${product_id}/min_history_price/?&stores=${store_id}&timestamp_after=2019-08-01T00:00:00.000Z&timestamp_before=2019-10-01T12:00:00`;
    fetchJson(url).then(bestStorePrice => {
      this.setState({
        bestStorePrice
      })
    })
  };

  render() {
    if (!this.state.bestStorePrice) {
      return null
    }

    const bestPrice = this.state.bestStorePrice;
    const entity = this.props.entity;

    const formattedBestPrice = this.props.formatCurrency(bestPrice['min_price']);
    const formattedEntityPrice = this.props.formatCurrency(entity.active_registry.offer_price);
    const formattedBestPriceDate = moment(bestPrice['stores_data'][0]['timestamp']).format('DD [de] MMMM');

    let answer = null;

    if(entity.active_registry.offer_price < bestPrice['min_price']){
      answer = <Alert color="success" className="d-flex">
        <div className="pr-3 d-flex align-items-center">
          <i className="fas fa-check"/>
        </div>
        <div>
          <span><strong>¡Sí!</strong> El precio actual de {formattedEntityPrice} es mejor que el de los últimos 2 meses ({formattedBestPrice}).</span>
        </div>
      </Alert>
    } else {
      answer = <Alert color="danger" className="d-flex">
        <div className="pr-3 d-flex align-items-center">
          <i className="fas fa-times"/>
        </div>
        <div>
          <span><strong>¡No!</strong> El día {formattedBestPriceDate} el producto estuvo a {formattedBestPrice}, que es menor o igual al precio actual de {formattedEntityPrice}.</span>
        </div>
      </Alert>
    }

    return <Col sm="12" className="mt-4">
      <Card>
        <CardHeader><h2>¿Es el mejor precio que ha tenido la tienda?</h2></CardHeader>
        <CardBody>
          {answer}
          <CyberStorePricingHistoryChart entity={this.props.entity}/>
        </CardBody>
      </Card>
    </Col>
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores, formatCurrency} = solotodoStateToPropsUtils(state);
  return {
    preferredCountryStores,
    formatCurrency
  }
}

export default connect(mapStateToProps)(CyberBestStoreHistoricPrice)