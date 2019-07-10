import React from 'react'
import {connect} from "react-redux";
import Router, {withRouter} from 'next/router'
import Big from 'big.js';

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {
  areObjectListsEqual,
  convertIdToUrl,
  fetchJson
} from "../../react-utils/utils";

import {solotodoStateToPropsUtils} from "../../redux/utils";
import Loading from "../../components/Loading";
import BudgetEditDesktop from "../../components/Budget/BudgetEditDesktop";
import BudgetEditMobile from "../../components/Budget/BudgetEditMobile";
import Head from "next/head";

class BudgetEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      budget: undefined,
      pricingEntries: undefined,
      compatibilityIssues: undefined,
    }
  }

  static async getInitialProps(ctx){
    const { res, query, reduxStore } = ctx;
    const reduxState = reduxStore.getState();

    const {user} = solotodoStateToPropsUtils(reduxState);
    const {fetchAuth} = apiResourceStateToPropsUtils(reduxState, ctx);

    const budgetId = query.id;
    const budgetUrl = convertIdToUrl(budgetId, 'budgets');
    let initialBudget;

    try{
      initialBudget = await fetchAuth(budgetUrl);
    } catch (e) {
      if (res) {
        res.statusCode = 404;
        res.end('Not found');
        return
      }
    }

    if (!user || (!user.is_superuser && initialBudget.user.id !== user.id)) {
      if (res) {
        res.writeHead(302, {
          Location: '/'
        });
        res.end()
      } else {
        Router.push('/')
      }
      return
    }

    return {
      initialBudget
    }
  }

  componentDidMount() {
    this.setState({
      budget: this.props.initialBudget
    }, () => this.componentUpdate());
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const oldPreferredStores = prevProps.preferredCountryStores;
    const newPreferredStores = this.props.preferredCountryStores;

    const oldBudget = prevProps.initialBudget;
    const newBudget = this.props.initialBudget;

    if (oldBudget.id !== newBudget.id) {
      this.setState({
        budget:newBudget
      }, () => this.componentUpdate())
    }

    if (!areObjectListsEqual(oldPreferredStores, newPreferredStores) ||
      (prevState.budget && !areObjectListsEqual(prevState.budget.products_pool, this.state.budget.products_pool))) {
      this.componentUpdate();
    }
  }

  componentUpdate() {
    const budget = this.state.budget;
    const stores = this.props.preferredCountryStores;

    if (budget.products_pool.length) {
      let url = 'products/available_entities/?';
      for (const product of budget.products_pool) {
        url += `ids=${product.id}&`
      }

      for (const store of stores) {
        url += `&stores=${store.id}`;
      }

      fetchJson(url).then(response => {
        const pricingEntries = response.results;
        pricingEntries.sort((a, b) => a.product.name <= b.product.name ? -1 : 1);

        this.setState({
          pricingEntries,
          budgetEditName: budget.name
        })
      })
    } else {
      this.setState({
        pricingEntries: [],
        budgetEditName: budget.name
      })
    }
  }

  budgetUpdate = () => {
    this.props.fetchAuth(this.state.budget.url).then(budget => {
      this.setState({
        budget
      })
    });
  };

  userUpdate = () => {
    this.props.fetchAuth('users/me/').then(user => {
      this.props.updateUser(user);
    })
  };

  render() {
    if (!this.state.budget) {
      return null
    }

    if (!this.state.pricingEntries) {
      return <Loading/>
    }

    const budget = this.state.budget;
    let totalPrice = new Big(0);

    for (const budgetEntry of budget.entries) {
      if (!budgetEntry.selected_store) {
        continue
      }
      const pricingEntry = this.state.pricingEntries.filter(entry => entry.product.url === budgetEntry.selected_product)[0] || null;

      if (!pricingEntry) {
        continue
      }
      const matchingEntity = pricingEntry.entities.filter(entity => entity.store === budgetEntry.selected_store)[0] || null;

      if (matchingEntity) {
        totalPrice = totalPrice.plus(new Big(matchingEntity.active_registry.offer_price));
      }
    }

    const budgetCategories = this.props.budgetCategories;
    budgetCategories.sort(function (category1, category2) {
      let category1ordering = category1.budget_ordering;
      let category2ordering = category2.budget_ordering;
      if (category1ordering < category2ordering) {
        return -1;
      } else if (category1ordering > category2ordering) {
        return 1;
      } else {
        return 0;
      }
    });

    if (this.props.isExtraSmall) {
      return <BudgetEditMobile
        budget={budget}
        budgetCategories={budgetCategories}
        pricingEntries={this.state.pricingEntries}
        budgetUpdate={this.budgetUpdate}
        userUpdate={this.userUpdate}/>
    }

    return <React.Fragment>
      <Head>
        <title key="title">{budget.name} - SoloTodo</title>
      </Head>
      <BudgetEditDesktop
        budget={budget}
        budgetCategories={budgetCategories}
        pricingEntries={this.state.pricingEntries}
        budgetUpdate={this.budgetUpdate}
        userUpdate={this.userUpdate}/>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {categories, preferredCountryStores} = solotodoStateToPropsUtils(state);
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    budgetCategories: categories.filter(category => category.budget_ordering),
    preferredCountryStores,
    isExtraSmall: state.browser.is.extraSmall,
    fetchAuth,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch,
    updateUser: user => {
      return dispatch({
        type: 'updateApiResourceObject',
        apiResourceObject: user
      })
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BudgetEdit))