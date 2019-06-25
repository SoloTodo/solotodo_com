import React from 'react'
import {connect} from "react-redux";
import Link from "next/link";
import {Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from "reactstrap";
import {toast} from "react-toastify";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import SoloTodoLeadLink from "../SoloTodoLeadLink";
import BudgetEntryDeleteButton from "./BudgetEntryDeleteButton";


class BudgetEntryEditRowMobile extends React.Component {
  addProductsMessage = () => {
    toast.info(
      'Busca el producto que te interesa y en su ficha haz click en "Agregar a cotización"', {autoClose: false})
  };

  // This is a callback for the dropdowntoggle component. It's necessary to
  // fix a known issue with reactstrap that has not been solved yet.
  // Issue: https://github.com/reactstrap/reactstrap/issues/1070
  triggerScrollCallbacks = () => {
    window.scrollBy(0, 1);
    window.scrollBy(0, -1)
  };

  render() {
    const budgetEntry = this.props.budgetEntry;
    const category = this.props.category;
    const pricingEntries = this.props.pricingEntries;
    const matchingPricingEntry = this.props.matchingPricingEntry;
    const filteredEntities = this.props.filteredEntities;
    const matchingEntity = this.props.matchingEntity;
    const selectedProduct = this.props.selectedProduct;
    const selectedProductHref = this.props.selectedProductHref;
    const selectedProductAs = this.props.selectedProductAs;

    return <div className="mobile-selector-row">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3 className="mb-2 pb-0">{category.name}</h3>
        </div>
        <UncontrolledDropdown>
          <DropdownToggle tag="div" onClick={this.triggerScrollCallbacks} data-toggle="dropdown">
            <i className="fas fa-ellipsis-v"/>
          </DropdownToggle>
          <DropdownMenu persist right>
            <DropdownItem onClick={this.addProductsMessage}>
              <Link href={`/browse?category_slug=${category.slug}`} as={`/${category.slug}`}>
                <span>Añadir producto</span>
              </Link>
            </DropdownItem>
            <BudgetEntryDeleteButton
              matchingPricingEntry={matchingPricingEntry}
              budgetEntry={budgetEntry}
              category={category}
              budgetUpdate={this.props.budgetUpdate}
              isMobile={true}/>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      {pricingEntries.length?
        <div>
          <div className="d-flex pb-2">
            <div className="mobile-select flex-grow mr-2">
              <select
                className="custom-select"
                value={selectedProduct || ''}
                onChange={this.props.handleProductSelect}>
                {pricingEntries.map(pricingEntry => (
                  <option key={pricingEntry.product.url} value={pricingEntry.product.url}>
                    {pricingEntry.product.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {budgetEntry.selected_product &&
              <Link href={selectedProductHref} as={selectedProductAs}>
                <Button outline color="info">
                  Link
                </Button>
              </Link>}
            </div>
          </div>
          <div className="d-flex pb-2">
            <div className="mobile-select flex-grow mr-2">
              {filteredEntities.length?
                <select
                  className="custom-select"
                  value={this.props.budgetEntry.selected_store || ''}
                  onChange={this.props.handleStoreSelect}>
                  {filteredEntities.map(entity => {
                    const store = this.props.stores.filter(store => store.url === entity.store)[0];
                    return <option key={store.url} value={store.url}>
                      {this.props.formatCurrency(entity.active_registry.offer_price)} - {store.name}
                    </option>
                  })}
                </select> : "Este producto no está disponible actualmente"}
            </div>
            <div>
              {matchingEntity?
                <SoloTodoLeadLink
                  className="btn btn-outline-warning budget-store-link"
                  product={matchingEntity.product}
                  entity={matchingEntity}
                  storeEntry={this.props.stores.filter(store => store.url === matchingEntity.store)[0]}>
                  Ir a tienda
                </SoloTodoLeadLink> : ''}
            </div>
          </div>
        </div> :
        <div>
          <Link href={`/browse?category_slug=${category.slug}`} as={`/${category.slug}`}>
            <Button outline color="info" size="sm" onClick={this.addProductsMessage}>Añadir producto</Button>
          </Link>
        </div>}
    </div>
  }
}

function mapStateToProps(state) {
  const {stores, formatCurrency} = solotodoStateToPropsUtils(state);

  return {
    stores,
    formatCurrency,
  }
}

export default connect(mapStateToProps)(BudgetEntryEditRowMobile)