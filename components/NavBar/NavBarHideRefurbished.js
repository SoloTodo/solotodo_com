import React from "react";
import {connect} from "react-redux";
import {
  DropdownItem,
  CustomInput,
} from 'reactstrap'
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import {
  updatePreferredExcludeRefurbished,
} from "../../redux/actions";
import {getAuthToken} from "../../react-utils/utils";


class NavBarHideRefurbished extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideRefurbished: undefined,
    }
  }

  componentDidMount() {
    this.setState({
      hideRefurbished: this.props.preferredExcludeRefurbished
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.preferredExcludeRefurbished !== this.props.preferredExcludeRefurbished){
      this.setState({
        hideRefurbished: this.props.preferredExcludeRefurbished
      })
    }

    if (this.state.hideRefurbished !== prevState.hideRefurbished){
      this.props.updatePreferredExcludeRefurbished(this.state.hideRefurbished, this.props.user)
    }
  }

  toggleHideRefurbished = () => {
    this.setState({
      hideRefurbished: !this.state.hideRefurbished
    })
  };

  render() {
    return <DropdownItem toggle={false}>
      <CustomInput
        type="switch"
        id="hideRefurbished"
        name="hideRefurbishedSwitch"
        label="Ocultar reacondicionados"
        onClick={this.toggleHideRefurbished}
        inline
        defaultChecked={this.state.hideRefurbished}/>
    </DropdownItem>;
  }
}

function mapStateToProps(state) {
  const { fetchAuth } = apiResourceStateToPropsUtils(state);
  const { user, preferredExcludeRefurbished } = solotodoStateToPropsUtils(state);

  return {
    fetchAuth,
    user,
    preferredExcludeRefurbished
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updatePreferredExcludeRefurbished: async (preferredExcludeRefurbished, user) => {
      return await dispatch(updatePreferredExcludeRefurbished(preferredExcludeRefurbished, user, getAuthToken()))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBarHideRefurbished);