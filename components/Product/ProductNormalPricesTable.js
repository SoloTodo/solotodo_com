import React from 'react'
import ReactTooltip from 'react-tooltip'
import ProductRatingStars from "./ProductRatingStars";

import ProductRefurbishedWarning from './ProductRefurbishedWarning'

import SoloTodoLeadLink from '../SoloTodoLeadLink'

class ProductNormalPricesTable extends React.Component {
  render() {
    return <table className="table table-sm mb-0">
      <thead>
      <tr>
        <th scope="col">Tienda</th>
        {this.props.hideRatings? null:
          <th scope="col">Rating</th>
        }
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
      {this.props.entities.length? this.props.entities.map(entity => {
        const storeEntry = this.props.storeEntries[entity.store];
        return <tr key={entity.id} style={this.props.entityHighlight === entity.id? {backgroundColor: '#337ab71c'} : null}>
          <td>
            <SoloTodoLeadLink
              className="normal-table-product-link"
              entity={entity}
              storeEntry={storeEntry}
              product={entity.product}>
              {storeEntry.name}
            </SoloTodoLeadLink>
            {entity.bundle && <>
              <ReactTooltip id="bundle" type="info" effect="solid" place="right">
                <span>Incluye {entity.bundle.name}</span>
              </ReactTooltip>
              <span data-tip data-for="bundle" className="ml-1 mr-1">
                 <i className="fas fa-gift"/>
              </span>
            </>}
            <ProductRefurbishedWarning entity={entity}/>
          </td>
          {this.props.hideRatings? null:
            <td className="stars-container-cell">
              <ProductRatingStars
                value={storeEntry.rating}
                linkHref={`/stores/[id]/ratings?id=${storeEntry.id}`}
                linkAs={`/stores/${storeEntry.id}/ratings`}/>
            </td>
          }
          <td className="text-right price-container-cell">
            <SoloTodoLeadLink
              className="price-container"
              entity={entity}
              storeEntry={storeEntry}
              product={entity.product}>
              {this.props.formatCurrency(entity.active_registry.offer_price)}
            </SoloTodoLeadLink>
          </td>
          <td className="text-right price-container-cell">
            <SoloTodoLeadLink
              className="price-container"
              entity={entity}
              storeEntry={storeEntry}
              product={entity.product}>
              {this.props.formatCurrency(entity.active_registry.normal_price)}
            </SoloTodoLeadLink>
          </td>
        </tr>
        }) :
        <tr>
          <td colSpan="4">Este producto no está disponible actualmente</td>
        </tr>
      }
      </tbody>
    </table>
  }
}

export default ProductNormalPricesTable;