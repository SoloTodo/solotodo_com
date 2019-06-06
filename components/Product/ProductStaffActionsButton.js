import React, {Component} from 'react'
import {connect} from "react-redux";
import {toast} from "react-toastify";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu} from 'reactstrap';

import {settings} from "../../settings";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class ProductStaffActionsButton extends Component {
  cloneProduct = evt => {
    evt.preventDefault();
    toast.info('Clonando...');
    this.props.fetchAuth(`products/${this.props.product.id}/clone/`, {method: 'POST'}).then(response => (
      window.location = `${settings.endpoint}metamodel/instances/${response.instance_id}`
    ));
  };

  render() {
    return <div className="mt-2">
      <UncontrolledDropdown>
        <DropdownToggle color="success" caret>
          Opciones
        </DropdownToggle>
        <DropdownMenu>
          <a href={`${settings.endpoint}metamodel/instances/${this.props.product.instance_model_id}`} className="dropdown-item" target="_blank" >
            Editar producto
          </a>
          <a href="" className="dropdown-item" onClick={this.cloneProduct}>
            Clonar
          </a>
          <a href={`${settings.backendUrl}products/${this.props.product.id}`} className="dropdown-item" target="_blank">
            Ver en backend
          </a>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth
  }
}

export default connect(mapStateToProps)(ProductStaffActionsButton)
