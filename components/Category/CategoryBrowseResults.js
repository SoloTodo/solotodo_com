import React from 'react';
import CategoryBrowseResult from "./CategoryBrowseResult";

export default class CategoryBrowseResults extends React.Component {
  render() {
    if (!this.props.results.results.length) {
      return <div className="category-browse-no-results">No se han encontrado resultados</div>
    }

    return <div>
      <div className="card-block d-flex justify-content-between flex-wrap category-browse-results">
        {this.props.results.results.map(productEntry => (
            <CategoryBrowseResult
                key={productEntry.bucket}
                bucket={productEntry}
                priceFormatter={this.props.priceFormatter}
                categoryBrowseParams={this.props.categoryBrowseParams}
            />
        ))}

        <div className="category-browse-dummy">&nbsp;</div>
        <div className="category-browse-dummy">&nbsp;</div>
        <div className="category-browse-dummy">&nbsp;</div>
        <div className="category-browse-dummy">&nbsp;</div>
        <div className="category-browse-dummy">&nbsp;</div>
      </div>
    </div>
  }
}