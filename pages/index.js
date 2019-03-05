import React from 'react'
import { connect } from 'react-redux'

class Index extends React.Component {
  static getInitialProps ({ reduxStore, res }) {
    // console.log(res)

    return {}
  }

  componentDidMount() {
    // document.cookie = 'authToken=8503c95504277ffa1a06d792c394a78ce24ed910'
  }

  render () {
    return <div>
      <h1>Hola!</h1>

      <ul>
        {Object.keys(this.props.apiResourceObjects).map(apiResourceObjectUrl => <li key={apiResourceObjectUrl}>
          {apiResourceObjectUrl}
        </li>)}
      </ul>
    </div>
  }
}

function mapStateToProps(state) {
  return {
    apiResourceObjects: state.apiResourceObjects
  }
}

export default connect(mapStateToProps)(Index)
