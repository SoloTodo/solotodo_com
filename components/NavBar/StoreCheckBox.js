import React from 'react'

export default class StoreCheckBox extends React.Component {
    render() {
        let originalClass = "store_check_box d-flex align-items-center btn";
        return <label className={this.props.isChecked ? originalClass : originalClass + " inactive"}
                      onClick={evt => this.props.handleCheckBoxClick(this.props.store)}>
            <i className={this.props.isChecked ? "far fa-check-square" : "far fa-square"}/>
            <span className="ml-1 text-left">{this.props.store.name}</span>
        </label>
    }
}
