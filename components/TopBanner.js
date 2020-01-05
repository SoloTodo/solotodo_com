import React from 'react';
import {connect} from "react-redux";
import {AdSlot, DFPManager} from "react-dfp";
import Router from 'next/router'

class TopBanner extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   category: props.category
    // }
  }

  componentDidMount() {
    // console.log('componentDidMount')
    // console.log('reloading banner')
    // DFPManager.reload();
    Router.events.on('routeChangeComplete', this.routeChangeHandler)
  }

  componentWillUnmount() {
    // console.log('componentWillUnmount')
    Router.events.off('routeChangeStart', this.routeChangeHandler)
  }

  routeChangeHandler = () => {
    DFPManager.reload();
    // DFPManager.refresh();

    // this.setState({
    //   category: null
    // });
  };

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   console.log('componentDidUpdate')
  //
  //   if (prevProps.category !== this.props.category) {
  //
  //   }
  //
  //   if (!this.state.category) {
  //     this.setState({
  //       category: this.props.category
  //     })
  //   }
  // }

  render() {
    // console.log('render')

    // if (!this.state.category) {
    //   console.log('Invalidating banner');
    //   return null
    // }

    const sizes = this.props.isExtraSmall ? [[320, 50], [300, 50]] : [[728,90], [970, 90]];

    return <div className="col-12 mt-2 mb-2 d-flex flex-row justify-content-center">
      <AdSlot
        sizes={sizes}
        adUnit="top_banner"
        targetingArguments={{category: this.props.category}}
      />
    </div>
  }
}

function mapStateToProps(state) {
  return {
    isExtraSmall: state.browser.is.extraSmall
  }
}

export default connect(mapStateToProps)(TopBanner)
