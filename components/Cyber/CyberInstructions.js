import React from 'react';
import Link from "next/link"
import {Card, CardBody, Col, Row} from "reactstrap";

class CyberInstructions extends React.Component {
  render() {

    return <Col sm="12" className="mt-4">
      <Card>
        <CardBody>
          <h2>¿Quieres saber si una oferta de Cyber es real o no?</h2>
          <h3>¡Ingresa la URL del producto que viste en el recuadro de arriba
            y nosotros responderemos tu consulta!</h3>
          <span> Recuerda que solo funciona para productos de Tecnología y Electrónica
            de las siguientes tiendas: Falabella, Ripley, Paris, AbcDin, La Polar, Corona
            Hites, Lider, PC Factory, Linio, Easy, Sodimac y SpDigital.</span><br/><br/>
          <span>Por ejemplo:</span>
          <ul style={{listStyleType: "none"}}>
            <li><a href="http://localhost:3000/cyber_check?product_url=https%3A%2F%2Fwww.pcfactory.cl%2Fproducto%2F34538-hp-notebooks-gamer-omen-i7-9750h-nvidia-rtx-2070-max-q-8gb-15-6-fhd-144hz-16gb--32gb-optane-512gb-ssd-intel-windows-10-15-dh0005la">https://www.pcfactory.cl/producto/34538-hp-notebooks-gamer-omen-i7-9750h-nvidia-rtx-2070-max-q-8gb-15-6-fhd-144hz-16gb--32gb-optane-512gb-ssd-intel-windows-10-15-dh0005la</a></li>
            <li><a href="http://localhost:3000/cyber_check?product_url=https://www.falabella.com/falabella-cl/product/6845144/LED-43-UN43NU7090GXZS-4K-Ultra-HD-Smart-TV/6845144">https://www.falabella.com/falabella-cl/product/6845144/LED-43-UN43NU7090GXZS-4K-Ultra-HD-Smart-TV/6845144</a></li>
            <li><a href="http://localhost:3000/cyber_check?product_url=https://simple.ripley.cl/huawei-y6-2019-black-608-2000374007566p">https://simple.ripley.cl/huawei-y6-2019-black-608-2000374007566p</a></li>

          </ul>
        </CardBody>
      </Card>
    </Col>
  }
}

export default CyberInstructions
