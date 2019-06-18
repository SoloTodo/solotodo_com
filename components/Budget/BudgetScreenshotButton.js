import React from 'react'
import {connect} from "react-redux";
import {toast} from "react-toastify";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import Loading from "../Loading";


class BudgetScreenshotButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exportedImageModalIsActive: false,
      exportedImageUrl: undefined,
    }
  }

  toggleExportedImageModal = () => {
    this.setState({
      exportedImageModalIsActive: !this.state.exportedImageModalIsActive
    })
  };

  exportToImage = () => {
    const budget = this.props.budget;
    const url = `budgets/${budget.id}/export/?export_format=img`;

    this.toggleExportedImageModal();

    this.props.fetchAuth(url).then(response => {
      this.setState({
        exportedImageUrl: response.content
      });
    })
  };

  render() {
    return <React.Fragment>
      <Button color="primary" outline className="m-2" onClick={this.exportToImage}>Obtener pantallazo</Button>
      <Modal size="lg" id="exported-image-modal" isOpen={this.state.exportedImageModalIsActive} toggle={this.toggleExportedImageModal}>
        <ModalHeader>{this.state.exportedImageUrl? "Pantallazo" : "Obteniendo pantallazo..."}</ModalHeader>
        <ModalBody>
          {this.state.exportedImageUrl?
            <div className="row">
              <div className="col-12">
                <div className="image-container mb-3">
                  <img src={this.state.exportedImageUrl} alt={this.props.budget.name}/>
                </div>
              </div>
              <div className="col-12">
                <input type="text" disabled className="form-control mb-1" value={this.state.exportedImageUrl}/>
              </div>
            </div>:
            <Loading/>}
        </ModalBody>
        {this.state.exportedImageUrl && <ModalFooter>
          <CopyToClipboard
            text={this.state.exportedImageUrl}
            onCopy={() => {
              this.toggleExportedImageModal();
              toast.info('URL de imagen copiada al portapapeles');
            }}>
            <Button onClick={this.onClick} color="primary"><i className="fas fa-copy"/> Copiar URL de imagen</Button>
          </CopyToClipboard>
          <Button color="danger" onClick={this.toggleExportedImageModal}>Cerrar</Button>
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

export default connect(mapStateToProps)(BudgetScreenshotButton)