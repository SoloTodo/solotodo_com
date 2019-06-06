import React from 'react'
import App, { Container } from 'next/app'
import { parseCookies } from 'nookies'
import {calculateResponsiveState} from 'redux-responsive'
import { Provider } from 'react-redux'
import {ToastContainer} from "react-toastify";
import { loadRequiredResources } from '../react-utils/redux/actions'
import {initializeUser, updateNavigation} from '../redux/actions'
import withReduxStore from '../lib/with-redux-store'
import uuidv4 from "uuid/v4"
import AppContext from '../react-utils/components/Context'
import NavBar from "../components/NavBar/NavBar";

import Footer from "../components/Footer/Footer";
import SoloTodoHead from "../components/SoloTodoHead";
import {solotodoStateToPropsUtils} from "../redux/utils";
import {DFPSlotsProvider} from "react-dfp";

// Import theme here because ajax-loader.gif import breaks otherwise
import 'slick-carousel/slick/slick-theme.scss';
import '../styles.scss';

class MyApp extends App {
  static async getInitialProps(appContext) {
    const reduxStore = appContext.ctx.reduxStore;

    if (appContext.ctx.req) {
      // Load the required resources and initialize the user only on the first request (on the server)

      await reduxStore.dispatch(loadRequiredResources(['countries', 'currencies', 'store_types', 'stores', 'number_formats', 'categories', 'category_templates']));

      const {authToken} = parseCookies(appContext.ctx);
      await reduxStore.dispatch(initializeUser(authToken, reduxStore.getState(), appContext.ctx));
      const {preferredCountry} = solotodoStateToPropsUtils(reduxStore.getState());
      await reduxStore.dispatch(updateNavigation(preferredCountry.url))
    }

    let pageProps = {};

    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx)
    }

    const namespace = uuidv4();

    return {
      pageProps,
      namespace
    }
  }

  componentDidMount() {
    // Re-render on frontend due to varying window sizes

    const store = this.props.reduxStore;
    store.dispatch(calculateResponsiveState(window));
  }

  render () {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Container>
        <SoloTodoHead />

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
          <AppContext.Provider value={{namespace:this.props.namespace}}>
            <DFPSlotsProvider
              dfpNetworkId='/21667261583'
              sizeMapping={[
                {viewport: [1024, 768], sizes:[[728, 90], [300, 50]]},
                {viewport: [900, 768], sizes:[[320, 50]] }
              ]}
              adSenseAttributes={{page_url: 'www.solotodo.com'}}>
              <NavBar />
              <div id="main-container">
                <Component {...pageProps} />
              </div>
              <Footer />
            </DFPSlotsProvider>
          </AppContext.Provider>
        </Provider>
      </Container>
    )
  }
}

export default withReduxStore(MyApp)
