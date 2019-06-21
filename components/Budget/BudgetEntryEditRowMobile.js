import React from 'react'
import {connect} from "react-redux";
import Link from "next/link";
import {toast} from "react-toastify";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from "reactstrap";
import BudgetEntryDeleteButton from "./BudgetEntryDeleteButton";
import SoloTodoLeadLink from "../SoloTodoLeadLink";

class BudgetEntryEditRowMobile extends React.Component {
  addProductsMessage = () => {
    toast.info(
      'Busca el producto que te interesa y en su ficha haz click en "Agregar a cotización"', {autoClose: false})
  };

  handleProductSelect = e => {
    const newProductUrl = e.target.value;
    const matchingPricingEntry = this.props.pricingEntries.filter(productEntry => productEntry.product.url === newProductUrl)[0];
    const matchingEntities = matchingPricingEntry? matchingPricingEntry.entities : [];
    const matchingEntity = matchingEntities[0] || null;

    const formData = {
      selected_product: newProductUrl,
      selected_store: matchingEntity && matchingEntity.store
    };
    this.props.fetchAuth(`budget_entries/${this.props.budgetEntry.id}/`, {
      method: 'PATCH',
      body: JSON.stringify(formData)
    }).then(() => {
      this.props.budgetUpdate();
    })
  };

  handleStoreSelect = e => {
    const newStoreUrl = e.target.value;
    const formData = {
      selected_store: newStoreUrl
    };
    this.props.fetchAuth(`budget_entries/${this.props.budgetEntry.id}/`, {
      method: 'PATCH',
      body: JSON.stringify(formData)
    }).then(() => {
      this.props.budgetUpdate();
    })
  };

  // This is a callback for the dropdowntoggle component. It's necessary to
  // fix a known issue with reactstrap that has not been solved yet.
  // Issue: https://github.com/reactstrap/reactstrap/issues/1070
  triggerScrollCallbacks = () => {
    window.scrollBy(0, 1);
    window.scrollBy(0, -1)
  };

  render() {
    const selectedProduct = this.props.budgetEntry.selected_product;
    const budgetEntry = this.props.budgetEntry;
    const pricingEntries = this.props.pricingEntries.filter(productEntry => budgetEntry.category === productEntry.product.category);
    const matchingPricingEntry = pricingEntries.filter(pricingEntry => pricingEntry.product.url === selectedProduct)[0];
    const matchingEntities = matchingPricingEntry? matchingPricingEntry.entities : [];
    const filteredEntities = [];

    for (const entity of matchingEntities) {
      if (!filteredEntities.some(filteredEntity => filteredEntity.store === entity.store)) {
        filteredEntities.push(entity)
      }
    }

    const matchingEntity = filteredEntities.filter(entity => entity.store === budgetEntry.selected_store)[0];
    const selectedProductHref = matchingPricingEntry? `/products?id=${matchingPricingEntry.product.id}`: '';
    const selectedProductAs = matchingPricingEntry? `/products/${matchingPricingEntry.product.id}` : '';

    const category = this.props.categories.filter(category => category.url === budgetEntry.category)[0];

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
                onChange={this.handleProductSelect}>
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
                onChange={this.handleStoreSelect}>
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
  const {categories, stores, preferredCountryStores, formatCurrency} = solotodoStateToPropsUtils(state);
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    categories,
    preferredCountryStores,
    stores,
    formatCurrency,
    fetchAuth
  }
}

export default connect(mapStateToProps)(BudgetEntryEditRowMobile)