import React from 'react'
import Head from "next/head";
import ReactDisqusComments from 'react-disqus-comments';
import {settings} from '../../../settings'
import {apiResourceStateToPropsUtils} from "../../../react-utils/ApiResource";
import TopBanner from "../../../components/TopBanner";
import BudgetViewTable from "../../../components/Budget/BudgetViewTable";
import {connect} from "react-redux";


class Budget extends React.Component {
  static async getInitialProps(ctx){
    const { res, query, reduxStore } = ctx;
    const reduxState = reduxStore.getState();

    const {fetchAuth} = apiResourceStateToPropsUtils(reduxState, ctx);

    const budgetId = query.id;
    const budgetUrl = `${settings.apiResourceEndpoints.budgets}${budgetId}`;

    let budget;

    try{
      budget = await fetchAuth(budgetUrl);
    } catch (e) {
      if (res) {
        res.statusCode=404;
        res.end('Not found');
        return
      }
    }

    return {
      budget
    }
  }

  render() {
    const budget = this.props.budget;

    let videoWidth = 560;
    let videoHeight = 315;

    if (this.props.isExtraSmall) {
      videoWidth = 300;
      videoHeight = 169;
    }


    return <React.Fragment>
      <Head>
        <title key="title">{budget.name} - SoloTodo</title>
      </Head>
      <div className="pl-3 pr-3">
        <div className="row">
          <TopBanner category="Hardware"/>
          <div className="col-12">
            <h1>{budget.name}</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-8">
            <div className="content-card mb-3">
              <BudgetViewTable budget={budget}/>
            </div>
          </div>
          {budget.is_public &&
          <div className="col-12 col-lg-8 mb-3">
            <div className="content-card">
              <div className="row">
                <div className="col-12">
                  <h3>¡Arma un PC gamer por 500 - 600 lucas!</h3>
                </div>
              </div>
              <div className="row d-flex justify-content-center mb-2">
                <iframe
                  width={`${videoWidth}`}
                  height={`${videoHeight}`}
                  src="https://www.youtube.com/embed/29-2Qkm61aY"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen/>
              </div>
            </div>
          </div>}
          {budget.is_public &&
          <div className="col-12">
            <div className="content-card">
              <ReactDisqusComments
                shortname={settings.disqusShortName}
                identifier={`budget_${budget.id}`}
                url={`https://www.solotodo.com/budgets/${budget.id}`}
              />
            </div>
          </div>}
        </div>
      </div>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  return {
    isExtraSmall: state.browser.is.extraSmall
  }
}

export default connect(mapStateToProps)(Budget)
