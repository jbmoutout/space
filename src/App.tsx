import React from 'react';
import './App.css';
import Artist from './Artist';
import Edition from './Edition';
import axios from 'axios';

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
  artworks: Array<Artwork>;
  isLoading: boolean;
};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      artworks: [],
      isLoading: true,
    };
  }

  componentDidMount(): void {
    this.fetchArtworks();
  }

  async fetchArtworks(): Promise<void> {
    const wallet_url =
      'https://api.better-call.dev/v1/account/mainnet/' +
      process.env.REACT_APP_WALLET +
      '/token_balances';
    try {
      const resp = await axios.get(wallet_url);
      const artworks = resp.data.balances.filter((a: Artwork) => a.symbol === 'OBJKT');
      this.setState({ artworks: artworks, isLoading: false });
    } catch (error) {
      console.error(error);
    }
  }

  render(): JSX.Element {
    const { artworks, isLoading } = this.state;
    if (isLoading) {
      return <p>Loading...</p>;
    } else {
      return (
        <div
          className="App"
          style={{
            display: 'flex',
            marginTop: '10vh',
            marginBottom: '10vh',
            justifyContent: 'center',
            minHeight: '100vh',
            flexWrap: 'wrap',
          }}
        >
          {artworks &&
            artworks.map((artwork, index) => {
              const uri_parser = /ipfs:\/\/(.*)/.exec(artwork.artifact_uri);
              const img_uri = uri_parser ? 'https://ipfs.io/ipfs/' + uri_parser[1] : '';
              return (
                <div
                  key={index}
                  style={{ maxWidth: '500px', margin: '2em', textAlign: 'left' }}
                >
                  <img src={img_uri} width="100%" />
                  <Artist artist_id={artwork.creators[0]} />
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
      );
    }
  }
}

export default App;
