import React from 'react'
import {Card, CardBody, CardHeader, Col} from "reactstrap";
import ProductPricesTable from "../Product/ProductPricesTable";


class CyberBestStoreHistoricPrice extends React.Component {
  render() {
    return <Col sm={{size:8, offset: 2}} className="mt-4">
      <Card>
        <CardHeader><h2>Mejor Precio Tienda últimos 2 Meses</h2></CardHeader>
        <CardBody>
          Hola
        </CardBody>
      </Card>
    </Col>
  }
}

export default CyberBestStoreHistoricPrice