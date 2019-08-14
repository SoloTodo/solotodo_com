import React from 'react'
import { Alert } from 'reactstrap';
import { parseCookies, setCookie } from 'nookies'

export default class AnnouncementAlert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: true
    }
  }

  componentDidMount() {
    const cookies = parseCookies();
    const announcementHidden = cookies['announcementHidden'];
    this.setState({
      isOpen: !announcementHidden
    })
  }

  dismiss = () => {
    setCookie(null, 'announcementHidden', 1, {
      maxAge: 60 * 60 * 24 * 14,
      path: "/"
    });
    this.setState({
      isOpen: false
    })
  };

  render() {
    return <Alert color="info" id="announcement_alert" className="mb-2 w-100" isOpen={this.state.isOpen} toggle={this.dismiss}>
      ¡Estamos probando nuestra nueva versión! Si encuentras algo extraño <a href="http://blog.solotodo.com/contacto/" className="font-weight-bold">avísanos por acá</a>.
    </Alert>
  }
}