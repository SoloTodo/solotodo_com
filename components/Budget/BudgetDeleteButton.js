import React from 'react'
import {connect} from "react-redux";
import Router from 'next/router'
import {toast} from 'react-toastify';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, DropdownItem} from "reactstrap";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class BudgetDeleteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      budgetDeleteModalIsActive: false
    }
  }

  toggleBudgetDeleteModal = () => {
    this.setState({
      budgetDeleteModalIsActive: !this.state.budgetDeleteModalIsActive
    });
  };

  deleteBudget = () => {
    const budget = this.props.budget;
    this.props.fetchAuth(`budgets/${budget.id}/`, {
      method: 'DELETE'
    }).then(() => {
      this.props.onBudgetDeleted();
      toast.info('Cotización eliminada');
      Router.push('/')
    })
  };

  render() {
    return <React.Fragment>
      {this.props.isMobile?
        <DropdownItem onClick={this.toggleBudgetDeleteModal}> Eliminar </DropdownItem> :
        <Button color="danger" className="m-2" onClick={this.toggleBudgetDeleteModal}>Eliminar</Button>}

      <Modal isOpen={this.state.budgetDeleteModalIsActive} toggle={this.toggleBudgetDeleteModal}>
        <ModalHeader>Eliminar cotización</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-12">
              Esto eliminará tu cotización. ¿Estás seguro que deseas continuar?
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.deleteBudget}>Eliminar</Button>
          <Button color="primary" onClick={this.toggleBudgetDeleteModal}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth
  }
}

export default connect(mapStateToProps)(BudgetDeleteButton);