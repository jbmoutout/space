import React from 'react';
import axios from 'axios';

interface Artwork {
  token_id: string;
}

type Props = unknown;

type State = {
  uri: string | undefined;
};

class FullScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      uri: undefined,
    };
  }

  componentDidMount(): void {
    this.fetchUri();
  }

  async fetchUri(): Promise<void> {
    const url_token = window.location.pathname.substring(1);
    const wallet_url =
      'https://api.better-call.dev/v1/account/mainnet/' +
      process.env.REACT_APP_WALLET +
      '/token_balances?size=50';
    try {
      const resp = await axios.get(wallet_url);
      const artifact = resp.data.balances.filter((a: Artwork) => a.token_id.toString() === url_token)[0];
      const uri_parser = /ipfs:\/\/(.*)/.exec(artifact.artifact_uri);
      const uri = uri_parser ? 'https://ipfs.io/ipfs/' + uri_parser[1] : '';
      this.setState({ uri: uri ? uri : undefined });
      // document.getElementById('img')?.requestFullscreen();
    } catch (error) {
      console.error(error);
    }
  }

  render(): JSX.Element {
    const { uri } = this.state;
    let specialStyle = {};
    const id = window.location.pathname.substring(1);
    if (id === '35595') {
      specialStyle = { maxWidth: '50vw' };
    }
    if (id === '97640' || id === '466963') {
      specialStyle = { height: '100vh' };
    }
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'rgb(17, 17, 17)',
        }}
      >
        <img
          src={uri}
          width="100%"
          id="img"
          //Not so clean
          style={specialStyle}
        />
      </div>
    );
  }
}

export default FullScreen;
