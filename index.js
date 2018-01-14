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
  setPage(index){
    return this.currentPage;
  }
  addPage(name,keys){
    this.pages.push(keys);
    return this.pages.length-1;
  }
  draw(){
    let deck = this;
    this.pages[this.currentPage].forEach(function(key,index){
      console.log(index);
      console.log(key);
      if(key instanceof Key){
        deck.device.fillImage(index,key.image);
      }
    })
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
