import React from 'react'

import {fetchJson} from "../../react-utils/utils";

class ProductVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoUrl: undefined
    }
  }

  componentDidMount() {
    this.componentUpdate(this.props.product)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(prevProps);
    if (this.props.product.id !== prevProps.product.id){
      this.componentDidUpdate(this.props.product)
    }
  }

  componentUpdate = product => {
    fetchJson(`products/${product.id}/videos`).then(productVideos => {
      if (productVideos.length > 0) {
        const videoUrl = `https://www.youtube.com/embed/${productVideos[0].youtube_id}`;
        this.setState({
          videoUrl
        })
      }
    })
  };

  render() {
    if (!this.state.videoUrl) {
      return null
    }

    return <div className="content-card">
      <div className="row">
        <div className="col-12">
          <h3>Video</h3>
        </div>
      </div>
      <div className="row ml-3 mb-2">
        <iframe
          width="560" height="315"
          src={this.state.videoUrl} frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen/>
      </div>

    </div>
  }
}

export default ProductVideo