import React from 'react'
import {connect} from "react-redux";
import Link from "next/link";

import {solotodoStateToPropsUtils} from "../../redux/utils";
import SoloTodoLeadLink from "../SoloTodoLeadLink";
import BudgetEntryDeleteButton from "./BudgetEntryDeleteButton";


class BudgetEntryEditRowDesktop extends React.Component{
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

    return <tr>
      <td>
        <Link href={`/browse?category_slug=${category.slug}`} as={`/${category.slug}`}>
          <a>{category.name}</a>
        </Link>
      </td>
      {pricingEntries.length?
        <td>
          <div className="input-group">
            <div className="input-group-prepend">
              <Link href={selectedProductHref} as={selectedProductAs}>
                <a className="btn btn-primary">
                  Ir
                </a>
              </Link>
            </div>
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
        </td>:
        <td colSpan="2"> No hay productos ingresados para esta categoría</td>}
      {!!pricingEntries.length && <td>
        {matchingEntity?
          <div className="input-group">
            <div className="input-group-prepend">
              <SoloTodoLeadLink
                className="btn btn-primary"
                product={matchingEntity.product}
                entity={matchingEntity}
                storeEntry={this.props.stores.filter(store => store.url === matchingEntity.store)[0]}>
                Ir
              </SoloTodoLeadLink>
            </div>
            <select
              className="custom-select product-selector"
              value={budgetEntry.selected_store || ''}
              onChange={this.props.handleStoreSelect}>
              {filteredEntities.map(entity => {
                const store = this.props.stores.filter(store => store.url === entity.store)[0];
                return <option key={store.url} value={store.url}>
                  {this.props.formatCurrency(entity.active_registry.offer_price)} - {store.name}
                </option>
              })}
            </select>
          </div>:
          "Este producto no esta disponible actualmente"}
      </td>}
      <td>
        <BudgetEntryDeleteButton
          matchingPricingEntry={matchingPricingEntry}
          budgetEntry={budgetEntry}
          category={category}
          budgetUpdate={this.props.budgetUpdate}/>
      </td>
    </tr>
  }
}

function mapStateToProps(state) {
  const {stores, formatCurrency} = solotodoStateToPropsUtils(state);

  return {
    stores,
    formatCurrency,
  }
}

export default connect(mapStateToProps)(BudgetEntryEditRowDesktop)