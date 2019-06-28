import React from 'react'
import Link from "next/link";
import Router, {withRouter} from "next/router";
import {toast} from 'react-toastify';
import LaddaButton, { MD, EXPAND_LEFT } from "react-ladda";

import {fetchJson} from "../../react-utils/utils";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import {settings} from "../../settings";
import TopBanner from "../../components/TopBanner";
import RatingStarsEditable from "../../components/RatingStarsEditable";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";



class NewProductRating extends React.Component {
  static async getInitialProps(ctx) {
    const { res, query, reduxStore, asPath } = ctx;
    const reduxState = reduxStore.getState();

    const {user, categories, preferredCountryStores} = solotodoStateToPropsUtils(reduxState);
    const productId = query.id;

    const productsUrl = settings.apiResourceEndpoints.products;

    let product;

    try {
      product = await fetchJson(`${productsUrl}${productId}/`);
    } catch (e) {
      if (res) {
        res.statusCode=404;
        res.end('Not found');
        return
      }
    }
    const category = categories.filter(localCategory => localCategory.url === product.category)[0];

    return {
      product,
      category,
      preferredCountryStores,
      user
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        product_rating: undefined,
        product_comments: '',
        store: this.props.preferredCountryStores[0].id,
        store_rating: undefined,
        store_comments: '',
        purchase_proof: undefined
      },
      rating: undefined
    }
  }

  handleStarClick = (nextValue, prevValue, name) => {
    this.setState({
      formValues: {
        ...this.state.formValues,
        [name]: nextValue
      }
    })
  };

  handleFieldChange = e => {
    this.setState({
      formValues: {
        ...this.state.formValues,
        [e.target.name]: e.target.value
      }})
  };

  handleFileChange = e => {
    this.setState({
      formValues: {
        ...this.state.formValues,
        purchase_proof: e.target.files[0] || null
      }
    })
  };

  handleFormSubmit = e => {
    e.preventDefault();
    if(!this.state.formValues.product_rating){
      toast.error('Por favor ingrese el numero de estrellas (1 a 5) del producto.');
      return;
    }

    if(!this.state.formValues.store_rating){
      toast.error('Por favor ingrese el numero de estrellas (1 a 5) de la tienda.');
      return;
    }

    this.setState({
      rating: null
    });

    const formData = new FormData();
    formData.append('product', this.props.product.id);

    for (const key in this.state.formValues) {
      formData.append(key, this.state.formValues[key])
    }

    this.props.fetchAuth(settings.apiResourceEndpoints.ratings, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': null
      }
    }).then(rating => {
      Router.push(`/products/view?id=${this.props.product.id}&slug=${this.props.product.slug}`, `/products/${this.props.product.id}-${this.props.product.slug}`);
      toast.success('Rating enviado exitosamente. Gracias! Apenas lo verifiquemos aparecerá publicado en el sitio.', {
        autoClose: false
      });
    })
  };


  render() {
    const product = this.props.product;
    const category = this.props.category;

    return <React.Fragment>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div>
              <div className="row">
                <TopBanner category={category.name}/>
                <div className="col-12">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link  href={`/browse?category_slug=${category.slug}`} as={`/${category.slug}`}><a>{category.name}</a></Link></li>
                    <li className="breadcrumb-item"><Link href={`/products/view?id=${product.id}&slug=${product.slug}`} as={`/products/${product.id}-${product.slug}`}><a>{product.name}</a></Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Nuevo rating</li>
                  </ol>
                </div>

                <div className="col-12">
                  <h1>{product.name} - Nuevo rating</h1>
                </div>

                <div className="col-12">
                  <div className="content-card">
                    <form onSubmit={this.handleFormSubmit}>
                      <table className="table">
                        <tbody>
                        <tr>
                          <th className="align-middle">Producto</th>
                          <td>{product.name}</td>
                        </tr>
                        <tr>
                          <th className="align-middle">Evaluación del producto (de 1 a 5)</th>
                          <td>
                            <RatingStarsEditable
                              name="product_rating"
                              value={this.state.formValues.product_rating}
                              onStarClick={this.handleStarClick}/>
                          </td>
                        </tr>
                        <tr>
                          <th className="align-middle">Comentarios del producto</th>
                          <td>
                          <textarea
                            name="product_comments"
                            value={this.state.formValues.product_comments}
                            onChange={this.handleFieldChange}
                            required={true}
                            placeholder="Comentarios sobre la calidad o rendimiento del producto mismo. ¿Cumplió las expectativas?"
                            className="form-control"/>
                          </td>
                        </tr>
                        <tr>
                          <th className="align-middle">Tienda</th>
                          <td>
                            <select className="form-control" name="store" value={this.state.formValues.store} onChange={this.handleFieldChange}>
                              {this.props.preferredCountryStores.map(store => (
                                <option key={store.id} value={store.id}>{store.name}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <th className="align-middle">Evaluación de la tienda (de 1 a 5)</th>
                          <td>
                            <RatingStarsEditable
                              name="store_rating"
                              value={this.state.formValues.store_rating}
                              onStarClick={this.handleStarClick}/>
                          </td>
                        </tr>
                        <tr>
                          <th className="align-middle">Comentarios de la tienda</th>
                          <td>
                          <textarea
                            name="store_comments"
                            value={this.state.formValues.store_comments}
                            onChange={this.handleFieldChange}
                            required={true}
                            placeholder="Comentarios sobre tienda. ¿Te trataron bien? ¿Te atendieron rápido? ¿Cómo fue el despacho?"
                            className="form-control"/>
                          </td>
                        </tr>
                        <tr>
                          <th className="align-middle">Archivo de confirmación</th>
                          <td>
                            <input
                              type="file"
                              name="purchase_proof"
                              className="form-control-file"
                              required={true}
                              onChange={this.handleFileChange} />
                            <p className="text-muted mt-2">
                              Boleta, factura, correo de confirmación, o cualquier foto o documento que verifique que compraste el producto en esa tienda. Tiene que aparecer el nombre del producto y de la tienda. Puede ser una foto, archivo PDF, o lo que prefieras.
                            </p>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                      <LaddaButton
                        loading={this.state.rating}
                        type="submit"
                        className="btn btn-primary"
                        data-size={MD}
                        data-style={EXPAND_LEFT}>
                        {this.state.rating === null ? 'Enviando' : 'Enviar'}
                      </LaddaButton>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth
  }
}

export default withRouter(connect(mapStateToProps)(NewProductRating))