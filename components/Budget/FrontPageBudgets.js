import React from 'react'
import {connect} from "react-redux";

import {settings} from '../../settings';
import Loading from "../Loading";
import {fetchJson} from "../../react-utils/utils";
import MultiToggle from "react-multi-toggle";
import BudgetViewTable
  from "./BudgetViewTable";

class FrontPageBudgets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeBudgetTier: settings.frontPageBudgets[this.props.country.iso_code][0].label,
      activeProcessorBrand: 'intelBudget',
      budgetsDict: undefined
    }
  }

  componentDidMount() {
    this.componentUpdate()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.country !== prevProps.country){
      this.setState({
        budgetsDict:undefined
      });
      this.componentUpdate()
    }
  }

  componentUpdate(){
    let url = 'budgets/?';
    const frontPageBudgets = settings.frontPageBudgets[this.props.country.iso_code];

    for (const budget of frontPageBudgets) {
      url += `ids=${budget.intelBudget}&ids=${budget.amdBudget}&`
    }

    fetchJson(url).then(response => {
      const budgetsDict = {};

      for (const budget of response.results) {
        budgetsDict[budget.id] = budget
      }

      this.setState({
        budgetsDict
      })
    })
  }

  handleBudgetTierSelect = value => {
    this.setState({
      activeBudgetTier: value
    })
  };

  handleProcessorBrandSelect = value => {
    this.setState({
      activeProcessorBrand: value
    })
  };

  render() {
    if (!this.state.budgetsDict) {
      return <Loading/>
    }

    const frontPageBudgets = settings.frontPageBudgets[this.props.country.iso_code];
    const matchingBudgetId = frontPageBudgets.filter(budget => budget.label === this.state.activeBudgetTier)[0][this.state.activeProcessorBrand];

    if (!(matchingBudgetId in this.state.budgetsDict)) {
      return <Loading/>
    }

    const budgetTierChoices = frontPageBudgets.map(budget => (
      {
        displayName: this.props.isExtraSmall ? budget.labelXS : budget.label,
        value: budget.label
      }
    ));

    const processorBrandChoices = [
      {
        displayName: "Intel",
        value: "intelBudget"
      },
      {
        displayName: "AMD",
        value: "amdBudget"
      }
    ];

    return <div className={this.props.isExtraSmall? "content-card pl-2 pr-2" : "content-card"}>
        <div className="d-flex justify-content-between" id="front-page-budgets-options">

          <div className="budget-multi-toggle-container">
            <MultiToggle
              options={budgetTierChoices}
              selectedOption={this.state.activeBudgetTier}
              onSelectOption={this.handleBudgetTierSelect}
            />
          </div>

          <div className="cpu-multi-toggle-container">
            <MultiToggle
              options={processorBrandChoices}
              selectedOption={this.state.activeProcessorBrand}
              onSelectOption={this.handleProcessorBrandSelect}/>
          </div>

        </div>
        <div id="front-page-budgets-table" className="mt-3">
          <BudgetViewTable budget={this.state.budgetsDict[matchingBudgetId]} isFront={true}/>
        </div>
      </div>
  }
}

function mapStateToProps(state) {
  return {
    isExtraSmall: state.browser.is.extraSmall
  }
}

export default connect(mapStateToProps)(FrontPageBudgets);