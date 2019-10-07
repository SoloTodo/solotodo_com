import React from 'react'
import {connect} from "react-redux";
import {Alert, Card, CardBody, CardHeader, Col} from "reactstrap";

import {fetchJson} from "../../react-utils/utils";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import PricingHistory from "../Product/PricingHistory";
import moment from "moment";


class CyberBestMarketHistoricPrice extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      bestPrice: undefined
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
    let url = `/products/${product_id}/min_history_price/?timestamp_0=2019-08-01T00:00:00.000Z&timestamp_1=2019-10-01T12:00:00`;

    for (const store of this.props.preferredCountryStores){
      url = url + `&stores=${store.id}`
    }

    fetchJson(url).then(bestPrice => {
      this.setState({
        bestPrice
      })
    })
  };

  render() {
    if (!this.state.bestPrice) {
      return null
    }

    const bestPrice = this.state.bestPrice;
    const entity = this.props.entity;

    const formattedBestPrice = this.props.formatCurrency(bestPrice['min_price']);
    const formattedEntityPrice = this.props.formatCurrency(entity.active_registry.offer_price);

    let answer = null;

    if(entity.active_registry.offer_price < bestPrice['min_price']){
      answer = <Alert color="success" className="d-flex">
        <div className="pr-3 d-flex align-items-center">
          <i className="fas fa-check"/>
        </div>
        <div>
          <span><strong>¡Sí!</strong> El precio actual de {formattedEntityPrice} es el mejor que ha tenido el mercado en los últimos 2 meses.</span>
        </div>
      </Alert>
    } else {
      answer = <Alert color="danger" className="d-flex">
        <div className="pr-3 d-flex align-items-center">
          <i className="fas fa-times"/>
        </div>
        <div>
          <span><strong>¡No!</strong> El producto estuvo disponible a {formattedBestPrice}, que es menor o igual al precio actual ({formattedEntityPrice}) en las siguientes tiendas:</span>
          <ul className="mb-0">
            {bestPrice.stores_data.map(store_data => {
              const store = this.props.preferredCountryStores.filter(store => store.url === store_data.store)[0]
              const formattedDate = moment(store_data.timestamp).format('DD [de] MMMM');
              return <li key={store.id}>{store.name}, el día {formattedDate}</li>
            })}
          </ul>
        </div>
      </Alert>
    }

    const startDate = moment('2019-08-01').startOf('day');

    return <Col sm="12" className="mt-4">
      <Card>
        <CardHeader><h2>¿Es el mejor precio que ha tenido el mercado?</h2></CardHeader>
        <CardBody>
          {answer}
          <PricingHistory
            product={this.props.entity.product}
            startDate={startDate}/>
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

export default connect(mapStateToProps)(CyberBestMarketHistoricPrice)