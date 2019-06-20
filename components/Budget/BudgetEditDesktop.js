import React from 'react'
import {connect} from "react-redux";
import {withRouter} from 'next/router'
import {
  Alert
} from "reactstrap";
import Big from 'big.js';

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

import {settings} from "../../settings";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import BudgetEntryEditRow from "../../components/Budget/BudgetEntryEditRow";
import BudgetNameEditModal from "../../components/Budget/BudgetNameEditModal";
import BudgetEntryCreateButton from "../../components/Budget/BudgetEntryCreateButton";
import BudgetExportButton from "../../components/Budget/BudgetExportButton";
import BudgetSelectBestPricesButton from "../../components/Budget/BudgetSelectBestPricesButton";
import BudgetScreenshotButton from "../../components/Budget/BudgetScreenshotButton";
import BudgetDeleteButton from "../../components/Budget/BudgetDeleteButton";
import BudgetCompatibilityCheckButton from "../../components/Budget/BudgetCompatibilityCheckButton";
import TopBanner from "../../components/TopBanner";

class BudgetEditDesktop extends React.Component {
  render() {
    const budget = this.props.budget;
    const budgetCategories = this.props.budgetCategories;

    let totalPrice = new Big(0);

    for (const budgetEntry of budget.entries) {
      if (!budgetEntry.selected_store) {
        continue
      }
      const pricingEntry = this.props.pricingEntries.filter(entry => entry.product.url === budgetEntry.selected_product)[0] || null;

      if (!pricingEntry) {
        continue
      }
      const matchingEntity = pricingEntry.entities.filter(entity => entity.store === budgetEntry.selected_store)[0] || null;

      if (matchingEntity) {
        totalPrice = totalPrice.plus(new Big(matchingEntity.active_registry.offer_price));
      }
    }

    return <div className="pl-3 pr-3">
      <div className="row">
        <TopBanner category="Hardware"/>
        <div className="col-12">
          <BudgetNameEditModal
            budget={budget}
            budgetUpdate={this.props.budgetUpdate}
            userUpdate={this.props.userUpdate}/>
        </div>
        {!this.props.pricingEntries.length && <div className="col-12">
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
              {budget.entries.map(budgetEntry => {
                return <BudgetEntryEditRow
                  key={budgetEntry.id}
                  budgetEntry={budgetEntry}
                  pricingEntries={this.props.pricingEntries}
                  budgetUpdate={this.props.budgetUpdate}/>})}
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
              budgetUpdate={this.props.budgetUpdate}/>
            <BudgetEntryCreateButton
              budget={budget}
              budgetCategories={budgetCategories}
              budgetUpdate={this.props.budgetUpdate}/>
            <BudgetExportButton
              budget={budget}/>
            <BudgetScreenshotButton
              budget={budget}/>
            <BudgetCompatibilityCheckButton
              budget={budget}/>
            <BudgetDeleteButton
              budget={budget}
              onBudgetDeleted={this.props.userUpdate}/>
          </div>
        </div>
      </div>
    </div>
  }
}

function mapStateToProps(state) {
  const {currencies, formatCurrency} = solotodoStateToPropsUtils(state);
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    clpCurrency: currencies.filter(currency => currency.id === settings.clpCurrencyId)[0],
    fetchAuth,
    formatCurrency
  }
}

export default withRouter(connect(mapStateToProps)(BudgetEditDesktop))