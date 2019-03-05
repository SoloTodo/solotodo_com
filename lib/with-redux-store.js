import React from 'react'
import { initializeStore } from '../redux/store'
import { isServer } from '../react-utils/utils';
import {parseCookies} from "nookies";
import moment from "moment";


const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore (initialState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore(initialState)
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState)
  }
  return window[__NEXT_REDUX_STORE__]
}

export default App => {
  return class AppWithRedux extends React.Component {
    static async getInitialProps (appContext) {
      const { preferredCountry, rawPreferredStores, rawPreferredStoresLastUpdated } = parseCookies(appContext.ctx);

      const preferredStores = rawPreferredStores ? JSON.parse(rawPreferredStores) : [];
      const preferredStoresLastUpdated = rawPreferredStoresLastUpdated ? moment(rawPreferredStoresLastUpdated) : null;

      const initialState = {
        apiResourceObjects: {},
        loadedBundle: false,
        preferredCountry: preferredCountry || null,
        preferredStores: preferredStores,
        preferredStoresLastUpdated: preferredStoresLastUpdated,
      };

      const reduxStore = getOrCreateStore(initialState);

      // Provide the store to getInitialProps of pages
      appContext.ctx.reduxStore = reduxStore;

      let appProps = {};
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext)
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState()
      }
    }

    constructor (props) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render () {
      return <App {...this.props} reduxStore={this.reduxStore} />
    }
  }
}
