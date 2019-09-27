import React from 'react'
import {connect} from "react-redux";
import {Card, CardBody, CardHeader, Col} from "reactstrap";

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
    const url = `/products/${product_id}/min_history_price/?&stores=${store_id}&timestamp_0=2019-08-01T00:00:00.000Z&timestamp_1=2019-10-06T23:59:59.9`;
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

    return <Col sm={{size:8, offset: 2}} className="mt-4">
      <Card>
        <CardHeader><h2>Mejor Precio Tienda últimos 2 Meses</h2></CardHeader>
        <CardBody>
          {this.state.bestStorePrice['min_price']}
          <CyberStorePricingHistoryChart entity={this.props.entity}/>
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

export default connect(mapStateToProps)(CyberBestStoreHistoricPrice)