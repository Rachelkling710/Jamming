import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.state = ( { searchResults:[],
                      playlistName:'New Playlist',
                      playlistTracks:[]
                  } );

  }

  addTrack(track) {
    let playlistTracks = this.state.playlistTracks;
    if(playlistTracks.includes(track) === false){
      playlistTracks.push(track);
      this.setState({playlistTracks: playlistTracks});
    }

  }

  removeTrack(track) {
    let playlistTracks = this.state.playlistTracks;
    let newPlaylistTracks= playlistTracks.filter(savedTrack => savedTrack !== track);
    this.setState({playlistTracks: newPlaylistTracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName:name});
  }

  savePlaylist() {
    let trackURIs = [];
    this.state.playlistTracks.map(track => trackURIs.push(track.uri));

    Spotify.savePlaylist(this.state.playlistName,trackURIs);
    this.setState( { playlistName: 'New Playlist' } );
    this.setState( { searchResults: [] } );
    this.setState( { playlistTracks: [] } );
  }

  search(term) {
    Spotify.search(term).then(tracks => this.setState( { searchResults: tracks } ));
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName}
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
