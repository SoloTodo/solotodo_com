import React from 'react'
import {connect} from "react-redux";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {Button} from "reactstrap";
import {solotodoStateToPropsUtils} from "../../redux/utils";

class BudgetSelectBestPricesButton extends React.Component {
  selectBestPrices = () => {
    const budget = this.props.budget;
    const formData = {stores: this.props.preferredCountryStores.map(store => store.id)};
    this.props.fetchAuth(`budgets/${budget.id}/select_cheapest_stores/`, {
      method: 'POST',
      body: JSON.stringify(formData)
    }).then(this.props.budgetUpdate)
  };

  render() {
    return <Button color="primary" outline className="m-2" onClick={this.selectBestPrices}>Seleccionar mejores precios</Button>
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores} = solotodoStateToPropsUtils(state);
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
    preferredCountryStores
  }
}

export default connect(mapStateToProps)(BudgetSelectBestPricesButton);