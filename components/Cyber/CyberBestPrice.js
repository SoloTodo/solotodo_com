import React from 'react'
import {connect} from "react-redux";
import {Col, Card, CardHeader, CardBody, Alert} from "reactstrap"

import ProductPricesTable from "../Product/ProductPricesTable";

import {solotodoStateToPropsUtils} from "../../redux/utils";
import {settings} from "../../settings";
import {fetchJson} from "../../react-utils/utils";


class CyberBestPrice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: undefined
    }
  }

  componentDidMount() {
    this.componentUpdate(this.props.entity.product)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.entity.id !== this.props.entity.id){
      this.componentUpdate(this.props.entity.product)
    }
  }

  componentUpdate(product){
    const productsUrl = settings.apiResourceEndpoints.products;
    let storesUrl = '';

    for (let store of this.props.preferredCountryStores) {
      storesUrl += `&stores=${store.id}`
    }

    fetchJson(`${productsUrl}available_entities/?ids=${product.id}${storesUrl}&exclude_refurbished=true`).then(availableEntities => {
      const entities = availableEntities.results[0].entities.filter(entity => entity.active_registry.cell_monthly_payment === null);
      this.setState({
        entities
      })
    })
  }


  render() {
    if (!this.state.entities) {
      return null
    }

    const storeEntity = this.props.entity;
    const entities = this.state.entities;
    const formattedEntityPrice = this.props.formatCurrency(storeEntity.active_registry.offer_price);
    const formattedBestPrice = this.props.formatCurrency(entities[0].active_registry.offer_price)

    let isBest = true;
    let answer = null;

    for (const entity of entities) {
      if(storeEntity.active_registry.offer_price > entity.active_registry.offer_price){
        isBest = false
      }
    }

    if (isBest) {
      answer = <Alert color="success" className="d-flex">
        <div className="pr-3 d-flex align-items-center">
          <i className="fas fa-check"/>
        </div>
        <div>
          <span><strong>¡Sí!</strong> El precio actual de {formattedEntityPrice} es el mejor precio del mercado.</span>
        </div>
      </Alert>
    } else {
      answer = <Alert color="danger" className="d-flex">
        <div className="pr-3 d-flex align-items-center">
          <i className="fas fa-times"/>
        </div>
        <div>
          <span><strong>¡No!</strong> El mejor precio actual del mercado es de {formattedBestPrice}.</span>
        </div>
      </Alert>
    }

    return <Col sm={{size:8, offset: 2}} className="mt-4">
      <Card>
        <CardHeader><h2>¿Es el mejor precio del mercado actualmente?</h2></CardHeader>
        <CardBody>
          {answer}
          <ProductPricesTable
            product={this.props.entity.product}
            category={this.props.categories.filter(category => category.url === this.props.entity.category)[0]}
            onEntitiesChange={() => {}}
            entityHighlight={this.props.entity.id}
            excludeRefurbished={true}
            hideRatings={true}/>
        </CardBody>
      </Card>
    </Col>
  }
}

function mapStateToProps(state) {
  const {categories, preferredCountryStores, formatCurrency} = solotodoStateToPropsUtils(state);
  return {
    categories,
    preferredCountryStores,
    formatCurrency
  }
}

export default connect(mapStateToProps)(CyberBestPrice)