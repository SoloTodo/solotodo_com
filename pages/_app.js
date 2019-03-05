import React from 'react'
import App, { Container } from 'next/app'
import { Provider } from 'react-redux'
import {ToastContainer} from "react-toastify";
import { loadRequiredResources } from '../react-utils/redux/actions'
import { initializeUser } from '../redux/actions'
import withReduxStore from '../lib/with-redux-store'
import { parseCookies } from 'nookies'


import '../styles.scss';

class MyApp extends App {
  static async getInitialProps(appContext) {
    const reduxStore = appContext.ctx.reduxStore;

    if (!reduxStore.getState().loadedBundle) {
      await reduxStore.dispatch(loadRequiredResources(['countries', 'currencies', 'store_types', 'stores', 'number_formats', 'categories', 'category_templates']));
    }

    const { authToken } = parseCookies(appContext.ctx);
    await reduxStore.dispatch(initializeUser(authToken, reduxStore.getState(), appContext.ctx));

    let pageProps = {};

    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx)
    }

    return {
      pageProps
    }
  }

  render () {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Container>
        <ToastContainer
          position="top-right"
          type="default"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          className="toast-container"
        />

        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}

export default withReduxStore(MyApp)
