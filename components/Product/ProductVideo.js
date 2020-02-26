import React from 'react'

import {fetchJson} from "../../react-utils/utils";
import {withRouter} from "next/dist/client/router";
import {connect} from "react-redux";

class ProductVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoTitle: undefined,
      videoUrl: undefined
    }
  }

  componentDidMount() {
    this.componentUpdate()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.product.id !== prevProps.product.id){
      this.componentUpdate()
    }
  }

  componentUpdate = () => {
    fetchJson(`products/${this.props.product.id}/videos/`).then(productVideos => {
      if (productVideos.length > 0) {
        const videoUrl = `https://www.youtube.com/embed/${productVideos[0].youtube_id}`;
        const videoTitle = productVideos[0].name;
        this.setState({
          videoUrl,
          videoTitle
        })
      } else {
        this.setState({
          videoUrl: undefined
        })
      }
    })
  };

  render() {
    if (!this.state.videoUrl) {
      return null
    }

    let videoWidth = 560;
    let videoHeight = 315;

    if (this.props.isExtraSmall) {
      videoWidth = 300;
      videoHeight = 169;
    }

    return <div className="content-card">
      <div className="row">
        <div className="col-12">
          <h3>{this.state.videoTitle}</h3>
        </div>
      </div>
      <div className="row d-flex justify-content-center mb-2">
        <iframe
          width={`${videoWidth}`}
          height={`${videoHeight}`}
          src={this.state.videoUrl} frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen/>
      </div>

    </div>
  }
}

function mapStateToProps(state) {
  return {
    isExtraSmall: state.browser.is.extraSmall,
  }
}
export default withRouter(connect(mapStateToProps)(ProductVideo))