import React from 'react'
import Head from "next/head";
import ReactDisqusComments from 'react-disqus-comments';
import {settings} from '../../settings'
import {withRouter} from 'next/router'
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import TopBanner from "../../components/TopBanner";
import BudgetViewTable from "../../components/Budget/BudgetViewTable";
import CyberCheckBanner from "../../components/CyberCheckBanner";


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
    return <React.Fragment>
      <Head>
        <title key="title">{budget.name} - SoloTodo</title>
      </Head>
      <div className="pl-3 pr-3">
        <div className="row">
          <TopBanner category="Hardware"/>
          <div className="col-12">
            <CyberCheckBanner />

            <h1>{budget.name}</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-8 ">
            <div className="content-card mb-3">
              <BudgetViewTable budget={budget}/>
            </div>
          </div>
          {budget.is_public &&
          <div className="col-12 col-xl-4">
            <div className="content-card mb-3">
              <h4>Si va a pedir ayuda sobre una cotización</h4>

              <ul className="mb-0">
                <li>
                  Diga con todo el detalle posible el uso
                  que le va a dar al PC y su presupuesto.
                </li>
                <li>
                  Si ya tiene alguna de las partes, dígalo
                </li>
                <li>
                  Si sólo puede / quiere comprar en una tienda, dígalo
                </li>
                <li>
                  Si tiene amor u odio por alguna marca en particular
                  (Intel / AMD / NVIDIA), dígalo.
                </li>
                <li>
                  <a href="https://www.youtube.com/watch?v=Uyq8-7tc5Eo" target="_blank" rel="noopener noreferrer">
                    Recomendamos pedir las cosas como corresponde
                  </a>
                </li>
              </ul>
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

export default withRouter(Budget)