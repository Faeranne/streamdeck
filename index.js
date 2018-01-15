const path = require("path");
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
    console.log(this.pages[this.currentPage]);
    for(var index = 0; index<15; index++){
      let key = this.pages[this.currentPage][index];
      console.log(index);
      console.log(key);
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

module.exports = {
  Key:Key,
  Deck:Deck
}
