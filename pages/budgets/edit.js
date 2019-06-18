import React from 'react'
import {connect} from "react-redux";
import Router, {withRouter} from 'next/router'
import {
  Alert
} from "reactstrap";
import Big from 'big.js';

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {
  areObjectListsEqual,
  convertIdToUrl,
  fetchJson
} from "../../react-utils/utils";

import {settings} from "../../settings";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import Loading from "../../components/Loading";
import BudgetEntryEditRow from "../../components/Budget/BudgetEntryEditRow";
import BudgetNameEditModal from "../../components/Budget/BudgetNameEditModal";
import BudgetEntryCreateButton from "../../components/Budget/BudgetEntryCreateButton";
import BudgetExportButton from "../../components/Budget/BudgetExportButton";
import BudgetSelectBestPricesButton from "../../components/Budget/BudgetSelectBestPricesButton";
import BudgetScreenshotButton from "../../components/Budget/BudgetScreenshotButton";
import BudgetDeleteButton from "../../components/Budget/BudgetDeleteButton";
import BudgetCompatibilityCheckButton from "../../components/Budget/BudgetCompatibilityCheckButton";
import TopBanner from "../../components/TopBanner";

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

    if (!areObjectListsEqual(oldPreferredStores, newPreferredStores)) {
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

    const product_ids = budget.products_pool.map(product => product.id);
    console.log(this.state.pricingEntries);

    return <div className="pl-3 pr-3">
      <div className="row">
        <TopBanner category="Hardware"/>
        <div className="col-12">
          <BudgetNameEditModal
            budget={budget}
            budgetUpdate={this.budgetUpdate}
            userUpdate={this.userUpdate}/>
        </div>
        {!this.state.pricingEntries.length && <div className="col-12">
          <div>
            <Alert color="info">
              <i className="fas fa-exclamation-circle">&nbsp;</i> ¡Tu cotización está vacía! Navega por los
              productos de SoloTodo y haz click en "Agregar a cotización" para incluirlos
            </Alert>
          </div>
        </div>}
      </div>
      <div className="row">
        <div className="col-12">
          <div className="content-card">
            <table id="budget-edit-table" className="table mb-0">
              <thead>
              <tr>
                <th scope="col">Componente</th>
                <th scope="col">Producto</th>
                <th scope="col">Tienda</th>
                <th scope="col">Quitar</th>
              </tr>
              </thead>
              <tbody>
              {budget.entries.map(budgetEntry => (
                <BudgetEntryEditRow
                  key={budgetEntry.id}
                  budgetEntry={budgetEntry}
                  pricingEntries={this.state.pricingEntries
                    .filter(productEntry => product_ids.includes(productEntry.product.id))
                    .filter(productEntry => budgetEntry.category === productEntry.product.category)}
                  budgetUpdate={this.budgetUpdate}
                  removeBudgetProduct={this.removeBudgetProduct}/>))}
              <tr>
                <td colSpan="2"/>
                <td className="budget-total-price" colSpan="2">
                  {this.props.formatCurrency(totalPrice, this.props.clpCurrency)}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-12">
          <div className="content-card mt-3 mb-3">
            <BudgetSelectBestPricesButton
              budget={budget}
              budgetUpdate={this.budgetUpdate}/>
            <BudgetEntryCreateButton
              budget={budget}
              budgetCategories={budgetCategories}
              budgetUpdate={this.budgetUpdate}/>
            <BudgetExportButton
              budget={budget}/>
            <BudgetScreenshotButton
              budget={budget}/>
            <BudgetCompatibilityCheckButton
              budget={budget}/>
            <BudgetDeleteButton
              budget={budget}
              onBudgetDeleted={this.userUpdate}/>
          </div>
        </div>
      </div>
    </div>
  }
}

function mapStateToProps(state) {
  const {categories, preferredCountryStores, currencies, formatCurrency} = solotodoStateToPropsUtils(state);
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    budgetCategories: categories.filter(category => category.budget_ordering),
    preferredCountryStores,
    clpCurrency: currencies.filter(currency => currency.id === settings.clpCurrencyId)[0],
    fetchAuth,
    formatCurrency
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