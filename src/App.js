import React, { Component } from 'react';
import './App.css';

class Image extends Component {
  render(){
    return (
      <article className="image-article" style={this.props.style}>
        <img src={`https://picsum.photos/${this.props.size}`} alt="random"/>
      </article>
    );
  }
}
class App extends Component {
  constructor(){
    super();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.size = Math.floor(this.width*0.5);
  }
  componentDidMount(){

    console.log("this.width:", this.width);
  }
  createImages(baseSize, startId, n){
    let images = [];
    for(let i=0;i < n;i++){
      images.push(<Image
        key={"img-"+i}
        size={baseSize+i+startId}
        style={{
          width: baseSize+"px",
          height: baseSize+"px"
        }}/>);
    }
    return images;
  }
  render() {

    const images = this.createImages(this.size, 0, 3);
    return (
      <div className="App">
        <header className="App-header">
          Welcome to Endless
        </header>
        {images}
      </div>
    );
  }
}

export default App;
