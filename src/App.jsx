import React from 'react';
import './App.css';
import Artist from "./Artist"
import Edition from "./Edition"
import axios from 'axios';


class App extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      artworks: [],
      isLoading: true
    }
  }
  

  componentDidMount(){
    this.fetchArtworks()
  }

  async fetchArtworks(){
      const wallet_url = "https://api.better-call.dev/v1/account/mainnet/" + process.env.REACT_APP_WALLET + "/token_balances"
      try {
        const resp = await axios.get(wallet_url);
        const artworks = resp.data.balances.filter(a => a.symbol === "OBJKT")
        this.setState({artworks: artworks, isLoading: false})     
      } catch (error) {
        console.error(error);
      }
  }   

  

  render() {
    const {artworks, isLoading} = this.state
    if(isLoading){
      return(
        <p>Loading...</p>  
      )
    }else {
      return (
        <div className="App" style={{display: "flex",marginTop: '10vh', marginBottom: '10vh', justifyContent:"center", minHeight: "100vh"}}>
          {artworks && artworks.map((artwork, index) => {
            const img_uri = /ipfs:\/\/(.*)/.exec(artwork.artifact_uri)[1]
            return(
              <div key={index} style={{width: "40vw", textAlign: "left"}}>
                <img src={"https://ipfs.io/ipfs/" + img_uri} width="100%" />
                <Artist artist_id={artwork.creators[0]}/>
                <p>{artwork.name}</p>
                <p>{artwork.description}</p>
                <Edition token_id={artwork.token_id}/>
              </div>
            ) 
              
          })}
        </div>
      );
    }
  }
}

export default App;
