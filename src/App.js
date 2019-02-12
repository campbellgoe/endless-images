import React, { Component } from 'react';
import { InView } from 'react-intersection-observer';
import './App.css';

class Image extends Component {
  getSrc(seed){
    const words = [
      "",
      "dog",
      "hill",
      "city",
      "animal",
      "people",
      "car",
      "person",
      "weather",
      "light",
      "food",
      "autumn",
      "tree",
      "plants",
      "jungle",
      "music",
      "asia",
      "temple",
      "church",
      "art",
      "science",
      "architecture",
      "building",
      "plane",
      "sky",
      "cloud",
      "sunset",
      "moon",
      "earth",
      "stars",
      "galaxy",
      "culture",
      "religion",
      "bird",
      "castle",
      "flower"
      ];
      const word = words[Math.floor(Math.random()*words.length)];
    return this.props.numberId >= 1060 ? `https://loremflickr.com/${this.props.size}/${this.props.size}/${word}?random=${this.props.numberId+seed+(new Date().getTime())}` :
  `https://picsum.photos/${this.props.size}/${this.props.size}/?image=${(seed+this.props.numberId)%1080}`;
  }
  render(){
    const imgSrc = this.getSrc(this.props.seed);
    return (
      <InView>
        {({ inView, ref }) => {
          console.log("in view:", inView);
          this.props.isInView(inView);
          return (<article
            className="image-article"
            style={this.props.style}
            ref={ref}>
            <img
              src={
                imgSrc

            }
            onError={(ev)=>{
              ev.target.src = this.getSrc(Math.floor(Math.random()*99999));
            }}
              alt="random"
              style={
                {
                  width: this.props.size+"px",
                  height: this.props.size+"px"
                }
              }
              />
          </article>);
        }}
      </InView>
    );
  }
}
class App extends Component {
  constructor(){
    super();
    this.seed = Math.floor(Math.random()*10000);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.size = Math.floor(this.width*0.5);
    this.state = {
      images: this.createImages(this.size, 0, 3),
      lastId: 2
    }
  }
  createImages(baseSize, startId, n){
    let images = [];
    for(let i=0;i < n;i++){
      const id = i+startId;
      let Img = (<Image
        key={"img-"+id}
        numberId={id}
        size={baseSize}
        seed={this.seed}
        style={{
          width: baseSize+"px",
          height: baseSize+"px"
          }}
        isInView={(inView)=>{
          if(inView && id >= this.state.lastId-2){
            let newImages = [...this.state.images, ...this.createImages(this.size, this.state.lastId+1, 3)];
            console.log("id:", id);
            //fetch n
            this.setState({
              images: newImages,
              lastId: this.state.lastId+3
            })
          }
        }}
          />);
      images.push(Img);
    }
    return images;
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Welcome to Endless
        </header>
        <p id="thanks">Images thanks to <a href="https://picsum.photos" target="_blank" rel="noopener noreferrer">Lorem Picsum</a> and <a href="https://loremflickr.com/" target="_blank" rel="noopener noreferrer">LoremFlickr</a>.</p>
        {this.state.images}
      </div>
    );
  }
}

export default App;
