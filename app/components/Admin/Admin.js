import React, { Component } from 'react';
import style from './Admin.scss';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const css = classNames.bind(style);

import { database } from '../../js/api';
import latinize from '../../js/utils/latinize';

import {
  getInventoryAsync
} from '../../actions/inventory-action-creators';
import FindAndEdit from './FindAndEdit';
import AddProduct from './AddProduct';

class Admin extends Component {
  constructor (props) {
    super(props);
    this.getAdmin = this.getAdmin.bind(this);
    this.searchProduct = this.searchProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.hideMessageHandler = this.hideMessageHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.addProductFormHandler = this.addProductFormHandler.bind(this);
    this.changeMenuHandler = this.changeMenuHandler.bind(this);

    this.state = {
      section: 'Pedidos'
    };
  }

  getAdmin (snapshot) {
    const admin = snapshot.val();
    let ordersPromise;

    this.setState({
      admin: admin
    });

    if (admin) {
      ordersPromise = database.ref('orders')
        .orderByChild('state')
        .equalTo('active')
        .once('value')
        .then(function (snapshot) {
          console.log(snapshot.val());
        });
    }
  }

  addProductFormHandler (e) {
    const { productName, price, units, imgUrl, type } = e.target;
    const { getInventoryAsync } = this.props;
    const data = {
      productName: productName.value,
      price: price.value,
      units: units.value,
      imgUrl: imgUrl.value,
      type: type.value
    };

    database.ref('inventory/data').push(data, getInventoryAsync);

    resetInputFields(productName, price, units, imgUrl, type);
    e.preventDefault();
  }

  updateProduct (e) {
    const { search } = this.state;
    const { uid, inventory, getInventoryAsync } = this.props;
    const { productName, price, units, imgUrl, type } = e.target;

    const inputData = {
      productName: productName.value,
      price: price.value,
      units: units.value,
      imgUrl: imgUrl.value,
      type: type.value
    };

    if (search && search.key) {
      const changes = whichHasChanged(inventory[search.key], inputData);

      database.ref(`inventory/data/${search.key}`).update(changes.reduce((a, b) => {
        return a[b] = inputData[b], a;
      }, {}), getInventoryAsync);
    }

    resetInputFields(productName, price, units, imgUrl, type);
    e.preventDefault();
  }

  searchProduct (e) {
    let value = this._inputSearch.value;
    const { inventory } = this.props;

    if (!value) return;
    value = latinize(value.toLowerCase());

    let search = Object.keys(inventory).find((key) => {
      return latinize(inventory[key].productName.toLowerCase()) === value;
    });

    if (!search) {
      search = searchByRegex(value, inventory);
    }
    setSearch.call(this, search, inventory);
  }

  hideMessageHandler (e) {
    this.setState({
      message: null
    });
  }

  deleteHandler (e) {
    const { message, search } = this.state;
    const {
      _inputProductName,
      _inputProductPrice,
      _inputProductUnits,
      _inputProductImg,
      _inputProductType
    } = this;

    e.preventDefault();
    if (!search) return;

    if (!message || !message.deleteToggle) {
      this.setState({
        message: {
          type: 'btn--danger',
          deleteToggle: true,
          text: ['click de nuevo en el boton para borrar', <br key="br" />, 'click en este mensaje para cancelar']
        }
      });
      return;
    }

    this.setState({
      search: null,
      message: {
        type: 'btn--success',
        deleteToggle: false,
        text: 'Se elimino permanentemente'
      }
    });

    resetInputFields(_inputProductName, _inputProductPrice, _inputProductUnits, _inputProductImg, _inputProductType);
    database.ref(`inventory/data/${search.key}`).remove().then(() => {
      this.props.getInventoryAsync();
    });
    e.preventDefault();
  }

  changeMenuHandler (e) {
    const { target } = e;

    if (target.classList.contains('js-menu')) {
      this.setState({
        section: target.innerHTML
      });
    }
  }

  render () {
    const { uid, filters } = this.props;
    const { admin, search, message, section } = this.state;

    if (uid && !admin) {
      database
        .ref(`users/${uid}/is_admin`)
        .once('value')
        .then(this.getAdmin);
    }

    return (
      admin
      ?
      <div className={ css('admin') }>
        <h1 className={ css('h1', 'admin__header') }>Admin</h1>
        <div className={ css('admin__menu') } onClick={ this.changeMenuHandler }>
          <div className={ css('admin__menu-item', 'js-menu') }>Pedidos</div>
          <div className={ css('admin__menu-item', 'js-menu') }>Productos</div>
        </div>
        <div className={ css('admin__module', 'admin__orders-module', section === 'Pedidos' && 'admin--active') }>
          <div className={ css('section-wrapper', 'admin__section-wrapper') }>

          </div>
        </div>
        <div className={ css('admin__module', 'admin__products-module', section === 'Productos' && 'admin--active') }>
          <div className={ css('section-wrapper', 'admin__section-wrapper') }>
            { FindAndEdit.call(this, { search, filters, message }) }
          </div>
          <div className={ css('section-wrapper', 'admin__section-wrapper') }>
            <AddProduct addProduct={ this.addProductFormHandler } filters={ filters } />
          </div>
        </div>
      </div>
      :
      <div></div>
    );
  }
}

function whichHasChanged (obj1, obj2) {
  return Object.keys(obj1).reduce((array, key) => {
    return obj1[key].toString() !== obj2[key] && array.push(key), array;
  }, []);
}

function resetInputFields (...inputs) {
  inputs.forEach((input) => {
    input.value = '';
  });
}

function searchByRegex (value, inventory) {
  const regex = new RegExp(`${value}?`);

  const search = Object.keys(inventory).find((key) => {
    return regex.test(latinize(inventory[key].productName.toLowerCase()));
  });

  if (search || value.length === 4) {
    return search;
  }

  return searchByRegex(value.slice(0, length - 1), inventory);
}

function setSearch (search, inventory) {
  const {
    _inputProductName,
    _inputProductPrice,
    _inputProductUnits,
    _inputProductImg,
    _inputProductType
  } = this;

  if (!search) {
    this.setState({
      search: null,
      message: {
        type: 'btn--warning',
        text: 'Sin resultados'
      }
    });
    resetInputFields(_inputProductName, _inputProductPrice, _inputProductUnits, _inputProductImg, _inputProductType);
    return;
  }
  this.setState({
    search: {
      key: search,
      type: inventory[search].type
    },
    message: null
  });
  _inputProductName.value = inventory[search].productName;
  _inputProductPrice.value = inventory[search].price;
  _inputProductUnits.value = inventory[search].units;
  _inputProductImg.value = inventory[search].imgUrl;
}

const mapStateToProps = (state, ownProps) => {
  return {
    inventory: state.inventory.data,
    filters: state.inventory.filters,
    uid: state.user.res && state.user.res.uid
  };
};

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
  getInventoryAsync
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
