import React from 'react';
import {connect} from "react-redux";
import {toast} from 'react-toastify';
import Router from 'next/router';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

import {solotodoStateToPropsUtils} from "../../redux/utils";

class ProductAddToBudgetButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createBudgetModalIsActive: false,
      newBudgetName: ''
    }
  }

  toggleCreateBudgetModal = () => {
    this.setState({
      newBudgetName: '',
      createBudgetModalIsActive: !this.state.createBudgetModalIsActive
    })
  };

  handleNewBudgetNameChange = evt => {
    this.setState({
      newBudgetName: evt.target.value
    });
  };

  handleCreateButtonClick = () => {
    const formData = {name: this.state.newBudgetName};
    return this.props.fetchAuth('budgets/', {
      method: 'POST',
      body: JSON.stringify(formData)
    }).then(newBudget => {
      this.props.fetchAuth('users/me/').then(newUser => {
        this.props.updateUser(newUser)
      });
      this.addToBudget(newBudget).then(() => {
        Router.push(`/budgets/${newBudget.id}/edit`)
      })
    })
  };

  addToBudget = budget => {
    const formData = {product: this.props.product.id};
    return this.props.fetchAuth(`budgets/${budget.id}/add_product/`, {
      method: 'POST',
      body: JSON.stringify(formData)
    })
  };

  addToBudgetWithNotification = budget => {
    this.addToBudget(budget).then(() => (
      toast.info(`${this.props.product.name} agregado a ${budget.name}`)
    ))
  };

  handleAnonymousCreateBudgetClick = evt => {
    toast.info('Regístrate y podrás crear cotizaciones de PCs y chequear su compatibilidad', {autoClose: false});
    Router.push(`/account/signup`)
  };

  render() {
    const user = this.props.user;

    if (!user) {
      return <div className="mt-2">
        <Button className="btn btn-primary" onClick={this.handleAnonymousCreateBudgetClick}>Crear cotización con este producto</Button>
      </div>
    }

    if (user.budgets.length) {
      return <div className="mt-2">
        <UncontrolledDropdown>
          <DropdownToggle caret color="primary">
            Agregar a cotización
          </DropdownToggle>
          <DropdownMenu>
            {user.budgets.map(budget => (
              <DropdownItem key={budget.id} onClick={e => this.addToBudgetWithNotification(budget)}>{budget.name}</DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    }
    return <div className="mt-2">
      <Button color="primary" onClick={this.toggleCreateBudgetModal}>Crear cotización con este producto</Button>
      <Modal isOpen={this.state.createBudgetModalIsActive} toggle={this.toggleCreateBudgetModal}>
        <ModalHeader>Crear nueva cotización</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label htmlFor="inputBudgetName">Nombre:</label>
            <input
              type="text"
              className="form-control"
              id="inputBudgetName"
              onChange={this.handleNewBudgetNameChange}
              value={this.state.newBudgetName}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleCreateButtonClick}>Crear</Button>
          <Button color="danger" onClick={this.toggleCreateBudgetModal}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </div>
  }
}

function mapStateToProps(state) {
  const {user} = solotodoStateToPropsUtils(state);
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    user,
    fetchAuth
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch,
    updateUser: user => {
      return dispatch({
        type: 'updateApiResourceObject',
        apiResourceObject: user
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductAddToBudgetButton)