import React from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DropdownItem
} from "reactstrap";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";


class BudgetEntryCreateButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: this.props.budgetCategories[0].url,
      entryCreateModalIsActive: false
    }
  }

  toggleEntryCreateModal = () => {
    this.setState({
      entryCreateModalIsActive: !this.state.entryCreateModalIsActive
    })
  };

  handleCategorySelect = e => {
    this.setState({
      selectedCategory: e.target.value
    })
  };

  createBudgetEntry = () => {
    const budget = this.props.budget;
    const formData = {
      budget: budget.url,
      category: this.state.selectedCategory
    };

    this.props.fetchAuth('budget_entries/', {
      method: 'POST',
      body: JSON.stringify(formData)
    }).then(() => {
      this.toggleEntryCreateModal();
      this.props.budgetUpdate();
    })
  };

  render() {
    return <React.Fragment>
      {this.props.isMobile?
        <DropdownItem onClick={this.toggleEntryCreateModal}>Agregar Componente</DropdownItem> :
        <Button color="primary" outline className="m-2" onClick={this.toggleEntryCreateModal}>Agregar componente</Button>}
      <Modal isOpen={this.state.entryCreateModalIsActive} toggle={this.toggleEntryCreateModal}>
        <ModalHeader>Agregar componente</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label htmlFor="category-select">Component</label>
            <select
              id="category-select"
              className="custom-select"
              value={this.state.selectedCategory}
              onChange={this.handleCategorySelect}>
              {this.props.budgetCategories.map(category =>
                <option key={category.url} value={category.url}>{category.name}</option>)}
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.createBudgetEntry}>Agregar</Button>
          <Button color="danger" onClick={this.toggleEntryCreateModal}>Cancelar</Button>
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

export default connect(mapStateToProps)(BudgetEntryCreateButton);