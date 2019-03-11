import React from 'react'
import { connect } from 'react-redux'
import NavBar from "../components/NavBar/NavBar";
import SoloTodoHead from "../components/SoloTodoHead";

class Index extends React.Component {
  static getInitialProps ({ reduxStore, res }) {
    // console.log(res)

    return {}
  }

  render () {
    return <React.Fragment>

    </React.Fragment>
  }
}

function mapStateToProps(state) {
  return {
    apiResourceObjects: state.apiResourceObjects
  }
}

export default connect(mapStateToProps)(Index)
