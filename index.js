const path = require("path");
const sharp = require('sharp');
const StreamDeck = require("elgato-stream-deck");
const EventEmitter = require('events').EventEmitter;

class Deck{
  constructor(){
    let deck = this;
    this.device = new StreamDeck();
    this.currentPage = 0;
    this.pages = [];
    this.device.on('down',function(index){
      if(deck.pages[deck.currentPage][index] instanceof Key){
        deck.pages[deck.currentPage][index].onPress();
        deck.draw()
      }
    })
    this.device.on('up',function(index){
      if(deck.pages[deck.currentPage][index] instanceof Key){
        deck.pages[deck.currentPage][index].onRelease();
        deck.draw()
      }
    })
  }
  draw(){
    let deck = this;
    for(var index = 0; index<15; index++){
      let key = this.pages[this.currentPage][index];
      if(key && key instanceof Key){
        deck.device.fillImage(index,key.image);
      }else{
        deck.device.fillColor(index,0,0,0);
      }
    }
  }
}

class Key{
  constructor(image){
    this.image = image || Buffer.alloc(15552);
  }
  onRelease(){
  }
  onPress(){
  }
}

class pageUpKey extends Key {
  constructor(deck){
    super()
    let key = this;
    this.deck = deck
    sharp(path.resolve(__dirname,'../resources/keyIcons/page_up.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.image = buffer
      })
      .catch(err => {
        console.error(err);
      })
  }
  onPress(){
    this.deck.currentPage--
    this.deck.draw()
  }
}

class pageDownKey extends Key {
  constructor(deck){
    super()
    let key = this;
    this.deck = deck
    sharp(path.resolve(__dirname,'../resources/keyIcons/page_down.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.image = buffer
      })
      .catch(err => {
        console.error(err);
      })
  }
  onPress(){
    this.deck.currentPage++
    this.deck.draw()
  }
}

module.exports = {
  pageDownKey:pageDownKey,
  pageUpKey:pageUpKey,
  Key:Key,
  ObsKeys:require('./keys/obs.js'),
  Deck:Deck
}
