import React from 'react';
import './App.css';
import Artwork from './Artwork';
import axios from 'axios';

import data from './data.json';

interface Transfer {
  token_id: string;
  from_alias: string;
  hash: string;
  timestamp: string;
  parent: string;
}

type Props = unknown;

type State = {
  artworks: Array<Artwork>;
  transfers: Array<Transfer>;
  isLoading: boolean;
};

class Follow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      artworks: [],
      transfers: [],
      isLoading: true,
    };
  }

  componentDidMount(): void {
    this.fetchArtworks();
  }

  async fetchArtworks(): Promise<void> {
    const url =
      'https://api.better-call.dev/v1/account/mainnet/' +
      data.artists[0].tz +
      '/token_balances?last_id=?size=50';
    await this.fetchTransactions(url);
    this.setState({ isLoading: false });
    // try {
    //   const resp = await axios.get(url);
    //   const resp_transfers = resp.data;
    //   if (resp_transfers.transfers.length) {
    //   }
    //   // const artworks = resp.data.balances.filter((a: Artwork) => a.symbol === 'OBJKT');
    //   // this.setState({ artworks: artworks, isLoading: false });
    // } catch (error) {
    //   console.error(error);
    // }
    // const wallet_url =
    //   'https://api.better-call.dev/v1/account/mainnet/' + data.artists[2].tz + '/token_balances';
    // try {
    //   const resp = await axios.get(wallet_url);
    //   const artworks = resp.data.balances.filter((a: Artwork) => a.symbol === 'OBJKT');
    //   this.setState({ artworks: artworks, isLoading: false });
    // } catch (error) {
    //   console.error(error);
    // }
  }

  async fetchTransactions(url: string): Promise<{ data: { transfers: Array<Transfer> } } | undefined> {
    const base_url =
      'https://api.better-call.dev/v1/account/mainnet/' + data.artists[0].tz + '/token_balances?last_id=';
    const resp = await axios.get(url);
    const resp_trans = resp.data;
    this.setState({ transfers: this.state.transfers.concat(resp_trans.transfers) });
    if (resp.data.total > 10) {
      const r = await this.fetchTransactions(base_url + resp.data.last_id);
      if (r) {
        const r_trans = r.data;
        this.setState({ transfers: this.state.transfers.concat(r_trans.transfers) });
      }
    } else {
      return;
    }
    return;
  }

  render(): JSX.Element {
    const { transfers, isLoading } = this.state;

    const allProduced = transfers.filter((t) => t.parent === 'swap');

    const produced = allProduced.filter(
      (value, index, self) => self.findIndex((m) => m.token_id === value.token_id) === index,
    );
    console.log(produced);
    if (isLoading) {
      return <p>Loading...</p>;
    } else {
      return (
        <div
          className="Follow"
          style={{
            display: 'flex',
            marginTop: '10vh',
            marginBottom: '10vh',
            justifyContent: 'center',
            minHeight: '100vh',
            flexWrap: 'wrap',
          }}
        >
          {produced &&
            produced.map((t, index) => {
              return <Artwork token_id={t.token_id} key={index} />;
            })}

          {/* {artworks &&
            artworks.map((artwork, index) => {
              const uri_parser = /ipfs:\/\/(.*)/.exec(artwork.artifact_uri);
              const img_uri = uri_parser ? 'https://ipfs.io/ipfs/' + uri_parser[1] : '';
              return (
                <div key={index} style={{ maxWidth: '200px', margin: '2em', textAlign: 'left' }}>
                  <img src={img_uri} width="100%" />
                  <Artist token_id={artwork.token_id} />
                  <p>{artwork.name}</p>
                  <p>{artwork.description}</p>
                  <a
                    href={`https://hicetnunc.xyz/objkt/${artwork.token_id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <p>
                      {artwork.symbol}#{artwork.token_id}
                    </p>
                  </a>
                  <Edition token_id={artwork.token_id} contract_id={artwork.contract} />
                </div>
              );
            })} */}
        </div>
      );
    }
  }
}

export default Follow;
