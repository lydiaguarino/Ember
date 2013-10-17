(function() {
"use strict";

window.App = Ember.Application.create();

App.Router.map(function() {
  this.resource('album', { path: '/album/:album_id' });
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.ALBUM_FIXTURES;
  }
});

App.AlbumRoute = Ember.Route.extend({
  model: function(params) {
    return App.ALBUM_FIXTURES.findProperty('id', params.album_id);
  },
  events: {
    play: function(song) {
      this.controllerFor('nowPlaying').set('model',song);
    }
  }
});

App.AudioPlayerComponent = Ember.Component.extend({
  classNames: ['audio-control'],
  duration:0,
  currentTime:0,
  isLoaded:false,
  showCurrent:true,
  remainingTime: function(){
    var duration = this.get('duration');
    var currentTime = this.get('currentTime');
    return duration - currentTime;
  }.property('duration','currentTime'),
  didInsertElement: function(){
    var $audio = this.$('audio'),
    component = this;
  $audio.on('loadedmetadata',function(){
    component.set('duration',Math.floor(this.duration));
    component.set('isLoaded',true);
  });

  $audio.on('timeupdate',function(){
    component.set('currentTime',Math.floor(this.currentTime));
  });

  $audio.on('play',function(){
    component.set('isPlaying',true);
  });

  $audio.on('pause',function(){
    component.set('isPlaying',false);
  });
  },
  play : function(){
    this.$('audio')[0].play();
  },
  pause : function(){
    this.$('audio')[0].pause();
  }  
});

App.TimeDurationComponent = Ember.Component.extend({
 toggleTime: function(){
    if(this.showCurrent==true){
      this.set('showCurrent',false);
    }else{
      this.set('showCurrent',true);
    };  
  },
});

App.NowPlayingController = Ember.ObjectController.extend({
});

App.Album = Ember.Object.extend({
  totalDuration: function(){
    var songs = this.get('songs');
    var total = 0;
    songs.forEach(function(song){
      total+=song.get('duration');
    });
    return total;
  }.property('songs.@each.duration'),
});

App.Song = Ember.Object.extend();

App.SongController = Ember.ObjectController.extend({
  needs: ['nowPlaying'],
  isPlaying : function(){
    var playing = this.get('model');
    var songPlaying = this.get('controllers.nowPlaying.model');
    return playing === songPlaying;
  }.property('model','controllers.nowPlaying.model')
});

Ember.Handlebars.helper('format-duration', function(seconds) {
  var minutes = Math.floor(seconds/60);
  var remainingSeconds = seconds % 60;

  var result = '';
  if (remainingSeconds < 10) {
    result = "0";
  }

  result += String(remainingSeconds);

  result = minutes + ":" + result;

  return result;
});

})();

