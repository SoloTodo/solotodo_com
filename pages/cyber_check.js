import React from 'react'
import {connect} from "react-redux";
import Router, {withRouter} from "next/router";
import Head from "next/head";
import {
  Container, Col, Row, Card, CardHeader, CardBody,
  Button, Input, InputGroup, InputGroupAddon} from "reactstrap"

import {fetchJson} from "../react-utils/utils";

import TopBanner from "../components/TopBanner";
import {toast} from "react-toastify";
import CyberBestPrice from "../components/Cyber/CyberBestPrice";
import {solotodoStateToPropsUtils} from "../redux/utils";
import CyberBestStoreHistoricPrice
  from "../components/Cyber/CyberBestStoreHistoricPrice";
import CyberBestMarketHistoricPrice
  from "../components/Cyber/CyberBestMarketHistoricPrice";
import CyberCurrentStorePrice
  from "../components/Cyber/CyberCurrentStorePrice";

class CyberCheck extends React.Component {
  static async getInitialProps(ctx) {
    const {query} = ctx;

    return {
      initialUrl: query.product_url
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      url: props.initialUrl,
      entity: undefined,
      product: undefined
    }
  }

  componentDidMount() {
    if (this.state.url) {
      this.handleCheckButtonClick()
    }
  }

  entityUrlChange = (e) => {
    this.setState({
      url: e.target.value
    })
  };

  handleCheckButtonClick = () => {
    const url = `entities/by_url/?url=${this.state.url}`;
    Router.push({
      pathname: '/cyber_check',
      query: {product_url: this.state.url}
    });
    fetchJson(url).then(entity => {
      this.setState({
        entity
      })
    }).catch(async err => {
      toast.error('URL de producto no válida')
    })
  };

  render() {
    return <React.Fragment>
      <Head>
        <title>Cyber Check - SoloTodo</title>
        <meta property="og:title" content={`Cotiza y ahorra cotizando todos tus productos de tecnología en un sólo lugar - SoloTodo`} />
        <meta name="description" property="og:description" content={`Ahorra tiempo y dinero cotizando celulares, notebooks, etc. en un sólo lugar y comparando el precio de todas las tiendas.`} />
      </Head>
      <Container fluid>
        <Row>
          <TopBanner category="Any" />
          <Col sm={{size:8, offset: 2}}>
            <h1>Ingrese la URL del producto:</h1>
          </Col>
          <Col sm={{size:8, offset: 2}}>
            <InputGroup>
              <Input value={this.state.url} onChange={this.entityUrlChange}/>
              <InputGroupAddon addonType="append">
                <Button color="success" onClick={this.handleCheckButtonClick}>Check</Button>
              </InputGroupAddon>
            </InputGroup>
          </Col>
          {this.state.entity?
            <React.Fragment>
              <CyberCurrentStorePrice entity={this.state.entity}/>
              <CyberBestStoreHistoricPrice entity={this.state.entity}/>
              <CyberBestPrice entity={this.state.entity}/>
              <CyberBestMarketHistoricPrice entity={this.state.entity}/>
            </React.Fragment>:null}
        </Row>
      </Container>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores, user} = solotodoStateToPropsUtils(state);
  return {
    preferredCountryStores,
    user
  }
}

export default connect(mapStateToProps)(withRouter(CyberCheck))