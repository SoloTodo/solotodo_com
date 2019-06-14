import React from 'react'
import {connect} from "react-redux";
import Link from "next/link";
import {UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from "reactstrap";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

import {solotodoStateToPropsUtils} from "../../redux/utils";
import SoloTodoLeadLink from "../SoloTodoLeadLink";

class BudgetEntryEditRow extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedProduct: this.props.budgetEntry.selected_product,
      selectedStore: this.props.budgetEntry.selected_store,
      entryDeleteModalIsActive: false,
    }

  }

  componentDidMount() {
    this.componentUpdate()
  }

  componentUpdate(){
    const budgetEntry = this.props.budgetEntry;
    const pricingEntries = this.props.pricingEntries;
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
        matchingEntity = entities.filter(entity => entity.store.id === budgetEntry.selected_store)[0] || null
      }

      if (!matchingEntity && entities.length) {
        matchingEntity = entities[0];
      }
    }

    const matchingProductUrl = matchingPricingEntry && matchingPricingEntry.product.url;
    const formData = {
      selected_product: matchingProductUrl,
      selected_store: matchingEntity && matchingEntity.store.url
    };

    this.props.fetchAuth(`budget_entries/${budgetEntry.id}/`, {
      method: 'PATCH',
      body: JSON.stringify(formData)
    }).then(() => {
      this.props.budgetUpdate();
    })
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
      this.setState({
        selectedProduct: newProductUrl
      })
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
      this.setState({
        selectedStore: newStoreUrl
      })
    })
  };

  removeSelectedProduct = product => {
    this.props.fetchAuth(`${this.props.budgetEntry.budget}remove_product/`, {
      method: 'POST',
      body: JSON.stringify({product: product.id})
    }).then(json => {
      console.log(json);
      this.props.budgetUpdate()
    })
  };

  render() {
    const selectedProduct = this.state.selectedProduct;
    const budgetEntry = this.props.budgetEntry;
    const matchingPricingEntry = this.props.pricingEntries.filter(pricingEntry => pricingEntry.product.url === selectedProduct)[0];
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

    return <tr>
      <td>
        <Link href={`/browse?category_slug=${category.slug}`} as={`/${category.slug}`}>
          <a>{category.name}</a>
        </Link>
      </td>
      {this.props.pricingEntries.length?
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
            onChange={this.handleProductSelect}>
            {this.props.pricingEntries.map(pricingEntry => (
              <option key={pricingEntry.product.url} value={pricingEntry.product.url}>
                {pricingEntry.product.name}
              </option>
            ))}
          </select>
        </div>
      </td>:
      <td colSpan="2"> No hay productos ingresados para esta categoría</td>}
      {!!this.props.pricingEntries.length && <td>
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
            value={this.state.selectedStore || ''}
            onChange={this.handleStoreSelect}>
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
        <UncontrolledDropdown>
          <DropdownToggle caret color="danger">
              Eliminar
          </DropdownToggle>
          <DropdownMenu right>
            {matchingPricingEntry && <DropdownItem onClick={e => this.removeSelectedProduct(matchingPricingEntry.product)}>
              Producto seleccionado
            </DropdownItem>}
            <DropdownItem>
              Quitar componente
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </td>
    </tr>
  }
}

function mapStateToProps(state) {
  const {categories, stores, formatCurrency} = solotodoStateToPropsUtils(state);
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    categories,
    stores,
    formatCurrency,
    fetchAuth
  }
}

export default connect(mapStateToProps)(BudgetEntryEditRow)