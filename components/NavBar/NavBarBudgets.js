import React from 'react';
import {connect} from "react-redux";
import Link from "next/link";
import Router from 'next/router'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {solotodoStateToPropsUtils} from "../../redux-utils";

class NavBarBudgets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createBudgetModalIsActive: false,
      newBudgetName: '',
    };
  }

  createBudgetModalHandler = () => {
    if (this.state.createBudgetModalIsActive) {
      this.cleanField();
    } else {
      this.toggleCreateBudgetModal();
    }
  };

  toggleCreateBudgetModal = () => {
    this.setState({
      createBudgetModalIsActive: !this.state.createBudgetModalIsActive
    });
  };

  handleNewBudgetNameChange = evt => {
    this.setState({
      newBudgetName: evt.target.value
    });
  };

  cleanField = () => {
    this.setState({
      newBudgetName: ''
    });
    this.toggleCreateBudgetModal();
  };

  handleFormSubmit = evt => {
    evt.preventDefault();
    const formData = {name: this.state.newBudgetName};
    return this.props.fetchAuth('budgets/', {
      method: 'POST',
      body: JSON.stringify(formData)
    }).then(newBudget => {
      this.props.fetchAuth('users/me/').then(
        newUser => {
          this.props.updateUser(newUser);
        });
      this.cleanField();
      Router.push(`/budgets/${newBudget.id}/edit`)
    });
  };

  render() {
    const user = this.props.user;

    if (!user) {
      return null
    }

    return <UncontrolledDropdown nav>
      <DropdownToggle nav caret className="navbar-user-link">
        <i className="fas fa-microchip">&nbsp;</i>
      </DropdownToggle>
      <DropdownMenu>
        {
          user.budgets.length ?
            user.budgets.map(budget => (
              <Link key={budget.id} href={`/budgets/edit?id=${budget.id}`} as={`/budgets/${budget.id}/edit`}>
                <a className="dropdown-item">{budget.name}</a>
              </Link>
            ))
            :
            <DropdownItem>
              <i>¡No tienes cotizaciones!</i>
            </DropdownItem>
        }
        <DropdownItem divider/>
        <a href="." className="dropdown-item navbar-dropdown-link" onClick={this.toggleCreateBudgetModal}>
          Crear nueva cotización
        </a>
      </DropdownMenu>

      <Modal isOpen={this.state.createBudgetModalIsActive} toggle={this.createBudgetModalHandler}>
        <ModalHeader>
          Crear nueva cotización
        </ModalHeader>
        <form onSubmit={this.handleFormSubmit}>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="inputBudgetName">Nombre</label>
              <input type="text"
                     className="form-control"
                     id="inputBudgetName"
                     onChange={this.handleNewBudgetNameChange}
                     value={this.state.newBudgetName}
                     required
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">Crear</Button>
            <Button color="danger" onClick={this.cleanField}>Cancelar</Button>
          </ModalFooter>
        </form>
      </Modal>
    </UncontrolledDropdown>
  }
}

function mapStateToProps(state) {
  const { fetchAuth } = apiResourceStateToPropsUtils(state);
  const { user } = solotodoStateToPropsUtils(state);
  return {
    fetchAuth,
    user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateUser: user => {
      return dispatch({
        type: 'updateApiResourceObject',
        apiResourceObject: user
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBarBudgets);