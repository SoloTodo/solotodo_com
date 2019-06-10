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
import {formatCurrency} from "../../react-utils/next_utils";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import Loading from '../Loading'
import PricingHistoryModal from "./PricingHistoryModal";


class PricingHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment().startOf('day').subtract(settings.defaultDaysForPricingHistory, 'days'),
      endDate: moment().startOf('day').add(1, 'days'),
      chart: undefined
    }
  }


  componentDidMount() {
    this.componentUpdate(this.props.preferredCountryStores, this.props.product)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.product.id !== prevProps.product.id) {
      this.setState({
        startDate: moment().startOf('day').subtract(settings.defaultDaysForPricingHistory, 'days'),
        endDate: moment().startOf('day').add(1, 'days'),
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

    url += `timestamp_0=${moment(this.state.startDate).toISOString()}&timestamp_1=${moment(this.state.endDate).toISOString()}`;

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
          const timestamp = moment(historyPoint.timestamp).startOf('day');
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
        formattedPrice = formatCurrency(
          price,
          this.props.preferredCurrency,
          null,
          this.props.numberFormat.thousands_separator,
          this.props.numberFormat.decimal_separator
        );
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
    const value = moment(e.target.value);
    if (e.target.id === 'endDate') {
      value.add(1, 'days')
    }
    this.setState({
      chart:undefined,
      [e.target.id]:value
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

    const numberFormat = this.props.numberFormat;
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
                numberFormat.thousands_separator,
                numberFormat.decimal_Separator
              )
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
            return tooltipItems.length && moment(tooltipItems[0].xLabel).format('ll')
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
      <h3>Precio histórico</h3>
      <div className="form-inline prices-chart-container mb-3">
        <div className="form-group row ml-2">
          <label className="col-form-label" htmlFor="start-date">Desde</label>
          <div className="col-sm-6">
            <input
              type="date"
              id="startDate"
              className="form-control"
              required={true}
              value={this.state.startDate? this.state.startDate.format('YYYY-MM-DD') : ''}
              onChange={this.handleDateChange}/>
          </div>
        </div>
        <div className="form-group row ml-3">
          <label className="col-form-label" htmlFor="end-date">Hasta</label>
          <div className="col-sm-6">
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
        <div className="form-group row ml-auto mr-2">
          <div className="col-sm-12">
            <PricingHistoryModal product={this.props.product}/>
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
  const {preferredCountry, preferredCountryStores, preferredCurrency, numberFormat} = solotodoStateToPropsUtils(state);

  return {
    preferredCountry,
    preferredCountryStores,
    preferredCurrency,
    numberFormat
  }
}

export default connect(mapStateToProps)(PricingHistory)