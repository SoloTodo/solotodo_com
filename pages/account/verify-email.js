import React from 'react';
import Head from 'next/head';
import Router from 'next/router'
import {fetchJson} from "../../react-utils/utils";
import {toast} from 'react-toastify';
import {settings} from "../../settings";

class VerifyAccount extends React.Component {
  static async getInitialProps({ reduxStore, res, query }) {
    const state = reduxStore.getState();
    const user = state.apiResourceObjects[settings.ownUserUrl] || null;

    if (user) {
      // User is already logged in, redirect to home

      if (res) {
        // Redirect server side

        res.writeHead(302, {
          Location: "/"
        });
        res.end()
      } else {
        // Soft redirect client side
        Router.push("/");
        return {}
      }
    }

    let response = null;

    try {
      response = await fetchJson('rest-auth/registration/verify-email/', {
        method: 'POST',
        body: JSON.stringify({key: query['key']})
      });
    } catch (err) {
      return {}
    }

    if (response['detail'] === 'Ok') {
      if (res) {
        res.writeHead(302, {
          Location: "/account/login?post_verify=1"
        });
        res.end()
      } else {
        Router.push('/account/login?post_verify=1');
      }
    }

    return {}
  }

  componentDidMount() {
    toast.error('Ocurrió un error al verificar tu correo, por favor verifica el link que seguiste. Si el problema persiste contáctanos!', {autoClose: false})
    Router.push('/');
  }

  render() {
    return <React.Fragment>
      <Head>
        <title>Verificando cuenta - SoloTodo</title>
      </Head>
    </React.Fragment>
  }
}

export default VerifyAccount;