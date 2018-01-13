const path = require("path");
const StreamDeck = require("elgato-stream-deck");
const theDeck = new StreamDeck();

let Deck = function(path){
  let deck = this;
  let device = new StreamDeck(path)
  let pages = {};
  let activePage = null
  let savedKeys = {};
  deck.getPage = function(name){
    if(pages[name]){
      return pages[name];
    }else{
      return false;
    }
  }
  deck.addPage = function(name,page){
    pages[name] = page;
  }
  deck.activatePage = function(name){
    if(pages[name]){
      activePage = name;
      pages[activePage].draw();
      return pages[activePage];
    }else{
      return false;
    }
  }
  device.on('down',function(index){
    if(activePage){
      pages[activePage].onPress(index);
    }
  })
  device.on('up',function(index){
    if(activePage){
      pages[activePage].onRelease(index);
    }
  })
  deck.loadKey = function(name,key){
    savedKeys[name]=key;
  }
  deck.loadPage = function(json){
    let data = null;
    if( typeof data == "string"){
      data = JSON.parse(json)
    }else{
      data = json;
    }
    let page = new Page();
    for(index in data){
      if(savedKeys[data[index]]){
        page.addKey(index,savedKeys[data[index]]);
      }
    }
  }
  return this;
}

let Page = function(){
  let page = this;
  let keys = [];
  page.onPress = function(index){
    if(keys[index]){
      keys[index].onPress();
    }
  }
  page.onRelease = function(index){
    if(keys[index]){
      keys[index].onRelease();
    }
  }
  page.addKey = function(index,key){
    keys[index]=key;
  }
  page.getKey = function(index){
    return keys[index];
  }
  return this;
}

let Key = function(keyIndex){
  let key = this;
  let index = keyIndex;
  let state = "disabled";
  let states = {
    disabled:{
      image:null,
      onPress:null,
      onRelease:null
    }
  };

  key.setState = function(newState){
    state = newState;
    key.draw();
  }
  key.draw = function(){
    if(state && states[state].image){
      let image = states[state].image;
      theDeck.fillImageFromFile(index,image);
    }
  }
  key.onPress = function(){
    if(state && states[state].onPress){
      states[state].onPress();
    }
  }
  key.onRelease = function(){
    if(state && states[state].onRelease){
      states[state].onRelease();
    }
  }
  return this;
}

module.exports = {
  Key:Key,
  Page:Page,
  Deck:Deck
}
