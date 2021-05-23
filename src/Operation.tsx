import React from 'react';
import './App.css';
import Artist from './Artist';
import axios from 'axios';

interface Operation {
  allocationFee: number;
  amount: number;
  bakerFee: number;
  block: string;
  counter: number;
  diffs: Array<{ [key: string]: { [key: string]: { issuer: string } } }>;
  gasLimit: number;
  gasUsed: number;
  hasInternals: boolean;
  hash: string;
  id: number;
  level: number;
  quote: { [key: string]: number };
  sender: { [key: string]: string };
  status: string;
  storageFee: number;
  storageLimit: number;
  storageUsed: number;
  timestamp: string;
  type: string;
}

type Props = {
  hash: string;
};

type State = {
  isLoading: boolean;
  operation: Operation | null;
};

class Operation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      operation: null,
    };
  }

  componentDidMount(): void {
    this.fetchOperations();
  }

  async fetchOperations(): Promise<void> {
    const ops_url = 'https://api.tzkt.io/v1/operations/';
    try {
      const resp = await axios.get(ops_url + this.props.hash + '?quote=eur');
      const operation = resp.data[0];
      this.setState({ operation, isLoading: false });
    } catch (error) {
      console.error(error);
    }
  }

  render(): JSX.Element | null {
    const { operation, isLoading } = this.state;
    if (isLoading) {
      return null;
    }
    if (operation) {
      const amount_xtz = operation.amount / 1000000;
      const amount_eur = amount_xtz * operation.quote.eur;
      return (
        <span>
          <p>
            {amount_xtz}ꜩ - {amount_eur.toFixed(2)}€ (fees: {operation.bakerFee / 1000000}ꜩ)
          </p>
          <p>From:</p> <Artist artist_id={operation.diffs[0].content.value.issuer} />
          <p>Status: {operation.status}</p>
        </span>
      );
    }
    return null;
  }
}

export default Operation;
