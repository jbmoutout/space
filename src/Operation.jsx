import React from 'react';
import './App.css';
import PropTypes from "prop-types";
import Artist from './Artist'
import axios from 'axios';


class Operation extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
  }
  

  componentDidMount(){
    this.fetchOperations()
  }

  async fetchOperations(){
      const ops_url = "https://api.tzkt.io/v1/operations/"
      try {
        const resp = await axios.get(ops_url + this.props.hash + '?quote=eur')
        const operation = resp.data[0]
        this.setState({operation, isLoading: false})     
      } catch (error) {
        console.error(error);
      }
  }   

  

  render() {
    const {operation, isLoading} = this.state
    if(isLoading){   
      return null
    }else{
      const amount_xtz = operation.amount / 1000000
      const amount_eur = amount_xtz * operation.quote.eur
      return(
        <span>
          <p>{amount_xtz}ꜩ - {(amount_eur.toFixed(2))}€ (fees: {operation.bakerFee / 1000000}ꜩ)</p> 
          <p>From:</p> <Artist artist_id={operation.diffs[0].content.value.issuer}/>
          <p>Status: {operation.status}</p>
        </span>
      );
    }
  }
}

Operation.propTypes = {
  hash: PropTypes.string.isRequired,
};


export default Operation;
