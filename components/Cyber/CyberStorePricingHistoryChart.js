import React from 'react'
import {connect} from "react-redux";
import moment from "moment";
import {Line} from 'react-chartjs-2';

import {fetchJson} from "../../react-utils/utils";
import {chartColors, lightenDarkenColor} from "../../react-utils/colors";
import {solotodoStateToPropsUtils} from "../../redux/utils";

class CyberStorePricingHistoryChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:undefined
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

  componentUpdate() {
    const entity = this.props.entity;
    fetchJson(`entities/${entity.id}/pricing_history?timestamp_after=2019-08-01T00:00:00.000Z`).then(json => {
      this.setState({
        data: json
      })
    })
  }



  preparePricingHistoryChartData() {
    const entity = this.props.entity;
    const data = this.state.data;
    let startDate = moment('2019-08-01').startOf('day');
    const endDate = moment().startOf('day');
    let initiallyAvailable = false;

    const chartData = data.map(entityHistory => ({
      timestamp: moment(entityHistory.timestamp),
      normalPrice: entityHistory.normal_price,
      offerPrice: entityHistory.offer_price,
      isAvailable: entityHistory.is_available
    }));

    if (chartData.length) {
      initiallyAvailable = chartData[0].isAvailable
    }

    const isCurrentlyAvailable = entity.activeRegistry && entity.activeRegistry.stock !== 0;

    const datapoints = [
      this.makeEmptyDatapoint(startDate, initiallyAvailable),
      ...chartData,
    ];

    if (!isCurrentlyAvailable && chartData.length) {
      const lastDataPoint = chartData[chartData.length - 1];
      datapoints.push(this.makeEmptyDatapoint(moment(lastDataPoint.timestamp), false))
    }

    const lastPricingUpdate = moment(entity.lastPricingUpdate);

    if (lastPricingUpdate.isBefore(endDate)) {
      datapoints.push(this.makeEmptyDatapoint(lastPricingUpdate, isCurrentlyAvailable))
    }

    datapoints.push(this.makeEmptyDatapoint(moment(endDate).add(1, 'days'), initiallyAvailable));

    let lastPriceHistorySeen = undefined;
    let result = [];

    for (const pricingHistory of datapoints) {
      if (typeof lastPriceHistorySeen !== 'undefined') {
        result = result.concat(this.fillTimeLapse(
          lastPriceHistorySeen.timestamp, pricingHistory.timestamp, lastPriceHistorySeen.isAvailable))
      }
      lastPriceHistorySeen = pricingHistory;

      const subresult = {
        timestamp: moment(pricingHistory.timestamp),
        normalPrice: pricingHistory.normalPrice,
        offerPrice: pricingHistory.offerPrice,
        cellMonthlyPayment: pricingHistory.cellMonthlyPayment,
        isAvailable: Number(pricingHistory.isAvailable)
      };
      result.push(subresult);
    }

    return result
  }

  makeEmptyDatapoint = (date, isAvailable) => {
    return {
      timestamp: date,
      normalPrice: NaN,
      offerPrice: NaN,
      cellMonthlyPayment: NaN,
      isAvailable: Number(isAvailable)
    };
  };

  fillTimeLapse(startDate, endDate, isAvailable) {
    const result = [];
    const targetDate = endDate.clone().startOf('day');
    let iterDate = startDate.clone().add(1, 'days').startOf('day');

    while (iterDate < targetDate) {
      result.push(this.makeEmptyDatapoint(iterDate.clone(), isAvailable));
      iterDate.add(1, 'days')
    }

    return result;
  }

  render() {
    if (!this.state.data) {
      return null
    }
    const filledChartData = this.preparePricingHistoryChartData();

    const maxPriceValue = filledChartData.reduce((acum, datapoint) => {
      return Math.max(acum, datapoint.normalPrice || 0, datapoint.offerPrice || 0, datapoint.cellMonthlyPayment || 0)
    }, 0);

    const formatCurrency = this.props.formatCurrency;

    const yAxes = [
      {
        id: 'price-axis',
        ticks: {
          callback: value => {
            return formatCurrency(value)
          }
        }
      }
    ];

    const datasets = [
      {
        label: 'Precio oferta',
        data: filledChartData.map(datapoint => ({
          x: datapoint.timestamp,
          y: datapoint.offerPrice.toString()
        })),
        yAxisID: 'price-axis',
        fill: false,
        borderColor: '#5CB9E6',
        backgroundColor: lightenDarkenColor('#5CB9E6', 40),
        lineTension: 0
      }
    ];

    const chartOptions = {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
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
            const yAxisId = data.datasets[tooltipItem.datasetIndex].yAxisID;
            if (yAxisId === 'price-axis') {
              const formattedCurrency = formatCurrency(tooltipItem.yLabel);
              return `${data.datasets[tooltipItem.datasetIndex].label}: ${formattedCurrency}`
            }
          }
        },
        filter: function (tooltipItem, data) {
          const yAxisId = data.datasets[tooltipItem.datasetIndex].yAxisID;
          return yAxisId === 'price-axis' || yAxisId === 'stock-axis'
        },
        mode: 'index',
        intersect: false,
        position: 'nearest'
      }
    };

    const chartData = {
      labels: filledChartData.map(datapoint => datapoint.timestamp),
      datasets: datasets
    };

    return <div className="product-pricing-history">
      <div className="chart-container flex-grow">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  }
}

function mapStateToProps(state) {
  const {preferredCurrency, formatCurrency} = solotodoStateToPropsUtils(state);

  return {
    preferredCurrency,
    formatCurrency
  }
}

export default connect(mapStateToProps)(CyberStorePricingHistoryChart)