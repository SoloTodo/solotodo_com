import React from 'react'
import ReactTooltip from 'react-tooltip'

import ProductRefurbishedWarning from "./ProductRefurbishedWarning";

import ProductRatingStars from "./ProductRatingStars";
import SoloTodoLeadLink from '../SoloTodoLeadLink'

class ProductCellPricesTable extends React.Component {
  render() {
    const groupedEntities = [];

    for (const entity of this.props.entities) {
      const store = this.props.storeEntries[entity.store];
      const filteredGroup = groupedEntities.filter(group => (group.store.id === store.id))[0];
      if (filteredGroup) {
        filteredGroup.entities.push(entity)
      } else {
        groupedEntities.push(
          {
            store: store,
            entities: [entity]
          }
        )
      }
    }

    const tableRows = [];

    for (const group of groupedEntities) {
      tableRows.push(
        <tr key={group.store.url}>
          <td colSpan="3">
            <div className="d-flex flex-row">
              <span className="mr-2">{group.store.name}</span>
              {this.props.hideRatings ? null:
                <ProductRatingStars
                  value = {group.store.rating || 0}
                  linkHref={`/store_ratings?id=${group.store.id}`}
                  linkAs={`/stores/${group.store.id}/ratings`}/>}
            </div>
          </td>
        </tr>
      );
      for (const entity of group.entities) {
        tableRows.push(
          <tr key={entity.url} style={this.props.entityHighlight === entity.id? {backgroundColor: 'yellow'} : null}>
            <td>
              <SoloTodoLeadLink
                className="cellphone-table-product-link pl-2"
                entity={entity}
                storeEntry={group.store}
                product={entity.product}>
                {entity.cell_plan ? entity.cell_plan.name : "Liberado"}
              </SoloTodoLeadLink>
              <ProductRefurbishedWarning entity={entity}/>
            </td>
            <td className="text-right">
              <SoloTodoLeadLink
                className="price-container"
                entity={entity}
                storeEntry={group.store}
                product={entity.product}>
                {this.props.formatCurrency(entity.active_registry.offer_price)}
              </SoloTodoLeadLink>
            </td>
            <td className="text-right">
              <SoloTodoLeadLink
                className="price-container"
                entity={entity}
                storeEntry={group.store}
                product={entity.product}>
                {this.props.formatCurrency(entity.active_registry.normal_price)}
              </SoloTodoLeadLink>
            </td>
          </tr>
        )
      }
    }

    return <table className="table table-sm mb-0">
      <thead>
      <tr>
        <th scope="col">Tienda</th>
        <th scope="col" className="text-right">
          <ReactTooltip id="offer-price" type="info" effect="solid" place="top">
            <span>Con el medio de pago preferido de la tienda</span>
          </ReactTooltip>
          <span data-tip data-for="offer-price" className="tooltip-span">
              P. oferta
          </span>
        </th>
        <th scope="col" className="text-right">
          <ReactTooltip id="normal-price" type="info" effect="solid" place="top">
            <span>Con cualquier medio de pago</span>
          </ReactTooltip>
          <span data-tip data-for="normal-price" className="tooltip-span">
              P. normal
          </span>
        </th>
      </tr>
      </thead>
      <tbody>
      {
        groupedEntities.length ? tableRows : <tr>
          <td colSpan="4">Este producto no está disponible actualmente</td>
        </tr>
      }
      </tbody>
    </table>
  }
}

export default ProductCellPricesTable