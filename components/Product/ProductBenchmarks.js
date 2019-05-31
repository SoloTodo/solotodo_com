import React, {Component} from 'react';
import {Circle} from 'rc-progress';

import {settings} from '../../settings';

class ProductBenchmarks extends Component {
  getPercentData = (value, maxValue) => {
    const percent = value * 100 / maxValue;
    if (percent > 100) {
      return '100'
    }
    return percent.toString()
  };

  getColorData = (value, maxValue) => {
    const percent = value * 100 / maxValue;

    if (percent < 25) {
      return "#dc3545"
    } else if (percent < 50) {
      return "#ffc107"
    } else if (percent < 75) {
      return "#28a745"
    }
    return "#264c85"
  };

  render() {
    const product = this.props.product;
    const category = this.props.category;
    return <div className="row">
      <div className="col-12">
        <h3 className="p-0 m-0">Puntuaciones</h3>
      </div>
      <div className="d-flex flex-row justify-content-around flex-wrap" id="benchmarks-container">
        {settings.benchmarkCategories[category.id].map(benchmark => {
          return <div key={benchmark.label} className="benchmark-container pt-3">
            <Circle
              percent={this.getPercentData(product.specs[benchmark.field], benchmark.maxValue)}
              strokeWidth="17"
              strokeColor={this.getColorData(product.specs[benchmark.field], benchmark.maxValue)}
              trailWidth="20"
              trailColor="#f5f5f5"
            />
            <p className="benchmark-name">{benchmark.label}</p>
            <p className="benchmark-score mb-0">{product.specs[benchmark.field]} / {benchmark.maxValue}</p>
          </div>
        })}
      </div>
    </div>
  }
}

export default ProductBenchmarks