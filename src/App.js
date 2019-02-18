import React, { Component } from 'react';
import { InView } from 'react-intersection-observer';
import './App.css';
import caretDownImage from './caret-down.svg';
import loadingIcon from './loading.gif';
class Image extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false
    }
  }
  getSrc(seed){
    //search terms for the second random image generator (after the first 1080 images).
    //many possible words couldn't be used because the loremflickr image generator was unable to generate a random image
    //and will tend to generate the metal cat statue on a curb image instead.
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
      //seed is just the starting index, so you get a different set of random images each time.
      //numberId is incremented so you get a unique id each time, although this doesn't apply to loremflicker since that just requires a unique query to get a random image
    return this.props.numberId >= 1080 ?
    `https://loremflickr.com/${this.props.size}/${this.props.size}/${word}?random=${seed+(new Date().getTime())}`
    : `https://picsum.photos/${this.props.size}/${this.props.size}/?image=${(seed+this.props.numberId)%1080}`;
  }
  render(){
    const imgSrc = this.getSrc(this.props.seed);
    return (
      <InView>
        {({ inView, ref }) => {
          this.props.isInView(inView);
          return (<article
            className="image-article"
            style={this.props.style}
            ref={ref}>
            {
              this.state.loaded ?
              null : 
              <img src={
                  loadingIcon
                }
                alt="Loading..."
                className="loading-icon"
              />
            }
            <img
              src={
                imgSrc
              }
              onError={(ev)=>{
                ev.target.src = this.getSrc(Math.floor(Math.random()*99999));
              }}
              onLoad={()=>{
                this.setState({
                  loaded: true
                })
              }}
              alt="random"
              />
          </article>);
        }}
      </InView>
    );
  }
}
function easeInOutQuad(t) {
  return t<.5 ? 2*t*t : -1+(4-2*t)*t;
};

class App extends Component {
  constructor(){
    super();
    this.seed = Math.floor(Math.random()*10000);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.imageSizeMultiplier = 0.5;//half screen width
    this.state = {
      size: Math.floor(this.width*this.imageSizeMultiplier)
    }
    this.state = { ...this.state,
      images: this.createImages(0, 3),//3 images starting at index 0
      lastId: 2,//of indexes 0,1,2 - 2 is the last index
    }

  }
  componentDidMount(){

    window.addEventListener("resize", ()=>this.onResize());
  }
  componentWillUnmount(){
    window.removeEventListener("resize", ()=>this.onResize());
  }
  onResize(){
    //resize images to fit nicely on the screen
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.setState({
      size: Math.floor(this.width*this.imageSizeMultiplier)
    })
  }
  createImage(id, size){
    return (<Image
      key={"img-"+id}
      numberId={id}
      size={size}
      seed={this.seed}
      isInView={(inView)=>{
        if(inView && id >= this.state.lastId-2){
          let newImages = [...this.state.images, ...this.createImages(this.state.lastId+1, 3)];
          //fetch n
          this.setState({
            images: newImages,
            lastId: this.state.lastId+3
          })
        }
      }}
        />);
  }
  createImages(startId, n){
    let images = [];
    for(let i=0;i < n;i++){
      const id = i+startId;
      let Image = this.createImage(id, this.state.size);
      images.push({id, Image});
    }
    return images;
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Welcome to Endless
        </header>
        <img
          src={caretDownImage}
          alt="go down"
          className="caret-down"
          onClick={()=>{
            const targetY = this.height;
            let frame = 0;
            const totalFrames = 48;
            function loop(){
              const t = easeInOutQuad(frame/totalFrames);
              if(t < 1){
                window.scrollTo(0, targetY*t);
                requestAnimationFrame(loop);
              } else {
                console.log("stopped");
              }
              frame ++;
            }
            loop();
          }}
        />
        <p id="thanks">Images thanks to <a href="https://picsum.photos" target="_blank" rel="noopener noreferrer">Lorem Picsum</a> and <a href="https://loremflickr.com/" target="_blank" rel="noopener noreferrer">LoremFlickr</a>.</p>
        {this.state.images.map(({Image})=>Image)}
      </div>
    );
  }
}

export default App;
