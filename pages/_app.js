import React from 'react'
import App, { Container } from 'next/app'
import { parseCookies } from 'nookies'
import {calculateResponsiveState} from 'redux-responsive'
import { Provider } from 'react-redux'
import {ToastContainer} from "react-toastify";
import {
  initializeUser,
  updateNavigation
} from '../redux/actions'
import withReduxStore from '../lib/with-redux-store'
import NavBar from "../components/NavBar/NavBar";

import Footer from "../components/Footer/Footer";
import SoloTodoHead from "../components/SoloTodoHead";
import {solotodoStateToPropsUtils} from "../redux/utils";
import {DFPSlotsProvider} from "react-dfp";
import NProgress from "next-nprogress/component";

// Import theme here because ajax-loader.gif import breaks otherwise
import 'slick-carousel/slick/slick-theme.scss';
import '../styles.scss';
import {loadRequiredResources} from "../react-utils/redux/actions";

import '../components/Product/ProductPicture.css';
import '../components/Cyber/CyberCurrentStorePrice.css'
import '../react-utils/components/Product/ProductTechSpecs.css'
import '../react-utils/api_forms/ApiForm.css'
import '../react-utils/api_forms/ApiFormDateRangeField.css'
import '../react-utils/api_forms/ApiFormRemoveOnlyListField.css'
import '../react-utils/api_forms/ApiFormResultsTable.css'
import '../react-utils/components/AxisChoices.css'
import '../react-utils/components/BannerCarousel.css'
import '../react-utils/components/Product/ProductPicture.css'
import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'



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

    return {
      pageProps
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

        <NProgress
          color="#ce5028"
          options={{ parent: "#main-container" }}
        />


        <Provider store={reduxStore}>
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
        </Provider>
      </Container>
    )
  }
}

export default withReduxStore(MyApp)
