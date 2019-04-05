import React, { Component } from 'react';
import { InView } from 'react-intersection-observer';
import './App.css';
import caretDownImage from './caret-down.svg';
import loadingIcon from './loading.gif';
import words from './words-images.json';
class WordCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: []
    }
  }
  render(){
    const { word, images } = this.props.wordItem;
    return <InView>
      {({ inView, ref }) => {
        this.props.isInView(inView);
        return (
          <article ref={ref} className="word-item">
            <h2>{word.toUpperCase()}</h2>
            <div className="word-images-container">
              {images.map((src, index) => {
                return (
                  <React.Fragment
                    key={"word-"+word+"-img-"+index}
                    >
                    <img
                      className="word-image"
                      src={src}
                      alt={word}
                      onLoad={(ev)=>{
                        this.setState({
                          loaded: [...this.state.loaded, index]
                        })
                      }}
                      />
                    {
                      this.state.loaded.indexOf(index) === -1 ?
                      <img
                        src={
                          loadingIcon
                        }
                        alt="Loading..."
                        className="loading-icon"
                      />
                      : null
                    }
                  </React.Fragment>
                );
              })}
            </div>
          </article>
        );
      }}
    </InView>
  }
}
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
            ref={ref}>
            <img
              className="image-random"
              src={
                imgSrc
              }
              onError={(ev)=>{
                console.log("on error");
                ev.target.src = this.getSrc(Math.floor(Math.random()*99999));
              }}
              onLoad={(ev)=>{
                console.log("on load", ev.target, window.scrollY);
                this.setState({
                  loaded: true
                })
              }}
              alt="random"
              />
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
          </article>);
        }}
      </InView>
    );
  }
}
function easeInOutQuad(t) {
  return t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
};
class App extends Component {
  constructor(){
    super();
    this.seed = Math.floor(Math.random()*10000);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.imageSizeMultiplier = 0.5;//half screen width
    this.lastScrollY = window.scrollY;
    this.restrictScroll = false;
    this.state = {
      size: Math.floor(this.width*this.imageSizeMultiplier)
    }
    this.state = { ...this.state,
      images: this.createWordCards(0, 3),//3 images starting at index 0
      lastId: 2,//of indexes 0,1,2 - 2 is the last index
    }

  }
  componentDidMount(){
    window.addEventListener("scroll", ()=>this.onScroll());
    window.addEventListener("resize", ()=>this.onResize());
  }
  componentWillUnmount(){
    window.removeEventListener("scroll", ()=>this.onScroll());
    window.removeEventListener("resize", ()=>this.onResize());
  }
  onScroll(){
    //had to implement this hack because when images loaded after the scroll
    //animation from clicking the caret, it would flick to 0 scrollY.
    if(this.restrictScroll){
      const scrollYDiff = window.scrollY-this.lastScrollY;
      //console.log("scroll diff:", scrollYDiff);
      if(scrollYDiff !== 0 && Math.abs(scrollYDiff) < window.innerHeight*0.5){
        //console.log("no longer restricting because", Math.abs(scrollYDiff), "is less than", window.innerHeight*0.);
        this.restrictScroll = false;
      }
      if(scrollYDiff < 0 && Math.abs(scrollYDiff) >= window.innerHeight*0.6){
        //scroll back to previous value
        window.scrollBy(0, -scrollYDiff);
        //console.log("scrolled back to original position");
      } else {
        //console.log("didn't scroll back because either ",scrollYDiff," is >= 0 or because ",Math.abs(scrollYDiff)," is < ", );
      }
    }
    this.lastScrollY = window.scrollY;
  }
  onResize(){
    //resize images to fit nicely on the screen
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.setState({
      size: Math.floor(this.width*this.imageSizeMultiplier)
    })
  }
  createWordCard(index){
    return <WordCard
      key={words[index].word+"-"+index}
      wordItem={words[index]}
      isInView={(inView)=>{
        if(inView && index >= this.state.lastId-2){
          let newImages = [...this.state.images, ...this.createWordCards(this.state.lastId+1, 3)];
          //fetch n
          this.setState({
            images: newImages,
            lastId: this.state.lastId+3
          })
        }
      }}
      />
  }
  createWordCards(startId, n){
    let images = [];
    for(let i=0;i < n;i++){
      const id = i+startId;
      let Image = this.createWordCard(id);
      images.push({id, Image});
    }
    return images;
  }
  createImage(id, size){
    return (<Image
      key={"img-"+id}
      numberId={id}
      size={Math.max(size, 540)}
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
            const startY = window.scrollY;
            const targetY = this.height;
            let frame = 0;
            const totalFrames = 48;//Math.ceil((targetY-startY)/this.height*48);
            const loop = () => {
              const t = easeInOutQuad(frame/totalFrames);
              if(t < 1){
                document.documentElement.scrollTop = Math.round(startY+(targetY-startY)*t);
                requestAnimationFrame(loop);
              } else {
                console.log("stopped");
                this.restrictScroll = true;
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
