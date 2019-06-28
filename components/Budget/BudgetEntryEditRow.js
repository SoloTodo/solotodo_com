import React from 'react'
import {connect} from "react-redux";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

import {solotodoStateToPropsUtils} from "../../redux/utils";
import BudgetEntryEditRowDesktop from "./BudgetEntryEditRowDesktop";
import BudgetEntryEditRowMobile from "./BudgetEntryEditRowMobile";


class BudgetEntryEditRow extends React.Component{
  componentDidMount() {
    this.componentUpdate()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.budgetEntry.selected_product !== this.props.budgetEntry.selected_product ||
      prevProps.pricingEntries !== this.props.pricingEntries) {
      this.componentUpdate();
    }
  }

  componentUpdate(){
    const budgetEntry = this.props.budgetEntry;
    const pricingEntries = this.props.pricingEntries.filter(productEntry => budgetEntry.category === productEntry.product.category);
    let matchingPricingEntry = null;

    if (budgetEntry.selected_product) {
      matchingPricingEntry = pricingEntries.filter(pricingEntry => pricingEntry.product.url === budgetEntry.selected_product)[0]
    }

    if (!matchingPricingEntry && pricingEntries.length) {
      matchingPricingEntry = pricingEntries[0]
    }

    let matchingEntity = null;

    if (matchingPricingEntry) {
      const entities = matchingPricingEntry.entities;

      if (budgetEntry.selected_store) {
        matchingEntity = entities.filter(entity => entity.store === budgetEntry.selected_store)[0] || null
      }

      if (!matchingEntity && entities.length) {
        matchingEntity = entities[0];
      }
    }

    const matchingProductUrl = matchingPricingEntry && matchingPricingEntry.product.url;

    if ((budgetEntry.selected_product !== matchingProductUrl) ||
      (budgetEntry.selected_store !== (matchingEntity && matchingEntity.store))) {

      const formData = {
        selected_product: matchingProductUrl,
        selected_store: matchingEntity && matchingEntity.store};

      this.props.fetchAuth(`budget_entries/${budgetEntry.id}/`, {
        method: 'PATCH',
        body: JSON.stringify(formData)
      }).then(() => {
        this.props.budgetUpdate();
      })
    }
  }

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

    const BudgetEntryEditRowComponent = this.props.isMobile? BudgetEntryEditRowMobile : BudgetEntryEditRowDesktop;

    return <BudgetEntryEditRowComponent
      budgetEntry={budgetEntry}
      category={category}
      pricingEntries={pricingEntries}
      matchingPricingEntry={matchingPricingEntry}
      filteredEntities={filteredEntities}
      matchingEntity={matchingEntity}
      selectedProduct={selectedProduct}
      selectedProductHref={selectedProductHref}
      selectedProductAs={selectedProductAs}
      handleProductSelect={this.handleProductSelect}
      handleStoreSelect={this.handleStoreSelect}
      budgetUpdate={this.props.budgetUpdate}/>
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

export default connect(mapStateToProps)(BudgetEntryEditRow)