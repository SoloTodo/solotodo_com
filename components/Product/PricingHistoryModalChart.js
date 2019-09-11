import React from 'react'
import {connect} from "react-redux";
import moment from "moment";
import {Line} from 'react-chartjs-2';

import {chartColors, lightenDarkenColor} from "../../react-utils/colors";

import {solotodoStateToPropsUtils} from "../../redux/utils";
import Loading from "../Loading";

class PricingHistoryModalChart extends React.Component {
  preparePricingHistoryChartData = () => {
    const priceType = this.props.priceType;

    const storeMinimumPrices = {};

    for (const entityData of this.props.data) {
      if (entityData.entity.condition !== 'https://schema.org/NewCondition') {
        continue
      }

      const store = this.props.stores.filter(store => store.url === entityData.entity.store)[0];
      if (!storeMinimumPrices[store.name]) {
        storeMinimumPrices[store.name] = {}
      }

      for (const pricingEntry of entityData.pricingHistory){
        if (!pricingEntry.is_available) {
          continue
        }
        const dateKey = pricingEntry.timestamp.startOf('day');
        if (!storeMinimumPrices[store.name][dateKey]
          || pricingEntry[priceType].lt(storeMinimumPrices[store.name][dateKey][priceType])) {
          storeMinimumPrices[store.name][dateKey] = pricingEntry
        }
      }
    }
    let result = [];

    for (const storeName in storeMinimumPrices) {
      const storeData = storeMinimumPrices[storeName];
      if (Object.keys(storeData).length === 0) {
        continue
      }
      const storePricingHistory = [];
      let currentDate = this.props.startDate.clone();
      const endDate = this.props.endDate;

      while(!currentDate.isAfter(endDate)) {
        const historyPoint = storeData[currentDate];
        let price = NaN;
        let formattedPrice = '';

        if(historyPoint){
          price = historyPoint[priceType];
          formattedPrice = this.props.formatCurrency(price);
        }
        storePricingHistory.push({
          price,
          formattedPrice,
          timestamp: currentDate.clone()
        });
        currentDate = currentDate.add(1, 'day')
      }

      result.push({
        label: storeName,
        pricingHistory: storePricingHistory
      })
    }
    return result
  };

  render() {
    if (!this.props.data) {
      return <Loading/>
    }

    const filledChartData = this.preparePricingHistoryChartData();
    const preferredCurrency = this.props.preferredCurrency;
    const formatCurrency = this.props.formatCurrency;

    const yAxes = [
      {
        id: 'price-axis',
        ticks: {
          callback: function (value, index, values) {
            if (preferredCurrency) {
              return formatCurrency(value);
            } else {
              return value
            }
          }
        }
      }
    ];

    const endDate = this.props.endDate.clone().subtract(1, 'days');

    const datasets = filledChartData.map((dataset, idx) => {
      const color = chartColors[idx % chartColors.length];
      const storeName = dataset.label;

      return {
        label: storeName,
        data: dataset.pricingHistory.map(datapoint => (
          {
            x: datapoint.timestamp,
            y: datapoint.price.toString(),
            formattedPrice: datapoint.formattedPrice,
            store: storeName,
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
            min: this.props.startDate.format('YYYY-MM-DD'),
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
            return `${datapoint.store}: ${datapoint.formattedPrice}`
          }
        },
      }
    };

    const chartData = {
      datasets
    };

    return <Line data={chartData} options={chartOptions}/>

  }
}

function mapStateToProps(state) {
  const {preferredCurrency, stores, formatCurrency} = solotodoStateToPropsUtils(state);

  return {
    preferredCurrency,
    formatCurrency,
    stores
  }
}

export default connect(mapStateToProps)(PricingHistoryModalChart)