import React from 'react';
import './App.css';
import PropTypes from "prop-types";
import Operation from './Operation'
import axios from 'axios';
import { parseISO } from 'date-fns'


class Edition extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
  }
  

  componentDidMount(){
    this.fetchHolders()
  }

  async fetchHolders(){
      const holders_url = "https://api.better-call.dev/v1/contract/mainnet/" + this.props.contract_id + "/tokens/holders?token_id="
      const transfers_url = "https://api.better-call.dev/v1/tokens/mainnet/transfers/"+ process.env.REACT_APP_WALLET + "?contracts=" + this.props.contract_id + "&token_id="

      try {
        const resp = await axios.get(holders_url + this.props.token_id)
        const holders = resp.data
        const reduced_holder = Object.entries(holders).map(a => [a[0], parseInt(a[1])])
        const editions_total = reduced_holder.map(a => a[1]).reduce((a, b) => a + b)
        const edition_index = reduced_holder.map(a => a[0]).indexOf(process.env.REACT_APP_WALLET)
        const edition = reduced_holder.slice(0, edition_index).map(a => a[1]).reduce((a, b) => a + b)
        const availables = reduced_holder[0]

        const transfers_resp = await axios.get(transfers_url + this.props.token_id)
        const transfers = transfers_resp.data

        this.setState({availables, edition, editions_total, transfers, isLoading: false})     
      } catch (error) {
        console.error(error);
      }
  }   

  

  render() {
    const {availables, edition, editions_total, transfers, isLoading, show_more} = this.state
    if(isLoading){   
      return null
    }else{
      return(
        <span>
          <p >ed. {edition}/{editions_total}</p>
          <p style={{cursor: "pointer"}} onClick={() => this.setState({show_more: !show_more})}>{show_more? "-":"+"}</p>
          {show_more && (
            <span style={{fontSize: '0.8em'}}>
              <p>Editions still available: {availables[1]} </p>
              <div style={{marginTop: 10}}>
              _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                <p>Transaction</p>
                {transfers.transfers.map((transfer, index) => {
                  const date = parseISO(transfer.timestamp)
                  return (
                    <span key={index}>
                      <p>{date.toString()}</p>
                      <p>{transfer.from_alias}</p>
                      <Operation hash={transfer.hash}/>
                    </span>
                  )
                })}
              </div>
            </span>
            )}
        </span>
      );
    }
  }
}

Edition.propTypes = {
  token_id: PropTypes.number.isRequired,
  contract_id: PropTypes.number.isRequired,
};


export default Edition;
