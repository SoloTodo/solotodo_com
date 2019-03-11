import React, {Component} from 'react';
import {Route, Switch} from "react-router-dom";
import AccountLogin from "./AccountLogin";
import AccountSignup from "./AccountSignup";
import VerifyAccount from "./VerifyAccount";
import PasswordResetForm from "./PasswordResetForm";
import PasswordChange from "./PasswordChange";
import {withSoloTodoTracker} from "../utils";

class AccountSwitch extends Component {
  render() {
    const match = this.props.match;
    return (
        <Switch>
          <Route path={match.url + '/login'} exact component={AccountLogin}/>
          <Route path={match.url + '/signup'} exact component={AccountSignup}/>
          <Route path={match.url + '/verify-email'} exact
                 component={VerifyAccount}/>
          <Route path={match.url + '/password_reset'} exact
                 component={PasswordResetForm}/>
          <Route path={match.url + '/password_change'} exact
                 component={PasswordChange}/>
        </Switch>
    )
  }
}

export default withSoloTodoTracker(AccountSwitch)