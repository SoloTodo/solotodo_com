import React from 'react'
import {connect} from "react-redux";
import {
  DropdownItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import {toast} from 'react-toastify';
import {solotodoStateToPropsUtils} from "../../redux/utils";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import StoreCheckBox from './StoreCheckBox'
import {updatePreferredStores} from "../../redux/actions";
import {getAuthToken} from "../../react-utils/utils";


class NavBarPreferredStores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preferredStoresModalIsActive: false,
      preferredCountryStores: []
    };
  }

  togglePreferredStoresModal = () => {
    this.setState({
      preferredCountryStores: [...this.props.preferredCountryStores],
      preferredStoresModalIsActive: !this.state.preferredStoresModalIsActive
    });
  };

  save = () => {
    if (!this.state.preferredCountryStores.length) {
      toast.error("Debes seleccionar al menos una tienda");
      return;
    }

    const newUnsortedPreferredStoreUrls = [
      ...this.props.preferredStores.filter(store => store.country !== this.props.preferredCountry.url),
      ...this.state.preferredCountryStores
    ].map(store => store.url);

    const newPreferredStoreIds = this.props.stores
      .filter(store => newUnsortedPreferredStoreUrls.includes(store.url))
      .map(store => store.id);

    this.props.updatePreferredStores(newPreferredStoreIds, this.props.user);
    this.setState({
      preferredStoresModalIsActive: false
    })
  };

  handleCheckBoxClick = store => {
    const previouslyChecked = this.state.preferredCountryStores.includes(store);

    if (previouslyChecked) {
      this.setState({
        preferredCountryStores: this.state.preferredCountryStores.filter(stateStore => {
          return stateStore.url !== store.url
        })
      })
    } else {
      this.setState({
        preferredCountryStores: [...this.state.preferredCountryStores, store]
      })
    }
  };

  selectAllStores = () => {
    this.setState({
      preferredCountryStores: this.props.countryStores
    })
  };

  deselectAllStores = () => {
    this.setState({
      preferredCountryStores: []
    })
  };

  render() {
    const countryStoresCount = this.props.countryStores.length;
    const preferredCountryStoresCount = this.props.preferredCountryStores.length;

    return <DropdownItem onClick={this.togglePreferredStoresModal}>
      <span>
        Tiendas&nbsp;
        {countryStoresCount !== preferredCountryStoresCount &&
        <span>({preferredCountryStoresCount} de {countryStoresCount})</span>}
      </span>
      <Modal id="preferred_stores" isOpen={this.state.preferredStoresModalIsActive}
             toggle={this.togglePreferredStoresModal} size="lg">
        <ModalHeader toggle={this.togglePreferredStoresModal}>
          Tiendas seleccionadas
          <div className="mt-2">
            <Button color="info" onClick={this.selectAllStores}>Todas</Button>
            <Button className="ml-1" color="info" onClick={this.deselectAllStores}>Ninguna</Button>
          </div>
        </ModalHeader>
        <ModalBody id="store_container"
                   className="d-flex align-items-center flex-wrap">
          {this.props.countryStores.map(store => (
            <StoreCheckBox
              key={store.id}
              isChecked={this.state.preferredCountryStores.includes(store)}
              store={store}
              handleCheckBoxClick={this.handleCheckBoxClick}/>))}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.save}>Guardar</Button>
          <Button color="danger" onClick={this.togglePreferredStoresModal}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </DropdownItem>
  }
}

function mapStateToProps(state) {
  const { fetchAuth } = apiResourceStateToPropsUtils(state);
  const { user, preferredStores, preferredCountry, stores, countryStores, preferredCountryStores } = solotodoStateToPropsUtils(state);

  return {
    fetchAuth,
    user,
    preferredStores,
    preferredCountry,
    stores,
    countryStores,
    preferredCountryStores,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updatePreferredStores: async (storeIds, user) => {
      return await dispatch(updatePreferredStores(storeIds, user, getAuthToken()))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBarPreferredStores);
