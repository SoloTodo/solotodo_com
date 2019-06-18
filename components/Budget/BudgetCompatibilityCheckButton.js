import React from 'react'
import {connect} from "react-redux";
import Link from "next/link";
import {Button, Alert} from "reactstrap";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class BudgetCompatibilityCheckButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      compatibilityIssues: undefined
    }
  }

  compatibilityCheck = () => {
    const budget = this.props.budget;
    this.props.fetchAuth(`budgets/${budget.id}/compatibility_issues/`).then(compatibilityIssues => {
      if (compatibilityIssues.errors.length || compatibilityIssues.warnings.length) {
        this.setState({
          compatibilityIssues
        });
      } else {
        this.setState({
          compatibilityIssues: {
            success: ['Tu cotización no tiene errores o advertencias según el sistema de SoloTodo, aunque considera que esta verificación no es perfecta y no revisa si tiene cuellos de botella o no.']
          }
        })
      }
      const scrollToComponent = require("react-scroll-to-component");
      scrollToComponent(this.CompatibilityIssuesContainer, {offset: -60, align: 'top'});
    })
  };

  render() {
    const compatibilityIssues = this.state.compatibilityIssues;
    return <React.Fragment>
      <Button color="success" className="m-2" onClick={this.compatibilityCheck}>Chequear compatibilidad</Button>
      {this.state.compatibilityIssues && <div ref={div => {
        this.CompatibilityIssuesContainer = div}}>
        <Alert color="warning">
          <i className="fas fa-exclamation-triangle">&nbsp;</i>
          Lea sobre el uso de la herramienta de compatibilidad en&nbsp;
          <Link href={'/budgets/compatibility'} as={'/budgets/compatibility'}>
            <a className="font-weight-bold">
              este link
            </a>
          </Link>.
          (tl;dr: La herramienta no es perfecta y no verifica todos los casos,
          no nos hacemos responsables).
        </Alert>
        <div className="content-card mb-3">
          {!compatibilityIssues.success &&
          <p>Tu cotización tiene las siguientes observaciones:</p>}
          <table className="table" id="compatibility-check-table">
            <tbody>
            {compatibilityIssues.success && compatibilityIssues.success.map(message => (
              <tr key={message}>
                <td className="text-success"><i className="fas fa-check-circle"/> Éxito</td>
                <td>{message}</td>
              </tr>
            ))}
            {compatibilityIssues.warnings && compatibilityIssues.warnings.map(warning => (
              <tr key={warning}>
                <td className="text-warning"><i className="fas fa-exclamation-triangle"/> Advertencia</td>
                  <td>{warning.split('\n').map((item, key) => <span key={key}>{item}<br/></span>)}</td>
                </tr>
            ))}
            {compatibilityIssues.errors && compatibilityIssues.errors.map(error => (
              <tr key={error}>
                <td className="text-danger"><i className="fas fa-exclamation-circle"/> Error</td>
                <td>{error.split('\n').map((item, key) => <span key={key}>{item}<br/></span>)}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>}
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