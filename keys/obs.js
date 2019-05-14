const Key = require('../').Key
const sharp = require('sharp');
const path = require('path');

class communityKey extends Key {
  constructor(deck,obs,streamServer,streamKey,icon){
    super()
    let key = this;
    this.deck = deck;
    this.obs = obs;
    this.stream = {}
    this.stream.server = streamServer
    this.stream.key = streamKey
    this.stream.icon = icon
    sharp(deck.resolveStreamIcon(this.stream.icon))
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
    this.obs.setStreamSettings(this.stream.server,this.stream.key);
  }
}

class recordKey extends Key {
  constructor(deck,obs,icon){
    super()
    let key = this;
    this.deck = deck;
    this.obs = obs;
    sharp(deck.resolveIcon('record_off.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.image = buffer
        key.imageOff = buffer
      })
      .catch(err => {
        console.error(err);
      })
    sharp(deck.resolveIcon('record_on.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.imageOn = buffer
      })
      .catch(err => {
        console.error(err);
      })
    this.obs.on("RecordingOn",function(){
      key.image = key.imageOn;
      key.deck.draw()
    })
    this.obs.on("RecordingOff", function(){
      key.image = key.imageOff;
      key.deck.draw()
    })
  }
  onPress(){
    this.obs.startStopRecording();
  }
}

class obsConnectionKey extends Key {
  constructor(deck,obs){
    super()
    let key = this;
    this.deck = deck;
    this.obs = obs;
    sharp(deck.resolveIcon('obs_off.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.image = buffer
        key.imageOff = buffer
      })
      .catch(err => {
        console.error(err);
      })
    sharp(deck.resolveIcon('obs_on.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.imageOn = buffer
      })
      .catch(err => {
        console.error(err);
      })
    this.obs.on("connected",function(){
      key.image = key.imageOn;
      key.deck.draw()
    })
    this.obs.on("disconnected", function(){
      key.image = key.imageOff;
      key.deck.draw()
    })
  }
  onPress(){
    if(!this.obs.connected){
      this.obs.connect();
    }else{
      this.obs.disconnect();
    }
  }
}

class streamKey extends Key {
  constructor(deck,obs){
    super()
    let key = this;
    this.deck = deck;
    this.obs = obs;
    sharp(deck.resolveIcon('stream_off.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.image = buffer
        key.imageOff = buffer
      })
      .catch(err => {
        console.error(err);
      })
    sharp(deck.resolveIcon('stream_on.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.imageOn = buffer
      })
      .catch(err => {
        console.error(err);
      })
    this.obs.on("StreamingOn",function(){
      key.image = key.imageOn;
      key.deck.draw()
    })
    this.obs.on("StreamingOff", function(){
      key.image = key.imageOff;
      key.deck.draw()
    })
  }
  onPress(){
    this.obs.startStopStreaming();
  }
}

class sceneKey extends Key {
  constructor(deck,obs,scene,icon){
    super()
    let key = this;
    this.deck = deck;
    this.sceneName = scene;
    this.obs = obs;
    if(icon){
      let sceneIcon = deck.resolveSceneIcon(icon);
    }else{
      let sceneIcon = deck.resolveSceneIcon(scene);
    }
    sharp(deck.resolveIcon('scene_off.png'))
      .overlayWith(sceneIcon,{gravity:sharp.gravity.south})
      .flatten()
      .resize(72,72)
      .toBuffer()
      .then(buffer => {
        return sharp(buffer)
        .flatten()
        .resize(72,72)
        .raw()
        .toBuffer()
      })
      .then(buffer => {
        console.log(buffer);
        if(key.obs.currentScene!=key.sceneName){
          key.image = buffer
        }
        key.imageOff = buffer
      })
      .catch(err => {
        console.error(err);
      })
    sharp(deck.resolveIcon('scene_on.png'))
      .overlayWith(sceneIcon,{gravity:sharp.gravity.south})
      .flatten()
      .resize(72,72)
      .toBuffer()
      .then(buffer => {
        return sharp(buffer)
        .flatten()
        .resize(72,72)
        .raw()
        .toBuffer()
      })
      .then(buffer => {
        if(key.obs.currentScene==key.sceneName){
          key.image = buffer
        }
        key.imageOn = buffer
      })
      .catch(err => {
        console.error(err);
      })
    this.obs.on("SceneSwitch",function(name){
      if(name == key.sceneName){
        key.image = key.imageOn;
      }else{
        key.image = key.imageOff;
      }
      key.deck.draw()
    })
  }
  onPress(){
    this.obs.setCurrentScene(this.sceneName);
  }
}

class muteAudioKey extends Key {
  constructor(deck,obs,scene,icon){
    super()
    let key = this;
    this.deck = deck;
    this.sceneName = scene;
    this.obs = obs;
    sharp(deck.resolveIcon('mic_off.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.image = buffer
        key.imageOff = buffer
      })
      .catch(err => {
        console.error(err);
      })
    sharp(deck.resolveIcon('mic_on.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.imageOn = buffer
      })
      .catch(err => {
        console.error(err);
      })
    this.obs.on("MicMuteToggled",function(on){
      if(on){
        key.image = key.imageOff;
      }else{
        key.image = key.imageOn;
      }
      key.deck.draw()
    })
  }
  onPress(){
    this.obs.toggleMic();
  }
}

module.exports = {
  recordKey:recordKey,
  streamKey:streamKey,
  sceneKey:sceneKey,
  muteAudioKey:muteAudioKey,
  obsConnectionKey:obsConnectionKey,
  communityKey: communityKey
}
