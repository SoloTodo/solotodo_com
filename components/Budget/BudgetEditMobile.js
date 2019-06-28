import React from 'react'
import {connect} from "react-redux";
import Big from 'big.js';
import {UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from "reactstrap";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

import {solotodoStateToPropsUtils} from "../../redux/utils";
import {settings} from "../../settings";
import BudgetSelectBestPricesButton from "./BudgetSelectBestPricesButton";
import BudgetNameEditModal from "./BudgetNameEditModal";
import BudgetEntryCreateButton from "./BudgetEntryCreateButton";
import BudgetScreenshotButton from "./BudgetScreenshotButton";
import BudgetCompatibilityCheckButton from "./BudgetCompatibilityCheckButton";
import BudgetExportButton from "./BudgetExportButton";
import BudgetDeleteButton from "./BudgetDeleteButton";
import BudgetEntryEditRow from "./BudgetEntryEditRow";
import BudgetCompatibilityCheckContainer
  from "./BudgetCompatibilityCheckContainer";

class BudgetEditMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      compatibilityIssues: undefined
    }
  }

  setCompatibilityIssues = (compatibilityIssues) => {
    this.setState({
      compatibilityIssues
    })
  };

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
      <div className="pt-3">
        <div className="d-flex justify-content-between align-items-center">
          <UncontrolledDropdown>
            <DropdownToggle
              tag="div"
              data-toggle="dropdown"
              className="more-budget-options-dropdown"
              caret>
              {this.props.budget.name}
            </DropdownToggle>
            <DropdownMenu persist>
              <BudgetNameEditModal
                budget={budget}
                budgetUpdate={this.props.budgetUpdate}
                userUpdate={this.props.userUpdate}
                isMobile={true}/>
              <BudgetSelectBestPricesButton
                budget={budget}
                budgetUpdate={this.props.budgetUpdate}
                isMobile={true}/>
              <BudgetEntryCreateButton
                budget={budget}
                budgetCategories={budgetCategories}
                budgetUpdate={this.props.budgetUpdate}
                isMobile={true}/>
              <BudgetScreenshotButton
                budget={budget}
                isMobile={true}/>
              <BudgetCompatibilityCheckButton
                budget={budget}
                setCompatibilityIssues={this.setCompatibilityIssues}
                isMobile={true}/>
              <DropdownItem divider/>
              <BudgetExportButton
                budget={budget}
                isMobile={true}/>
              <DropdownItem divider/>
              <BudgetDeleteButton
                budget={budget}
                onBudgetDeleted={this.props.userUpdate}
                isMobile={true}/>
            </DropdownMenu>
          </UncontrolledDropdown>
          <div className="budget-total-price">
            Total: {this.props.formatCurrency(totalPrice, this.props.clpCurrency)}
          </div>
        </div>
        {!this.props.pricingEntries.length &&
        <div>
          <div>
            <Alert color="info">
              <i className="fas fa-exclamation-circle">&nbsp;</i> ¡Tu cotización está vacía! Navega por los
              productos de SoloTodo y haz click en "Agregar a cotización" para incluirlos
            </Alert>
          </div>
        </div>}
      </div>
      <div className="content-card mb-3">
        {budget.entries.map(budgetEntry => {
          return <BudgetEntryEditRow
            key={budgetEntry.id}
            budgetEntry={budgetEntry}
            pricingEntries={this.props.pricingEntries}
            budgetUpdate={this.props.budgetUpdate}
            isMobile={true}/>})}
      </div>
      <BudgetCompatibilityCheckContainer
        compatibilityIssues={this.state.compatibilityIssues}/>
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

export default connect(mapStateToProps)(BudgetEditMobile)