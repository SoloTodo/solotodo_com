import React from 'react'
import {connect} from "react-redux";
import {Col, Card, CardHeader, CardBody} from "reactstrap"

import ProductPricesTable from "../Product/ProductPricesTable";

import {solotodoStateToPropsUtils} from "../../redux/utils";


class CyberBestPrice extends React.Component {
  render() {
    return <Col sm={{size:8, offset: 2}} className="mt-4">
      <Card>
        <CardHeader><h2>Precios</h2></CardHeader>
        <CardBody>
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
  const {categories} = solotodoStateToPropsUtils(state);
  return {
    categories
  }
}

export default connect(mapStateToProps)(CyberBestPrice)