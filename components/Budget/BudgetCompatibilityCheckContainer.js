import React from 'react'
import Link from "next/link";
import {Alert} from "reactstrap";

class BudgetCompatibilityCheckContainer extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.compatibilityIssues && this.props.compatibilityIssues !== prevProps.compatibilityIssues) {
      const scrollToComponent = require("react-scroll-to-component");
      scrollToComponent(this.CompatibilityIssuesContainer, {offset: -60, align: 'top'});
    }
  }

  render() {
    const compatibilityIssues = this.props.compatibilityIssues;
    return <React.Fragment>
      {compatibilityIssues && <div ref={div => {
        this.CompatibilityIssuesContainer = div}}>
        <Alert color="warning">
          <i className="fas fa-exclamation-triangle">&nbsp;&nbsp;</i>
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

export default BudgetCompatibilityCheckContainer;