import React from 'react';
import './App.css';
import PropTypes from "prop-types";

import axios from 'axios';


class Artist extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      artist_name: null
    }
  }
  

  componentDidMount(){
    this.fetchArtist()
  }

  async fetchArtist(){
      const artist_url = "https://api.tzkt.io/v1/accounts/"
      try {
        const artist = await axios.get(artist_url + this.props.artist_id)
        const artist_name = artist.data.alias
        this.setState({artist_name: artist_name, isLoading: false})     
      } catch (error) {
        console.error(error);
      }
  }   

  

  render() {
    const {artist_name, isLoading} = this.state
    if(isLoading){   
      return null
    }else {
      return(
        <p style={{fontWeight: 700}}>{artist_name}</p>
      );
    }
  }
}

Artist.propTypes = {
  artist_id: PropTypes.string.isRequired,
};


export default Artist;
