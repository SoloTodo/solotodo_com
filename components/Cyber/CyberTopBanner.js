import React from 'react';
import {connect} from "react-redux";


class CyberTopBanner extends React.Component {
  render() {
    const source = this.props.isExtraSmall? "/static/cyber_banner_mobile.png":"/static/cyber_banner_desktop.png";
    const width = this.props.isExtraSmall? 320 : 768;
    const height = this.props.isExtraSmall? 50 : 90;
    return <div className="col-12 mt-3 mb-3 d-flex flex-row justify-content-center">
      <img src={source} alt="cyber banner" width={width} height={height}/>
    </div>
  }
}

function mapStateToProps(state) {
  return {
    isExtraSmall: state.browser.lessThan.medium
  }
}

export default connect(mapStateToProps)(CyberTopBanner)
