import React from 'react';
import Router from "next/router";

class SearchByKeywords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: ''
    }
  }

  handleKeywordsChange = evt => {
    this.setState({
      keywords: evt.target.value
    });
  };

  handleFormSubmit = evt => {
    evt.preventDefault();
    window.scrollTo(0, 0);
    Router.push(
      `/search?search=${encodeURIComponent(this.state.keywords)}`,
      `/search?search=${encodeURIComponent(this.state.keywords)}`
    );
  };

  render() {
    return <div className="mr-2">
      <form onSubmit={this.handleFormSubmit}>
        <div className="form-group mb-0">
          <div className="input-group">
            <input type="text"
                   className="form-control"
                   id="searcher"
                   placeholder="Buscar"
                   onChange={this.handleKeywordsChange}
                   value={this.state.keywords}
            />
            <div className="input-group-append">
              <button className="btn btn-light" type="submit"><i className="fas fa-search">&nbsp;</i></button>
            </div>
          </div>
        </div>
      </form>
    </div>
  }
}

export default SearchByKeywords