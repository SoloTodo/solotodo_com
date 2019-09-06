import React from 'react'
import {CopyToClipboard} from "react-copy-to-clipboard";
import {toast} from "react-toastify";
import {
  UncontrolledDropdown,DropdownItem, DropdownMenu, DropdownToggle,
  Modal, ModalBody, ModalFooter, Button, ModalHeader
} from "reactstrap";

import Loading from "../Loading";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";

class BudgetExportButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exportedBBCodeModalIsActive: false,
      bbCode: undefined
    }
  }

  toggleExportedBBCodeModal = () => {
    this.setState({
      exportedBBCodeModalIsActive: !this.state.exportedBBCodeModalIsActive
    })
  };

  exportToBBCode = () => {
    const budget = this.props.budget;
    let url = `budgets/${budget.id}/export/?export_format=bbcode`;

    this.toggleExportedBBCodeModal();

    this.props.fetchAuth(url).then(response => {
      this.setState({
        bbCode: response.content
      });
    })
  };

  exportToXls = () => {
    const budget = this.props.budget;
    const url = `budgets/${budget.id}/export/?export_format=xls`;

    this.props.fetchAuth(url)
      .then(response => window.location = response.content)
  };

  render() {
    return <React.Fragment>
      {this.props.isMobile?
        <React.Fragment>
          <DropdownItem onClick={this.exportToBBCode}>Exportar a Capa9</DropdownItem>
          <DropdownItem onClick={this.exportToXls}>Exportar a Excel</DropdownItem>
        </React.Fragment> :
        <UncontrolledDropdown className="m-2 export-dropdown">
          <DropdownToggle color="primary" outline caret>Exportar</DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.exportToBBCode}>Exportar a Capa9</DropdownItem>
            <DropdownItem onClick={this.exportToXls}>Exportar a Excel</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>}

      <Modal isOpen={this.state.exportedBBCodeModalIsActive} toggle={this.toggleExportedBBCodeModal}>
        <ModalHeader toggle={this.toggleExportedBBCodeModal}>Código para foro de Capa9</ModalHeader>
        <ModalBody>
          {this.state.bbCode?
            <div>
              <div className="row">
                <div className="col-12">
                  <p>Copia y pega este código en el foro de Capa9 para compartir tu cotización</p>
                  <textarea disabled className="exported-bbcode" value={this.state.bbCode}/>
                </div>
              </div>
            </div> :
            <Loading/>}
        </ModalBody>
        {this.state.bbCode &&
        <ModalFooter>
          <CopyToClipboard
            text={this.state.bbCode}
            onCopy={() => {
              this.toggleExportedBBCodeModal();
              toast.info('Código copiado al portapapeles')}}>
            <Button onClick={this.onClick} color="primary"><i className="fas fa-copy"/> Copiar código</Button>

          </CopyToClipboard>
        </ModalFooter>}
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

export default connect(mapStateToProps)(BudgetExportButton)