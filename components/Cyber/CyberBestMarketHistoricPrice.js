import React from 'react'
import {connect} from "react-redux";
import {Card, CardBody, CardHeader, Col} from "reactstrap";

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
    const url = `/products/${product_id}/min_history_price/?timestamp_0=2019-08-01T00:00:00.000Z&timestamp_1=2019-10-06T23:59:59.9`;
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

    const startDate = moment('2019-08-01').startOf('day');

    return <Col sm={{size:8, offset: 2}} className="mt-4">
      <Card>
        <CardHeader><h2>Mejor Precio Mercado últimos 2 Meses</h2></CardHeader>
        <CardBody>
          {this.state.bestPrice['min_price']}
          <PricingHistory
            product={this.props.entity.product}
            startDate={startDate}/>
        </CardBody>
      </Card>
    </Col>
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores} = solotodoStateToPropsUtils(state);
  return {
    preferredCountryStores,
  }
}

export default connect(mapStateToProps)(CyberBestMarketHistoricPrice)