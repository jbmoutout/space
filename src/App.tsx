import React from 'react';
import './App.css';
import Artist from './Artist';
import Edition from './Edition';
import axios from 'axios';
import data from './data.json';

interface Artwork {
  artifact_uri: string;
  balance: string;
  contract: string;
  creators: Array<string>;
  decimals: number;
  description: string;
  formats: Array<unknown>;
  level: number;
  name: string;
  network: string;
  symbol: string;
  tags: Array<string>;
  thumbnail_uri: string;
  token_id: number;
}

type Props = unknown;

type State = {
  lot: Array<{ tz: string; artworks: Artwork[] }>;
  isLoading: boolean;
  multiple: boolean;
};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      lot: [],
      isLoading: true,
      multiple: false,
    };
  }

  componentDidMount(): void {
    if (window.location.pathname === '/follow') {
      this.setState({ multiple: true });
      data.artists.forEach((artist) => {
        this.fetchArtworks(artist.tz);
      });
    } else {
      this.fetchArtworks(process.env.REACT_APP_WALLET ? process.env.REACT_APP_WALLET : '');
    }
  }

  async fetchArtworks(tz: string): Promise<void> {
    const wallet_url = 'https://api.better-call.dev/v1/account/mainnet/' + tz + '/token_balances';
    try {
      const resp = await axios.get(wallet_url);
      const artworks = [
        {
          tz: tz,
          artworks: resp.data.balances.filter(
            (a: Artwork) => a.symbol === 'OBJKT' && parseInt(a.balance) > 0,
          ),
        },
      ];
      this.setState({ lot: this.state.lot.concat(artworks), isLoading: false });
    } catch (error) {
      console.error(error);
    }
  }

  render(): JSX.Element {
    const { lot, isLoading, multiple } = this.state;
    if (isLoading) {
      return <p>Loading...</p>;
    } else {
      return (
        <div
          // className="App"
          style={{
            display: 'flex',
            marginTop: '10vh',
            marginBottom: '10vh',
            justifyContent: 'center',
            minHeight: '100vh',
            flexWrap: 'wrap',
            flexDirection: 'column',
          }}
        >
          {lot &&
            lot.map((l, index) => {
              return (
                <div key={index}>
                  {multiple && (
                    <b style={{ margin: '0 24px' }}>
                      {data.artists.filter((a) => a.tz === l.tz)[0].local_name}
                    </b>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {l.artworks.map((artwork, index) => {
                      const uri_parser = /ipfs:\/\/(.*)/.exec(artwork.artifact_uri);
                      const img_uri = uri_parser ? 'https://ipfs.io/ipfs/' + uri_parser[1] : '';
                      return (
                        <div
                          key={index}
                          style={{
                            maxWidth: multiple ? '200px' : '500px',
                            margin: '2em',
                            textAlign: 'left',
                            fontSize: multiple ? '12px' : '1em',
                          }}
                        >
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
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      );
    }
  }
}

export default App;
