import React from 'react';
import './App.css';

import axios from 'axios';

type Props = {
  token_id: number;
};

type State = {
  isLoading: boolean;
  artist_name: string;
};

class Artist extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      artist_name: '',
    };
  }

  componentDidMount(): void {
    this.fetchArtist();
  }

  async fetchArtist(): Promise<void> {
    const bigmap_url = 'https://api.tzstats.com/explorer/bigmap/522/';
    const artist_url = 'https://api.tzkt.io/v1/accounts/';
    try {
      const bigmap = await axios.get(bigmap_url + this.props.token_id);
      const artist_wallet = bigmap && bigmap.data.value.issuer;
      const artist_resp = await axios.get(artist_url + artist_wallet);
      const artist_name = artist_resp.data.alias;
      this.setState({ artist_name: artist_name, isLoading: false });
    } catch (error) {
      console.error(error);
    }
  }

  render(): JSX.Element | null {
    const { artist_name, isLoading } = this.state;
    if (isLoading) {
      return null;
    } else {
      return <p style={{ fontWeight: 700 }}>{artist_name}</p>;
    }
  }
}

export default Artist;
