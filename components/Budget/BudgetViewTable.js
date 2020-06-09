import React from 'react'
import {connect} from "react-redux";
import Link from "next/link";
import Big from 'big.js';
import {Button} from "reactstrap";

import {settings} from "../../settings";
import {fetchJson} from "../../react-utils/utils";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import BudgetEntryViewRow from "./BudgetEntryViewRow";


class BudgetViewTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pricingEntries: undefined,
    }
  }

  componentDidMount() {
    this.componentUpdate(this.props.budget);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const budget = this.props.budget;

    if (budget.id !== prevProps.budget.id) {
      this.setState({
        pricingEntries: undefined
      }, () => {
        this.componentUpdate(budget)
      });
    } else if (prevProps.preferredExcludeRefurbished !== this.props.preferredExcludeRefurbished) {
      this.componentUpdate(budget)
    }
  }

  componentUpdate(budget){
    const selectedProductUrls = budget.entries.map(entry => entry.selected_product).filter(productUrl => productUrl);

    if (selectedProductUrls.length) {
      const productIds = budget.products_pool
        .filter(product => selectedProductUrls.includes(product.url))
        .map(product => product.id);

      let url = 'products/available_entities/?';
      for (const productId of productIds) {
        url += `ids=${productId}&`
      }

      for (const entry of budget.entries) {
        const store = this.props.stores.filter(store => store.url === entry.selected_store)[0];
        if (store) {
          url += `stores=${store.id}&`;
        }
      }

      url += `&exclude_refurbished=${this.props.preferredExcludeRefurbished}`;

      fetchJson(url).then(response => {
        this.setState({
          pricingEntries: response.results,
        })
      })
    } else {
      this.setState({
        pricingEntries: [],
      })
    }
  }

  exportToXls = () => {
    const budget = this.props.budget;
    let url = `budgets/${budget.id}/export/?export_format=xls`;

    this.props.fetchAuth(url).then(response => window.location = response.content)
  };

  render() {
    const budget = this.props.budget;

    let totalPrice = new Big(0);

    if (this.state.pricingEntries) {
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
    }

    const filteredEntries = budget.entries.filter(entry => entry.selected_product);

    return <table className="table mb-0" id="budget-view-table">
      <thead>
      <tr>
        {!this.props.isExtraSmall && <th scope="col">Componente</th>}
        <th scope="col">Producto</th>
        <th scope="col">Tienda</th>
        <th scope="col" className="price-column text-right">Precio</th>
      </tr>
      </thead>
      <tbody>
      {
        filteredEntries.map(budgetEntry => (
          <BudgetEntryViewRow
            key={budgetEntry.id}
            budgetEntry={budgetEntry}
            productsPool={budget.products_pool}
            pricingEntries={this.state.pricingEntries}/>
        ))
      }
      <tr>
        {
          this.props.isFront? <td colSpan={this.props.isExtraSmall ? "1" : "2"}>
              <Link
                href={`/budgets/[id]?id=${budget.id}`}
                as={`/budgets/${budget.id}`}>
                <a className="btn btn-outline-primary">Comentar</a>
              </Link>
            </td> :
            <td colSpan={this.props.isExtraSmall ? "1" : "2"}>
              <Button outline onClick={this.exportToXls}>Exportar a Excel</Button>
            </td>
        }
        <td className="budget-total-price text-right" colSpan="2">
          {this.props.formatCurrency(totalPrice)}
        </td>
      </tr>
      </tbody>
    </table>
  }
}

function mapStateToProps(state) {
  const {stores, currencies, formatCurrency, preferredExcludeRefurbished} = solotodoStateToPropsUtils(state);
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    stores,
    preferredExcludeRefurbished,
    clpCurrency: currencies.filter(currency => currency.id === settings.clpCurrencyId)[0],
    formatCurrency,
    fetchAuth,
    isExtraSmall: state.browser.is.extraSmall
  }
}

export default connect(mapStateToProps)(BudgetViewTable);