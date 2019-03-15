import React from 'react';

export default class CategoryResultCount extends React.Component {
  render() {
    if (!this.props.resultCount || !this.props.page) {
      return null
    }

    const page = this.props.page.id;
    const pageSize = this.props.resultsPerPage;
    const resultCount = this.props.resultCount;

    const startValue = (page - 1) * pageSize + 1;
    const endValue = Math.min(page * pageSize, resultCount);

    return <span className="category-browse-result-count">{startValue} - {endValue} de {resultCount} resultados</span>
  }
}