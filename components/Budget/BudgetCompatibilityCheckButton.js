import React from 'react'
import {connect} from "react-redux";
import {Button, DropdownItem} from "reactstrap";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class BudgetCompatibilityCheckButton extends React.Component {
  compatibilityCheck = () => {
    const budget = this.props.budget;
    this.props.fetchAuth(`budgets/${budget.id}/compatibility_issues/`).then(compatibilityIssues => {
      if (compatibilityIssues.errors.length || compatibilityIssues.warnings.length) {
        this.props.setCompatibilityIssues(compatibilityIssues);
      } else {
        this.props.setCompatibilityIssues(
          {success: ['Tu cotización no tiene errores o advertencias según ' +
            'el sistema de SoloTodo, aunque considera que esta verificación ' +
            'no es perfecta y no revisa si tiene cuellos de botella o no.']})
      }
    })
  };

  render() {
    return <React.Fragment>
      {this.props.isMobile?
        <DropdownItem onClick={this.compatibilityCheck}> Chequear compatibilidad </DropdownItem> :
        <Button color="success" className="m-2" onClick={this.compatibilityCheck}>Chequear compatibilidad</Button>}
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth
  }
}

export default connect(mapStateToProps)(BudgetCompatibilityCheckButton);