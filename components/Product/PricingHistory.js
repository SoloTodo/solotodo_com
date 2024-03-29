import React from 'react'
import {connect} from "react-redux";
import moment from 'moment';
import {Line} from 'react-chartjs-2';

import {
  areObjectsEqual,
  areValueListsEqual,
  convertToDecimal,
  fetchJson
} from "../../react-utils/utils";
import {chartColors, lightenDarkenColor} from "../../react-utils/colors";

import {settings} from "../../settings";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import Loading from '../Loading'
import PricingHistoryModal from "./PricingHistoryModal";


class PricingHistory extends React.Component {
  constructor(props) {
    super(props);
    const startDate = this.props.startDate || moment().subtract(settings.defaultDaysForPricingHistory, 'days').startOf('day');
    const offSet = startDate.utcOffset();
    this.state = {
      offSet,
      startDate: startDate.utcOffset(offSet),
      endDate: moment().add(1, 'days').utcOffset(offSet).startOf('day'),
      chart: undefined
    }
  }


  componentDidMount() {
    this.componentUpdate(this.props.preferredCountryStores, this.props.product)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.product.id !== prevProps.product.id) {
      const startDate = moment().subtract(settings.defaultDaysForPricingHistory, 'days').startOf('day');
      const offSet = startDate.utcOffset();
      this.setState({
        offSet,
        startDate: startDate.utcOffset(offSet),
        endDate: moment().add(1, 'days').utcOffset(offSet).startOf('day'),
        chart: undefined
      }, () => this.componentUpdate(this.props.preferredCountryStores, this.props.product));

      return;
    }

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

    url += `timestamp_after=${moment(this.state.startDate).toISOString()}&timestamp_before=${moment(this.state.endDate).toISOString()}`;

    fetchJson(url).then(pricingData => {
      const dayMinimumPrices = {
        normalPrices: {},
        offerPrices: {}
      };

      for (const pricingEntry of pricingData){
        if (pricingEntry.entity.condition !== 'https://schema.org/NewCondition') {
          continue
        }

        for (const historyPoint of pricingEntry.pricing_history){
          if (!historyPoint.is_available) {
            continue
          }
          const timestamp = moment(historyPoint.timestamp).utcOffset(this.state.offSet).startOf('day');
          const normalPrice = convertToDecimal(historyPoint.normal_price);
          const offerPrice = convertToDecimal(historyPoint.offer_price);
          if (!dayMinimumPrices.offerPrices[timestamp] || offerPrice.lt(dayMinimumPrices.offerPrices[timestamp].offerPrice)) {
            dayMinimumPrices.offerPrices[timestamp] = {
              timestamp,
              offerPrice
            }
          }

          if (!dayMinimumPrices.normalPrices[timestamp] || normalPrice.lt(dayMinimumPrices.normalPrices[timestamp].normalPrice)) {
            dayMinimumPrices.normalPrices[timestamp] = {
              timestamp,
              normalPrice
            }
          }
        }
      }

      this.setState({
        chart: {
          data: dayMinimumPrices
        }
      })
    })
  };

  preparePricingHistoryChartData = (data, priceField, label) => {
    const pricingHistory = [];
    let currentDate = this.state.startDate.clone();
    const endDate = this.state.endDate.clone();

    while(!currentDate.isAfter(endDate)) {
      const historyPoint = data[currentDate];
      let price = NaN;
      let formattedPrice = '';

      if(historyPoint){
        price = historyPoint[priceField];
        formattedPrice = this.props.formatCurrency(price);
      }

      pricingHistory.push({
        price,
        formattedPrice,
        timestamp: currentDate.clone()
      });

      currentDate = currentDate.add(1, 'day')
    }
    return {
      label: label,
      pricingHistory
    }
  };

  handleDateChange = (e) => {
    const value = moment(e.target.value).startOf('day');
    const offSet = value.utcOffset();
    if (e.target.id === 'endDate') {
      value.add(1, 'days')
    }
    this.setState({
      chart:undefined,
      offSet,
      [e.target.id]:value.utcOffset(offSet)
    })
  };

  render() {
    if (!this.state.chart) {
      return <Loading/>
    }

    const filledChartData = [
      this.preparePricingHistoryChartData(this.state.chart.data.normalPrices, 'normalPrice', 'Precio normal (cualquier medio de pago)'),
      this.preparePricingHistoryChartData(this.state.chart.data.offerPrices, 'offerPrice', 'Precio oferta (tarjeta CMR, Cencosud, etc.)')
    ];

    const preferredCurrency = this.props.preferredCurrency;
    const formatCurrency = this.props.formatCurrency;

    const yAxes = [
      {
        id: 'price-axis',
        ticks: {
          callback: function (value, index, values) {
            if (preferredCurrency) {
              return formatCurrency(value)
            } else {
              return value
            }
          }
        }
      }
    ];

    const endDate = this.state.endDate.clone().subtract(1, 'days');

    const datasets = filledChartData.map((dataset, idx) => {
      const color = chartColors[idx % chartColors.length];
      const label = dataset.label;

      return {
        label: label,
        data: dataset.pricingHistory.map(datapoint => (
          {
            x: datapoint.timestamp,
            y: datapoint.price.toString(),
            formattedPrice: datapoint.formattedPrice
          })),
        fill: false,
        borderColor: color,
        backgroundColor: lightenDarkenColor(color, 40),
        lineTension: 0
      };
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
            if (tooltipItems) {
              const xData = data.datasets[tooltipItems[0].datasetIndex].data[tooltipItems[0].index].x;
              return xData.format('ll')
            }
            return false
          },
          label: (tooltipItem, data) => {
            const datapoint = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            return `Precio: ${datapoint.formattedPrice}`
          }
        }
      }
    };

    const chartData = {
      datasets: datasets
    };

    return <div className="product-pricing-history">
      <div className="d-flex justify-content-between">
        <h3>Precio histórico</h3>
        <div className="form-group">
            <PricingHistoryModal
              product={this.props.product}
              startDate={this.props.startDate}/>
        </div>
      </div>
      <div className="form-inline prices-chart-container mb-3">
        <div className="form-group col-xs-6">
          <label className="col-form-label pl-2" htmlFor="start-date">Desde</label>
          <div className="pl-2">
            <input
              type="date"
              id="startDate"
              className="form-control"
              required={true}
              value={this.state.startDate? this.state.startDate.format('YYYY-MM-DD') : ''}
              onChange={this.handleDateChange}/>
          </div>
        </div>
        <div className="form-group col-xs-6">
          <label className="col-form-label pl-2" htmlFor="end-date">Hasta</label>
          <div className="pl-2">
            <input
              type="date"
              id="endDate"
              className="form-control"
              required={true}
              max={moment().format('YYYY-MM-DD')}
              value={this.state.endDate? this.state.endDate.clone().subtract(1, 'days').format('YYYY-MM-DD') : ''}
              onChange={this.handleDateChange}/>
          </div>
        </div>
      </div>
      <div className="chart-container flex-grow">
        <Line data={chartData} options={chartOptions}/>
      </div>
    </div>
  }
}

function mapStateToProps(state) {
  const {preferredCountry, preferredCountryStores, preferredCurrency, formatCurrency} = solotodoStateToPropsUtils(state);

  return {
    preferredCountry,
    preferredCountryStores,
    preferredCurrency,
    formatCurrency
  }
}

export default connect(mapStateToProps)(PricingHistory)