import React from 'react'
import {connect} from "react-redux";
import moment from 'moment';

import {fetchJson, convertToDecimal} from "../../react-utils/utils";

import {settings} from "../../settings";
import {formatCurrency} from "../../react-utils/next_utils";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import Loading from '../Loading'

class PricingHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priceType: 'offer',
      startDate: undefined,
      endDate: undefined,
      chart: undefined
    }
  }


  componentDidMount() {
    this.componentUpdate(this.props.preferredCountryStores, this.props.product)
  }

  componentUpdate = (preferredStores, product) => {
    let url = `products/${product.id}/pricing_history/?`;
    for (const store of preferredStores) {
      url += `stores=${store.id}&`
    }

    if (!this.state.startDate) {
      url += `timestamp_0=${moment().startOf('day').subtract(settings.defaultDaysForPricingHistory, 'days').toISOString()}&`;
    } else {
      url += `timestamp_0=${moment(this.state.startDate).toISOString()}&timestamp_1=${moment(this.state.endDate).toISOString()}`
    }

    fetchJson(url).then(pricingData => {
      const convertedData = pricingData.map(pricingEntry => ({
        entity: pricingEntry.entity,
        pricingHistory: pricingEntry.pricing_history.map(entityHistory => ({
          timestamp: moment(entityHistory.timestamp).startOf('day'),
          normalPrice: convertToDecimal(entityHistory.normal_price),
          offerPrice: convertToDecimal(entityHistory.offer_price)
        }))
      }));

      const dayMinimumPrices = {};

      for (const pricingEntry of convertedData){
        for (const historyPoint of pricingEntry.pricingHistory){
          if (!dayMinimumPrices[historyPoint.timestamp] || historyPoint.offerPrice.lt(dayMinimumPrices[historyPoint.timestamp].offerPrice)) {
            dayMinimumPrices[historyPoint.timestamp] = historyPoint;
          }
        }
      }

      this.setState({
        chart: {
          startDate: moment().startOf('day').subtract(settings.defaultDaysForPricingHistory, 'days'),
          endDate: moment().startOf('day'),
          data: dayMinimumPrices
        }
      })
    })
  };

  preparePricingHistoryChartData = () => {
    const priceField = `${this.state.priceType}Price`;
    const pricingHistory = [];
    let currentDate = this.state.chart.startDate;
    const endDate = this.state.chart.endDate.clone();


    while(!currentDate.isAfter(endDate)) {
      const historyPoint = this.state.chart.data[currentDate];
      let price = NaN;
      let formattedPrice = '';

      if(historyPoint){
        price = historyPoint[priceField];
        formattedPrice = formatCurrency(
          price,
          this.props.preferredCurrency,
          null,
          this.props.preferredCountry.number_format.thousandsSeparator,
          this.props.preferredCountry.number_format.decimalSeparator
        );
      }

      pricingHistory.push({
          price,
          formattedPrice,
          timestamp: currentDate.clone()
        });

      currentDate = currentDate.add(1, 'day')
    }
    return pricingHistory
  };

  render() {
    if (!this.state.chart) {
      return <Loading/>
    }

    const chartData = this.preparePricingHistoryChartData();
    console.log(chartData);

    return <div>Hola</div>
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores, preferredCountry, preferredCurrency} = solotodoStateToPropsUtils(state);

  return {
    preferredCountryStores,
    preferredCountry,
    preferredCurrency
  }
}

export default connect(mapStateToProps)(PricingHistory)