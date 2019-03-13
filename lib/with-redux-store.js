import React from 'react'
import { initializeStore } from '../redux/store'
import { isServer } from '../react-utils/utils';
import {parseCookies} from "nookies";
import moment from "moment";
import parser from 'ua-parser-js'


const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore (initialState, isMobile) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore(initialState, isMobile)
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState, isMobile)
  }
  return window[__NEXT_REDUX_STORE__]
}

export default App => {
  return class AppWithRedux extends React.Component {
    static async getInitialProps(appContext) {
      // Initial viewport (desktop or mobile)
      const req = appContext.ctx.req;
      const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
      const ua = parser(userAgent);
      const isMobile = ua.device.type === 'mobile';

      // Preferences
      const { preferredCountryId, preferredStoreIds, preferredStoresLastUpdated } = parseCookies(appContext.ctx);

      const cleanedPreferredStoreIds = preferredStoreIds ? JSON.parse(preferredStoreIds) : null;
      const cleanedPreferredStoresLastUpdated = preferredStoresLastUpdated ? moment(preferredStoresLastUpdated) : null;

      const initialState = {
        apiResourceObjects: {},
        loadedBundle: false,
        preferredCountryId: preferredCountryId || null,
        preferredStoreIds: cleanedPreferredStoreIds,
        preferredStoresLastUpdated: cleanedPreferredStoresLastUpdated,
      };

      const reduxStore = getOrCreateStore(initialState, isMobile);

      // Provide the store to getInitialProps of pages
      appContext.ctx.reduxStore = reduxStore;

      let appProps = {};
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext)
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState(),
        isMobile
      }
    }

    constructor (props) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState, props.isMobile)
    }

    render () {
      return <App {...this.props} reduxStore={this.reduxStore} />
    }
  }
}
