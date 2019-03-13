import React from 'react'
import { connect } from 'react-redux'
import { solotodoStateToPropsUtils } from "../redux/utils";

class Index extends React.Component {
  static getInitialProps ({ reduxStore, res }) {
    // console.log(res)

    return {}
  }

  render () {
    return <React.Fragment>
      <div>
        <h1>Preferred Country: {this.props.preferredCountry.name}</h1>
        <h1>Preferred stores:</h1>
        <ul>
          {this.props.preferredStores.map(store => <li key={store.id}>
            {store.name}
          </li>)}
        </ul>
        
      </div>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {preferredCountry, preferredStores} = solotodoStateToPropsUtils(state);
  
  return {
    apiResourceObjects: state.apiResourceObjects,
    preferredCountry,
    preferredStores
  }
}

export default connect(mapStateToProps)(Index)
