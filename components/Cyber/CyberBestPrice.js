import React from 'react'
import {connect} from "react-redux";
import {
  Container, Col, Row, Card, CardHeader, CardBody,
  Button, Input, InputGroup, InputGroupAddon} from "reactstrap"

import {fetchJson} from "../../react-utils/utils";
import {solotodoStateToPropsUtils} from "../../redux/utils";


class CyberBestPrice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: undefined
    }
  }

  componentDidMount() {
    let url = `products/available_entities/?ids=${this.props.entity.product.id}`;
    for (const store of this.props.preferredCountryStores){
      url = url + `&${store.id}`
    }

    fetchJson(url).then(response => {
      this.setState({
        entities: response.results[0].entities
      })
    })
  }

  render() {
    console.log(this.state.entities);
    return <Col sm={{size:8, offset: 2}} className="mt-4">
      <Card>
        <CardHeader><h2>Mejor precio del mercado</h2></CardHeader>
        <CardBody>
          <Row>
            <Col sm="5">
              <img style={{width:"100%"}} src={this.props.entity.picture_urls[0]}/>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores, user} = solotodoStateToPropsUtils(state);
  return {
    preferredCountryStores,
    user
  }
}

export default connect(mapStateToProps)(CyberBestPrice)