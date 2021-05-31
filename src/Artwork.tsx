import React from 'react';
import './App.css';
import Artist from './Artist';
// import Edition from './Edition';
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

type Props = {
  token_id: string;
};

type State = {
  artwork: Artwork | undefined;
  isLoading: boolean;
};

class Artwork extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      artwork: undefined,
      isLoading: true,
    };
  }

  componentDidMount(): void {
    this.fetchArtworks();
  }

  async fetchArtworks(): Promise<void> {
    const artwork_url = 'https://api.better-call.dev/v1/tokens/mainnet/metadata?token_id=';
    try {
      const resp = await axios.get(artwork_url + this.props.token_id);
      const artwork = resp.data[0];
      this.setState({ artwork: artwork, isLoading: false });
    } catch (error) {
      console.error(error);
    }
  }

  render(): JSX.Element | null {
    const { artwork, isLoading } = this.state;

    if (artwork) {
      const uri_parser = /ipfs:\/\/(.*)/.exec(artwork.artifact_uri);
      const img_uri = uri_parser ? 'https://ipfs.io/ipfs/' + uri_parser[1] : '';
      return (
        <div
          className="Artwork"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: '200px', margin: '2em', textAlign: 'left' }}>
            <img src={img_uri} width="100%" />
            <Artist token_id={artwork.token_id} />
            <p>{artwork.name}</p>
            <p>{artwork.description}</p>
            <a href={`https://hicetnunc.xyz/objkt/${artwork.token_id}`} target="_blank" rel="noreferrer">
              <p>
                {artwork.symbol}#{artwork.token_id}
              </p>
            </a>
            {/* <Edition token_id={artwork.token_id} contract_id={artwork.contract} /> */}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Artwork;
