import React from 'react'
import {connect} from "react-redux";
import {
  UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle,
  Modal, ModalBody, ModalFooter, ModalHeader, Button
} from "reactstrap";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class BudgetEntryDeleteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entryDeleteModalIsActive: false
    }
  }

  toggleEntryDeleteModal = () => {
    this.setState({
      entryDeleteModalIsActive: !this.state.entryDeleteModalIsActive
    });
  };

  removeSelectedProduct = product => {
    this.props.fetchAuth(`${this.props.budgetEntry.budget}remove_product/`, {
      method: 'POST',
      body: JSON.stringify({product: product.id})
    }).then(this.props.budgetUpdate)
  };

  removeComponent = () => {
    this.props.fetchAuth(`budget_entries/${this.props.budgetEntry.id}/`, {
      method: 'DELETE'
    }).then(this.props.budgetUpdate)
  };

  render() {
    return <React.Fragment>
      {this.props.isMobile?
        <React.Fragment>
          {this.props.matchingPricingEntry && <DropdownItem onClick={e => this.removeSelectedProduct(this.props.matchingPricingEntry.product)}>
            Producto seleccionado
          </DropdownItem>}
          <DropdownItem onClick={this.toggleEntryDeleteModal}>
            Quitar componente
          </DropdownItem>
        </React.Fragment> :
        <UncontrolledDropdown>
          <DropdownToggle caret color="danger">
            Eliminar
          </DropdownToggle>
          <DropdownMenu right>
            {this.props.matchingPricingEntry && <DropdownItem onClick={e => this.removeSelectedProduct(this.props.matchingPricingEntry.product)}>
              Producto seleccionado
            </DropdownItem>}
            <DropdownItem onClick={this.toggleEntryDeleteModal}>
              Quitar componente
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>}

      <Modal isOpen={this.state.entryDeleteModalIsActive} toggle={this.toggleEntryDeleteModal}>
        <ModalHeader>Quitar componente</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-12">
              {`Esta acción removerá el componente "${this.props.category.name}" de tu cotización. ¿Estás seguro que deseas continuar?`}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.removeComponent}>Quitar</Button>
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

export default connect(mapStateToProps)(BudgetEntryDeleteButton)