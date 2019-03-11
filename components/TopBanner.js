import React from 'react';
import {connect} from "react-redux";
import {AdSlot} from "react-dfp";

class TopBanner extends React.Component {
  render() {
    const sizes = this.props.isExtraSmall ? [[320, 50], [300, 50]] : [[728,90], [970, 90]];

    const category = this.props.category;
    const targetingArguments = {
      category
    };

    return <div className="col-12 mt-2 mb-2 d-flex flex-row justify-content-center">
      <AdSlot sizes={sizes} adUnit="top_banner" targetingArguments={targetingArguments} />
    </div>
  }
}

function mapStateToProps(state) {
  return {
    isExtraSmall: state.browser.is.extraSmall
  }
}

export default connect(mapStateToProps)(TopBanner)
