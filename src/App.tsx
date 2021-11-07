import React from 'react';
import './App.css';
import Artist from './Artist';
import Edition from './Edition';
import axios from 'axios';
import data from './data.json';
import '@google/model-viewer';

interface Artwork {
  artifact_uri: string;
  balance: string;
  contract: string;
  creators: Array<string>;
  decimals: number;
  description: string;
  formats: Array<{ mimeType: string }>;
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
    if (window.location.pathname === '/artists') {
      this.setState({ multiple: true });
      data.artists.forEach((artist) => {
        this.fetchArtworks(artist.tz);
      });
    } else {
      this.fetchArtworks(process.env.REACT_APP_WALLET ? process.env.REACT_APP_WALLET : '');
    }
  }

  async fetchArtworks(tz: string): Promise<void> {
    const wallet_url = 'https://api.better-call.dev/v1/account/mainnet/' + tz + '/token_balances?size=50';
    try {
      const resp = await axios.get(wallet_url);
      const artworks = [
        {
          tz: tz,
          artworks: resp.data.balances.filter(
            (a: Artwork) => a.symbol === 'OBJKT' && parseInt(a.balance) > 0 && a.creators[0] !== tz,
          ),
        },
      ];
      this.setState({ lot: this.state.lot.concat(artworks), isLoading: false });
    } catch (error) {
      console.error(error);
    }
  }

  uriParser(uri: string): string {
    const uri_parser = /ipfs:\/\/(.*)/.exec(uri);
    return uri_parser ? 'https://ipfs.io/ipfs/' + uri_parser[1] : '';
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
                      const mimeType = artwork.formats[0].mimeType;
                      console.log(mimeType);
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
                          {mimeType.includes('video') && (
                            <video width="100%" controls>
                              <source src={this.uriParser(artwork.artifact_uri)} type={mimeType} />
                            </video>
                          )}
                          {mimeType.includes('application') && (
                            <iframe src={this.uriParser(artwork.artifact_uri)} width="100%" />
                          )}
                          {mimeType.includes('model') && (
                            <div style={{ width: '100%' }}>
                              <model-viewer
                                src={this.uriParser(artwork.artifact_uri)}
                                camera-controls
                              ></model-viewer>
                            </div>
                          )}
                          {mimeType.includes('image') && (
                            <img
                              src={this.uriParser(
                                mimeType === 'application/x-directory'
                                  ? artwork.thumbnail_uri
                                  : artwork.artifact_uri,
                              )}
                              width="100%"
                            />
                          )}
                          {mimeType === 'application/x-directory' && <p>🕹</p>}
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
                          {artwork.tags && <p>[{artwork.tags.join(', ')}]</p>}
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
