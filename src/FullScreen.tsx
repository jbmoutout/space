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
      'https://api.better-call.dev/v1/account/mainnet/' + process.env.REACT_APP_WALLET + '/token_balances';
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
          style={
            window.location.pathname.substring(1) === '35595' ? { maxWidth: '50vw' } : { height: '100vh' }
          }
        />
      </div>
    );
  }
}

export default FullScreen;
