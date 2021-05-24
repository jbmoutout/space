import React from 'react';
import './App.css';
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
  target: { [key: string]: string };
  timestamp: string;
  type: string;
}

type Props = {
  hash: string;
};

type State = {
  isLoading: boolean;
  operations: Array<Operation> | null;
};

class Operation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      operations: null,
    };
  }

  componentDidMount(): void {
    this.fetchOperations();
  }

  async fetchOperations(): Promise<void> {
    const ops_url = 'https://api.tzkt.io/v1/operations/';
    try {
      const resp = await axios.get(ops_url + this.props.hash + '?quote=eur');
      const operations = resp.data;
      this.setState({ operations, isLoading: false });
    } catch (error) {
      console.error(error);
    }
  }

  render(): JSX.Element | null {
    const { operations, isLoading } = this.state;
    if (isLoading || !operations || operations.length < 1) {
      return null;
    } else {
      return (
        <span>
          {operations.map((operation, index) => {
            const amount_xtz = operation.amount / 1000000;
            const amount_eur = amount_xtz * operation.quote.eur;
            return (
              <span key={index} style={index === 0 ? { fontWeight: 800 } : {}}>
                _ _ _ _ _
                <p>
                  {operation.sender.alias ? operation.sender.alias : operation.sender.address} {'>'}{' '}
                  {operation.target.alias}
                </p>
                <p>
                  {amount_xtz}ꜩ - {amount_eur.toFixed(2)}€ (fees: {operation.bakerFee / 1000000}ꜩ)
                </p>
                <p>Status: {operation.status}</p>
              </span>
            );
          })}
        </span>
      );
    }
  }
}

export default Operation;
