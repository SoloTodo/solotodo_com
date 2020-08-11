import React from 'react';
import { Button } from 'reactstrap';

import PricingHistory from "./PricingHistory";


class PricingHistoryButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showChart: false
        }
    }

    handleButtonClick = () => {
        this.setState({
            showChart: true
        })
    }


    render() {
        return <div id="product-detail-pricing-history" className="content-card">
            {this.state.showChart?
                <PricingHistory product={this.props.product}/>:
                <Button color="success" onClick={this.handleButtonClick}>Ver gráfico de precios</Button>
            }
        </div>
    }
}

export default PricingHistoryButton
