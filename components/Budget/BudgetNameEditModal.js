import React from 'react'
import {connect} from "react-redux";
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class BudgetNameEditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameEditModalIsActive: false,
      budgetEditName: undefined
    }
  }

  toggleNameEditModal = () => {
    this.setState({
      budgetEditName: this.props.budget.name,
      nameEditModalIsActive: !this.state.nameEditModalIsActive
    });
  };

  handleNameChange = e => {
    this.setState({
      budgetEditName: e.target.value
    })
  };

  handleNameEditButton = () => {
    const budget = this.props.budget;
    const formData = {name: this.state.budgetEditName};
    this.props.fetchAuth(`budgets/${budget.id}/`, {
      method: 'PATCH',
      body: JSON.stringify(formData)
    }).then(() => {
      this.props.budgetUpdate();
      this.props.userUpdate();
      this.toggleNameEditModal();
    })
  };

  render() {
    return <React.Fragment>
      <h1 className="budget-name" onClick={this.toggleNameEditModal}>{this.props.budget.name}</h1>
      <Modal isOpen={this.state.nameEditModalIsActive} toggle={this.toggleNameEditModal}>
        <ModalHeader>Cambiar nombre</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label htmlFor="budgetName">Nombre:</label>
            <input
              type="text"
              className="form-control"
              id="budgetName"
              onChange={this.handleNameChange}
              value={this.state.budgetEditName}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleNameEditButton}>Guardar</Button>
          <Button color="danger" onClick={this.toggleNameEditModal}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  return {
    fetchAuth,
  }
}

export default connect(mapStateToProps)(BudgetNameEditModal);
