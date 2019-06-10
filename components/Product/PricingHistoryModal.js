import React from 'react'
import {connect} from "react-redux";
import moment from "moment";
import {Modal, ModalHeader, ModalBody} from "reactstrap";

import {
  areObjectsEqual,
  areValueListsEqual,
  convertToDecimal,
  fetchJson
} from "../../react-utils/utils";

import {settings} from "../../settings";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import PricingHistoryModalChart from "./PricingHistoryModalChart";

class PricingHistoryModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priceType: 'offerPrice',
      startDate: moment().startOf('day').subtract(settings.defaultDaysForPricingHistory, 'days'),
      endDate: moment().startOf('day').add(1, 'days'),
      data: undefined,
      pricingModalIsActive: false
    }
  }

  pricingModalToggle = () => {
    this.setState({
      pricingModalIsActive: !this.state.pricingModalIsActive
    })
  };

  componentDidMount() {
    this.componentUpdate(this.props.preferredCountryStores, this.props.product);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.state.startDate.isSame(prevState.startDate) ||
      !this.state.endDate.isSame(prevState.endDate) ||
      !areValueListsEqual(prevProps.preferredCountryStores, this.props.preferredCountryStores) ||
      !areObjectsEqual(prevProps.preferredCountry, this.props.preferredCountry)) {
      this.componentUpdate(this.props.preferredCountryStores, this.props.product)
    }
  }

  componentUpdate = (preferredStores, product) => {
    let url = `products/${product.id}/pricing_history/?`;
    for (const store of preferredStores) {
      url += `stores=${store.id}&`
    }

    url += `timestamp_0=${moment(this.state.startDate).toISOString()}&timestamp_1=${moment(this.state.endDate).toISOString()}`;

    fetchJson(url).then(pricingData => {
      const convertedData = pricingData.map(pricingEntry => ({
        entity: pricingEntry.entity,
        pricingHistory: pricingEntry.pricing_history.map(entityHistory => ({
          timestamp: moment(entityHistory.timestamp),
          normalPrice: convertToDecimal(entityHistory.normal_price),
          offerPrice: convertToDecimal(entityHistory.offer_price)
        }))
      }));

      this.setState({
        data: convertedData
      })
    })
  };

  handleDateChange = (e) => {
    const value = moment(e.target.value);
    if (e.target.name === 'endDate') {
      value.add(1, 'days')
    }
    this.setState({
      data: undefined,
      [e.target.name]: value
    })
  };

  handlePriceTypeChange = (e) => {
    this.setState({
      priceType: e.target.value
    });
  };

  render() {
    return <React.Fragment>
      <button type="button" className="btn btn-primary btn-sm form-control" onClick={this.pricingModalToggle}>Ver detalle</button>
      <Modal id="pricing-modal" size="xl" centered isOpen={this.state.pricingModalIsActive} toggle={this.pricingModalToggle}>
        <ModalHeader>Precio histórico por tienda</ModalHeader>
        <ModalBody>
          <div className="form-inline prices-chart-container mb-3">
            <div className="form-group row ml-2">
              <label className="col-form-label" htmlFor="start-date">Desde</label>
              <div className="col-sm-6">
                <input
                  type="date"
                  name="startDate"
                  className="form-control"
                  required={true}
                  value = {this.state.startDate? this.state.startDate.format('YYYY-MM-DD') : ''}
                  onChange={this.handleDateChange}/>
              </div>
            </div>
            <div className="form-group row ml-3">
              <label className="col-form-label" htmlFor="end-date">Hasta</label>
              <div className="col-sm-6">
                <input
                  type="date"
                  name="endDate"
                  className="form-control"
                  required={true}
                  max={moment().format('YYYY-MM-DD')}
                  value = {this.state.endDate? this.state.endDate.clone().subtract(1, 'days').format('YYYY-MM-DD') : ''}
                  onChange={this.handleDateChange}/>
              </div>
            </div>
            <div className="form-group row ml-auto mr-2">
              <select
                className="custom-select chart-prices-selector"
                value={this.state.priceType}
                onChange={this.handlePriceTypeChange}>
                <option value="offerPrice">Precio oferta</option>
                <option value="normalPrice">Precio normal</option>
              </select>
            </div>
          </div>
          <div className="product-pricing-history">
            <div className="chart-container flex-grow">
              <PricingHistoryModalChart
                data={this.state.data}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                priceType={this.state.priceType}/>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {preferredCountry, preferredCountryStores} = solotodoStateToPropsUtils(state);

  return {
    preferredCountry,
    preferredCountryStores
  }
}

export default connect(mapStateToProps)(PricingHistoryModal)