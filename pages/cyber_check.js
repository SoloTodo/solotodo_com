import React from 'react'
import {connect} from "react-redux";
import Router, {withRouter} from "next/router";
import Head from "next/head";
import {
  Container, Col, Row,
  Button, Input, InputGroup, InputGroupAddon} from "reactstrap"

import {fetchJson} from "../react-utils/utils";

import {toast} from "react-toastify";
import CyberBestPrice from "../components/Cyber/CyberBestPrice";
import {solotodoStateToPropsUtils} from "../redux/utils";
import CyberBestStoreHistoricPrice
  from "../components/Cyber/CyberBestStoreHistoricPrice";
import CyberBestMarketHistoricPrice
  from "../components/Cyber/CyberBestMarketHistoricPrice";
import CyberCurrentStorePrice
  from "../components/Cyber/CyberCurrentStorePrice";
import CyberTopBanner from "../components/Cyber/CyberTopBanner";
import CyberInstructions from "../components/Cyber/CyberInstructions";
import {withSoloTodoTracker} from "../utils";

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
      const url = `entities/by_url/?url=${this.state.url}`;
      this.checkUrl(url)
    }
  }

  entityUrlChange = (e) => {
    this.setState({
      url: e.target.value
    })
  };

  handleSubmit = e => {
    e.preventDefault();
    const url = `entities/by_url/?url=${this.state.url}`;
    Router.push({
      pathname: '/cyber_check',
      query: {product_url: this.state.url}
    });
    this.checkUrl(url)
  };

  checkUrl = (url) => {
    fetchJson(url).then(entity => {
      if (!entity.active_registry) {
        toast.error('Según nuestros registros, este producto no esta disponible para compra actualmente.');
        return
      }
      this.setState({
        entity
      })
    }).catch(async err => {
      toast.error('¡Lo sentimos! No econtramos este producto en nuestros registros.')
    })
  };

  render() {

    return <React.Fragment>
      <Head>
        <title>Cyber Check: ¡Verifica las ofertas del Cyber de forma rápida y simple! - SoloTodo</title>
        <meta property="og:title" content={`Cyber Check: ¡Verifica las ofertas del Cyber de forma rápida y simple!`} />
      </Head>
      <Container>
        <Row>
          <CyberTopBanner/>
          <Col sm="12">
            <h1>Ingresa la URL del producto</h1>
          </Col>
          <Col sm="12">
            <form action="" onSubmit={this.handleSubmit}>
            <InputGroup>
              <Input name="product_url" value={this.state.url} onChange={this.entityUrlChange} placeholder="Ejemplo: https://simple.ripley.cl/huawei-y6-2019-black-608-2000374007566p"/>
              <InputGroupAddon addonType="append">
                <Button type="submit" color="success">Verificar</Button>
              </InputGroupAddon>
            </InputGroup>
            </form>
          </Col>
          {this.state.entity?
            <React.Fragment>
              <CyberCurrentStorePrice entity={this.state.entity}/>
              <CyberBestStoreHistoricPrice entity={this.state.entity}/>
              <CyberBestPrice entity={this.state.entity}/>
              <CyberBestMarketHistoricPrice entity={this.state.entity}/>
            </React.Fragment>:
            <CyberInstructions/>
          }
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

function mapPropsToGAField(props) {
  return {
    pageTitle: 'Cyber Check: ¡Verifica las ofertas del Cyber de forma rápida y simple!'
  }
}

const TrackedCyberCheck = withSoloTodoTracker(CyberCheck, mapPropsToGAField);
export default withRouter(connect(mapStateToProps)(TrackedCyberCheck))