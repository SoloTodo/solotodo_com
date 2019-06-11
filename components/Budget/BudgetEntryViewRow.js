import React from 'react'
import {connect} from "react-redux";
import Link from "next/link";

import {formatCurrency} from "../../react-utils/next_utils";

import SoloTodoLeadLink from "../SoloTodoLeadLink";
import {solotodoStateToPropsUtils} from "../../redux/utils";

class BudgetEntryViewRow extends React.Component {
  render() {
    const budgetEntry = this.props.budgetEntry;
    const store = this.props.stores.filter(store => store.url === budgetEntry.selected_store)[0];

    let matchingPricingEntry = null;

    if (budgetEntry.selected_product && this.props.pricingEntries) {
      matchingPricingEntry = this.props.pricingEntries.filter(productEntry => productEntry.product.url === budgetEntry.selected_product)[0] || null;
    }

    let matchingEntity = null;

    if (matchingPricingEntry && store){
      matchingEntity = matchingPricingEntry.entities.filter(entity => entity.store === store.url)[0] || null;
    }

    const product = this.props.productsPool.filter(product => product.url === budgetEntry.selected_product)[0];

    return <tr>
      {!this.props.isExtraSmall &&
      <td>{this.props.categories.filter(category => category.url === budgetEntry.category)[0].name}</td>}
      <td>{product ?
        <Link
          href={`/products?id=${product.id}`}
          as={`/products/${product.id}`}>
          <a>
            {product.name}
          </a>
        </Link>:
        "N/A"}
      </td>
      <td>{store? matchingEntity?
        <SoloTodoLeadLink
          entity={matchingEntity}
          storeEntry={store}
          product={product}>
          {store.name}
        </SoloTodoLeadLink> :
        store.name :
        "N/A"}
      </td>
      <td className="text-right">{matchingEntity ?
        formatCurrency(
          matchingEntity.active_registry.offer_price,
          this.props.preferredCurrency,
          this.props.preferredCurrency,
          this.props.numberFormat.thousands_separator,
          this.props.numberFormat.decimal_separator):
        "N/A"}
      </td>
    </tr>
  }
}

function mapStateToProps(state) {
  const {stores, categories, preferredCountry, preferredCurrency, numberFormat} = solotodoStateToPropsUtils(state);

  return {
    stores,
    categories,
    preferredCountry,
    preferredCurrency,
    numberFormat,
    isExtraSmall: state.browser.is.extraSmall
  }
}

export default connect(mapStateToProps)(BudgetEntryViewRow);