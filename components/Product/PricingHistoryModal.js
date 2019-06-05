import React from 'react'
import moment from "moment";
import {Line} from 'react-chartjs-2';
import {Modal, ModalHeader, ModalBody} from "reactstrap";

import {settings} from "../../settings";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import {connect} from "react-redux";
import {convertToDecimal, fetchJson} from "../../react-utils/utils";
import Loading from "../Loading";
import {formatCurrency} from "../../react-utils/next_utils";
import {
  chartColors,
  lightenDarkenColor
} from "../../../solotodo_frontend/src/react-utils/colors";

class PricingHistoryModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priceType: 'offerPrice',
      startDate: moment().startOf('day').subtract(settings.defaultDaysForPricingHistory, 'days'),
      endDate: moment().startOf('day').add(1, 'days'),
      chart: undefined,
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
      !this.state.endDate.isSame(prevState.endDate)) {
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
        chart: {
          data: convertedData
        }
      })

    })
  };

  preparePricingHistoryChartData = () => {
    const priceType = this.state.priceType;

    let result = [];
    for (const datapoint of this.state.chart.data) {
      const entity = datapoint.entity;
      let lastTimestampSeen = undefined;

      let pricingHistory = [];

      for (const entityHistory of datapoint.pricingHistory) {
        const timestamp = moment(entityHistory.timestamp);

        if (lastTimestampSeen) {
          pricingHistory = pricingHistory.concat(this.fillTimeLapse(lastTimestampSeen, timestamp))
        }

        const price = entityHistory[priceType];
        const preferredCountry = this.props.preferredCountry;
        const preferredCurrency = this.props.preferredCurrency;
        const formattedPrice = formatCurrency(
          price,
          preferredCurrency,
          null,
          preferredCountry.number_format.thousandsSeparator,
          preferredCountry.number_format.decimalSeparator
        );

        lastTimestampSeen = timestamp;

        pricingHistory.push({
          entity,
          price,
          formattedPrice,
          timestamp,
        })
      }

      result.push({
        entity,
        pricingHistory
      })
    }
    return result;
  };

  fillTimeLapse = (startDate, endDate) => {
    const result = [];
    const targetDate = endDate.clone().startOf('day');
    let iterDate = startDate.clone().add(1, 'days').startOf('day');

    while (iterDate < targetDate) {
      result.push(this.makeEmptyDatapoint(iterDate.clone()));
      iterDate.add(1, 'days')
    }

    return result;
  };

  makeEmptyDatapoint = (date) => {
    return {
      timestamp: date,
      price: NaN,
    };
  };

  handleDateChange = (e) => {
    const value = moment(e.target.value);
    if (e.target.name === 'endDate') {
      value.add(1, 'days')
    }
    this.setState({
      chart:undefined,
      [e.target.name]:value
    })
  };

  render() {
    if (!this.state.chart) {
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
                Aquí va el select
              </div>
            </div>
            <div className="product-pricing-history">
              <div className="chart-container flex-grow">
                <Loading/>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </React.Fragment>
    }

    const filledChartData = this.preparePricingHistoryChartData();
    const preferredCountry = this.props.preferredCountry;
    const preferredCurrency = this.props.preferredCurrency;

    const yAxes = [
      {
        id: 'price-axis',
        ticks: {
          callback: function (value, index, values) {
            if (preferredCurrency) {
              return formatCurrency(
                value,
                preferredCurrency,
                null,
                preferredCountry.number_format.thousandsSeparator,
                preferredCountry.number_format.decimalSeparator);
            } else {
              return value
            }
          }
        }
      }
    ];

    const endDate = this.state.endDate.clone();

    const datasets = filledChartData.map((dataset, idx) => {
      const color = chartColors[idx % chartColors.length];
      const store = this.props.preferredCountryStores.filter(store => store.url === dataset.entity.store)[0];

      let datasetLabel = store.name;
      if (dataset.entity.cell_plan) {
        datasetLabel += ` (${dataset.entity.cell_plan_name})`
      }
      return {
        label: datasetLabel,
        data: dataset.pricingHistory.map(datapoint => (
          {
            x: datapoint.timestamp,
            y: datapoint.price.toString(),
            formattedPrice: datapoint.formattedPrice,
            store: store.name,
            cellPlan: dataset.entity.cellPlan
          })),
        fill: false,
        borderColor: color,
        backgroundColor: lightenDarkenColor(color, 40),
        lineTension: 0
      }
    });

    const chartOptions = {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            min: this.state.startDate.format('YYYY-MM-DD'),
            max: endDate.format('YYYY-MM-DD'),
            displayFormats: {
              day: 'MMM DD'
            },
            unit: 'day'
          }
        }],
        yAxes: yAxes
      },
      legend: {
        position: 'bottom'
      },
      maintainAspectRatio: false,
      tooltips: {
        callbacks: {
          title: (tooltipItems, data) => {
            return tooltipItems.length && moment(tooltipItems[0].xLabel).format('llll')
          },
          label: (tooltipItem, data) => {
            const datapoint = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            if (datapoint.cellPlan) {
              return `${datapoint.store} (${datapoint.cellPlan.name}): ${datapoint.formattedPrice}`
            } else {
              return `${datapoint.store}: ${datapoint.formattedPrice}`
            }
          }
        },
      }
    };

    const chartData = {
      datasets: datasets
    };

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
              Aquí va el select
            </div>
          </div>
          <div className="product-pricing-history">
            <div className="chart-container flex-grow">
              <Line data={chartData} options={chartOptions}/>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores, preferredCountry, preferredCurrency, stores} = solotodoStateToPropsUtils(state);

  return {
    preferredCountryStores,
    preferredCountry,
    preferredCurrency,
    stores
  }
}

export default connect(mapStateToProps)(PricingHistoryModal)