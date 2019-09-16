!function(){"use strict";var e=function(){this.init()};e.prototype={init:function(){var e=this||n;return e._counter=1e3,e._codecs={},e._howls=[],e._muted=!1,e._volume=1,e._canPlayEvent="canplaythrough",e._navigator="undefined"!=typeof window&&window.navigator?window.navigator:null,e.masterGain=null,e.noAudio=!1,e.usingWebAudio=!0,e.autoSuspend=!0,e.ctx=null,e.mobileAutoEnable=!0,e._setup(),e},volume:function(e){var o=this||n;if(e=parseFloat(e),o.ctx||_(),void 0!==e&&e>=0&&e<=1){if(o._volume=e,o._muted)return o;o.usingWebAudio&&o.masterGain.gain.setValueAtTime(e,n.ctx.currentTime);for(var t=0;t<o._howls.length;t++)if(!o._howls[t]._webAudio)for(var r=o._howls[t]._getSoundIds(),a=0;a<r.length;a++){var u=o._howls[t]._soundById(r[a]);u&&u._node&&(u._node.volume=u._volume*e)}return o}return o._volume},mute:function(e){var o=this||n;o.ctx||_(),o._muted=e,o.usingWebAudio&&o.masterGain.gain.setValueAtTime(e?0:o._volume,n.ctx.currentTime);for(var t=0;t<o._howls.length;t++)if(!o._howls[t]._webAudio)for(var r=o._howls[t]._getSoundIds(),a=0;a<r.length;a++){var u=o._howls[t]._soundById(r[a]);u&&u._node&&(u._node.muted=!!e||u._muted)}return o},unload:function(){for(var e=this||n,o=e._howls.length-1;o>=0;o--)e._howls[o].unload();return e.usingWebAudio&&e.ctx&&void 0!==e.ctx.close&&(e.ctx.close(),e.ctx=null,_()),e},codecs:function(e){return(this||n)._codecs[e.replace(/^x-/,"")]},_setup:function(){var e=this||n;if(e.state=e.ctx?e.ctx.state||"running":"running",e._autoSuspend(),!e.usingWebAudio)if("undefined"!=typeof Audio)try{var o=new Audio;void 0===o.oncanplaythrough&&(e._canPlayEvent="canplay")}catch(n){e.noAudio=!0}else e.noAudio=!0;try{var o=new Audio;o.muted&&(e.noAudio=!0)}catch(e){}return e.noAudio||e._setupCodecs(),e},_setupCodecs:function(){var e=this||n,o=null;try{o="undefined"!=typeof Audio?new Audio:null}catch(n){return e}if(!o||"function"!=typeof o.canPlayType)return e;var t=o.canPlayType("audio/mpeg;").replace(/^no$/,""),r=e._navigator&&e._navigator.userAgent.match(/OPR\/([0-6].)/g),a=r&&parseInt(r[0].split("/")[1],10)<33;return e._codecs={mp3:!(a||!t&&!o.canPlayType("audio/mp3;").replace(/^no$/,"")),mpeg:!!t,opus:!!o.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),oga:!!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!o.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),aac:!!o.canPlayType("audio/aac;").replace(/^no$/,""),caf:!!o.canPlayType("audio/x-caf;").replace(/^no$/,""),m4a:!!(o.canPlayType("audio/x-m4a;")||o.canPlayType("audio/m4a;")||o.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(o.canPlayType("audio/x-mp4;")||o.canPlayType("audio/mp4;")||o.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,""),webm:!!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,""),dolby:!!o.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/,""),flac:!!(o.canPlayType("audio/x-flac;")||o.canPlayType("audio/flac;")).replace(/^no$/,"")},e},_enableMobileAudio:function(){var e=this||n,o=/iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(e._navigator&&e._navigator.userAgent),t=!!("ontouchend"in window||e._navigator&&e._navigator.maxTouchPoints>0||e._navigator&&e._navigator.msMaxTouchPoints>0);if(!e._mobileEnabled&&e.ctx&&(o||t)){e._mobileEnabled=!1,e._mobileUnloaded||44100===e.ctx.sampleRate||(e._mobileUnloaded=!0,e.unload()),e._scratchBuffer=e.ctx.createBuffer(1,1,22050);var r=function(){n._autoResume();var o=e.ctx.createBufferSource();o.buffer=e._scratchBuffer,o.connect(e.ctx.destination),void 0===o.start?o.noteOn(0):o.start(0),"function"==typeof e.ctx.resume&&e.ctx.resume(),o.onended=function(){o.disconnect(0),e._mobileEnabled=!0,e.mobileAutoEnable=!1,document.removeEventListener("touchstart",r,!0),document.removeEventListener("touchend",r,!0)}};return document.addEventListener("touchstart",r,!0),document.addEventListener("touchend",r,!0),e}},_autoSuspend:function(){var e=this;if(e.autoSuspend&&e.ctx&&void 0!==e.ctx.suspend&&n.usingWebAudio){for(var o=0;o<e._howls.length;o++)if(e._howls[o]._webAudio)for(var t=0;t<e._howls[o]._sounds.length;t++)if(!e._howls[o]._sounds[t]._paused)return e;return e._suspendTimer&&clearTimeout(e._suspendTimer),e._suspendTimer=setTimeout(function(){e.autoSuspend&&(e._suspendTimer=null,e.state="suspending",e.ctx.suspend().then(function(){e.state="suspended",e._resumeAfterSuspend&&(delete e._resumeAfterSuspend,e._autoResume())}))},3e4),e}},_autoResume:function(){var e=this;if(e.ctx&&void 0!==e.ctx.resume&&n.usingWebAudio)return"running"===e.state&&e._suspendTimer?(clearTimeout(e._suspendTimer),e._suspendTimer=null):"suspended"===e.state?(e.ctx.resume().then(function(){e.state="running";for(var n=0;n<e._howls.length;n++)e._howls[n]._emit("resume")}),e._suspendTimer&&(clearTimeout(e._suspendTimer),e._suspendTimer=null)):"suspending"===e.state&&(e._resumeAfterSuspend=!0),e}};var n=new e,o=function(e){var n=this;if(!e.src||0===e.src.length)return void console.error("An array of source files must be passed with any new Howl.");n.init(e)};o.prototype={init:function(e){var o=this;return n.ctx||_(),o._autoplay=e.autoplay||!1,o._format="string"!=typeof e.format?e.format:[e.format],o._html5=e.html5||!1,o._muted=e.mute||!1,o._loop=e.loop||!1,o._pool=e.pool||5,o._preload="boolean"!=typeof e.preload||e.preload,o._rate=e.rate||1,o._sprite=e.sprite||{},o._src="string"!=typeof e.src?e.src:[e.src],o._volume=void 0!==e.volume?e.volume:1,o._xhrWithCredentials=e.xhrWithCredentials||!1,o._duration=0,o._state="unloaded",o._sounds=[],o._endTimers={},o._queue=[],o._playLock=!1,o._onend=e.onend?[{fn:e.onend}]:[],o._onfade=e.onfade?[{fn:e.onfade}]:[],o._onload=e.onload?[{fn:e.onload}]:[],o._onloaderror=e.onloaderror?[{fn:e.onloaderror}]:[],o._onplayerror=e.onplayerror?[{fn:e.onplayerror}]:[],o._onpause=e.onpause?[{fn:e.onpause}]:[],o._onplay=e.onplay?[{fn:e.onplay}]:[],o._onstop=e.onstop?[{fn:e.onstop}]:[],o._onmute=e.onmute?[{fn:e.onmute}]:[],o._onvolume=e.onvolume?[{fn:e.onvolume}]:[],o._onrate=e.onrate?[{fn:e.onrate}]:[],o._onseek=e.onseek?[{fn:e.onseek}]:[],o._onresume=[],o._webAudio=n.usingWebAudio&&!o._html5,void 0!==n.ctx&&n.ctx&&n.mobileAutoEnable&&n._enableMobileAudio(),n._howls.push(o),o._autoplay&&o._queue.push({event:"play",action:function(){o.play()}}),o._preload&&o.load(),o},load:function(){var e=this,o=null;if(n.noAudio)return void e._emit("loaderror",null,"No audio support.");"string"==typeof e._src&&(e._src=[e._src]);for(var r=0;r<e._src.length;r++){var u,i;if(e._format&&e._format[r])u=e._format[r];else{if("string"!=typeof(i=e._src[r])){e._emit("loaderror",null,"Non-string found in selected audio sources - ignoring.");continue}u=/^data:audio\/([^;,]+);/i.exec(i),u||(u=/\.([^.]+)$/.exec(i.split("?",1)[0])),u&&(u=u[1].toLowerCase())}if(u||console.warn('No file extension was found. Consider using the "format" property or specify an extension.'),u&&n.codecs(u)){o=e._src[r];break}}return o?(e._src=o,e._state="loading","https:"===window.location.protocol&&"http:"===o.slice(0,5)&&(e._html5=!0,e._webAudio=!1),new t(e),e._webAudio&&a(e),e):void e._emit("loaderror",null,"No codec support for selected audio sources.")},play:function(e,o){var t=this,r=null;if("number"==typeof e)r=e,e=null;else{if("string"==typeof e&&"loaded"===t._state&&!t._sprite[e])return null;if(void 0===e){e="__default";for(var a=0,u=0;u<t._sounds.length;u++)t._sounds[u]._paused&&!t._sounds[u]._ended&&(a++,r=t._sounds[u]._id);1===a?e=null:r=null}}var i=r?t._soundById(r):t._inactiveSound();if(!i)return null;if(r&&!e&&(e=i._sprite||"__default"),"loaded"!==t._state){i._sprite=e,i._ended=!1;var d=i._id;return t._queue.push({event:"play",action:function(){t.play(d)}}),d}if(r&&!i._paused)return o||setTimeout(function(){t._emit("play",i._id)},0),i._id;t._webAudio&&n._autoResume();var _=Math.max(0,i._seek>0?i._seek:t._sprite[e][0]/1e3),s=Math.max(0,(t._sprite[e][0]+t._sprite[e][1])/1e3-_),l=1e3*s/Math.abs(i._rate);i._paused=!1,i._ended=!1,i._sprite=e,i._seek=_,i._start=t._sprite[e][0]/1e3,i._stop=(t._sprite[e][0]+t._sprite[e][1])/1e3,i._loop=!(!i._loop&&!t._sprite[e][2]);var c=i._node;if(t._webAudio){var f=function(){t._refreshBuffer(i);var e=i._muted||t._muted?0:i._volume;c.gain.setValueAtTime(e,n.ctx.currentTime),i._playStart=n.ctx.currentTime,void 0===c.bufferSource.start?i._loop?c.bufferSource.noteGrainOn(0,_,86400):c.bufferSource.noteGrainOn(0,_,s):i._loop?c.bufferSource.start(0,_,86400):c.bufferSource.start(0,_,s),l!==1/0&&(t._endTimers[i._id]=setTimeout(t._ended.bind(t,i),l)),o||setTimeout(function(){t._emit("play",i._id)},0)};"running"===n.state?f():(t.once("resume",f),t._clearTimer(i._id))}else{var p=function(){c.currentTime=_,c.muted=i._muted||t._muted||n._muted||c.muted,c.volume=i._volume*n.volume(),c.playbackRate=i._rate;try{var e=c.play();if("undefined"!=typeof Promise&&e instanceof Promise&&(t._playLock=!0,e.then(function(){t._playLock=!1,t._loadQueue()})),c.paused)return void t._emit("playerror",i._id,"Playback was unable to start. This is most commonly an issue on mobile devices where playback was not within a user interaction.");l!==1/0&&(t._endTimers[i._id]=setTimeout(t._ended.bind(t,i),l)),o||t._emit("play",i._id)}catch(e){t._emit("playerror",i._id,e)}},m=window&&window.ejecta||!c.readyState&&n._navigator.isCocoonJS;if(4===c.readyState||m)p();else{var v=function(){p(),c.removeEventListener(n._canPlayEvent,v,!1)};c.addEventListener(n._canPlayEvent,v,!1),t._clearTimer(i._id)}}return i._id},pause:function(e){var n=this;if("loaded"!==n._state||n._playLock)return n._queue.push({event:"pause",action:function(){n.pause(e)}}),n;for(var o=n._getSoundIds(e),t=0;t<o.length;t++){n._clearTimer(o[t]);var r=n._soundById(o[t]);if(r&&!r._paused&&(r._seek=n.seek(o[t]),r._rateSeek=0,r._paused=!0,n._stopFade(o[t]),r._node))if(n._webAudio){if(!r._node.bufferSource)continue;void 0===r._node.bufferSource.stop?r._node.bufferSource.noteOff(0):r._node.bufferSource.stop(0),n._cleanBuffer(r._node)}else isNaN(r._node.duration)&&r._node.duration!==1/0||r._node.pause();arguments[1]||n._emit("pause",r?r._id:null)}return n},stop:function(e,n){var o=this;if("loaded"!==o._state)return o._queue.push({event:"stop",action:function(){o.stop(e)}}),o;for(var t=o._getSoundIds(e),r=0;r<t.length;r++){o._clearTimer(t[r]);var a=o._soundById(t[r]);a&&(a._seek=a._start||0,a._rateSeek=0,a._paused=!0,a._ended=!0,o._stopFade(t[r]),a._node&&(o._webAudio?a._node.bufferSource&&(void 0===a._node.bufferSource.stop?a._node.bufferSource.noteOff(0):a._node.bufferSource.stop(0),o._cleanBuffer(a._node)):isNaN(a._node.duration)&&a._node.duration!==1/0||(a._node.currentTime=a._start||0,a._node.pause())),n||o._emit("stop",a._id))}return o},mute:function(e,o){var t=this;if("loaded"!==t._state)return t._queue.push({event:"mute",action:function(){t.mute(e,o)}}),t;if(void 0===o){if("boolean"!=typeof e)return t._muted;t._muted=e}for(var r=t._getSoundIds(o),a=0;a<r.length;a++){var u=t._soundById(r[a]);u&&(u._muted=e,u._interval&&t._stopFade(u._id),t._webAudio&&u._node?u._node.gain.setValueAtTime(e?0:u._volume,n.ctx.currentTime):u._node&&(u._node.muted=!!n._muted||e),t._emit("mute",u._id))}return t},volume:function(){var e,o,t=this,r=arguments;if(0===r.length)return t._volume;if(1===r.length||2===r.length&&void 0===r[1]){t._getSoundIds().indexOf(r[0])>=0?o=parseInt(r[0],10):e=parseFloat(r[0])}else r.length>=2&&(e=parseFloat(r[0]),o=parseInt(r[1],10));var a;if(!(void 0!==e&&e>=0&&e<=1))return a=o?t._soundById(o):t._sounds[0],a?a._volume:0;if("loaded"!==t._state)return t._queue.push({event:"volume",action:function(){t.volume.apply(t,r)}}),t;void 0===o&&(t._volume=e),o=t._getSoundIds(o);for(var u=0;u<o.length;u++)(a=t._soundById(o[u]))&&(a._volume=e,r[2]||t._stopFade(o[u]),t._webAudio&&a._node&&!a._muted?a._node.gain.setValueAtTime(e,n.ctx.currentTime):a._node&&!a._muted&&(a._node.volume=e*n.volume()),t._emit("volume",a._id));return t},fade:function(e,o,t,r){var a=this;if("loaded"!==a._state)return a._queue.push({event:"fade",action:function(){a.fade(e,o,t,r)}}),a;a.volume(e,r);for(var u=a._getSoundIds(r),i=0;i<u.length;i++){var d=a._soundById(u[i]);if(d){if(r||a._stopFade(u[i]),a._webAudio&&!d._muted){var _=n.ctx.currentTime,s=_+t/1e3;d._volume=e,d._node.gain.setValueAtTime(e,_),d._node.gain.linearRampToValueAtTime(o,s)}a._startFadeInterval(d,e,o,t,u[i],void 0===r)}}return a},_startFadeInterval:function(e,n,o,t,r,a){var u=this,i=n,d=n>o?"out":"in",_=Math.abs(n-o),s=_/.01,l=s>0?t/s:t;l<4&&(s=Math.ceil(s/(4/l)),l=4),e._fadeTo=o,e._interval=setInterval(function(){s>0&&(i+="in"===d?.01:-.01),i=Math.max(0,i),i=Math.min(1,i),i=Math.round(100*i)/100,u._webAudio?e._volume=i:u.volume(i,e._id,!0),a&&(u._volume=i),(o<n&&i<=o||o>n&&i>=o)&&(clearInterval(e._interval),e._interval=null,e._fadeTo=null,u.volume(o,e._id),u._emit("fade",e._id))},l)},_stopFade:function(e){var o=this,t=o._soundById(e);return t&&t._interval&&(o._webAudio&&t._node.gain.cancelScheduledValues(n.ctx.currentTime),clearInterval(t._interval),t._interval=null,o.volume(t._fadeTo,e),t._fadeTo=null,o._emit("fade",e)),o},loop:function(){var e,n,o,t=this,r=arguments;if(0===r.length)return t._loop;if(1===r.length){if("boolean"!=typeof r[0])return!!(o=t._soundById(parseInt(r[0],10)))&&o._loop;e=r[0],t._loop=e}else 2===r.length&&(e=r[0],n=parseInt(r[1],10));for(var a=t._getSoundIds(n),u=0;u<a.length;u++)(o=t._soundById(a[u]))&&(o._loop=e,t._webAudio&&o._node&&o._node.bufferSource&&(o._node.bufferSource.loop=e,e&&(o._node.bufferSource.loopStart=o._start||0,o._node.bufferSource.loopEnd=o._stop)));return t},rate:function(){var e,o,t=this,r=arguments;if(0===r.length)o=t._sounds[0]._id;else if(1===r.length){var a=t._getSoundIds(),u=a.indexOf(r[0]);u>=0?o=parseInt(r[0],10):e=parseFloat(r[0])}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));var i;if("number"!=typeof e)return i=t._soundById(o),i?i._rate:t._rate;if("loaded"!==t._state)return t._queue.push({event:"rate",action:function(){t.rate.apply(t,r)}}),t;void 0===o&&(t._rate=e),o=t._getSoundIds(o);for(var d=0;d<o.length;d++)if(i=t._soundById(o[d])){i._rateSeek=t.seek(o[d]),i._playStart=t._webAudio?n.ctx.currentTime:i._playStart,i._rate=e,t._webAudio&&i._node&&i._node.bufferSource?i._node.bufferSource.playbackRate.value=e:i._node&&(i._node.playbackRate=e);var _=t.seek(o[d]),s=(t._sprite[i._sprite][0]+t._sprite[i._sprite][1])/1e3-_,l=1e3*s/Math.abs(i._rate);!t._endTimers[o[d]]&&i._paused||(t._clearTimer(o[d]),t._endTimers[o[d]]=setTimeout(t._ended.bind(t,i),l)),t._emit("rate",i._id)}return t},seek:function(){var e,o,t=this,r=arguments;if(0===r.length)o=t._sounds[0]._id;else if(1===r.length){var a=t._getSoundIds(),u=a.indexOf(r[0]);u>=0?o=parseInt(r[0],10):t._sounds.length&&(o=t._sounds[0]._id,e=parseFloat(r[0]))}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));if(void 0===o)return t;if("loaded"!==t._state)return t._queue.push({event:"seek",action:function(){t.seek.apply(t,r)}}),t;var i=t._soundById(o);if(i){if(!("number"==typeof e&&e>=0)){if(t._webAudio){var d=t.playing(o)?n.ctx.currentTime-i._playStart:0,_=i._rateSeek?i._rateSeek-i._seek:0;return i._seek+(_+d*Math.abs(i._rate))}return i._node.currentTime}var s=t.playing(o);s&&t.pause(o,!0),i._seek=e,i._ended=!1,t._clearTimer(o),s&&t.play(o,!0),!t._webAudio&&i._node&&(i._node.currentTime=e),t._emit("seek",o)}return t},playing:function(e){var n=this;if("number"==typeof e){var o=n._soundById(e);return!!o&&!o._paused}for(var t=0;t<n._sounds.length;t++)if(!n._sounds[t]._paused)return!0;return!1},duration:function(e){var n=this,o=n._duration,t=n._soundById(e);return t&&(o=n._sprite[t._sprite][1]/1e3),o},state:function(){return this._state},unload:function(){for(var e=this,o=e._sounds,t=0;t<o.length;t++){if(o[t]._paused||e.stop(o[t]._id),!e._webAudio){/MSIE |Trident\//.test(n._navigator&&n._navigator.userAgent)||(o[t]._node.src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"),o[t]._node.removeEventListener("error",o[t]._errorFn,!1),o[t]._node.removeEventListener(n._canPlayEvent,o[t]._loadFn,!1)}delete o[t]._node,e._clearTimer(o[t]._id);var a=n._howls.indexOf(e);a>=0&&n._howls.splice(a,1)}var u=!0;for(t=0;t<n._howls.length;t++)if(n._howls[t]._src===e._src){u=!1;break}return r&&u&&delete r[e._src],n.noAudio=!1,e._state="unloaded",e._sounds=[],e=null,null},on:function(e,n,o,t){var r=this,a=r["_on"+e];return"function"==typeof n&&a.push(t?{id:o,fn:n,once:t}:{id:o,fn:n}),r},off:function(e,n,o){var t=this,r=t["_on"+e],a=0;if("number"==typeof n&&(o=n,n=null),n||o)for(a=0;a<r.length;a++){var u=o===r[a].id;if(n===r[a].fn&&u||!n&&u){r.splice(a,1);break}}else if(e)t["_on"+e]=[];else{var i=Object.keys(t);for(a=0;a<i.length;a++)0===i[a].indexOf("_on")&&Array.isArray(t[i[a]])&&(t[i[a]]=[])}return t},once:function(e,n,o){var t=this;return t.on(e,n,o,1),t},_emit:function(e,n,o){for(var t=this,r=t["_on"+e],a=r.length-1;a>=0;a--)r[a].id&&r[a].id!==n&&"load"!==e||(setTimeout(function(e){e.call(this,n,o)}.bind(t,r[a].fn),0),r[a].once&&t.off(e,r[a].fn,r[a].id));return t},_loadQueue:function(){var e=this;if(e._queue.length>0){var n=e._queue[0];e.once(n.event,function(){e._queue.shift(),e._loadQueue()}),n.action()}return e},_ended:function(e){var o=this,t=e._sprite;if(!o._webAudio&&e._node&&!e._node.paused&&!e._node.ended&&e._node.currentTime<e._stop)return setTimeout(o._ended.bind(o,e),100),o;var r=!(!e._loop&&!o._sprite[t][2]);if(o._emit("end",e._id),!o._webAudio&&r&&o.stop(e._id,!0).play(e._id),o._webAudio&&r){o._emit("play",e._id),e._seek=e._start||0,e._rateSeek=0,e._playStart=n.ctx.currentTime;var a=1e3*(e._stop-e._start)/Math.abs(e._rate);o._endTimers[e._id]=setTimeout(o._ended.bind(o,e),a)}return o._webAudio&&!r&&(e._paused=!0,e._ended=!0,e._seek=e._start||0,e._rateSeek=0,o._clearTimer(e._id),o._cleanBuffer(e._node),n._autoSuspend()),o._webAudio||r||o.stop(e._id),o},_clearTimer:function(e){var n=this;return n._endTimers[e]&&(clearTimeout(n._endTimers[e]),delete n._endTimers[e]),n},_soundById:function(e){for(var n=this,o=0;o<n._sounds.length;o++)if(e===n._sounds[o]._id)return n._sounds[o];return null},_inactiveSound:function(){var e=this;e._drain();for(var n=0;n<e._sounds.length;n++)if(e._sounds[n]._ended)return e._sounds[n].reset();return new t(e)},_drain:function(){var e=this,n=e._pool,o=0,t=0;if(!(e._sounds.length<n)){for(t=0;t<e._sounds.length;t++)e._sounds[t]._ended&&o++;for(t=e._sounds.length-1;t>=0;t--){if(o<=n)return;e._sounds[t]._ended&&(e._webAudio&&e._sounds[t]._node&&e._sounds[t]._node.disconnect(0),e._sounds.splice(t,1),o--)}}},_getSoundIds:function(e){var n=this;if(void 0===e){for(var o=[],t=0;t<n._sounds.length;t++)o.push(n._sounds[t]._id);return o}return[e]},_refreshBuffer:function(e){var o=this;return e._node.bufferSource=n.ctx.createBufferSource(),e._node.bufferSource.buffer=r[o._src],e._panner?e._node.bufferSource.connect(e._panner):e._node.bufferSource.connect(e._node),e._node.bufferSource.loop=e._loop,e._loop&&(e._node.bufferSource.loopStart=e._start||0,e._node.bufferSource.loopEnd=e._stop),e._node.bufferSource.playbackRate.value=e._rate,o},_cleanBuffer:function(e){var o=this;if(n._scratchBuffer){e.bufferSource.onended=null,e.bufferSource.disconnect(0);try{e.bufferSource.buffer=n._scratchBuffer}catch(e){}}return e.bufferSource=null,o}};var t=function(e){this._parent=e,this.init()};t.prototype={init:function(){var e=this,o=e._parent;return e._muted=o._muted,e._loop=o._loop,e._volume=o._volume,e._rate=o._rate,e._seek=0,e._paused=!0,e._ended=!0,e._sprite="__default",e._id=++n._counter,o._sounds.push(e),e.create(),e},create:function(){var e=this,o=e._parent,t=n._muted||e._muted||e._parent._muted?0:e._volume;return o._webAudio?(e._node=void 0===n.ctx.createGain?n.ctx.createGainNode():n.ctx.createGain(),e._node.gain.setValueAtTime(t,n.ctx.currentTime),e._node.paused=!0,e._node.connect(n.masterGain)):(e._node=new Audio,e._errorFn=e._errorListener.bind(e),e._node.addEventListener("error",e._errorFn,!1),e._loadFn=e._loadListener.bind(e),e._node.addEventListener(n._canPlayEvent,e._loadFn,!1),e._node.src=o._src,e._node.preload="auto",e._node.volume=t*n.volume(),e._node.load()),e},reset:function(){var e=this,o=e._parent;return e._muted=o._muted,e._loop=o._loop,e._volume=o._volume,e._rate=o._rate,e._seek=0,e._rateSeek=0,e._paused=!0,e._ended=!0,e._sprite="__default",e._id=++n._counter,e},_errorListener:function(){var e=this;e._parent._emit("loaderror",e._id,e._node.error?e._node.error.code:0),e._node.removeEventListener("error",e._errorFn,!1)},_loadListener:function(){var e=this,o=e._parent;o._duration=Math.ceil(10*e._node.duration)/10,0===Object.keys(o._sprite).length&&(o._sprite={__default:[0,1e3*o._duration]}),"loaded"!==o._state&&(o._state="loaded",o._emit("load"),o._loadQueue()),e._node.removeEventListener(n._canPlayEvent,e._loadFn,!1)}};var r={},a=function(e){var n=e._src;if(r[n])return e._duration=r[n].duration,void d(e);if(/^data:[^;]+;base64,/.test(n)){for(var o=atob(n.split(",")[1]),t=new Uint8Array(o.length),a=0;a<o.length;++a)t[a]=o.charCodeAt(a);i(t.buffer,e)}else{var _=new XMLHttpRequest;_.open("GET",n,!0),_.withCredentials=e._xhrWithCredentials,_.responseType="arraybuffer",_.onload=function(){var n=(_.status+"")[0];if("0"!==n&&"2"!==n&&"3"!==n)return void e._emit("loaderror",null,"Failed loading audio file with status: "+_.status+".");i(_.response,e)},_.onerror=function(){e._webAudio&&(e._html5=!0,e._webAudio=!1,e._sounds=[],delete r[n],e.load())},u(_)}},u=function(e){try{e.send()}catch(n){e.onerror()}},i=function(e,o){n.ctx.decodeAudioData(e,function(e){e&&o._sounds.length>0&&(r[o._src]=e,d(o,e))},function(){o._emit("loaderror",null,"Decoding audio data failed.")})},d=function(e,n){n&&!e._duration&&(e._duration=n.duration),0===Object.keys(e._sprite).length&&(e._sprite={__default:[0,1e3*e._duration]}),"loaded"!==e._state&&(e._state="loaded",e._emit("load"),e._loadQueue())},_=function(){try{"undefined"!=typeof AudioContext?n.ctx=new AudioContext:"undefined"!=typeof webkitAudioContext?n.ctx=new webkitAudioContext:n.usingWebAudio=!1}catch(e){n.usingWebAudio=!1}var e=/iP(hone|od|ad)/.test(n._navigator&&n._navigator.platform),o=n._navigator&&n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),t=o?parseInt(o[1],10):null;if(e&&t&&t<9){var r=/safari/.test(n._navigator&&n._navigator.userAgent.toLowerCase());(n._navigator&&n._navigator.standalone&&!r||n._navigator&&!n._navigator.standalone&&!r)&&(n.usingWebAudio=!1)}n.usingWebAudio&&(n.masterGain=void 0===n.ctx.createGain?n.ctx.createGainNode():n.ctx.createGain(),n.masterGain.gain.setValueAtTime(n._muted?0:1,n.ctx.currentTime),n.masterGain.connect(n.ctx.destination)),n._setup()};"function"==typeof define&&define.amd&&define([],function(){return{Howler:n,Howl:o}}),"undefined"!=typeof exports&&(exports.Howler=n,exports.Howl=o),"undefined"!=typeof window?(window.HowlerGlobal=e,window.Howler=n,window.Howl=o,window.Sound=t):"undefined"!=typeof global&&(global.HowlerGlobal=e,global.Howler=n,global.Howl=o,global.Sound=t)}();
"use strict";
/**
 * A stack for int values that normally needs a limited buffer size, but which accepts
 * unlimited number of elements. To do this, the user code can grant permission
 * to discard old entries. With such a permission given, subsequent put operations
 * may auto-delete the oldest element to keep stack size small.
 * In such a case the size of the stack will not grow.
 */
var DiscardingStack = function() 
{
    this.capacity = 0;           // size if the data array
    this.elements = null;        // the data is put into the buffer in round-robin manner
    this.offset = 0;             // position inside the array where the bottom-most stack element lies 
    this.length = 0;             // length of "active" part of the array - may wrap around the border
    this.destroypermission = 0;  // permission was given to auto-discard this many elements
};

    /**
     * Create new auto-discarding stack.
     * @capacity Initial capacity. In certain cases the capacity will be
     * automatically increased. Since this is an expensive operation, try to choose the
     * value in a way that it should never be exhausted in normal use.
     */
DiscardingStack.prototype.$ = function(capacity)
{
    this.capacity = capacity;
    this.elements = new Array(capacity);
    this.offset = 0;
    this.length = 0;
    this.destroypermission = 0;
    return this;
};
    
    /** 
     * Completely clears the stack.
     */
DiscardingStack.prototype.clear = function()
{
    this.offset = 0;
    this.length = 0;
    this.destroypermission = 0;
};

    /** 
     * Add a new value to the stack. When the increased size exceeds the current capacity, 
     * the capacity will be automatically increased also.
     * When a prior permission was given to discard old elements this is done and the new value
     * will be stored on top of the stack without the increasing its size.
     * @param value The value to push on top of the stack.
     */
DiscardingStack.prototype.push = function(value)
{
    if (this.length>=this.capacity)
    {   // must do something since buffer is full
        if (this.destroypermission > 0)
        {   // if not necessary to keep all data, can discard and overwrite the oldest element
            this.destroypermission--;
            this.elements[this.offset] = value;
            this.offset = (this.offset+1) % capacity;
            return;
        }
        else
        {   // expand capacity to hold more data
            var b2 = new Array(capacity*2);            
                // the content is in 2 parts, the second beginning at "offset" - compact the array
                // System.arraycopy(elements,offset, b2,0, capacity-offset);
            for (var i=0; i<capacity-offset; i++) b2[i] = this.elements[offset+i];            
                // System.arraycopy(elements,0, b2,capacity-offset, offset);
            for (var i=0; i<offset; i++) b2[capacity-offset+i] = this.elements[i];            
            this.offset = 0;
            this.elements = b2;
            this.capacity = this.capacity*2;
        }
    }
    // insert element at top of stack
    this.elements[(this.offset+this.length)%this.capacity] = value;
    this.length++;        
};

    /**
     * Give the stack the permission to discard the bottom-most values on the
     * stack.
     * @param number How many elements (from current point of view) may be auto-destroyed.
     *   When auto-discard is later performed the number is also decremented then to
     *   not destroy too many elements.
     *   The permission may later be changed any time.
     *   It is even possible to allow discarding elements that are not yet generated.
     */
DiscardingStack.prototype.mayDiscard = function(number)
{
    this.destroypermission = number;
};
    
    /** 
     * Extract the topmost element. 
     * @return The element previously on top of stack or 0 of none exists.
     */
DiscardingStack.prototype.pop = function()
{
        if (this.length<=0)
        {   return 0;
        }
        else
        {   this.length--;
            return this.elements[(this.offset+this.length)%this.capacity];
        }
};

    /** 
     * Query the number of elements on the stack.
     */
DiscardingStack.prototype.size = function()
{
    return this.length;
};
    
    /** 
     * Query the number of elements in the "save" area , that means, the elements
     * for which there was not given a permission to discard. 
     */
DiscardingStack.prototype.keepingSize = function()
{
    return this.length - this.destroypermission;
};
    
DiscardingStack.prototype.capacity = function()
{   
    return this.capacity;
};

    /**
     * Retrieve the element at the position on the stack.
     * @return The element on the position, or 0 if index is out of bounds
     *  index >= 0 && index < size()
     */
DiscardingStack.prototype.get = function(index)
{
        if (index<0 || index>=this.length) 
        {   return 0;
        }
        else
        {   return this.elements[(this.offset+this.index)%this.capacity];
        }
};

"use strict";
// constant values
var MAPWIDTH  = 64;
var MAPHEIGHT = 64; 

// pieces in static level definition
var OUTSIDE           = 0;
var MAN1              = '1'.charCodeAt(0);
var MAN2              = '2'.charCodeAt(0);
var AIR               = ' '.charCodeAt(0);
var EARTH             = '.'.charCodeAt(0);
var SAND              = 's'.charCodeAt(0);
var SAND_FULL         = 'S'.charCodeAt(0);
//var SAND_FULLEMERALD  = '}'.charCodeAt(0);
var WALL              = '#'.charCodeAt(0);
var ROUNDWALL         = 'A'.charCodeAt(0);
var GLASSWALL         = ':'.charCodeAt(0);
var STONEWALL         = '+'.charCodeAt(0);
var ROUNDSTONEWALL    = '|'.charCodeAt(0);
var WALLEMERALD       = '&'.charCodeAt(0);
var EMERALD           = '*'.charCodeAt(0);
var CITRINE           = ')'.charCodeAt(0); 
var SAPPHIRE          = '$'.charCodeAt(0);
var RUBY              = '('.charCodeAt(0);    
var ROCK              = '0'.charCodeAt(0);
//var ROCKEMERALD       = 'e'.charCodeAt(0);
var BAG               = '@'.charCodeAt(0);
var BOMB              = 'Q'.charCodeAt(0);
var DOOR              = 'E'.charCodeAt(0);
var SWAMP             = '%'.charCodeAt(0);
var DROP              = '/'.charCodeAt(0);
var TIMEBOMB          = '!'.charCodeAt(0);
var ACTIVEBOMB5       = '?'.charCodeAt(0);
var TIMEBOMB10        = ']'.charCodeAt(0);
var CONVERTER         = 'c'.charCodeAt(0);
var BOX               = '['.charCodeAt(0);
var CUSHION           = '_'.charCodeAt(0);
var ELEVATOR          = '{'.charCodeAt(0);
var CONVEYORLEFT      = '3'.charCodeAt(0);
var CONVEYORRIGHT     = '4'.charCodeAt(0);
//  public final static byte DISPENSER         = 'd'.charCodeAt(0);
var ACID              = 'a'.charCodeAt(0);
var KEYBLUE           = 'b'.charCodeAt(0);
var KEYRED            = 'r'.charCodeAt(0);
var KEYGREEN          = 'g'.charCodeAt(0);
var KEYYELLOW         = 'y'.charCodeAt(0);
var DOORBLUE          = 'B'.charCodeAt(0);
var DOORRED           = 'R'.charCodeAt(0);
var DOORGREEN         = 'G'.charCodeAt(0);
var DOORYELLOW        = 'Y'.charCodeAt(0);
var ONETIMEDOOR       = '='.charCodeAt(0);
var LORRYLEFT         = 'h'.charCodeAt(0);
var LORRYUP           = 'u'.charCodeAt(0);
var LORRYRIGHT        = 'k'.charCodeAt(0);
var LORRYDOWN         = 'j'.charCodeAt(0);
var BUGLEFT           = '5'.charCodeAt(0);
var BUGUP             = '6'.charCodeAt(0);
var BUGRIGHT          = '7'.charCodeAt(0);
var BUGDOWN           = '8'.charCodeAt(0);
var YAMYAM            = 'X'.charCodeAt(0);
var YAMYAMLEFT        = '<'.charCodeAt(0);
var YAMYAMUP          = '^'.charCodeAt(0);
var YAMYAMRIGHT       = '>'.charCodeAt(0);
var YAMYAMDOWN        = 'V'.charCodeAt(0);
var ROBOT             = 'o'.charCodeAt(0);
var GUN0              = '\''.charCodeAt(0);
var GUN1              = 'C'.charCodeAt(0);
var GUN2              = 'D'.charCodeAt(0);
var GUN3              = 'F'.charCodeAt(0);

var DEFAULTSWAMPRATE = 30;
var DEFAULTROBOTSPEED = 1;
var DEFAULTYAMYAMREMAINDERS = [ RUBY,RUBY,RUBY, RUBY,RUBY,RUBY, RUBY,RUBY,RUBY];

var Level = function()
{
    this.filename = null;
    this.title = null;
    this.author = null;
    this.hint = null;
    this.difficulty = 0;
    this.category = 0;
    
    this.players = 0;                // number of players
    this.loot = 0;                   // number of emeralds to collect
    this.swamprate = 0;              // swamp spreading speed
    this.robotspeed = 0;             // probability for robot step 
    this.yamyamremainders = null;    // YamYam remainders definition
    
    this.datawidth = 0;
    this.dataheight = 0;
    this.mapdata = null;        // contains datawidth*dataheight pieces
    
    this.hash = null;           // a hash value (as string) for all game-relevant settings
    
    this.demos = null;          // contains the stored demos
};
    

Level.prototype.$ = function(filename,json) 
{
    // initialize with default values
    this.filename = filename;
    this.title = "";
    this.author = "";
    this.hint = "";
    this.difficulty = 2;
    this.category = 0;
    this.loot = 0;
    this.swamprate = DEFAULTSWAMPRATE;
    this.robotspeed = DEFAULTROBOTSPEED;
    this.yamyamremainders = DEFAULTYAMYAMREMAINDERS.slice();
    this.demos = [];
    this.datawidth=1;
    this.dataheight=1;
    this.mapdata = [49];
    this.players=1;
    
    // if data is given, use it for populate level
    if (json)
    {   if (json.title && json.title.constructor == String) { this.title = json.title; }
        if (json.author && json.author.constructor == String) { this.author = json.author; }
        if (json.hint && json.hint.constructor == String) { this.hint = json.hint; }
        if (isInteger(json.difficulty)) { this.difficulty = Number(json.difficulty); }
        if (isInteger(json.category)) { this.category = Number(json.category); }
        if (isInteger(json.loot)) { this.loot = Number(json.loot); }    
        if (isInteger(json.swamprate)) { this.swamprate = Number(json.swamprate); }
        if (isInteger(json.robotspeed)) { this.robotspeed = Number(json.robotspeed); }
        if (json.yamyamremainders && json.yamyamremainders.constructor==String) 
        { this.yamyamremainders = parseremainders(json.yamyamremainders); }
    
        for (var i=0; Array.isArray(json.demos) && i<json.demos.length; i++) 
        {   var dj = json.demos[i];
            if (dj) this.demos.push(new Walk().$(dj));
        }
    
        if (Array.isArray(json.map))
        {   this.dataheight = Math.min(json.map.length, MAPHEIGHT);
            this.datawidth  = Math.min(this.determineLongestString(json.map), MAPWIDTH);
            this.mapdata = new Array(this.datawidth*this.dataheight);
            var foundp1=false;
            var foundp2=false;
            for (var y=0; y<this.dataheight; y++)
            {   var l = json.map[y];
                for (var x=0; x<this.datawidth; x++)
                {   var p = ((l && l.constructor==String && l.length>x) ? l.charCodeAt(x) : AIR);
                    if (p==MAN1) 
                    {   if (foundp1) 
                        {   p=AIR;
                        }
                        foundp1=true;
                    }
                    if (p==MAN2) 
                   {    if (foundp2) 
                        {   p=AIR;
                        }
                        foundp2=true;
                    }
                    this.mapdata[x+y*this.datawidth] =  p;
                }
            }
            this.players = (foundp2) ? 2 : 1;
        }    
    }
    
    this.makeHash();
    return this;
    
    function parseremainders(str)
    {   var rem = [RUBY,RUBY,RUBY, RUBY,RUBY,RUBY, RUBY,RUBY,RUBY];
        for (var i=0; i<9 && i<str.length; i++)
        {   var c = str.charCodeAt(i);
            if (c>=30 && c<128) rem[i]=c;
        }
        return rem;
    }
};

Level.prototype.makeHash = function()
{
    // collect all relevant data
    var all = 
    [   this.players, 
        this.loot, 
        this.swamprate, 
        this.robotspeed, 
        this.datawidth, 
        this.dataheight 
    ]
    .concat(this.yamyamremainders)
    .concat(this.mapdata);
    
    this.hash = md5(all.join("/"));
}

Level.prototype.getHash = function()
{
    return this.hash;
}

Level.prototype.toJSON = function()
{
    var o = { title: this.title, 
              difficulty: this.difficulty,
              category: this.category,
              loot: this.loot,
              map: [],
              demos: [],
            };            
    if (this.author.length>0)
    {   o.author = this.author;
    }
    if (this.hint.length>0)
    {   o.hint = this.hint;
    }
    if (this.swamprate!=DEFAULTSWAMPRATE)
    {   o.swamprate = this.swamprate;
    }
    if (this.swamprate!=DEFAULTSWAMPRATE)
    {   o.swamprate = this.swamprate;
    }
    if (this.robotspeed!=DEFAULTROBOTSPEED)
    {   o.robotspeed = this.robotspeed;
    }
    if (this.yamyamremainders.join(" ")!=DEFAULTYAMYAMREMAINDERS.join(" "))
    {   var r = "";
        for (var i=0; i<this.yamyamremainders.length; i++)
        {   r = r + String.fromCharCode(this.yamyamremainders[i]);
        }
        o.yamyamremainders = r;
    }
    for (var y=0; y<this.dataheight; y++)
    {   var l = [];
        for (var x=0; x<this.datawidth; x++)
        {   l.push(String.fromCharCode(this.mapdata[x+y*this.datawidth]));
        }
        o.map.push(l.join(""));
    }
    for (var i=0; i<this.demos.length; i++)
    {   o.demos.push(this.demos[i].toJSON());
    }
    
    return o;
};
    
Level.prototype.getNumberOfPlayers = function()
{
    return this.players;
};
    
Level.prototype.getTitle = function()
{
    return this.title;
};

Level.prototype.setTitle = function(t)
{
    this.title = t;
};
    
Level.prototype.getAuthor = function()
{
    return this.author;  
};

Level.prototype.setAuthor = function(a)
{
    this.author = a; 
};

Level.prototype.getHint = function()
{
    return this.hint;
};

Level.prototype.setHint = function(h)
{
    this.hint = h;
};
    
Level.prototype.getDifficulty = function()
{
    return this.difficulty;
};

Level.prototype.setDifficulty = function(d)
{
    this.difficulty = d;
};

Level.prototype.getCategory = function()
{
    return this.category;
};
    
Level.prototype.setCategory = function(c)
{
    this.category = c;
};
    
Level.prototype.getSwampRate = function()
{
    return this.swamprate;
};

Level.prototype.setSwampRate = function(r)
{
    this.swamprate = r;
};

Level.prototype.getRobotSpeed = function()
{
    return this.robotspeed;
};
    
Level.prototype.setRobotSpeed = function(s)
{
    this.robotspeed = s;
};
    
Level.prototype.getLoot = function()
{
    return this.loot;
};
    
Level.prototype.setLoot = function(l)
{
    this.loot = l;
};
        
Level.prototype.numberOfDemos = function ()
{
    return this.demos.length;
};

Level.prototype.getDemo = function(index)
{   
    return this.demos[index];
};

Level.prototype.setDemo = function(walk)
{
    this.demos = [ new Walk().$original(walk) ];
};

Level.prototype.getWidth = function()
{
    return this.datawidth;
};
    
Level.prototype.getHeight = function()
{
    return this.dataheight;
};
    
Level.prototype.getPiece = function(x,y)
{
    return this.mapdata[x+y*this.datawidth];  
};

Level.prototype.setPiece = function(x,y,p)
{
    this.mapdata[x+y*this.datawidth] = p;  
};
    
Level.prototype.insertMapColumn = function(x)
{
    for (var i=this.dataheight-1; i>=0; i--)
    {   this.mapdata.splice(i*this.datawidth+x, 0, AIR);
    }
    this.datawidth++;
};
Level.prototype.insertMapRow = function(y)
{
    for (var i=0; i<this.datawidth; i++)
    {   this.mapdata.splice(y*this.datawidth, 0, AIR);
    }
    this.dataheight++;
};

Level.prototype.isMapColumnOnlyAir = function(x)
{
    if (x<0 || x>=this.datawidth) return false;
    for (var i=0; i<this.dataheight; i++)
    {   if (this.mapdata[i*this.datawidth+x]!=AIR) { return false; }
    }
    return true;
}
Level.prototype.isMapRowOnlyAir = function(y)
{
    if (y<0 || y>=this.dataheight) return false;
    for (var i=0; i<this.datawidth; i++)
    {   if (this.mapdata[y*this.datawidth+i]!=AIR) { return false; }
    }
    return true;
}

Level.prototype.shrink = function()
{
    while (this.isMapRowOnlyAir(0))
    {   this.mapdata.splice(0,this.datawidth);
        this.dataheight--;
    }
    while (this.isMapRowOnlyAir(this.getHeight()-1))
    {   this.mapdata.splice(this.datawidth*(this.dataheight-1),this.datawidth);
        this.dataheight--;
    }
    while (this.isMapColumnOnlyAir(0))
    {   for (var i=this.dataheight-1; i>=0; i--)
        {   this.mapdata.splice(this.datawidth*i,1);
        }
        this.datawidth--;
    }
    while (this.isMapColumnOnlyAir(this.getWidth()-1))
    {   for (var i=this.dataheight-1; i>=0; i--)
        {   this.mapdata.splice(this.datawidth*(i+1)-1,1);
        }
        this.datawidth--;
    }    
}
    
Level.prototype.determineLongestString = function(a)
{
    var max=1;
    for (var i=0; i<a.length; i++)
    {   var l = a[i];
        if (l && l.constructor==String && l.length>max)
        {   max = l.length;
        }
    }
    return max;
};
    
    
Level.prototype.calculateMaximumLoot = function(considerconverters)
{
    var count0=0;
    var count1=0;
    var count2=0;
    var count3=0;
    var haveconverter=false;
        
    for (var i=0; i<this.mapdata.length; i++)
    {
            switch (this.mapdata[i])
            {   case ROCK:
                    count0++;
                    break;
                case WALLEMERALD:
                case EMERALD:
//                case ROCKEMERALD:
//                case SAND_FULLEMERALD:
                case BAG:
                case BOX:
                case RUBY:
                    count1++;
                    break;
                case SAPPHIRE:
                    count2++;
                    break;
                case CITRINE:
                    count3++;
                    break;
                case LORRYLEFT:
                case LORRYRIGHT:
                case LORRYUP:
                case LORRYDOWN:
                    count1+=8;
                    count2++;
                    break;
                case YAMYAM:
                case YAMYAMLEFT:
                case YAMYAMUP:
                case YAMYAMRIGHT:
                case YAMYAMDOWN:
                {   for (var j=0; j<this.yamyamremainders.length; j++)
                    switch (this.yamyamremainders[j])
                    {   case BAG:
                        case RUBY:
                        case EMERALD: { count1++; break; }
                        case SAPPHIRE: { count2++; break; }
                        case CITRINE: { count3++; break; }                        
                    }
                    break;
                }
                case CONVERTER:
                    haveconverter=true;
                    break;           
            }           
    }
    if (haveconverter && considerconverters) // when a converter is present any gem or stone could count 3
    {   return 3*(count0+count1+count2+count3);
    }
    else
    {   return count1+2*count2+3*count3;
    }
};

// toolbox functions
function isInteger(value)
{
    if (typeof(value)!="number") { return false; }
    return Math.round(value) === value;    
};

// MD5 hash function
function md5(str)
{
  var _rotateLeft = function (lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
  }

  var _addUnsigned = function (lX, lY) {
    var lX4, lY4, lX8, lY8, lResult
    lX8 = (lX & 0x80000000)
    lY8 = (lY & 0x80000000)
    lX4 = (lX & 0x40000000)
    lY4 = (lY & 0x40000000)
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF)
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8)
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8)
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8)
      }
    } else {
      return (lResult ^ lX8 ^ lY8)
    }
  }

  var _F = function (x, y, z) {
    return (x & y) | ((~x) & z)
  }
  var _G = function (x, y, z) {
    return (x & z) | (y & (~z))
  }
  var _H = function (x, y, z) {
    return (x ^ y ^ z)
  }
  var _I = function (x, y, z) {
    return (y ^ (x | (~z)))
  }

  var _FF = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_F(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _GG = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_G(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _HH = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_H(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _II = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_I(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _convertToWordArray = function (str) {
    var lWordCount
    var lMessageLength = str.length
    var lNumberOfWordsTemp1 = lMessageLength + 8
    var lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64
    var lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16
    var lWordArray = new Array(lNumberOfWords - 1)
    var lBytePosition = 0
    var lByteCount = 0
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4
      lBytePosition = (lByteCount % 4) * 8
      lWordArray[lWordCount] = (lWordArray[lWordCount] |
        ( (str.charCodeAt(lByteCount) & 0xff) << lBytePosition))
      lByteCount++
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4
    lBytePosition = (lByteCount % 4) * 8
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
    return lWordArray
  }

  var _wordToHex = function (lValue) {
    var wordToHexValue = ''
    var wordToHexValueTemp = ''
    var lByte
    var lCount

    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255
      wordToHexValueTemp = '0' + lByte.toString(16)
      wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2)
    }
    return wordToHexValue
  }

  var x = []
  var k
  var AA
  var BB
  var CC
  var DD
  var a
  var b
  var c
  var d
  var S11 = 7
  var S12 = 12
  var S13 = 17
  var S14 = 22
  var S21 = 5
  var S22 = 9
  var S23 = 14
  var S24 = 20
  var S31 = 4
  var S32 = 11
  var S33 = 16
  var S34 = 23
  var S41 = 6
  var S42 = 10
  var S43 = 15
  var S44 = 21

  x = _convertToWordArray(str)
  a = 0x67452301
  b = 0xEFCDAB89
  c = 0x98BADCFE
  d = 0x10325476

  var xl = x.length
  for (k = 0; k < xl; k += 16) {
    AA = a
    BB = b
    CC = c
    DD = d
    a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478)
    d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
    c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB)
    b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
    a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
    d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A)
    c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613)
    b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501)
    a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8)
    d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
    c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
    b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
    a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122)
    d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193)
    c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E)
    b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821)
    a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562)
    d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340)
    c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51)
    b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
    a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D)
    d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453)
    c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
    b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
    a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
    d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6)
    c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
    b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED)
    a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
    d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
    c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9)
    b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)
    a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
    d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681)
    c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
    b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
    a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
    d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
    c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
    b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
    a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
    d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
    c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
    b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05)
    a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
    d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
    c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
    b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665)
    a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244)
    d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97)
    c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
    b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039)
    a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3)
    d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
    c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
    b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1)
    a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
    d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
    c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314)
    b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
    a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82)
    d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
    c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
    b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391)
    a = _addUnsigned(a, AA)
    b = _addUnsigned(b, BB)
    c = _addUnsigned(c, CC)
    d = _addUnsigned(d, DD)
  }

  var temp = _wordToHex(a) + _wordToHex(b) + _wordToHex(c) + _wordToHex(d)

  return temp.toLowerCase()
}
    
"use strict";
var Logic = function() 
{
    this.map = null;                     // fixed-size buffer to hold current map   
    this.counters = null;                // various counter values / flags that get modified in game
    this.transactions = null;            // the transaction buffer
    
    this.level = null;                   // level currently played
    this.walk = null;                    // the walk currently running
    this.turnsdone = 0
    this.numberofplayers = 0;
    
    this.visualrandomseed = 0;   // secondary random generator used for graphics appearances (not logic relevant) 
    this.movedflags = null;                // temporary info to prevent double-actions of pieces
    this.countersatbeginofturn = null;
};

    // pieces created during game   
var ROCK_FALLING      = 128;
var EMERALD_FALLING   = 129;
var BOMB_FALLING      = 130;
var BAG_FALLING       = 131;
var DOOR_OPENED       = 132;
var DOOR_CLOSING      = 133;
var DOOR_CLOSED       = 134;
var BUGLEFT_FIXED   = 135;
var BUGUP_FIXED     = 136;
var BUGRIGHT_FIXED  = 137;
var BUGDOWN_FIXED   = 138;
var LORRYLEFT_FIXED     = 139;
var LORRYUP_FIXED       = 140;
var LORRYRIGHT_FIXED    = 141;
var LORRYDOWN_FIXED     = 142;
var BOMB_EXPLODE      = 143;
var EXPLODE1_AIR      = 144;
var EXPLODE2_AIR      = 145;
var EXPLODE3_AIR      = 146;
var EXPLODE4_AIR      = 147;
var EXPLODE1_EMERALD  = 148;
var EXPLODE2_EMERALD  = 149;
var EXPLODE3_EMERALD  = 150;
var EXPLODE4_EMERALD  = 151;
var EXPLODE1_SAPPHIRE = 152;
var EXPLODE2_SAPPHIRE = 153;
var EXPLODE3_SAPPHIRE = 154;
var EXPLODE4_SAPPHIRE = 155;
var ONETIMEDOOR_CLOSED= 156;
var BIGBOMB_EXPLODE   = 157;
var LORRY_EXPLODE     = 158;
var BUG_EXPLODE       = 159;
var ACTIVEBOMB0       = 160;
var ACTIVEBOMB1       = 161;
var ACTIVEBOMB2       = 162;
var ACTIVEBOMB3       = 163;
var ACTIVEBOMB4       = 164;
var TIMEBOMB_EXPLODE  = 165;
var RUBY_FALLING      = 166;
var SAPPHIRE_FALLING  = 167;    
var BAG_OPENING       = 168;    
var SAPPHIRE_BREAKING = 169;    
var EXPLODE1_BAG      = 170;
var EXPLODE2_BAG      = 171;
var EXPLODE3_BAG      = 172;
var EXPLODE4_BAG      = 173;
var MAN1_LEFT         = 174;
var MAN2_LEFT         = 175;
var MAN1_RIGHT        = 176;
var MAN2_RIGHT        = 177;
var MAN1_UP           = 178;
var MAN2_UP           = 179;
var MAN1_DOWN         = 180;
var MAN2_DOWN         = 181;
var MAN1_PUSHLEFT     = 182;
var MAN2_PUSHLEFT     = 183;
var MAN1_PUSHRIGHT    = 184;
var MAN2_PUSHRIGHT    = 185;
var MAN1_PUSHUP       = 186;
var MAN2_PUSHUP       = 187;
var MAN1_PUSHDOWN     = 188;
var MAN2_PUSHDOWN     = 189;
var MAN1_DIGLEFT      = 190;
var MAN2_DIGLEFT      = 191;
var MAN1_DIGRIGHT     = 192;
var MAN2_DIGRIGHT     = 193;
var MAN1_DIGUP        = 194;
var MAN2_DIGUP        = 195;
var MAN1_DIGDOWN      = 196;
var MAN2_DIGDOWN      = 197;
var CITRINE_FALLING   = 198;
var CITRINE_BREAKING  = 199;
var EXPLODE1_TNT     = 200;
var EXPLODE2_TNT     = 201;
var EXPLODE3_TNT     = 202;
var EXPLODE4_TNT     = 203;
var YAMYAM_EXPLODE   = 204;
var EXPLODE1_YAMYAM0 = 205;
var EXPLODE2_YAMYAM0 = 206;
var EXPLODE3_YAMYAM0 = 207;
var EXPLODE4_YAMYAM0 = 208;
var EXPLODE1_YAMYAM1 = 209;
var EXPLODE2_YAMYAM1 = 210;
var EXPLODE3_YAMYAM1 = 211;
var EXPLODE4_YAMYAM1 = 212;
var EXPLODE1_YAMYAM2 = 213;
var EXPLODE2_YAMYAM2 = 214;
var EXPLODE3_YAMYAM2 = 215;
var EXPLODE4_YAMYAM2 = 216;
var EXPLODE1_YAMYAM3 = 217;
var EXPLODE2_YAMYAM3 = 218;
var EXPLODE3_YAMYAM3 = 219;
var EXPLODE4_YAMYAM3 = 220;
var EXPLODE1_YAMYAM4 = 221;
var EXPLODE2_YAMYAM4 = 222;
var EXPLODE3_YAMYAM4 = 223;
var EXPLODE4_YAMYAM4 = 224;
var EXPLODE1_YAMYAM5 = 225;
var EXPLODE2_YAMYAM5 = 226;
var EXPLODE3_YAMYAM5 = 227;
var EXPLODE4_YAMYAM5 = 228;
var EXPLODE1_YAMYAM6 = 229;
var EXPLODE2_YAMYAM6 = 230;
var EXPLODE3_YAMYAM6 = 231;
var EXPLODE4_YAMYAM6 = 232;
var EXPLODE1_YAMYAM7 = 233;
var EXPLODE2_YAMYAM7 = 234;
var EXPLODE3_YAMYAM7 = 235;
var EXPLODE4_YAMYAM7 = 236;
var EXPLODE1_YAMYAM8 = 237;
var EXPLODE2_YAMYAM8 = 238;
var EXPLODE3_YAMYAM8 = 239;
var EXPLODE4_YAMYAM8 = 240;

// virtual pieces (exist only during animations)
var CUSHION_BUMPING   = 1;
var EARTH_UP          = 2;
var EARTH_DOWN        = 3;
var EARTH_LEFT        = 4;
var EARTH_RIGHT       = 5;    
var LASER_H           = 6;
var LASER_V           = 7;
var LASER_BL          = 8;
var LASER_BR          = 9;
var LASER_TL          = 10;
var LASER_TR          = 11;
var LASER_L           = 12;
var LASER_R           = 13;
var LASER_U           = 14;
var LASER_D           = 15;
var SWAMP_RIGHT       = 16;
var SWAMP_LEFT        = 17;
var SWAMP_UP          = 18;
var SWAMP_DOWN        = 19;

    // the counters are references with this index
//  public final static int CTR_NUMPLAYERS              = 0;
var CTR_MANPOSX1                = 1;
var CTR_MANPOSX2                = 2;
var CTR_MANPOSY1                = 3;
var CTR_MANPOSY2                = 4;
var CTR_EMERALDSCOLLECTED       = 5;
var CTR_EXITED_PLAYER1          = 6;
var CTR_EXITED_PLAYER2          = 7;
var CTR_KILLED_PLAYER1          = 8;
var CTR_KILLED_PLAYER2          = 9;
var CTR_TIMEBOMBS_PLAYER1       = 10;
var CTR_TIMEBOMBS_PLAYER2       = 11;
var CTR_KEYS_PLAYER1            = 12;
var CTR_KEYS_PLAYER2            = 13;
var CTR_RANDOMSEED              = 14;
var CTR_EMERALDSTOOMUCH         = 15;
    
    // opcodes for the transaction stack 
    // these are organized in a way to prefer values nearer to zero,
    // so the runtime may do some optimizations here 
var OPCODE_STARTOFTURN = 0;
var OPCODE_MASK     = 0xf0000000 | 0;
var TRN_HIGHLIGHT   = 0x00000000 | 0;  
var TRN_COUNTER     = 0x10000000 | 0;
var TRN_TRANSFORM   = 0x20000000 | 0;
var TRN_CHANGESTATE = 0x30000000 | 0;
var TRN_MOVEUP      = 0xf0000000 | 0;
var TRN_MOVEDOWN    = 0xe0000000 | 0;
var TRN_MOVELEFT    = 0xd0000000 | 0;
var TRN_MOVERIGHT   = 0xc0000000 | 0;
var TRN_MOVEUP2     = 0x40000000 | 0;
var TRN_MOVEDOWN2   = 0x50000000 | 0;
var TRN_MOVELEFT2   = 0x60000000 | 0;
var TRN_MOVERIGHT2  = 0x70000000 | 0;

var MAXTRANSACTIONS = 20000;

Logic.DEBRIS_NOTHING = 
[   EXPLODE1_AIR, EXPLODE1_AIR, EXPLODE1_AIR, 
    EXPLODE1_AIR, EXPLODE1_AIR, EXPLODE1_AIR,
    EXPLODE1_AIR, EXPLODE1_AIR, EXPLODE1_AIR ];
Logic.DEBRIS_EMERALDS =
[   EXPLODE1_EMERALD, EXPLODE1_EMERALD, EXPLODE1_EMERALD,
    EXPLODE1_EMERALD, EXPLODE1_SAPPHIRE,EXPLODE1_EMERALD,
    EXPLODE1_EMERALD, EXPLODE1_EMERALD, EXPLODE1_EMERALD ];
Logic.DEBRIS_YAMYAM =
[   EXPLODE1_YAMYAM0, EXPLODE1_YAMYAM1, EXPLODE1_YAMYAM2,
    EXPLODE1_YAMYAM3, EXPLODE1_YAMYAM4, EXPLODE1_YAMYAM5,
    EXPLODE1_YAMYAM6, EXPLODE1_YAMYAM7, EXPLODE1_YAMYAM8 ];

Logic.prototype.$ = function()
{
    this.map = new Array(MAPWIDTH*MAPHEIGHT);       
    this.counters = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    this.transactions = [];
    this.movedflags = new Array(MAPWIDTH*MAPHEIGHT);
    this.countersatbeginofturn = new Array(this.counters.length);
    this.visualrandomseed = 23452;
    return this;
};

Logic.prototype.attach = function(l, w)
{
    this.level = l;
    this.walk = w;
    this.reset();
};
    
    // moves the game-logic to the desired position.
    // it is guaranteed that the transaction buffer then holds at least all 
    // the modifications that lead to this turn, and the keep-location
    // is set to the first of these transactions
    // (exception: when moving to 0, no transactions are available)
Logic.prototype.gototurn = function(t)
{
        if (this.turnsdone<t)
        {   // moving forward is quite simple
            while (this.turnsdone<t)
            {   this.computeturn();
            }
        }
        else if (this.turnsdone>t)
        {   
            if (t==0)
            {   // moving backwards to 0 is just a reset
                this.reset();
            }
            else
            {   // otherwise try to roll back the turns.
                // this could fail on the way because the 
                // transactions were already discarded
                while (this.turnsdone>t)
                {   if (!this.rollback())
                    {   console.log("rollback failed - need to restart from begin");
                        // when rollback indeed failed, just reset
                        // and start from begin
                        this.reset();
                        while (this.turnsdone<t)
                        {   this.computeturn();
                        }
                        return;
                    }
                }               
            }
        }
}
    
    // resets the game logic to the initial state as defined in the Level
Logic.prototype.reset = function()
{
        this.turnsdone = 0;
        this.numberofplayers = 1;        
        this.transactions.length = 0;
        
        for (var i=0; i<this.map.length; i++) this.map[i]=OUTSIDE;
        var dw = this.level.datawidth;
        for (var y=0; y<this.level.dataheight; y++)
        {   for (var x=0; x<dw; x++) 
            {   this.map[x+y*MAPWIDTH] = this.level.mapdata[x+y*dw];
            }
        }               
        for (var i=0; i<this.counters.length; i++) this.counters[i]=0;

        // init start positions of players
        var populatedwidth = this.level.datawidth;
        for (var y=this.level.dataheight-1; y>=0; y--)
        {   for (var x=0; x<populatedwidth; x++)
            {   if (this.is(x,y,MAN1))
                {   this.counters[CTR_MANPOSX1] = x;
                    this.counters[CTR_MANPOSY1] = y;
                }
                else if (this.is(x,y,MAN2))
                {   this.counters[CTR_MANPOSX2] = x;
                    this.counters[CTR_MANPOSY2] = y; 
                    this.numberofplayers = 2;            
                }
            }
        }
                        
        this.counters[CTR_RANDOMSEED] = this.walk.getRandomSeed() & 0xffff;
        this.counters[CTR_EMERALDSTOOMUCH] = this.level.calculateMaximumLoot(true) - this.level.loot;
};

    
    // progress the game logic by one turn. everything that happens in the
    // game is also recorded in the transaction buffer.
    // the keep-location is set in the transaction buffer to point at the
    // first transaction which will set to a TRN_STARTOFTURN value.
Logic.prototype.computeturn = function()
{
        // transactions from previous steps may be deleted if too big
        if (this.transactions.length>=MAXTRANSACTIONS)
        {   this.transactions.length = 0
        }
        
        // insert turn start marker
        this.transactions.push (OPCODE_STARTOFTURN);

        // clear the array of the moved flags
        for (var i=0; i<this.movedflags.length; i++) 
        {   this.movedflags[i] = false;
        }
        // memorize the values of the counters at the begin of the turn 
        for (var i=0; i<this.counters.length; i++) 
        {   this.countersatbeginofturn[i] = this.counters[i];
        }
        
        // special handling if man1 moves towards man2:  man2 will move first to allow close proximity while walking
        var num = this.getNumberOfPlayers();
        if (num==2 && this.man1_moves_toward_man2())
        {   this.playermove(1);
            this.playermove(0);
        }
        else
        {   for (var p=0; p<num; p++)
            {   this.playermove(p);      
            }
        }
        
        // after the players, all the pieces move
        this.piecesmove();           
        
        this.turnsdone++;
};

Logic.prototype.piecesmove = function()
    {
        // for the case a random decision is needed, take the value of the random seed counter
        var randomseed = this.counters[CTR_RANDOMSEED];
    
        // only pieces inside the populated area can actually move
        var populatedwidth = this.level.datawidth;
        for (var y=this.level.dataheight-1; y>=0; y--)
        {   for (var x=0; x<populatedwidth; x++)
            {   
                // when found a flag on a piece while processing, this piece must
                // not be moved in this turn again
                if (this.hasmoved(x,y))
                {   continue;
                }
                
                // huge decision - tree what to do with each piece 
                var piece = this.piece(x,y);
                switch (piece)
                {   case DOOR:
                        if (this.counters[CTR_EMERALDSCOLLECTED]>=this.level.getLoot())
                        {   this.transform(x,y, DOOR_OPENED);
                        }
                        break;
                    case DOOR_OPENED:
                        this.highlight(x,y, piece);
                        break;
                    case DOOR_CLOSING:
                        this.transform(x,y, DOOR_CLOSED);                        
                        break;
                    case ROCK:
                    {   var dx;
                        if (this.is(x,y+1,AIR))
                        {   this.move(x,y, 0,1, ROCK_FALLING);
                        }
                        else if (this.is(x,y+1,SAND))
                        {   this.move(x,y, 0,1, ROCK);
                            this.transform(x,y+1, SAND_FULL);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,ROCK);
                            this.transform(x,y+1, ACID);                          
                        }
                        else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                        {   this.move (x,y,0,2,EMERALD_FALLING);
                            this.highlight (x,y+1, CONVERTER);                       
                        }
                        else if (dx=this.may_roll(x,y, true))
                        {   this.move(x, y, dx, 0, ROCK_FALLING);
                        } 
                        else if (dx=this.may_be_transported(x,y))
                        {   this.move(x, y, dx, 0, ROCK);                            
                        }
                        break;
                    }
                    case ROCK_FALLING:
                    {
                        if (!this.is_hit_by_non_bomb(x,y+1, ROCK_FALLING))
                        {   if (this.is(x,y+1,AIR))
                            {   this.move(x,y,0,1,ROCK_FALLING);
                            }
                            else if (this.is(x,y+1,ACID))
                            {   this.move(x,y,0,1,ROCK);     
                                this.transform(x,y+1,ACID);                      
                            }
                            else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                            {   this.move (x,y, 0,2,EMERALD_FALLING);
                                this.highlight (x,y+1, CONVERTER);                       
                            }
                            else if (this.is(x,y+1,CUSHION))
                            {   this.changestate(x,y,ROCK);
                                this.transform(x,y+1, CUSHION_BUMPING);
                                this.transform(x,y+1, CUSHION);
                            }
                            else
                            {   this.changestate(x,y,ROCK);
                            }
                        }
                        break;
                    }
                    case SAND_FULL:
                    {   if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,ROCK_FALLING);
                            this.transform(x,y,SAND);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,ROCK_FALLING);
                            this.transform(x,y, SAND);
                            this.transform(x,y+1, ACID);
                        }
                        else if (this.is(x,y+1,SAND))
                        {   this.move(x,y,0,1,ROCK);
                            this.transform(x,y, SAND);
                            this.transform(x,y+1, SAND_FULL);
                        }
                        break;
                    }
                    case EMERALD:
                    {   var dx;
                        if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,EMERALD_FALLING);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,EMERALD);
                            this.transform(x,y+1,ACID);                          
                            this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                        }
                        else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                        {   this.move (x,y,0,2,SAPPHIRE_FALLING);
                            this.highlight (x,y+1, CONVERTER);
                        }
                        else if (dx=this.may_roll(x,y, true))
                        {   this.move(x,y,dx,0,EMERALD_FALLING);
                        }
                        else if (dx=this.may_be_transported(x,y))
                        {   this.move(x, y, dx, 0, EMERALD);                            
                        }
                        else 
                        {
                            this.visualrandomseed = this.nextrandomseed(this.visualrandomseed);
                            if ((this.visualrandomseed & 31) == 0)
                            {
                                this.highlight(x,y,EMERALD);
                            }                               
                        }
                        break;
                    }
                    case EMERALD_FALLING:
                    {
                        if (!this.is_hit_by_non_bomb(x,y+1, EMERALD_FALLING))
                        {   if (this.is(x,y+1,AIR))
                            {   this.move(x,y,0,1,EMERALD_FALLING);
                            }
                            else if (this.is(x,y+1,ACID))
                            {   this.move(x,y,0,1,EMERALD);
                                this.transform(x,y+1,ACID);                          
                                this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                            }
                            else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                            {   this.move (x,y,0,2,SAPPHIRE_FALLING);
                                this.highlight (x,y+1, CONVERTER);                       
                            }
                            else if (this.is(x,y+1,CUSHION))
                            {   this.changestate(x,y,EMERALD);
                                this.transform(x,y+1, CUSHION_BUMPING);
                                this.transform(x,y+1, CUSHION);
                            }
                            else
                            {   this.changestate(x,y,EMERALD);
                            }
                        }
                        break;
                    }                    
                    case WALLEMERALD:
                    {
                            this.visualrandomseed = this.nextrandomseed(this.visualrandomseed);
                            if ((this.visualrandomseed & 31) == 0)
                            {
                                this.highlight(x,y,WALLEMERALD);
                            }                               
                        break;
                    }
                    case SAPPHIRE:
                    {   var dx;
                        if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,SAPPHIRE_FALLING);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,SAPPHIRE);
                            this.transform(x,y+1,ACID);                      
                            this.changecounter(CTR_EMERALDSTOOMUCH,-2);
                        }
                        else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                        {   this.move (x,y,0,2,CITRINE_FALLING);
                            this.highlight (x,y+1, CONVERTER);                       
                        }
                        else if (dx=this.may_roll(x,y, true))
                        {   this.move(x,y,dx,0,SAPPHIRE_FALLING);
                        }
                        else if (dx=this.may_be_transported(x,y))
                        {   this.move(x, y, dx, 0, SAPPHIRE); 
                        }
                        else 
                        {
                            this.visualrandomseed = this.nextrandomseed(this.visualrandomseed);
                            if ((this.visualrandomseed & 31) == 0)
                            {
                                this.highlight(x,y,SAPPHIRE);
                            }                               
                        }
                        break;
                    }
                    case SAPPHIRE_FALLING:
                    {   if (!this.is_hit_by_non_bomb(x,y+1,SAPPHIRE_FALLING))
                        {   if (this.is(x,y+1,AIR))
                            {   this.move(x,y,0,1, SAPPHIRE_FALLING);
                            }
                            else if (this.is(x,y+1,ACID))
                            {   this.move(x,y,0,1,SAPPHIRE);
                                this.transform(x,y+1,ACID);                          
                                this.changecounter(CTR_EMERALDSTOOMUCH,-2);
                            }
                            else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                            {   this.move (x,y,0,2,CITRINE_FALLING);
                                this.highlight (x,y+1, CONVERTER);                       
                            }
                            else if (this.is(x,y+1,CUSHION))
                            {   this.changestate(x,y,SAPPHIRE);
                                this.transform(x,y+1, CUSHION_BUMPING);
                                this.transform(x,y+1, CUSHION);
                            }
                            else
                            {   this.changestate(x,y,SAPPHIRE);
                            }
                        }
                        break;
                    }
                    case SAPPHIRE_BREAKING:
                    {   this.transform(x,y, AIR);
                        break;
                    }
                    case CITRINE:
                    {   var dx=0;
                        if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,CITRINE_FALLING);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,CITRINE);
                            this.transform(x,y+1,ACID);                          
                            this.changecounter(CTR_EMERALDSTOOMUCH,-3);
                        }
                        else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                        {   this.move (x,y, 0,2,CITRINE_FALLING);
                            this.highlight (x,y+1, CONVERTER);                       
                        }
                        else if (dx=this.may_roll(x,y, true))
                        {   this.move(x,y,dx,0,CITRINE_FALLING);
                        }
                        else if (dx=this.may_be_transported(x,y))
                        {   this.move(x, y, dx, 0, CITRINE);                            
                        }                        
                        else 
                        {
                            this.visualrandomseed = this.nextrandomseed(this.visualrandomseed);
                            if ((this.visualrandomseed & 31) == 0)
                            {
                                this.highlight(x,y,CITRINE);
                            }                               
                        }
                        break;
                    }
                    case CITRINE_FALLING:
                    {   if (!this.is_hit_by_non_bomb(x,y+1,CITRINE_FALLING))
                        {   if (this.is(x,y+1,AIR))
                            {   this.move(x,y,0,1,CITRINE_FALLING);
                            }
                            else if (this.is(x,y+1,ACID))
                            {   this.move(x,y,0,1,CITRINE);
                                this.transform(x,y+1,ACID);                          
                                this.changecounter(CTR_EMERALDSTOOMUCH,-3);
                            }
                            else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                            {   this.move (x,y,0,2,CITRINE_FALLING);
                                this.highlight (x,y+1, CONVERTER);                       
                            }
                            else if (this.is(x,y+1,CUSHION))
                            {   this.changestate(x,y,CITRINE);
                                this.transform(x,y+1, CUSHION_BUMPING);
                                this.transform(x,y+1, CUSHION);
                            }
                            else
                            {   this.changestate(x,y,CITRINE_BREAKING);
                                this.transform(x,y,AIR);
                                this.changecounter(CTR_EMERALDSTOOMUCH, -4);
                            }
                        }
                        break;
                    }
                    case CITRINE_BREAKING:
                    {   this.transform(x,y,AIR);
                        break;
                    }
                    case RUBY:
                    {   var dx;
                        if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,RUBY_FALLING);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,RUBY);
                            this.transform(x,y+1,ACID);                          
                            this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                        }
                        else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                        {   this.move (x,y,0,2,SAPPHIRE_FALLING);
                            this.highlight (x,y+1,CONVERTER);                        
                        }
                        else if (dx=this.may_roll(x,y, true))
                        {   this.move(x,y,dx,0,RUBY_FALLING);
                        }
                        else if (dx=this.may_be_transported(x,y))
                        {   this.move(x, y, dx, 0, RUBY);
                        }
                        else 
                        {
                            this.visualrandomseed = this.nextrandomseed(this.visualrandomseed);
                            if ((this.visualrandomseed & 31) == 0)
                            {
                                this.highlight(x,y,RUBY);
                            }                               
                        }
                        break;
                    }
                    case RUBY_FALLING:
                    {
                        if (!this.is_hit_by_non_bomb(x,y+1, RUBY_FALLING))
                        {   if (this.is(x,y+1,AIR))
                            {   this.move(x,y,0,1,RUBY_FALLING);
                            }
                            else if (this.is(x,y+1,ACID))
                            {   this.move(x,y,0,1,RUBY);
                                this.transform(x,y+1,ACID);                          
                                this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                            }
                            else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                            {   this.move (x,y,0,2,SAPPHIRE_FALLING);
                                this.highlight (x,y+1, CONVERTER);                       
                            }
                            else if (this.is(x,y+1,CUSHION))
                            {   this.changestate(x,y,RUBY);
                                this.transform(x,y+1, CUSHION_BUMPING);
                                this.transform(x,y+1, CUSHION);
                            }
                            else
                            {   this.changestate(x,y,RUBY);
                            }
                        }
                        break;
                    }
                    case KEYRED:
                    case KEYBLUE:
                    case KEYGREEN:
                    case KEYYELLOW:
                    {   this.visualrandomseed = this.nextrandomseed(this.visualrandomseed);
                        if ((this.visualrandomseed & 31) == 0)
                        {   this.highlight(x,y,piece);
                        }                               
                        break;
                    }                    
                    case BAG:
                    {   var dx=0;
                        if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,BAG_FALLING);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,BAG);
                            this.transform(x,y+1,ACID);                          
                            this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                        }
                        else if (dx=this.may_roll(x,y, false))
                        {   this.move(x,y,dx,0,BAG_FALLING);
                        }
                        else if (dx=this.may_be_transported(x,y))
                        {   this.move(x, y, dx, 0, BAG); 
                        }
                        break;
                    }
                    case BAG_FALLING:
                    {
                        if (!this.is_hit_by_non_bomb(x,y+1, BAG_FALLING))
                        {   if (this.is(x,y+1,AIR))
                            {   this.move(x,y,0,1,BAG_FALLING);
                            }
                            else if (this.is(x,y+1,ACID))
                            {   this.move(x,y,0,1,BAG);
                                this.transform(x,y+1,ACID);  
                                this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                            }
                            else if (this.is(x,y+1,CUSHION))
                            {   this.changestate(x,y, BAG);
                                this.transform(x,y+1, CUSHION_BUMPING);
                                this.transform(x,y+1, CUSHION);
                            }
                            else
                            {   this.changestate(x,y,BAG);
                            }
                        }
                        break;
                    }
                    case BAG_OPENING:
                    {   this.transform(x,y, EMERALD);
                        break;
                    }                               
                    
                    case BOMB:
                    {   var dx;
                        if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,BOMB_FALLING);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,BOMB);
                            this.transform(x,y+1,ACID);                          
                        }
                        else if (dx=this.may_roll(x,y, false))
                        {   this.move(x,y,dx,0,BOMB_FALLING);
                        }
                        else if (dx=this.may_be_transported(x,y))
                        {   this.move(x, y, dx, 0, BOMB); 
                        }						
                        break;
                    }
                    case BOMB_FALLING:
                        if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,BOMB_FALLING);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,BOMB);
                            this.transform(x,y+1,ACID);                          
                        }
                        else if (this.is(x,y+1,CUSHION))
                        {   this.changestate(x,y,BOMB);
                            this.transform(x,y+1, CUSHION_BUMPING);
                            this.transform(x,y+1, CUSHION);
                        }
                        else if (this.is_living(x,y+1))
                        {   this.explode3x3(x,y, Logic.DEBRIS_NOTHING);
                        }
                        else 
                        {   this.transform(x,y, BOMB_EXPLODE);
                        }
                        break;          
                        
                    case SWAMP:                     
                        if (this.level.getSwampRate()>0)
                        {   randomseed = this.nextrandomseed(randomseed);
                            switch (randomseed % (4*this.level.getSwampRate()))
                            {   case 0: 
                                    this.highlight(x,y, SWAMP);
                                    if (this.is(x,y-1,EARTH))
                                    {   this.highlight(x,y-1, EARTH);
                                        this.transform(x,y-1, SWAMP_UP);
                                        this.transform(x,y-1, SWAMP);
                                    }
                                    else if(this.is(x,y-1,AIR))
                                    {   this.transform(x,y-1, SWAMP_UP);
                                        this.transform(x,y-1, SWAMP);
                                    }
                                    break;
                                case 1:
                                    this.highlight(x,y, SWAMP);
                                    if (this.is(x-1,y,EARTH))
                                    {   this.highlight(x-1,y, EARTH);
                                        this.transform(x-1,y, SWAMP_LEFT);
                                        this.transform(x-1,y, SWAMP);
                                    }
                                    else if (this.is(x-1,y,AIR))
                                    {   this.transform(x-1,y, SWAMP_LEFT);
                                        this.transform(x-1,y, DROP);     
                                    }
                                    break;
                                case 2:
                                    this.highlight(x,y, SWAMP);
                                    if (this.is(x+1,y,EARTH))
                                    {   this.highlight(x+1,y, EARTH);
                                        this.transform(x+1,y, SWAMP_RIGHT);                                  
                                        this.transform(x+1,y, SWAMP);  
                                    }
                                    else if (this.is(x+1,y,AIR))
                                    {   this.transform(x+1,y, SWAMP_RIGHT);
                                        this.transform(x+1,y, DROP);                                 
                                    }
                                    break;
                                case 3:
                                    this.highlight(x,y,SWAMP);
                                    if (this.is(x,y+1,EARTH))
                                    {   this.highlight(x,y+1, EARTH);
                                        this.transform(x,y+1, SWAMP_DOWN);
                                        this.transform(x,y+1, SWAMP);
                                    }
                                    else if (this.is(x,y+1,AIR))
                                    {   this.transform(x,y+1, DROP);                                 
                                    }
                                    break;
                                
                            }
                        }
                        break;
                        
                    case DROP:
                        if (!this.is_hit_by_non_bomb(x,y+1, DROP))
                        {   if (this.is(x,y+1,AIR))
                            {   this.move(x,y,0,1,DROP);
                            }
                            else if (this.is(x,y+1,ACID))
                            {   this.move(x,y,0,1,DROP);
                                this.transform(x,y+1,ACID);                          
                            }
                            else
                            {   this.transform(x,y, SWAMP);
                            }
                        }
                        break;                      
                        
                    case BUGLEFT:
                    case BUGLEFT_FIXED:
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x-1,y))
                        {   this.explode3x3(x,y, Logic.DEBRIS_NOTHING);
                        }                       
                        else if (this.is(x,y+1,AIR) && this.is(x,y,BUGLEFT)) 
                        {   this.transform(x,y,BUGDOWN_FIXED);
                        }
                        else if (!this.is(x-1,y,AIR)) 
                        {   this.transform(x,y, BUGUP);
                        }
                        else 
                        {   this.move(x,y,-1,0,BUGLEFT);
                        }
                        break;
                    }
                    case BUGUP:
                    case BUGUP_FIXED:  
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x,y-1))
                        {   this.explode3x3(x,y, Logic.DEBRIS_NOTHING);
                        }                       
                        else if (this.is(x-1,y,AIR) && this.is(x,y,BUGUP)) 
                        {   this.transform(x,y,BUGLEFT_FIXED);
                        } 
                        else if (!this.is(x,y-1,AIR)) 
                        {   this.transform(x,y,BUGRIGHT);
                        }
                        else
                        {   this.move(x,y,0,-1, BUGUP);
                        }
                        break;
                    }
                    case BUGRIGHT:
                    case BUGRIGHT_FIXED:
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x+1,y))
                        {   this.explode3x3(x,y, Logic.DEBRIS_NOTHING);
                        }                       
                        else if (this.is(x,y-1,AIR) && this.is(x,y,BUGRIGHT)) 
                        {   this.transform(x,y,BUGUP_FIXED);
                        }
                        else if (!this.is(x+1,y,AIR)) 
                        {   this.transform(x,y, BUGDOWN);
                        }
                        else 
                        {   this.move(x,y, 1,0, BUGRIGHT);
                        }   
                        break;
                    }
                    case BUGDOWN:
                    case BUGDOWN_FIXED:
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x,y+1))
                        {   this.explode3x3(x,y, Logic.DEBRIS_NOTHING);
                        }                       
                        else if (this.is(x+1,y,AIR) && this.is(x,y,BUGDOWN)) 
                        {   this.transform(x,y, BUGRIGHT_FIXED);
                        }
                        else if (!this.is(x,y+1,AIR)) 
                        {   this.transform(x,y,BUGLEFT);
                        }
                        else                        
                        {   this.move(x,y, 0,1,BUGDOWN);
                        }
                        break;
                    }   
                    case LORRYLEFT:
                    case LORRYLEFT_FIXED:
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x-1,y))
                        {   this.explode3x3(x,y, Logic.DEBRIS_EMERALDS);
                        }                       
                        else if (this.is(x,y-1,AIR) && this.is(x,y,LORRYLEFT)) 
                        {   this.transform(x,y, LORRYUP_FIXED);
                        } 
                        else if (!this.is(x-1,y,AIR)) 
                        {   this.transform(x,y,LORRYDOWN);
                        } 
                        else 
                        {   this.move(x,y,-1,0,LORRYLEFT);
                        }
                        break;
                    }
                    case LORRYUP:
                    case LORRYUP_FIXED:  
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x,y-1))
                        {   this.explode3x3(x,y, Logic.DEBRIS_EMERALDS);
                        }
                        else if (this.is(x+1,y,AIR) && this.is(x,y,LORRYUP)) 
                        {   this.transform(x,y, LORRYRIGHT_FIXED);
                        } 
                        else if (!this.is(x,y-1,AIR)) 
                        {   this.transform(x,y, LORRYLEFT);
                        } 
                        else 
                        {   this.move(x,y,0,-1,LORRYUP);
                        }
                        break;
                    }
                    case LORRYRIGHT:
                    case LORRYRIGHT_FIXED:
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x+1,y))
                        {   this.explode3x3(x,y, Logic.DEBRIS_EMERALDS);
                        }                                                   
                        else if (this.is(x,y+1,AIR) && this.is(x,y,LORRYRIGHT)) 
                        {   this.transform(x,y, LORRYDOWN_FIXED);
                        }
                        else if (!this.is(x+1,y,AIR)) 
                        {   this.transform(x,y, LORRYUP);
                        } 
                        else 
                        {   this.move(x,y, 1,0, LORRYRIGHT);
                        }                       
                        break;
                    }
                    case LORRYDOWN:
                    case LORRYDOWN_FIXED:
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x,y+1))
                        {   this.explode3x3(x,y, Logic.DEBRIS_EMERALDS);
                        }                                                   
                        else if (this.is(x-1,y,AIR) && this.is(x,y,LORRYDOWN)) {
                            this.transform(x,y,LORRYLEFT_FIXED);
                        } 
                        else if (!this.is(x,y+1,AIR)) {
                            this.transform(x,y, LORRYRIGHT);
                        } 
                        else
                        {   this.move(x,y, 0,1, LORRYDOWN);
                        }
                        break;
                    }

                    case YAMYAM:
                    {   if (this.is_neardestruct_target(x,y)) 
                        {   this.explode3x3(x,y, Logic.DEBRIS_YAMYAM);
                        }
                        else
                        {   randomseed = this.nextrandomseed(randomseed);
                            switch (randomseed % 4)
                            {   case 0: 
                                {   if (this.is(x-1,y,AIR) || this.is(x-1,y,SAPPHIRE)) { this.transform(x,y, YAMYAMLEFT); }
                                    break;
                                }
                                case 1:
                                {   if (this.is(x+1,y,AIR) || this.is(x+1,y,SAPPHIRE)) { this.transform(x,y, YAMYAMRIGHT); }
                                    break;
                                }
                                case 2:  
                                {   if (this.is(x,y-1,AIR) || this.is(x,y-1,SAPPHIRE)) { this.transform(x,y, YAMYAMUP); }
                                    break;
                                }
                                case 3:
                                {   if (this.is(x,y+1,AIR) || this.is(x,y+1,SAPPHIRE)) { this.transform(x,y, YAMYAMDOWN); }
                                    break;
                                }
                            }
                            if (this.is(x,y,YAMYAM)) { this.highlight(x,y, YAMYAM); }
                        }
                        break;
                    }                        
                    case YAMYAMLEFT:
                    case YAMYAMRIGHT:
                    case YAMYAMUP:
                    case YAMYAMDOWN:
                    {   var dx = (piece==YAMYAMLEFT) ? -1 : (piece==YAMYAMRIGHT) ? 1 : 0;
                        var dy = (piece==YAMYAMUP) ? -1 : (piece==YAMYAMDOWN) ? 1 : 0;                        
                        if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x+dx,y+dy)) 
                        {   this.explode3x3(x,y, Logic.DEBRIS_YAMYAM);
                        }
                        else if (this.is(x+dx,y+dy,AIR))
                        {   this.move(x,y, dx,dy, piece);
                        }
                        else if (this.is(x+dx,y+dy,SAPPHIRE))
                        {   this.transform (x+dx,y+dy, AIR);
                            this.highlight(x,y, piece);
                            this.changecounter(CTR_EMERALDSTOOMUCH, -2); 
                        }
                        else if (this.is(x+dx,y+dy,CITRINE))
                        {   this.transform (x+dx,y+dy, AIR);
                            this.highlight(x,y, piece);
                            this.changecounter(CTR_EMERALDSTOOMUCH, -3); 
                        }
                        else
                        {   this.transform(x,y,YAMYAM); 
                        }
                        break;                      
                    }
                    
                    case ROBOT:
                    {   var sp = this.level.getRobotSpeed();
                        if (sp>0)
                        {   if (sp>1) { randomseed = this.nextrandomseed(randomseed); }
                            if ((randomseed % sp)==0)                    
                            { // determine position of nearest player
                                var nearx = 1000;
                                var neary = 1000;
                                for (var i=0; i<this.getNumberOfPlayers(); i++)
                                {   var px = this.countersatbeginofturn[CTR_MANPOSX1+i];       
                                    var py = this.countersatbeginofturn[CTR_MANPOSY1+i];
                                    if (Math.abs(px-x)+Math.abs(py-y) < Math.abs(nearx-x)+Math.abs(neary-y))
                                    {   nearx = px;
                                        neary = py;
                                    }
                                }
                                // determine direction to let robot walk
                                var dirx = 0;
                                var diry = 0;
                                var secdirx = 0;
                                var secdiry = 0;
                                if (Math.abs(neary-y)>Math.abs(nearx-x))
                                {   diry = neary<y ? -1 : 1;  // primary direction
                                    secdirx = nearx<x ? -1 : (nearx>x ? 1 : 0);                         
                                }
                                else if (nearx!=x)
                                {   dirx = nearx<x ? -1 : 1;                    
                                    secdiry = neary<y ? -1 : (neary>y ? 1 : 0);     
                                }
                                if (dirx!=0 || diry!=0)
                                {   if (this.is_player_piece_at(x+dirx,y+diry)) 
                                    {   this.move (x,y, dirx,diry, ROBOT);
                                        this.transform (x+dirx,y+diry, EXPLODE1_AIR);
                                    }
                                    else if (this.is(x+dirx,y+diry,AIR) && !this.hasmoved(x+dirx,y+diry))
                                    {   this.move (x,y,dirx,diry, ROBOT);
                                    }
                                    else if (this.is(x+secdirx,y+secdiry,AIR) && !this.hasmoved(x+secdirx,y+secdiry))
                                    {   this.move (x,y, secdirx,secdiry, ROBOT);
                                    }
                                }
                            }
                        }
                        break;
                    }   
                    case ELEVATOR:
                    {   var lpiece = this.piece(x,y-1);
                        if 
                        (   lpiece==EMERALD || lpiece==SAPPHIRE || lpiece==CITRINE 
                            || lpiece==RUBY || lpiece==BAG || lpiece==ROCK || lpiece==BOMB
                        )
                        {   if (!this.hasmoved(x,y-1) && this.is(x,y-2,AIR) )
                            {   this.move (x,y-1, 0,-1, lpiece);
                                this.move (x,y, 0,-1, this.piece(x,y));
                            }
                        }
                        else if 
                        (   lpiece==EMERALD_FALLING || lpiece==SAPPHIRE_FALLING || lpiece==CITRINE_FALLING 
                            || lpiece==RUBY_FALLING || lpiece==BAG_FALLING || 
                            lpiece==BOMB_FALLING || lpiece==BAG_OPENING || lpiece==SAPPHIRE_BREAKING
                        )
                        {   // do not move down
                        }
                        else if (this.is(x,y+1,AIR))
                        {   this.move (x,y, 0,1, this.piece(x,y));
                        }
                        break;
                    }
                        
                    case DOOR_OPENED:
                        if (this.isSolved() && this.timeSinceAllExited()>1)
                        {   this.transform(x,y,DOOR_CLOSED);
                        }
                        break;
                        
                        // various incarnations of the gun that fire in proper sequence
                    case GUN0:
                        if (this.turnsdone%4 == 0)
                        {   this.add_laser_beam(x,y-1, 0,-1);                            
                            this.highlight(x,y,GUN0);
                        }                       
                        break;
                    case GUN1:
                        if (this.turnsdone%4 == 1)
                        {   this.add_laser_beam(x,y-1, 0,-1);                            
                            this.highlight(x,y,GUN1);
                        }
                        break;
                    case GUN2:
                        if (this.turnsdone%4 == 2)
                        {   this.add_laser_beam(x,y-1, 0,-1);                            
                            this.highlight(x,y,GUN2);
                        }
                        break;
                    case GUN3:
                        if (this.turnsdone%4 == 3)
                        {   this.add_laser_beam(x,y-1, 0,-1);                            
                            this.highlight(x,y,GUN3);
                        }
                        break;
                        
                    case BOMB_EXPLODE:
                        this.explode3x3(x,y, Logic.DEBRIS_NOTHING);
                        break;
                    case TIMEBOMB_EXPLODE:
                        this.explode3x3(x,y, Logic.DEBRIS_NOTHING);
                        break;
                    case BUG_EXPLODE:
                        this.explode3x3(x,y, Logic.DEBRIS_NOTHING);
                        break;
                    case LORRY_EXPLODE:
                        this.explode3x3(x,y, Logic.DEBRIS_EMERALDS);
                        break;
                    case YAMYAM_EXPLODE:
                        this.explode3x3(x,y, Logic.DEBRIS_YAMYAM);
                        break;
                    case BIGBOMB_EXPLODE:
                        this.explode5x5(x,y, EXPLODE1_TNT, EXPLODE1_TNT, EXPLODE1_AIR);
                        break;
                        
                    case EXPLODE1_AIR:
                        this.transform(x,y, EXPLODE2_AIR);
                        break;
                    case EXPLODE2_AIR:
                        this.transform(x,y, EXPLODE3_AIR);
                        break;
                    case EXPLODE3_AIR:
                        this.transform(x,y, EXPLODE4_AIR);
                        break;
                    case EXPLODE4_AIR:
                        this.transform(x,y, AIR);
                        break;
                    case EXPLODE1_TNT:
                        this.transform(x,y, EXPLODE2_TNT);
                        break;
                    case EXPLODE2_TNT:
                        this.transform(x,y, EXPLODE3_TNT);
                        break;
                    case EXPLODE3_TNT:
                        this.transform(x,y, EXPLODE4_TNT);
                        break;
                    case EXPLODE4_TNT:
                        this.transform(x,y, AIR);
                        break;                        
                    case EXPLODE1_EMERALD:
                        this.transform(x,y, EXPLODE2_EMERALD);
                        break;
                    case EXPLODE2_EMERALD:
                        this.transform(x,y, EXPLODE3_EMERALD);
                        break;
                    case EXPLODE3_EMERALD:
                        this.transform(x,y, EXPLODE4_EMERALD);
                        break;
                    case EXPLODE4_EMERALD:
                        this.transform(x,y, EMERALD);
                        break;
                    case EXPLODE1_SAPPHIRE:
                        this.transform(x,y, EXPLODE2_SAPPHIRE);
                        break;
                    case EXPLODE2_SAPPHIRE:
                        this.transform(x,y, EXPLODE3_SAPPHIRE);
                        break;
                    case EXPLODE3_SAPPHIRE:
                        this.transform(x,y, EXPLODE4_SAPPHIRE);
                        break;
                    case EXPLODE4_SAPPHIRE:
                        this.transform(x,y, SAPPHIRE);
                        break;
                    case EXPLODE1_BAG:
                        this.transform(x,y, EXPLODE2_BAG);
                        break;
                    case EXPLODE2_BAG:
                        this.transform(x,y, EXPLODE3_BAG);
                        break;
                    case EXPLODE3_BAG:
                        this.transform(x,y, EXPLODE4_BAG);
                        break;
                    case EXPLODE4_BAG:
                        this.transform(x,y, BAG);
                        break;
                    case EXPLODE1_YAMYAM0:
                        this.transform(x,y, EXPLODE2_YAMYAM0);
                        break;
                    case EXPLODE2_YAMYAM0:
                        this.transform(x,y, EXPLODE3_YAMYAM0);
                        break;
                    case EXPLODE3_YAMYAM0:
                        this.transform(x,y, EXPLODE4_YAMYAM0);
                        break;
                    case EXPLODE4_YAMYAM0:
                        this.transform(x,y, this.level.yamyamremainders[0]);
                        break;
                    case EXPLODE1_YAMYAM1:
                        this.transform(x,y, EXPLODE2_YAMYAM1);
                        break;
                    case EXPLODE2_YAMYAM1:
                        this.transform(x,y, EXPLODE3_YAMYAM1);
                        break;
                    case EXPLODE3_YAMYAM1:
                        this.transform(x,y, EXPLODE4_YAMYAM1);
                        break;
                    case EXPLODE4_YAMYAM1:
                        this.transform(x,y, this.level.yamyamremainders[1]);
                        break;
                    case EXPLODE1_YAMYAM2:
                        this.transform(x,y, EXPLODE2_YAMYAM2);
                        break;
                    case EXPLODE2_YAMYAM2:
                        this.transform(x,y, EXPLODE3_YAMYAM2);
                        break;
                    case EXPLODE3_YAMYAM2:
                        this.transform(x,y, EXPLODE4_YAMYAM2);
                        break;
                    case EXPLODE4_YAMYAM2:
                        this.transform(x,y, this.level.yamyamremainders[2]);
                        break;
                    case EXPLODE1_YAMYAM3:
                        this.transform(x,y, EXPLODE2_YAMYAM3);
                        break;
                    case EXPLODE2_YAMYAM3:
                        this.transform(x,y, EXPLODE3_YAMYAM3);
                        break;
                    case EXPLODE3_YAMYAM3:
                        this.transform(x,y, EXPLODE4_YAMYAM3);
                        break;
                    case EXPLODE4_YAMYAM3:
                        this.transform(x,y, this.level.yamyamremainders[3]);
                        break;
                    case EXPLODE1_YAMYAM4:
                        this.transform(x,y, EXPLODE2_YAMYAM4);
                        break;
                    case EXPLODE2_YAMYAM4:
                        this.transform(x,y, EXPLODE3_YAMYAM4);
                        break;
                    case EXPLODE3_YAMYAM4:
                        this.transform(x,y, EXPLODE4_YAMYAM4);
                        break;
                    case EXPLODE4_YAMYAM4:
                        this.transform(x,y, this.level.yamyamremainders[4]);
                        break;
                    case EXPLODE1_YAMYAM5:
                        this.transform(x,y, EXPLODE2_YAMYAM5);
                        break;
                    case EXPLODE2_YAMYAM5:
                        this.transform(x,y, EXPLODE3_YAMYAM5);
                        break;
                    case EXPLODE3_YAMYAM5:
                        this.transform(x,y, EXPLODE4_YAMYAM5);
                        break;
                    case EXPLODE4_YAMYAM5:
                        this.transform(x,y, this.level.yamyamremainders[5]);
                        break;
                    case EXPLODE1_YAMYAM6:
                        this.transform(x,y, EXPLODE2_YAMYAM6);
                        break;
                    case EXPLODE2_YAMYAM6:
                        this.transform(x,y, EXPLODE3_YAMYAM6);
                        break;
                    case EXPLODE3_YAMYAM6:
                        this.transform(x,y, EXPLODE4_YAMYAM6);
                        break;
                    case EXPLODE4_YAMYAM6:
                        this.transform(x,y, this.level.yamyamremainders[6]);
                        break;
                    case EXPLODE1_YAMYAM7:
                        this.transform(x,y, EXPLODE2_YAMYAM7);
                        break;
                    case EXPLODE2_YAMYAM7:
                        this.transform(x,y, EXPLODE3_YAMYAM7);
                        break;
                    case EXPLODE3_YAMYAM7:
                        this.transform(x,y, EXPLODE4_YAMYAM7);
                        break;
                    case EXPLODE4_YAMYAM7:
                        this.transform(x,y, this.level.yamyamremainders[7]);
                        break;
                    case EXPLODE1_YAMYAM8:
                        this.transform(x,y, EXPLODE2_YAMYAM8);
                        break;
                    case EXPLODE2_YAMYAM8:
                        this.transform(x,y, EXPLODE3_YAMYAM8);
                        break;
                    case EXPLODE3_YAMYAM8:
                        this.transform(x,y, EXPLODE4_YAMYAM8);
                        break;
                    case EXPLODE4_YAMYAM8:
                        this.transform(x,y, this.level.yamyamremainders[8]);
                        break;

                    case ACTIVEBOMB5:
                        this.transform(x,y, ACTIVEBOMB4);
                        break;
                    case ACTIVEBOMB4:
                        this.transform(x,y, ACTIVEBOMB3);
                        break;
                    case ACTIVEBOMB3:
                        this.transform(x,y, ACTIVEBOMB2);
                        break;
                    case ACTIVEBOMB2:
                        this.transform(x,y, ACTIVEBOMB1);
                        break;
                    case ACTIVEBOMB1:
                        this.transform(x,y, ACTIVEBOMB0);
                        break;
                    case ACTIVEBOMB0:
                        this.explode3x3(x,y, Logic.DEBRIS_NOTHING);
                        break;                        
                }           
            }
        }
        
        // if the random seed got modified during the logic, need to store it back to the counters array
        if (randomseed != this.counters[CTR_RANDOMSEED])
        {   this.changecounter(CTR_RANDOMSEED, randomseed-this.counters[CTR_RANDOMSEED]);
        }
};
    
Logic.prototype.explode3x3 = function(x, y, debris)
{    
        this.transform(x,y, debris[4]);
        this.catch_in_explosion(x-1,y-1, debris[0], false, 0,0);
        this.catch_in_explosion(x,y-1,   debris[1], false, 0,-1);
        this.catch_in_explosion(x+1,y-1, debris[2], false, 0,0);
        this.catch_in_explosion(x-1,y,   debris[3], false, -1,0);
        this.catch_in_explosion(x+1,y,   debris[5], false, 1,0);
        this.catch_in_explosion(x-1,y+1, debris[6], false, 0,0);
        this.catch_in_explosion(x,y+1,   debris[7], false, 0,1);
        this.catch_in_explosion(x+1,y+1, debris[8], false, 0,0);        
};
    
Logic.prototype.explode5x5 = function(x, y, centerdebris, outerdebris, rimdebris)
{
        this.transform(x,y, centerdebris);
        this.catch_in_explosion(x-1,y-1, outerdebris, true, 0,0);
        this.catch_in_explosion(x,y-1, outerdebris, true, 0,-1);
        this.catch_in_explosion(x+1,y-1, outerdebris, true, 0,0);
        this.catch_in_explosion(x-1,y, outerdebris, true, 0,-1);
        this.catch_in_explosion(x+1,y, outerdebris, true, 1,0);
        this.catch_in_explosion(x-1,y+1, outerdebris, true, 0,0);
        this.catch_in_explosion(x,y+1, outerdebris, true, 0,1);
        this.catch_in_explosion(x+1,y+1, outerdebris, true, 0,0);        
        this.catch_in_explosion(x-1,y-2, rimdebris, false, 0,0);
        this.catch_in_explosion(x,y-2, rimdebris, false, 0,-1);
        this.catch_in_explosion(x+1,y-2, rimdebris, false, 0,0);
        this.catch_in_explosion(x+2,y-1, rimdebris, false, 0,0);
        this.catch_in_explosion(x+2,y, rimdebris, false, 1,0);
        this.catch_in_explosion(x+2,y+1, rimdebris, false, 0,0);
        this.catch_in_explosion(x-2,y-1, rimdebris, false, 0,0);
        this.catch_in_explosion(x-2,y, rimdebris, false, 0,-1);
        this.catch_in_explosion(x-2,y+1, rimdebris, false, 0,0);
        this.catch_in_explosion(x-1,y+2, rimdebris, false, 0,0);
        this.catch_in_explosion(x,y+2, rimdebris, false, 0,1);
        this.catch_in_explosion(x+1,y+2, rimdebris, false, 0,0);
};
    
Logic.prototype.catch_in_explosion = function(x, y, debris, totalexplode, outwarddirectionx, outwarddirectiony)
{
        switch(this.piece(x,y))
        {   case OUTSIDE:               
                this.can_not_create_debris(debris);
                break;      // will not be blasted
            case WALL:
            case ROUNDWALL:
            case GLASSWALL:
                if (totalexplode)
                {   this.transform(x,y,debris);      // will only be blasted by big explosions
                }
                else
                {   this.can_not_create_debris(debris);
                }
                break;
            case TIMEBOMB_EXPLODE:
            case BOMB_EXPLODE:
            case BIGBOMB_EXPLODE:
            case YAMYAM_EXPLODE: 
            case LORRY_EXPLODE:
            case BUG_EXPLODE:
                this.can_not_create_debris(debris);      
                break;     // will explode anyway
            case BOMB:
            case BOMB_FALLING:
                this.can_not_create_debris(debris);
                this.transform(x,y, BOMB_EXPLODE);   // will explode in next turn
                break;
            case TIMEBOMB:
            case ACTIVEBOMB0:
            case ACTIVEBOMB1:
            case ACTIVEBOMB2:
            case ACTIVEBOMB3:
            case ACTIVEBOMB4:
            case ACTIVEBOMB5:   
                this.can_not_create_debris(debris);
                this.transform(x,y, TIMEBOMB_EXPLODE);   // will explode in next turn
                break;
            case TIMEBOMB10:
                this.can_not_create_debris(debris);
                this.transform(x,y, BIGBOMB_EXPLODE);  // will explode in next turn
                break;
            case BUGLEFT:
            case BUGLEFT_FIXED:
            case BUGRIGHT:
            case BUGRIGHT_FIXED:
            case BUGUP:
            case BUGUP_FIXED:
            case BUGDOWN:
            case BUGDOWN_FIXED:  
                this.can_not_create_debris(debris);
                this.transform(x,y, BUG_EXPLODE);     // will explode in next turn
                break;
            case LORRYLEFT:
            case LORRYLEFT_FIXED:
            case LORRYRIGHT:
            case LORRYRIGHT_FIXED:
            case LORRYUP:
            case LORRYUP_FIXED:
            case LORRYDOWN:
            case LORRYDOWN_FIXED:
                this.can_not_create_debris(debris);
                this.transform(x,y, LORRY_EXPLODE);        // will explode in next turn
                break;
            case YAMYAM:
            case YAMYAMLEFT:
            case YAMYAMRIGHT:
            case YAMYAMUP:
            case YAMYAMDOWN:    
                this.can_not_create_debris(debris);
                this.transform(x,y, YAMYAM_EXPLODE);         // will explode in next turn
                break;
            case WALLEMERALD:            
                this.can_not_create_debris(debris);
                this.transform(x,y, EXPLODE1_EMERALD);    // will turn into emerald after explosion
                break;          
            case BOX: 
                this.can_not_create_debris(debris);
                this.transform(x,y, EXPLODE1_BAG);       // will turn into bag after explosion
                break;
            case RUBY:
            case RUBY_FALLING:
                // add laser beam
                if (outwarddirectionx!=0 || outwarddirectiony!=0)
                {                   
                    this.highlight (x,y, outwarddirectionx>0
                                    ? LASER_R
                                    : outwarddirectionx<0
                                      ? LASER_L
                                      : (outwarddirectiony<0 ? LASER_U:LASER_D) );
                    this.add_laser_beam(x+outwarddirectionx,y+outwarddirectiony, outwarddirectionx,outwarddirectiony);               
                }
                if (totalexplode)           // additionally will be destroyed by big explosion
                {   this.transform(x,y, debris);
                }
                else
                {   this.can_not_create_debris(debris);
                }
                break;
            case EMERALD:
            case EMERALD_FALLING:
            case BAG:
            case BAG_FALLING:
                this.transform(x,y, debris);
                this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                break;
            case SAPPHIRE:
            case SAPPHIRE_FALLING:
                this.transform(x,y, debris);
                this.changecounter(CTR_EMERALDSTOOMUCH,-2);
                break;
            case CITRINE:
            case CITRINE_FALLING:
                this.transform(x,y, debris);
                this.changecounter(CTR_EMERALDSTOOMUCH,-3);
                break;
                
            case EXPLODE1_EMERALD:
            case EXPLODE2_EMERALD:
            case EXPLODE3_EMERALD:
            case EXPLODE4_EMERALD:
            case EXPLODE1_BAG:
            case EXPLODE2_BAG:
            case EXPLODE3_BAG:
            case EXPLODE4_BAG:
                this.transform(x,y, debris);
                this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                break;
            case EXPLODE1_SAPPHIRE:
            case EXPLODE2_SAPPHIRE:
            case EXPLODE3_SAPPHIRE:
            case EXPLODE4_SAPPHIRE:
                this.transform(x,y, debris);
                this.changecounter(CTR_EMERALDSTOOMUCH,-2);
                break;
                
            default:
                this.transform(x,y, debris);
                break;
         }
};
    
Logic.prototype.can_not_create_debris = function(debris)
{
        switch (debris)
        {   case EXPLODE1_EMERALD:
                this.changecounter(CTR_EMERALDSTOOMUCH, -1);
                break;  
            case EXPLODE1_SAPPHIRE:
                this.changecounter(CTR_EMERALDSTOOMUCH, -2);
                break;  
            case EXPLODE1_BAG:
                this.changecounter(CTR_EMERALDSTOOMUCH, -1);
                break;  
        }
};
    
    /**
     *  Return:  true, if the logic here takes over the falling object (the caller must not touch this object anymore)
     */ 
Logic.prototype.is_hit_by_non_bomb = function(x, y, bywhat)
{
        switch (this.piece(x,y))
        {   case BUGLEFT:
            case BUGLEFT_FIXED:
            case BUGRIGHT:
            case BUGRIGHT_FIXED:
            case BUGUP:
            case BUGUP_FIXED:
            case BUGDOWN:
            case BUGDOWN_FIXED:  
                this.transform(x,y, BUG_EXPLODE);
                return false;
            case LORRYLEFT:
            case LORRYLEFT_FIXED:
            case LORRYRIGHT:
            case LORRYRIGHT_FIXED:
            case LORRYUP:
            case LORRYUP_FIXED:
            case LORRYDOWN:
            case LORRYDOWN_FIXED:
                this.transform(x,y, LORRY_EXPLODE);
                return false;
            case YAMYAM:
            case YAMYAMLEFT:
            case YAMYAMRIGHT:
            case YAMYAMUP:
            case YAMYAMDOWN:    
                this.transform(x,y, YAMYAM_EXPLODE);
                return false;
//                this.move(x,y-1, 0,1, bywhat);
//                this.catch_in_explosion(x,y, EXPLODE1_RUBY, false, 0,0);           // yamyams get smashed by any falling object
//                return true;
            case BOMB:
            case BOMB_FALLING:
                this.transform(x,y, BOMB_EXPLODE);
                return false;
            case SAPPHIRE:
            case SAPPHIRE_FALLING:
                if (bywhat==ROCK_FALLING)      // sapphire gets crushed by a stone
                {   if (this.hasmoved(x,y))
                    {   this.changestate(x,y, SAPPHIRE_BREAKING);
                        this.changestate(x,y-1, ROCK);  // decelerate rock 
                    } 
                    else
                    {   this.changestate(x,y, SAPPHIRE_BREAKING);
                        this.transform(x,y, AIR);        
                        this.move(x,y-1, 0,1, ROCK);  // decelerate rock, but move down anyway
                    }
                    this.changecounter(CTR_EMERALDSTOOMUCH, -2); 
                    return true;
                }
                return false;
            case CITRINE:
            case CITRINE_FALLING:
                if (this.hasmoved(x,y))
                {   this.changestate(x,y, CITRINE_BREAKING);
                } 
                else
                {   this.changestate(x,y, CITRINE_BREAKING);
                    this.transform(x,y, AIR);    
                }
                this.changecounter(CTR_EMERALDSTOOMUCH, -3);                 
                return false;   
            case BAG:
                if (bywhat==ROCK_FALLING)      // bag gets opened by stone
                {   if (this.hasmoved(x,y))
                    {   this.changestate(x,y, BAG_OPENING);
                    } 
                    else
                    {   this.changestate(x,y, BAG_OPENING);
                        this.transform(x,y, EMERALD);
                    }
                    this.changestate (x,y-1, ROCK);
                    return true;
                }
                return false;
            case BAG_FALLING:
                if (bywhat==ROCK_FALLING)       // when a falling rock tries to open a falling bag, this must not happen right now, but 
                                                // the rock keeps falling for an additional turn and tries again
                {   return true;
                }
                return false;
            case ROBOT:
                this.move(x,y-1, 0,1, bywhat);
                this.catch_in_explosion(x,y, EXPLODE1_AIR, false, 0,0);           // robots get smashed by any falling object
                return true;
            default:
                if (this.is_player_piece_at(x,y))
                {   this.move(x,y-1, 0,1, bywhat);
                    this.catch_in_explosion(x,y, EXPLODE1_AIR, false, 0,0);       // players get smashed by any falling object
                    return true;
                }
                return false;
        }                
};
    
Logic.prototype.is_neardestruct_target = function (x, y) 
{
        var pi = this.piece(x,y-1);
        var wpp;
        
        // check presence of player/enemies on directly adjacent square
        var player0adjacent = false;
        var player1adjacent = false;
        if (pi==SWAMP)
        {   return true;
        }
        if ((wpp=this.whose_player_piece(pi))>=0)
        {   if (wpp==0) player0adjacent = true;
            else        player1adjacent = true; 
        }
        pi = this.piece(x,y+1);
        if (pi==SWAMP)
        {   return true;
        }
        if ((wpp=this.whose_player_piece(pi))>=0)
        {   if (wpp==0) player0adjacent = true;
            else        player1adjacent = true; 
        }
        pi = this.piece(x-1,y);
        if (pi==SWAMP)
        {   return true;
        }
        if ((wpp=this.whose_player_piece(pi))>=0)
        {   if (wpp==0) player0adjacent = true;
            else        player1adjacent = true; 
        }
        pi = this.piece(x+1,y);
        if (pi==SWAMP)
        {   return true;
        }
        if ((wpp=this.whose_player_piece(pi))>=0)
        {   if (wpp==0) player0adjacent = true;
            else        player1adjacent = true; 
        }

        // check presence of player on diagonally adjacent square
        var player0diagonally = false;
        var player1diagonally = false;      
        if ((wpp=this.whose_player_piece(this.piece(x-1,y-1)))>=0)
        {   if (wpp==0) player0diagonally = true;
            else        player1diagonally = true; 
        }
        if ((wpp=this.whose_player_piece(this.piece(x+1,y-1)))>=0)
        {   if (wpp==0) player0diagonally = true;
            else        player1diagonally = true; 
        }
        if ((wpp=this.whose_player_piece(this.piece(x-1,y+1)))>=0)
        {   if (wpp==0) player0diagonally = true;
            else        player1diagonally = true; 
        }
        if ((wpp=this.whose_player_piece(this.piece(x+1,y+1)))>=0)
        {   if (wpp==0) player0diagonally = true;
            else        player1diagonally = true; 
        }
        
        // trigger explosion only if player can indeed be reached
        if (player0diagonally || player0adjacent)
        {   // trigger is caused by a player being directly next to monster at begin of turn
            if (this.is_next_to_origin_position_of_player(x,y,0))
            {   return true;
            }
            // additionally trigger if player was already in reach before turn and is
            // now directly next to monster (player moved deeper in danger zone)
            if (player0adjacent && this.is_near_origin_position_of_player(x,y,0))
            {   return true;
            }           
        }

        // trigger explosion only if player can indeed be reached
        if (player1diagonally || player1adjacent)
        {   // trigger is caused by a player being directly next to monster at begin of turn
            if (this.is_next_to_origin_position_of_player(x,y,1))
            {   return true;
            }
            // additionally trigger if player was already in reach before turn and is
            // now directly next to monster (player moved deeper in danger zone)
            if (player1adjacent && this.is_near_origin_position_of_player(x,y,1))
            {   return true;
            }           
        }
        return false;
};
    
Logic.prototype.is_next_to_origin_position_of_player = function(x, y, playeridx)
{
        var px = this.countersatbeginofturn[CTR_MANPOSX1+playeridx];       
        var py = this.countersatbeginofturn[CTR_MANPOSY1+playeridx];
        return Math.abs(px-x) + Math.abs(py-y)==1;
};
    
Logic.prototype.is_near_origin_position_of_player = function(x, y, playeridx)
{
        var px = this.countersatbeginofturn[CTR_MANPOSX1+playeridx];       
        var py = this.countersatbeginofturn[CTR_MANPOSY1+playeridx];
        return Math.abs(px-x)<=1 && Math.abs(py-y)<=1;
};
    
Logic.prototype.add_laser_beam = function(x, y, dx, dy)
{
    var startx = x;
    var starty = y;
    var startdx = dx;
    var startdy = dy;
    var length=1000;
    
    while (length>0) 
    {   length--;

        switch (this.piece(x,y)) 
        {   case EMERALD:
            case EMERALD_FALLING:
            {   switch (dx+10*dy)
                {   case -10:                   
                        dx = -1;
                        dy = 0; 
                        this.highlight (x,y, LASER_BL);
                        break;
                    case 10:  
                        dx = 1;
                        dy = 0;
                        this.highlight (x,y, LASER_TR);
                        break;
                    case -1:
                        dx = 0;
                        dy = 1;
                        this.highlight (x,y, LASER_BR);
                        break;
                    case 1:
                        dx = 0;
                        dy = -1;
                        this.highlight (x,y, LASER_TL);  
                        break;              
                }
                break;
            }
            case SAPPHIRE:
            case SAPPHIRE_FALLING:
            {   switch (dx+10*dy)
                {   case -10:                   
                        dx = 1;
                        dy = 0; 
                        this.highlight (x,y, LASER_BR);
                        break;
                    case 10:  
                        dx = -1;
                        dy = 0;
                        this.highlight (x,y, LASER_TL);
                        break;
                    case -1:
                        dx = 0;
                        dy = -1;
                        this.highlight (x,y, LASER_TR);
                        break;
                    case 1:
                        dx = 0;
                        dy = 1;
                        this.highlight (x,y, LASER_BL);
                        break;                  
                }
                break;
            }
            case CITRINE:
            case CITRINE_FALLING:
            {   dx = -dx;
                dy = -dy;
                this.highlight (x,y, dx>0 ? LASER_R 
                                     : dx<0 ? LASER_L
                                            : dy<0 ? LASER_U : LASER_D);
                break;
            }
            case GUN0:
            case GUN1:
            case GUN2:
            case GUN3:
            {   // lasers go through guns in upward direction (to be able to stack guns)
                if (dy==-1)                                 
                {   this.highlight(x,y, this.piece(x,y));
                    this.highlight (x,y, LASER_V);
                }
                // guns are destroyed if hit in other directions
                else
                {   this.catch_in_explosion(x,y,EXPLODE1_AIR, false, 0,0);
                    return;
                }
                break;
            }
            case AIR:
            case BOMB_EXPLODE:
            case BIGBOMB_EXPLODE:
            case TIMEBOMB_EXPLODE:
            case LORRY_EXPLODE:
            case YAMYAM_EXPLODE:
            case BUG_EXPLODE:
            case EXPLODE1_AIR: 
            case EXPLODE2_AIR: 
            case EXPLODE3_AIR: 
            case EXPLODE4_AIR: 
            case EXPLODE1_EMERALD: 
            case EXPLODE2_EMERALD: 
            case EXPLODE3_EMERALD: 
            case EXPLODE4_EMERALD: 
            case EXPLODE1_SAPPHIRE: 
            case EXPLODE2_SAPPHIRE: 
            case EXPLODE3_SAPPHIRE: 
            case EXPLODE4_SAPPHIRE: 
            case EXPLODE1_BAG: 
            case EXPLODE2_BAG: 
            case EXPLODE3_BAG: 
            case EXPLODE4_BAG: 
            case EXPLODE1_YAMYAM0: 
            case EXPLODE2_YAMYAM0: 
            case EXPLODE3_YAMYAM0: 
            case EXPLODE4_YAMYAM0: 
            case EXPLODE1_YAMYAM1: 
            case EXPLODE2_YAMYAM1: 
            case EXPLODE3_YAMYAM1: 
            case EXPLODE4_YAMYAM1: 
            case EXPLODE1_YAMYAM2: 
            case EXPLODE2_YAMYAM2: 
            case EXPLODE3_YAMYAM2: 
            case EXPLODE4_YAMYAM2: 
            case EXPLODE1_YAMYAM3: 
            case EXPLODE2_YAMYAM3: 
            case EXPLODE3_YAMYAM3: 
            case EXPLODE4_YAMYAM3: 
            case EXPLODE1_YAMYAM4: 
            case EXPLODE2_YAMYAM4: 
            case EXPLODE3_YAMYAM4: 
            case EXPLODE4_YAMYAM4: 
            case EXPLODE1_YAMYAM5: 
            case EXPLODE2_YAMYAM5: 
            case EXPLODE3_YAMYAM5: 
            case EXPLODE4_YAMYAM5: 
            case EXPLODE1_YAMYAM6: 
            case EXPLODE2_YAMYAM6: 
            case EXPLODE3_YAMYAM6: 
            case EXPLODE4_YAMYAM6: 
            case EXPLODE1_YAMYAM7: 
            case EXPLODE2_YAMYAM7: 
            case EXPLODE3_YAMYAM7: 
            case EXPLODE4_YAMYAM7: 
            case EXPLODE1_YAMYAM8: 
            case EXPLODE2_YAMYAM8: 
            case EXPLODE3_YAMYAM8: 
            case EXPLODE4_YAMYAM8: 
            case RUBY:
            case RUBY_FALLING:
            case GLASSWALL:
            {   this.highlight (x,y, dx==0 ? LASER_V : LASER_H);
                break;
            }
            default:
            {   this.catch_in_explosion(x,y, EXPLODE1_AIR, false, 0,0);
                //this.highlight (x,y, dx==0 ? LASER_V : LASER_H);
                
                // this.highlight (x,y, dx>0 ? LASER_L 
                //    : dx<0 ? LASER_R
                //    : dy<0 ? LASER_D : LASER_U);
                return;
            }
        }

        // at last continues travel
        x+=dx;
        y+=dy;

        if (x==startx && y==starty && dx==startdx && dy==startdy)
        {   return;     // laser entered a cycle
        }       
    } 
};
    
    
Logic.prototype.playermove = function (player)
{
        // determine piece and position of this player
        var x = this.counters[CTR_MANPOSX1+player];
        var y = this.counters[CTR_MANPOSY1+player];
        
        // when player has exited or is killed, increase counter to allow gracefull game-end, but do not continue further actions
        if (this.counters[CTR_EXITED_PLAYER1+player]>0)
        {   this.changecounter(CTR_EXITED_PLAYER1+player, 1);
            return;     
        }
        if (this.counters[CTR_KILLED_PLAYER1+player]>0)
        {   this.changecounter(CTR_KILLED_PLAYER1+player, 1);
            return;
        }
        
        // when there is no longer a man-piece on the expected position, the player must have been killed in previous turn
        if (!this.is_player_piece_at(x,y))
        {   this.changecounter(CTR_KILLED_PLAYER1+player, 1);
            return;
        }
                
        // decode the possibilities and the direction
        var grab=false;
        var setbomb=false;
        var dx = 0;
        var dy = 0;
        var manpiece = this.piece(x,y);
        
        var m = this.walk.getMovement(player, this.turnsdone);
        switch (m)
        {   case Walk.MOVE_REST:
                //  revert player piece to the proper neutral state
                manpiece = (MAN1 + player); // switch (manpiece)
                if (!this.is(x,y,manpiece))
                {   this.transform(x,y,manpiece);
                }
                // add blink animation
                else
                {
                    this.visualrandomseed = this.nextrandomseed(this.visualrandomseed);
                    if ((this.visualrandomseed & 7) == 0)
                    {
                        this.highlight(x,y,manpiece);
                    }                               
                }
                return;
            case Walk.MOVE_LEFT:  dx = -1; manpiece=(MAN1_LEFT+player); break;
            case Walk.MOVE_RIGHT: dx = 1;  manpiece=(MAN1_RIGHT+player); break;
            case Walk.MOVE_UP:    dy = -1; manpiece=(MAN1_UP+player); break;
            case Walk.MOVE_DOWN:  dy = 1;  manpiece=(MAN1_DOWN+player); break;
            case Walk.GRAB_LEFT:  dx = -1;  grab = true;  manpiece=(MAN1_LEFT+player); break;
            case Walk.GRAB_RIGHT: dx = 1;  grab = true; manpiece=(MAN1_RIGHT+player); break;
            case Walk.GRAB_UP:    dy = -1; grab = true;  manpiece=(MAN1_UP+player); break;
            case Walk.GRAB_DOWN:  dy = 1;  grab = true;  manpiece=(MAN1_DOWN+player); break;
            case Walk.BOMB_LEFT:  dx = -1; setbomb = true; manpiece=(MAN1_LEFT+player); break;
            case Walk.BOMB_RIGHT: dx = 1; setbomb = true; manpiece=(MAN1_RIGHT+player); break;
            case Walk.BOMB_UP:    dy = -1; setbomb = true; manpiece=(MAN1_UP+player); break;
            case Walk.BOMB_DOWN:  dy = 1; setbomb = true; manpiece=(MAN1_DOWN+player); break;           
        }
        // disable bomb setting if not already in possession of a bomb (to prevent picking and placing a bomb in same turn)
        if (this.counters[CTR_TIMEBOMBS_PLAYER1+player]==0) 
        {   setbomb=false;
        }
        
        // try to grab/dig an object without moving 
        if (grab)
        {   if (this.is(x+dx,y+dy,EARTH))
            {   //manpiece += (MAN1_DIGLEFT - MAN1_LEFT);   // need to show different image when digging
                //// hint for display logic
                //switch (dx+10*dy)
                //{   case -10: { this.transform (x+dx,y+dy, EARTH_UP); break; }
                //    case 10: { this.transform (x+dx,y+dy, EARTH_DOWN); break; }
                //    case -1: { this.transform (x+dx,y+dy, EARTH_LEFT); break; }
                //    case 1: { this.transform (x+dx,y+dy, EARTH_RIGHT); break; }
                //}                
                this.transform(x+dx,y+dy,AIR);       
            }
            else
            {   this.trypickup(player, x+dx,y+dy);           
            }
        }
        // leave through exit
        else if (this.is(x+dx,y+dy,DOOR_OPENED))
        {
            this.highlight(x+dx,y+dy, DOOR_OPENED);
            this.move (x,y, dx,dy, manpiece);
            this.transform(x+dx,y+dy, DOOR_CLOSING);
            
            this.changecounter (CTR_MANPOSX1+player, dx);
            this.changecounter (CTR_MANPOSY1+player, dy);
            this.changecounter (CTR_EXITED_PLAYER1+player, 1);
            
            // optionally place a goodbye-bomb 
            var cidx = CTR_TIMEBOMBS_PLAYER1+player;
            if (setbomb && this.counters[cidx]>0)
            {   this.changecounter(cidx,-1);
                this.transform(x,y, ACTIVEBOMB5);
            }
        }
        // try to move to the given position, collecting things on the way, or pushing them aside
        else 
        {   
            // if something is in the way try to pick it up
            if (!this.is(x+dx,y+dy,AIR))
            {   this.trypickup(player, x+dx,y+dy);
            }
            // check if there still is something in the way that may be pushed or otherwise removed
            var otherpiece =  this.piece(x+dx,y+dy);
            switch (otherpiece)
            {   case EARTH:
                    // hint for the display logic
                    switch (dx+10*dy)
                    {   case -10: { this.transform (x+dx,y+dy, EARTH_UP); break; }
                        case 10: { this.transform (x+dx,y+dy, EARTH_DOWN); break; }
                        case -1: { this.transform (x+dx,y+dy, EARTH_LEFT); break; }
                        case 1: { this.transform (x+dx,y+dy, EARTH_RIGHT); break; }
                    }
                    // transform target to air
                    this.transform(x+dx,y+dy, AIR);
                    manpiece += (MAN1_DIGLEFT - MAN1_LEFT);   // need to show different image when digging
                    break;
                case ROCK:  
//                case ROCKEMERALD:
                case BAG:
                case BOMB:  
                    if (dx!=0 && dy==0)     // horizontal moves only
                    {   if (this.is(x+2*dx,y,AIR))
                        {   this.move (x+dx,y+dy, dx,dy,  otherpiece);
                            // check if need to change into falling variation immediately
                            if (this.would_fall_in_next_step(otherpiece, x+dx*2,y))
                            {   switch (otherpiece)
                                {   case ROCK:        this.changestate(x+2*dx,y, ROCK_FALLING); break; 
//                                    case ROCKEMERALD: this.changestate(x+2*dx,y, ROCKEMERALD_FALLING); break;
                                    case BAG:         this.changestate(x+2*dx,y, BAG_FALLING); break;
                                    case BOMB:        this.changestate(x+2*dx,y, BOMB_FALLING); break;
                                }
                            }                           
                        }
                        manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push
                    } 
                    break;
                case BOX:   
                case CUSHION:
                    if (this.is(x+2*dx,y+2*dy,AIR))
                    {   this.move (x+dx,y+dy, dx,dy, this.piece(x+dx,y+dy));
                    }
                    manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push 
                    break;
                case GUN0:
                    if (this.is(x+2*dx,y+2*dy,AIR)  &&  (this.turnsdone%4!=0))    // must refuse pushing if laser is about to shoot now
                    {   this.move (x+dx,y+dy, dx,dy, this.piece(x+dx,y+dy));                          
                    }
                    manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push 
                    break;              
                case GUN1:
                    if (this.is(x+2*dx,y+2*dy,AIR)  &&  (this.turnsdone%4!=1))    // must refuse pushing if laser is about to shoot now
                    {   this.move (x+dx,y+dy, dx,dy, this.piece(x+dx,y+dy));                          
                    }
                    manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push 
                    break;              
                case GUN2:
                    if (this.is(x+2*dx,y+2*dy,AIR)  &&  (this.turnsdone%4!=2))    // must refuse pushing if laser is about to shoot now
                    {   this.move (x+dx,y+dy, dx,dy, this.piece(x+dx,y+dy));                          
                    }
                    manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push 
                    break;              
                case GUN3:
                    if (this.is(x+2*dx,y+2*dy,AIR)  &&  (this.turnsdone%4!=3))    // must refuse pushing if laser is about to shoot now
                    {   this.move (x+dx,y+dy, dx,dy, this.piece(x+dx,y+dy));                          
                    }
                    manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push 
                    break;              
            }
            // if nothing is in the way then, do the movement and optionally leave bomb
            otherpiece =  this.piece(x+dx,y+dy);
            if (otherpiece==AIR)
            {   
                this.move (x,y, dx,dy, manpiece);
                this.changecounter (CTR_MANPOSX1+player, dx);
                this.changecounter (CTR_MANPOSY1+player, dy);
            }
            // check if player wants to go through one-time door
            else if (otherpiece==ONETIMEDOOR && this.is(x+2*dx,y+2*dy,AIR))
            {
                this.move (x,y, 2*dx,2*dy, manpiece);
                this.changecounter (CTR_MANPOSX1+player, 2*dx);
                this.changecounter (CTR_MANPOSY1+player, 2*dy);
                this.transform (x+dx,y+dy, ONETIMEDOOR_CLOSED);              
            }
            // check if player wants to go through a colored door
            else if ( (otherpiece==DOORRED || otherpiece==DOORGREEN
                    || otherpiece==DOORBLUE || otherpiece==DOORYELLOW)
                && this.is(x+2*dx,y+2*dy,AIR) && this.have_matching_key(player,otherpiece) )
            {
                this.move (x,y, 2*dx,2*dy, manpiece);
                this.changecounter (CTR_MANPOSX1+player, 2*dx);          
                this.changecounter (CTR_MANPOSY1+player, 2*dy);          
                this.highlight(x+dx,y+dy, otherpiece); 
            }
                
            // check if want to place a bomb at moving          
            var cidx = CTR_TIMEBOMBS_PLAYER1+player;
            if (setbomb && this.counters[cidx]>0 && this.is(x,y,AIR))
            {   this.changecounter(cidx,-1);
                this.transform(x,y, ACTIVEBOMB5);            
            }
        }
        
        // bring player piece to correct state if not already done
        x = this.counters[CTR_MANPOSX1+player];
        y = this.counters[CTR_MANPOSY1+player];
        if (!this.is(x,y,manpiece) && this.is_player_piece_at(x,y)) {
            this.transform(x,y,manpiece);
        }                   
};

Logic.prototype.trypickup = function(player, x, y)
{
        // cause necessary effect after picking up object
        switch (this.piece(x,y))
        {   case EMERALD:
                this.changecounter(CTR_EMERALDSCOLLECTED, 1);
                break;
            case SAPPHIRE:
                this.changecounter(CTR_EMERALDSCOLLECTED, 2);
                break;
            case CITRINE:
                this.changecounter(CTR_EMERALDSCOLLECTED, 3);
                break;
            case RUBY:  
                this.changecounter(CTR_EMERALDSCOLLECTED, 1);
                break;
            case TIMEBOMB:
                this.changecounter(CTR_TIMEBOMBS_PLAYER1+player, 1);
                break;
            case TIMEBOMB10:
                this.changecounter(CTR_TIMEBOMBS_PLAYER1+player, 10);
                break;
            case KEYRED:
                if ((this.counters[CTR_KEYS_PLAYER1+player]&0x01) == 0)
                {   this.changecounter(CTR_KEYS_PLAYER1+player, 0x01);
                }
                break;
            case KEYGREEN:
                if ((this.counters[CTR_KEYS_PLAYER1+player]&0x02) == 0)
                {   this.changecounter(CTR_KEYS_PLAYER1+player, 0x02);
                }
                break;
            case KEYBLUE:
                if ((this.counters[CTR_KEYS_PLAYER1+player]&0x04) == 0)
                {   this.changecounter(CTR_KEYS_PLAYER1+player, 0x04);
                }
                break;
            case KEYYELLOW:
                if ((this.counters[CTR_KEYS_PLAYER1+player]&0x08) == 0)
                {   this.changecounter(CTR_KEYS_PLAYER1+player, 0x08);
                }
                break;
            default:    // can not be picked - just keep object where it is
            {   return;
            }
        }
        // remove the object from the map
        this.transform (x,y,AIR);
};
    
    /**
     *  Simple implementation of a Fibonacci LFSR. This method computes the next value for the shift register
     *  given the current value. To work around the all-0 case, a 1 is injected instead.  
     */ 
Logic.prototype.nextrandomseed = function(seed)
{   
        // work-around for all-0 case
        if (seed==0)
        {   seed=1;
        }
        // calculate next bit from the current state
        for (var i=0; i<3; i++)
        {   var bit = ((seed>>15) ^ (seed>>13) ^ (seed>>12) ^ (seed>>10)) & 1;
            seed = ((seed << 1) ^ bit) & 0xffff;
        }
//System.out.println("seed ("+seed%4+")");
        return seed;
};
    

    // -------- queries to check for some conditions of the map -----------
Logic.prototype.piece = function(x, y)
{
        if (x<0 || x>=MAPWIDTH || y<0 || y>=MAPHEIGHT)
        {   return OUTSIDE;
        }
        return this.map[x+y*MAPWIDTH];
};
     
Logic.prototype.is = function(x, y, p)
{
        return this.piece(x,y)==p;
};
    
Logic.prototype.hasmoved = function(x,y)
{
        return this.movedflags[x+y*MAPWIDTH];
};
    
Logic.prototype.may_roll = function(x,y,isconvertible)
{
    var ground = this.piece(x,y+1);
	if (this.has_rounded_top(ground))
    {   if (this.is(x-1,y,AIR))
        {   var pl = this.piece(x-1,y+1);
            if (pl==AIR || pl==ACID || (isconvertible && pl==CONVERTER && this.is(x-1,y+2,AIR)))
            {   return -1;
            }
        }
        if (this.is(x+1,y,AIR))
        {   var pl = this.piece(x+1,y+1);
            if (pl==AIR || pl==ACID || (isconvertible && pl==CONVERTER && this.is(x+1,y+2,AIR)))
            {   return 1;
            }
        }
    }    
    return 0;
}

Logic.prototype.may_be_transported = function(x,y)
{
    var below = this.piece(x,y+1);
    var above = this.piece(x,y-1);
    if (below===CONVEYORLEFT || (above===CONVEYORRIGHT && below===ELEVATOR))
    {   if (this.is(x-1,y,AIR)) { return -1; }
    }
    else if (below===CONVEYORRIGHT || (above===CONVEYORLEFT && below===ELEVATOR))
    {   if (this.is(x+1,y,AIR)) { return 1; }
    }
    return 0;
}

Logic.prototype.has_rounded_top = function(piece)
{   
        switch (piece)
        {   case ROCK:
            case BAG:
            case BOMB:
            case ROUNDWALL:
            case ROUNDSTONEWALL:
            case DOOR:
            case DOOR_OPENED:
            case DOOR_CLOSING:
            case DOOR_CLOSED:
            case EMERALD:
            case SAPPHIRE:
            case CITRINE:
            case RUBY:
            case KEYBLUE:
            case KEYRED:
            case KEYGREEN:
            case KEYYELLOW:
            case CUSHION:   return true;
        }
        return false;
};

Logic.prototype.is_player_piece_at = function(x, y)
{   
     return this.whose_player_piece(this.piece(x,y))>=0;
};

Logic.prototype.whose_player_piece = function(tile)
{   
        switch (tile)
        {   case MAN1:
            case MAN1_LEFT:
            case MAN1_RIGHT:
            case MAN1_UP:
            case MAN1_DOWN:
            case MAN1_PUSHLEFT:
            case MAN1_PUSHRIGHT:
            case MAN1_PUSHUP:
            case MAN1_PUSHDOWN:
            case MAN1_DIGLEFT:
            case MAN1_DIGRIGHT:
            case MAN1_DIGUP:
            case MAN1_DIGDOWN:
                return 0;
            case MAN2:  
            case MAN2_LEFT:
            case MAN2_RIGHT:
            case MAN2_UP:
            case MAN2_DOWN:
            case MAN2_PUSHLEFT:
            case MAN2_PUSHRIGHT:                
            case MAN2_PUSHUP:
            case MAN2_PUSHDOWN:             
            case MAN2_DIGLEFT:
            case MAN2_DIGRIGHT:             
            case MAN2_DIGUP:
            case MAN2_DIGDOWN:              
                return 1;           
        }
        return -1;
};

Logic.prototype.would_fall_in_next_step = function(piece, x, y)
{
        switch (this.piece(x,y+1)) {
        case AIR:
        case ACID:     return true;
        }
        return false;
};

Logic.prototype.is_living = function(x, y)
{
        switch (this.piece(x,y))
        {   case BUGLEFT:
            case BUGLEFT_FIXED:
            case BUGRIGHT:
            case BUGRIGHT_FIXED:
            case BUGUP:
            case BUGUP_FIXED:
            case BUGDOWN:
            case BUGDOWN_FIXED:
            case LORRYLEFT: 
            case LORRYLEFT_FIXED:
            case LORRYRIGHT:
            case LORRYRIGHT_FIXED:
            case LORRYUP:
            case LORRYUP_FIXED:
            case LORRYDOWN:
            case LORRYDOWN_FIXED:
            case YAMYAMLEFT:
            case YAMYAMRIGHT:   
            case YAMYAMUP:
            case YAMYAMDOWN:
                return true;
        }
        return this.is_player_piece_at(x,y);
};

Logic.prototype.isVisiblyEquivalent = function(p1, p2)
{
        if (p1==ROCK || p1==ROCK_FALLING)
        {   return p2==ROCK || p2==ROCK_FALLING;
        }
        if (p1==EMERALD || p1==EMERALD_FALLING)
        {   return p2==EMERALD || p2==EMERALD_FALLING;
        }
        if (p1==CITRINE || p1==CITRINE_FALLING || p1==CITRINE_BREAKING)
        {   return p2==CITRINE || p2==CITRINE_FALLING || p2==CITRINE_BREAKING;
        }
        if (p1==SAPPHIRE || p1==SAPPHIRE_FALLING || p1==SAPPHIRE_BREAKING)
        {   return p2==SAPPHIRE || p2==SAPPHIRE_FALLING || p2==SAPPHIRE_BREAKING;
        }
        if (p1==BAG || p1==BAG_FALLING || p1==BAG_OPENING)
        {   return p2==BAG || p2==BAG_FALLING || p2==BAG_OPENING;
        }
        if (p1==RUBY || p1==RUBY_FALLING)
        {   return p2==RUBY || p2==RUBY_FALLING;
        }
        if (p1==BOMB || p1==BOMB_FALLING)
        {   return p2==BOMB || p2==BOMB_FALLING;
        }
        if ( p1==GUN0 || p1==GUN1 || p1==GUN2 || p1==GUN3)
        {   return p2==GUN0 || p2==GUN1 || p2==GUN2 || p2==GUN3;
        }
        return false;
};

Logic.prototype.have_matching_key = function(player, otherpiece)
{
        var kflags = this.counters[CTR_KEYS_PLAYER1+player];
    
        switch (otherpiece)
        {   case DOORRED:       return (kflags & 0x01) != 0;
            case DOORGREEN:     return (kflags & 0x02) != 0;
            case DOORBLUE:      return (kflags & 0x04) != 0;
            case DOORYELLOW:    return (kflags & 0x08) != 0;
        }
        return false;
};

Logic.prototype.man1_moves_toward_man2 = function()
{
        var x1 = this.counters[CTR_MANPOSX1];
        var y1 = this.counters[CTR_MANPOSY1];
        var x2 = this.counters[CTR_MANPOSX2];
        var y2 = this.counters[CTR_MANPOSY2];
        
        switch (this.walk.getMovement(0, this.turnsdone))
        {   case Walk.MOVE_LEFT: 
            case Walk.BOMB_LEFT:  
                return x2<x1;
            case Walk.MOVE_RIGHT:
            case Walk.BOMB_RIGHT:
                return x2>x1; 
            case Walk.MOVE_UP:    
            case Walk.BOMB_UP:
                return y2<y1;
            case Walk.MOVE_DOWN: 
            case Walk.BOMB_DOWN:  
                return y2>y1;
        }       
        return false; 
};
    
    
    
    // tries to undo the previous turn. this is done by popping the transactions
    // from the stack and inverting the effect of each one.
    // if the stacks runs before a STARTOFTURN - transaction could be found, this
    // method just returns false. The caller must then completely reset the 
    // game logic to clear things up. 
    // the position of the keep-location will be undefined in any case.
Logic.prototype.rollback = function()
{
        while (this.transactions.length>0)
        {
            var t = this.transactions.pop();
            if (t===OPCODE_STARTOFTURN) {
                this.turnsdone--;
                return true;
            }
            
            switch (t & OPCODE_MASK)
            {   case TRN_COUNTER:
                {   var index = (t>>20) & 0xff;
                    var increment = t & 0xfffff;
                    if (increment >= 0x80000) increment-=0x100000;
                    this.counters[index] -= increment;
                    break;
                }
                case TRN_TRANSFORM:
                case TRN_CHANGESTATE:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    break;
                }
                case TRN_MOVEDOWN:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+(y+1)*MAPWIDTH] = AIR;
                    break;
                }
                case TRN_MOVEUP:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+(y-1)*MAPWIDTH] = AIR;
                    break;
                }
                case TRN_MOVELEFT:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+y*MAPWIDTH-1] = AIR;
                    break;
                }
                case TRN_MOVERIGHT:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+y*MAPWIDTH+1] = AIR;
                    break;
                }
                case TRN_MOVEDOWN2:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+(y+2)*MAPWIDTH] = AIR;
                    break;
                }
                case TRN_MOVEUP2:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+(y-2)*MAPWIDTH] = AIR;
                    break;
                }
                case TRN_MOVELEFT2:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+y*MAPWIDTH-2] = AIR;
                    break;
                }
                case TRN_MOVERIGHT2:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+y*MAPWIDTH+2] = AIR;
                    break;
                }
                case TRN_HIGHLIGHT:
                {   break;      // nothing to do. highlights do not change state
                }
                default:
                {   throw Error("Transaction can not be undone: "+t);
                }
            }
        }
        return false;  // did not encounter the turn start marker - rollback failed
};
    
    
    //  ------ modifications of the map that cause one or more entries in the transaction table -----
    
Logic.prototype.changecounter = function(index, increment)   // index<=255, only increment by a signed 20-bit value
{
    if (increment!==0)
    {   this.counters[index] += increment;
        this.transactions.push (TRN_COUNTER | (index<<20) | (increment&0xfffff));
    }
};

Logic.prototype.transform = function(x, y, newpiece)
{
        var index = x+y*MAPWIDTH;
        var oldpiece = this.map[index];
        if (oldpiece != newpiece && this.isVisiblyEquivalent(oldpiece,newpiece) )
        {   throw new Error("Must not use transform for different but visibly equivalent pieces: "
                    +oldpiece+"->"+newpiece);
        }
        this.map[index] = newpiece;
        this.movedflags[index] = true;
        this.transactions.push (TRN_TRANSFORM | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
};

Logic.prototype.changestate = function(x, y, newpiece)
{
    var index = x+y*MAPWIDTH;
    var oldpiece = this.map[index];
    if (!this.isVisiblyEquivalent(oldpiece,newpiece) )
        {   throw new Error("Can not use changestate for not visibly equivalent pieces:" 
                +oldpiece_i+"->"+newpiece_i);
        }
    this.map[index] = newpiece;
    this.transactions.push (TRN_CHANGESTATE | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
};

Logic.prototype.highlight = function(x, y, highlightpiece)
{
    this.transactions.push (TRN_HIGHLIGHT | (x<<22) | (y<<16) | highlightpiece );
};

Logic.prototype.move = function(x, y, dx, dy, newpiece)
{
        // when space to move to is not empty - let disappear piece before
        if (!this.is(x+dx,y+dy,AIR))
        {   this.transform(x+dx,y+dy,AIR);
        }
        // move and transform piece on the way
        var index = x+y*MAPWIDTH;
        var index2 = x+dx + (y+dy)*MAPWIDTH;
        var oldpiece = this.map[index];
        this.map[index] = AIR;
        this.map[index2] = newpiece;     
        this.movedflags[index2] = true;
        
        // store what happened into transaction log
        switch (dx+10*dy)
        {   case 10:
            {   this.transactions.push (TRN_MOVEDOWN | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            case -10:
            {   this.transactions.push (TRN_MOVEUP | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            case -1:
            {   this.transactions.push (TRN_MOVELEFT | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            case 1:
            {   this.transactions.push (TRN_MOVERIGHT | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            case 20:
            {   this.transactions.push (TRN_MOVEDOWN2 | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            case -20:
            {   this.transactions.push (TRN_MOVEUP2 | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            case -2:
            {   this.transactions.push (TRN_MOVELEFT2 | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            case 2:
            {   this.transactions.push (TRN_MOVERIGHT2 | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            default:
                throw new Error("Move direction out of range: "+dx+","+dy);
        }
};    
    
    // --------- query methods to extract public game info ------
Logic.prototype.isKilled = function()
{
    return this.counters[CTR_KILLED_PLAYER1] + this.counters[CTR_KILLED_PLAYER2] > 0;
};

Logic.prototype.isSolved = function()
{
    return this.timeSinceAllExited()>0;
};
    
Logic.prototype.isOverForSomeTime = function()
{
    var killtimeout = 6;
    var wintimeout = 7;
    if (this.counters[CTR_KILLED_PLAYER1] > killtimeout) return true;
    if (this.counters[CTR_KILLED_PLAYER2] > killtimeout) return true;
    return this.timeSinceAllExited()>wintimeout;         
};
    
Logic.prototype.totalTimeForSolution = function()
{
    if (!this.isSolved()) return 0;
    return this.turnsdone - this.timeSinceAllExited() + 1;
};
    
Logic.prototype.timeSinceAllExited = function()
{
    if (this.getNumberOfPlayers()<=1)
    {   return this.counters[CTR_EXITED_PLAYER1];
    }
    else
    {   return Math.min(this.counters[CTR_EXITED_PLAYER1],this.counters[CTR_EXITED_PLAYER2]);
    }
};
    
Logic.prototype.getCounter = function(ctr)
{   
        return this.counters[ctr];
};
        
Logic.prototype.getPopulatedWidth = function()
{
    return this.level.datawidth;
};
        
Logic.prototype.getPopulatedHeight = function()
{
    return this.level.dataheight;
};

Logic.prototype.getNumberOfPlayers = function()
{
    return this.numberofplayers;
};

Logic.prototype.getTurnsInWalk = function()
{   
    return this.walk.getTurns();
};
    
//  public byte getPiece(int index)
//  {   return map[index];
//  }
//  public byte getPieceInPopulatedArea(int x, int y)
//  {
//      return map[1+x+(1+y)*MAPWIDTH];
//  }
    
Logic.prototype.getPlayerPositionX = function(idx)
{
    return this.counters[CTR_MANPOSX1+idx];
};

Logic.prototype.getPlayerPositionY = function(idx)
{
    return this.counters[CTR_MANPOSY1+idx];
};

//  public int calculateXInPopulatedArea(int pos)
//  {   
//      return (pos % MAPWIDTH)-1;
//  }
//  public int calculateYInPopulatedArea(int pos)
//  {   
//      return (pos / MAPWIDTH)-1;
//  }

Logic.prototype.getAnimationBufferSize = function()
{
    return this.transactions.length;
};

Logic.prototype.getFistAnimationOfTurn = function()
{
    for (var i=this.transactions.length-1; i>=0; i--)
    {   if (this.transactions[i]===OPCODE_STARTOFTURN) return i;
    }
    return 0;
};

Logic.prototype.getAnimation = function(idx)
{
    return this.transactions[idx];
};
    
Logic.prototype.getNumberOfEmeraldsStillNeeded = function()
{   return this.level.loot - this.counters[CTR_EMERALDSCOLLECTED];
};
    
Logic.prototype.canStillGetEnoughEmeralds = function()
{   
    return this.counters[CTR_EMERALDSTOOMUCH] >= 0;
};
    
Logic.prototype.getTurnsDone = function()
{   
    return this.turnsdone;
};
    
Logic.prototype.getCollectedKeys = function(player)
{       
    return this.counters[CTR_KEYS_PLAYER1+player];
};
    
Logic.prototype.getCollectedTimeBombs = function(player)
{   
    return this.counters[CTR_TIMEBOMBS_PLAYER1+player];
};
    
// ----------- for debug: print internal state of logic -----

// create array of string, holding everything relevant
Logic.prototype.extractState = function()     
{    
    var level = this.level;
    var s = [];
    s.push("TURN:" + this.turnsdone  + " "
          +"PLAYERS:" + this.numberofplayers + " "
          +"LOOT:" + this.level.getLoot() + " "
          +"SOLVED:" + this.isSolved() + " "
          +"COUNTERS:" + (this.counters.join(","))
          );    
    for (var y=0; y<level.getHeight(); y++)
    {   var line = [];
        for (var x=0; x<level.getWidth(); x++) {
            var piece = this.map[x+y*MAPWIDTH];
            if (piece>=32 && piece<=127) line.push(String.fromCharCode(piece));
            else                         line.push("~");
        }
        s.push(line.join(""));
    }
    return s;
};

Logic.prototype.printState = function()     
{
    var s = this.extractState();
    for (var i=0; i<s.length; i++) 
    {   console.log(s[i]);
    }
};

Logic.prototype.toString = function()
{
    return this.extractState().join("\n");
};

"use strict";
var Walk = function()
{
    this.buffer = null;
    this.randomseed = 0;
};

Walk.MOVE_REST  = 0;
Walk.MOVE_UP    = 1;
Walk.MOVE_DOWN  = 2;
Walk.MOVE_LEFT  = 3;
Walk.MOVE_RIGHT = 4;
Walk.GRAB_UP    = 5;
Walk.GRAB_DOWN  = 6;
Walk.GRAB_LEFT  = 7;
Walk.GRAB_RIGHT = 8;
Walk.BOMB_UP    = 9;
Walk.BOMB_DOWN  = 10;
Walk.BOMB_LEFT  = 11;
Walk.BOMB_RIGHT = 12;
    
Walk.prototype.$ = function(json)
{
    this.buffer = [];
    this.randomseed = 0;

    this.initialize(isInteger(json.randomseed) ? json.randomseed : 0);
    
    var a = json.moves;
    if (!Array.isArray(a)) a = [a];
    
    if (json.players === 2)     // having 2 moves for each turn
    {   for (var i=0; a && i<a.length; i++)
        {   var s = a[i];
            for (var j=0; s && s.constructor==String && j+1<s.length; j+=2)
            {   this.recordMovements(this.char2move(s.charCodeAt(j)), this.char2move(s.charCodeAt(j+1)));
            }
        }
    }
    else                            // only one move for each turn
    {   for (var i=0; a && i<a.length; i++)
        {   var s = a[i];
            for (var j=0; s && s.constructor==String && j<s.length; j++)
            {   this.recordMovement(this.char2move(s.charCodeAt(j)));
            }
        }
    }
    
    return this;
};
    
Walk.prototype.$original = function(original)
{
    this.buffer = original.buffer.slice();
    this.randomseed = original.randomseed;
    return this;
};

Walk.prototype.$randomseed = function(randomseed)
{
    this.buffer = [];
    this.randomseed = randomseed;
    return this;
};
    
Walk.prototype.toJSON = function()
{
    var hassecond = this.hasMovementsForSecondPlayer();
    var numturns = this.buffer.length;
    
    var a = [ ];
    var m = [ ];
    for (var i=0; i<numturns; i++)
    {   m.push(this.move2str(this.getMovement(0,i)));
        if (hassecond)
        {   m.push(this.move2str(this.getMovement(1,i)));
        }
        if (m.length>=40 || i===numturns-1) 
        {   a.push (m.join(""));
            m.length = 0;
        }
    }
    
    if (hassecond) 
    {   return {    randomseed: this.randomseed,
                    players:    2,
                    moves:      a                      
                };
    }
    else
    {   return {    randomseed: this.randomseed,
                    moves:      a                      
                };
    }
};
    
Walk.prototype.initialize = function(randomseed)
{
    this.randomseed = randomseed;
    this.buffer.length = 0;
};
    
Walk.prototype.getTurns = function()
{
    return this.buffer.length;
};
    
Walk.prototype.trimRecord = function(turns)
{    
    if (turns<this.buffer.length)
    {   this.buffer.length = turns;
    }
};
    
Walk.prototype.recordMovement = function(movement1)
{
    this.recordMovements(movement1, Walk.MOVE_REST);
};
    
Walk.prototype.recordMovements = function(movement1, movement2)
{
    this.buffer.push(movement1 | (movement2<<4));
};

Walk.prototype.getRandomSeed = function()
{
    return this.randomseed;
};
    
Walk.prototype.getMovement = function(player, turn)
{
    if (turn<0 || turn>=this.buffer.length)
    {   return Walk.MOVE_REST;
    }
    return (this.buffer[turn] >> (player*4)) & 0xf;
};
    
Walk.prototype.currentNumberOfCompleteTurns = function()
{
    return this.buffer.length;
};
    
Walk.prototype.hasMovementsForSecondPlayer = function()
{
    for (var i=0; i<this.buffer.length; i++)
    {   if ( ((this.buffer[i]>>4) & 0xf) != Walk.MOVE_REST)
        {   return true;
        }
    }
    return false;
};
    
Walk.prototype.char2move = function(c)
{
    switch (c)
    {   default:  return Walk.MOVE_REST;
        case 116: return Walk.MOVE_UP;      // 't'
        case 98:  return Walk.MOVE_DOWN;    // 'b'
        case 108: return Walk.MOVE_LEFT;    // 'l'
        case 114: return Walk.MOVE_RIGHT;   // 'r'
        case 84:  return Walk.GRAB_UP;      // 'T'
        case 66:  return Walk.GRAB_DOWN;    // 'B'
        case 76:  return Walk.GRAB_LEFT;     // 'L'
        case 82:  return Walk.GRAB_RIGHT;    // 'R'
        case 117: return Walk.BOMB_UP;      // 'u'
        case 99:  return Walk.BOMB_DOWN;     // 'c'
        case 109: return Walk.BOMB_LEFT;    // 'm'
        case 115: return Walk.BOMB_RIGHT;   // 's'
    }
}

Walk.prototype.move2str = function(m)
{
    return ".tblrTBLRucms".substring(m,m+1);
};


"use strict";
var Matrix = function()
{
};

/** Temporary memory for operations that need temporary matrix data. */
//Matrix.sTemp = new Array(32);

    /**
     * Multiplies two 4x4 matrices together and stores the result in a third 4x4
     * matrix. In matrix notation: result = lhs x rhs. Due to the way
     * matrix multiplication works, the result matrix will have the same
     * effect as first multiplying by the rhs matrix, then multiplying by
     * the lhs matrix. This is the opposite of what you might expect.
     * <p>
     * The same float array may be passed for result, lhs, and/or rhs. However,
     * the result element values are undefined if the result elements overlap
     * either the lhs or rhs elements.
     *
     * @param result The float array that holds the result.
     * @param resultOffset The offset into the result array where the result is
     *        stored.
     * @param lhs The float array that holds the left-hand-side matrix.
     * @param lhsOffset The offset into the lhs array where the lhs is stored
     * @param rhs The float array that holds the right-hand-side matrix.
     * @param rhsOffset The offset into the rhs array where the rhs is stored.
     *
     * @throws IllegalArgumentException if result, lhs, or rhs are null, or if
     * resultOffset + 16 > result.length or lhsOffset + 16 > lhs.length or
     * rhsOffset + 16 > rhs.length.
     */
/*     
Matrix.multiplyMM(var result, var resultOffset, var lhs, var lhsOffset, var rhs, var rhsOffset)
{
    var sTemp = Matrix.sTemp;
    for (var i = 0; i < 4; i++) {
                var rhs_i0 = rhs[rhsOffset + 4*i];
                var ri0 = lhs[lhsOffset + 0 ] * rhs_i0;
                var ri1 = lhs[lhsOffset + 1 ] * rhs_i0;
                var ri2 = lhs[lhsOffset + 2 ] * rhs_i0;
                var ri3 = lhs[lhsOffset + 3 ] * rhs_i0;
                for (var j = 1; j < 4; j++) {
                        var rhs_ij = rhs[rhsOffset + 4*i + j];
                        ri0 += lhs[ lhsOffset + 4*j ] * rhs_ij;
                        ri1 += lhs[ lhsOffset + 4*j + 1 ] * rhs_ij;
                        ri2 += lhs[ lhsOffset + 4*j + 2 ] * rhs_ij;
                        ri3 += lhs[ lhsOffset + 4*j + 3 ] * rhs_ij;
                }
                sTemp[ i*4 + 0 ] = ri0;
                sTemp[ i*4 + 1 ] = ri1;
                sTemp[ i*4 + 2 ] = ri2;
                sTemp[ i*4 + 3 ] = ri3;
    }
    
        	System.arraycopy (sTemp,0, result,resultOffset, 16); 	
}
*/
    /**
     * Multiplies a 4 element vector by a 4x4 matrix and stores the result in a
     * 4-element column vector. In matrix notation: result = lhs x rhs
     * <p>
     * The same float array may be passed for resultVec, lhsMat, and/or rhsVec.
     * However, the resultVec element values are undefined if the resultVec
     * elements overlap either the lhsMat or rhsVec elements.
     *
     * @param resultVec The float array that holds the result vector.
     * @param resultVecOffset The offset into the result array where the result
     *        vector is stored.
     * @param lhsMat The float array that holds the left-hand-side matrix.
     * @param lhsMatOffset The offset into the lhs array where the lhs is stored
     * @param rhsVec The float array that holds the right-hand-side vector.
     * @param rhsVecOffset The offset into the rhs vector where the rhs vector
     *        is stored.
     *
     * @throws IllegalArgumentException if resultVec, lhsMat,
     * or rhsVec are null, or if resultVecOffset + 4 > resultVec.length
     * or lhsMatOffset + 16 > lhsMat.length or
     * rhsVecOffset + 4 > rhsVec.length.
     */
//    public static native void multiplyMV(float[] resultVec,
//            int resultVecOffset, float[] lhsMat, int lhsMatOffset,
//            float[] rhsVec, int rhsVecOffset);

    /**
     * Transposes a 4 x 4 matrix.
     * <p>
     * mTrans and m must not overlap.
     *
     * @param mTrans the array that holds the output transposed matrix
     * @param mTransOffset an offset into mTrans where the transposed matrix is
     *        stored.
     * @param m the input array
     * @param mOffset an offset into m where the input matrix is stored.
     */
/*     
Matrix.transposeM = function(mTrans, mTransOffset, m, mOffset) {
        for (var i = 0; i < 4; i++) {
            var mBase = i * 4 + mOffset;
            mTrans[i + mTransOffset] = m[mBase];
            mTrans[i + 4 + mTransOffset] = m[mBase + 1];
            mTrans[i + 8 + mTransOffset] = m[mBase + 2];
            mTrans[i + 12 + mTransOffset] = m[mBase + 3];
        }
};
*/
    /**
     * Inverts a 4 x 4 matrix.
     * <p>
     * mInv and m must not overlap.
     *
     * @param mInv the array that holds the output inverted matrix
     * @param mInvOffset an offset into mInv where the inverted matrix is
     *        stored.
     * @param m the input array
     * @param mOffset an offset into m where the input matrix is stored.
     * @return true if the matrix could be inverted, false if it could not.
     */     
/*     
Matrix.invertM = function(mInv, mInvOffset, m, mOffset) {
        // Invert a 4 x 4 matrix using Cramer's Rule

        // transpose matrix
        var src0  = m[mOffset +  0];
        var src4  = m[mOffset +  1];
        var src8  = m[mOffset +  2];
        var src12 = m[mOffset +  3];

        var src1  = m[mOffset +  4];
        var src5  = m[mOffset +  5];
        var src9  = m[mOffset +  6];
        var src13 = m[mOffset +  7];

        var src2  = m[mOffset +  8];
        var src6  = m[mOffset +  9];
        var src10 = m[mOffset + 10];
        var src14 = m[mOffset + 11];

        var src3  = m[mOffset + 12];
        var src7  = m[mOffset + 13];
        var src11 = m[mOffset + 14];
        var src15 = m[mOffset + 15];

        // calculate pairs for first 8 elements (cofactors)
        var atmp0  = src10 * src15;
        var atmp1  = src11 * src14;
        var atmp2  = src9  * src15;
        var atmp3  = src11 * src13;
        var atmp4  = src9  * src14;
        var atmp5  = src10 * src13;
        var atmp6  = src8  * src15;
        var atmp7  = src11 * src12;
        var atmp8  = src8  * src14;
        var atmp9  = src10 * src12;
        var atmp10 = src8  * src13;
        var atmp11 = src9  * src12;

        // calculate first 8 elements (cofactors)
        var dst0  = (atmp0 * src5 + atmp3 * src6 + atmp4  * src7)
                          - (atmp1 * src5 + atmp2 * src6 + atmp5  * src7);
        var dst1  = (atmp1 * src4 + atmp6 * src6 + atmp9  * src7)
                          - (atmp0 * src4 + atmp7 * src6 + atmp8  * src7);
        var dst2  = (atmp2 * src4 + atmp7 * src5 + atmp10 * src7)
                          - (atmp3 * src4 + atmp6 * src5 + atmp11 * src7);
        var dst3  = (atmp5 * src4 + atmp8 * src5 + atmp11 * src6)
                          - (atmp4 * src4 + atmp9 * src5 + atmp10 * src6);
        var dst4  = (atmp1 * src1 + atmp2 * src2 + atmp5  * src3)
                          - (atmp0 * src1 + atmp3 * src2 + atmp4  * src3);
        var dst5  = (atmp0 * src0 + atmp7 * src2 + atmp8  * src3)
                          - (atmp1 * src0 + atmp6 * src2 + atmp9  * src3);
        var dst6  = (atmp3 * src0 + atmp6 * src1 + atmp11 * src3)
                          - (atmp2 * src0 + atmp7 * src1 + atmp10 * src3);
        var dst7  = (atmp4 * src0 + atmp9 * src1 + atmp10 * src2)
                          - (atmp5 * src0 + atmp8 * src1 + atmp11 * src2);

        // calculate pairs for second 8 elements (cofactors)
        var btmp0  = src2 * src7;
        var btmp1  = src3 * src6;
        var btmp2  = src1 * src7;
        var btmp3  = src3 * src5;
        var btmp4  = src1 * src6;
        var btmp5  = src2 * src5;
        var btmp6  = src0 * src7;
        var btmp7  = src3 * src4;
        var btmp8  = src0 * src6;
        var btmp9  = src2 * src4;
        var btmp10 = src0 * src5;
        var btmp11 = src1 * src4;

        // calculate second 8 elements (cofactors)
        var dst8  = (btmp0  * src13 + btmp3  * src14 + btmp4  * src15)
                          - (btmp1  * src13 + btmp2  * src14 + btmp5  * src15);
        var dst9  = (btmp1  * src12 + btmp6  * src14 + btmp9  * src15)
                          - (btmp0  * src12 + btmp7  * src14 + btmp8  * src15);
        var dst10 = (btmp2  * src12 + btmp7  * src13 + btmp10 * src15)
                          - (btmp3  * src12 + btmp6  * src13 + btmp11 * src15);
        var dst11 = (btmp5  * src12 + btmp8  * src13 + btmp11 * src14)
                          - (btmp4  * src12 + btmp9  * src13 + btmp10 * src14);
        var dst12 = (btmp2  * src10 + btmp5  * src11 + btmp1  * src9 )
                          - (btmp4  * src11 + btmp0  * src9  + btmp3  * src10);
        var dst13 = (btmp8  * src11 + btmp0  * src8  + btmp7  * src10)
                          - (btmp6  * src10 + btmp9  * src11 + btmp1  * src8 );
        var dst14 = (btmp6  * src9  + btmp11 * src11 + btmp3  * src8 )
                          - (btmp10 * src11 + btmp2  * src8  + btmp7  * src9 );
        var dst15 = (btmp10 * src10 + btmp4  * src8  + btmp9  * src9 )
                          - (btmp8  * src9  + btmp11 * src10 + btmp5  * src8 );

        // calculate determinant
        var det =
                src0 * dst0 + src1 * dst1 + src2 * dst2 + src3 * dst3;

        if (det == 0.0f) {
            return false;
        }

        // calculate matrix inverse
        var invdet = 1.0f / det;
        mInv[     mInvOffset] = dst0  * invdet;
        mInv[ 1 + mInvOffset] = dst1  * invdet;
        mInv[ 2 + mInvOffset] = dst2  * invdet;
        mInv[ 3 + mInvOffset] = dst3  * invdet;

        mInv[ 4 + mInvOffset] = dst4  * invdet;
        mInv[ 5 + mInvOffset] = dst5  * invdet;
        mInv[ 6 + mInvOffset] = dst6  * invdet;
        mInv[ 7 + mInvOffset] = dst7  * invdet;

        mInv[ 8 + mInvOffset] = dst8  * invdet;
        mInv[ 9 + mInvOffset] = dst9  * invdet;
        mInv[10 + mInvOffset] = dst10 * invdet;
        mInv[11 + mInvOffset] = dst11 * invdet;

        mInv[12 + mInvOffset] = dst12 * invdet;
        mInv[13 + mInvOffset] = dst13 * invdet;
        mInv[14 + mInvOffset] = dst14 * invdet;
        mInv[15 + mInvOffset] = dst15 * invdet;

        return true;
    }
*/
    /**
     * Computes an orthographic projection matrix.
     *
     * @param m returns the result
     * @param mOffset
     * @param left
     * @param right
     * @param bottom
     * @param top
     * @param near
     * @param far
     */
/*     
    public static void orthoM(float[] m, int mOffset,
        float left, float right, float bottom, float top,
        float near, float far) {
        if (left == right) {
            throw new IllegalArgumentException("left == right");
        }
        if (bottom == top) {
            throw new IllegalArgumentException("bottom == top");
        }
        if (near == far) {
            throw new IllegalArgumentException("near == far");
        }

        final float r_width  = 1.0f / (right - left);
        final float r_height = 1.0f / (top - bottom);
        final float r_depth  = 1.0f / (far - near);
        final float x =  2.0f * (r_width);
        final float y =  2.0f * (r_height);
        final float z = -2.0f * (r_depth);
        final float tx = -(right + left) * r_width;
        final float ty = -(top + bottom) * r_height;
        final float tz = -(far + near) * r_depth;
        m[mOffset + 0] = x;
        m[mOffset + 5] = y;
        m[mOffset +10] = z;
        m[mOffset +12] = tx;
        m[mOffset +13] = ty;
        m[mOffset +14] = tz;
        m[mOffset +15] = 1.0f;
        m[mOffset + 1] = 0.0f;
        m[mOffset + 2] = 0.0f;
        m[mOffset + 3] = 0.0f;
        m[mOffset + 4] = 0.0f;
        m[mOffset + 6] = 0.0f;
        m[mOffset + 7] = 0.0f;
        m[mOffset + 8] = 0.0f;
        m[mOffset + 9] = 0.0f;
        m[mOffset + 11] = 0.0f;
    }
*/

    /**
     * Defines a projection matrix in terms of six clip planes.
     *
     * @param m the float array that holds the output perspective matrix
     * @param offset the offset into float array m where the perspective
     *        matrix data is written
     * @param left
     * @param right
     * @param bottom
     * @param top
     * @param near
     * @param far
     */
/*     
    public static void frustumM(float[] m, int offset,
            float left, float right, float bottom, float top,
            float near, float far) {
        if (left == right) {
            throw new IllegalArgumentException("left == right");
        }
        if (top == bottom) {
            throw new IllegalArgumentException("top == bottom");
        }
        if (near == far) {
            throw new IllegalArgumentException("near == far");
        }
        if (near <= 0.0f) {
            throw new IllegalArgumentException("near <= 0.0f");
        }
        if (far <= 0.0f) {
            throw new IllegalArgumentException("far <= 0.0f");
        }
        final float r_width  = 1.0f / (right - left);
        final float r_height = 1.0f / (top - bottom);
        final float r_depth  = 1.0f / (near - far);
        final float x = 2.0f * (near * r_width);
        final float y = 2.0f * (near * r_height);
        final float A = (right + left) * r_width;
        final float B = (top + bottom) * r_height;
        final float C = (far + near) * r_depth;
        final float D = 2.0f * (far * near * r_depth);
        m[offset + 0] = x;
        m[offset + 5] = y;
        m[offset + 8] = A;
        m[offset +  9] = B;
        m[offset + 10] = C;
        m[offset + 14] = D;
        m[offset + 11] = -1.0f;
        m[offset +  1] = 0.0f;
        m[offset +  2] = 0.0f;
        m[offset +  3] = 0.0f;
        m[offset +  4] = 0.0f;
        m[offset +  6] = 0.0f;
        m[offset +  7] = 0.0f;
        m[offset + 12] = 0.0f;
        m[offset + 13] = 0.0f;
        m[offset + 15] = 0.0f;
    }
*/
    /**
     * Defines a projection matrix in terms of a field of view angle, an
     * aspect ratio, and z clip planes.
     *
     * @param m the float array that holds the perspective matrix
     * @param offset the offset into float array m where the perspective
     *        matrix data is written
     * @param fovy field of view in y direction, in degrees
     * @param aspect width to height aspect ratio of the viewport
     * @param zNear
     * @param zFar
     */
/*     
    public static void perspectiveM(float[] m, int offset,
          float fovy, float aspect, float zNear, float zFar) {
        float f = 1.0f / (float) Math.tan(fovy * (Math.PI / 360.0));
        float rangeReciprocal = 1.0f / (zNear - zFar);

        m[offset + 0] = f / aspect;
        m[offset + 1] = 0.0f;
        m[offset + 2] = 0.0f;
        m[offset + 3] = 0.0f;

        m[offset + 4] = 0.0f;
        m[offset + 5] = f;
        m[offset + 6] = 0.0f;
        m[offset + 7] = 0.0f;

        m[offset + 8] = 0.0f;
        m[offset + 9] = 0.0f;
        m[offset + 10] = (zFar + zNear) * rangeReciprocal;
        m[offset + 11] = -1.0f;

        m[offset + 12] = 0.0f;
        m[offset + 13] = 0.0f;
        m[offset + 14] = 2.0f * zFar * zNear * rangeReciprocal;
        m[offset + 15] = 0.0f;
    }
*/
    /**
     * Computes the length of a vector.
     *
     * @param x x coordinate of a vector
     * @param y y coordinate of a vector
     * @param z z coordinate of a vector
     * @return the length of a vector
     */
/*     
    public static float length(float x, float y, float z) {
        return (float) Math.sqrt(x * x + y * y + z * z);
    }
*/
    /**
     * Sets matrix m to the identity matrix.
     *
     * @param sm returns the result
     * @param smOffset index into sm where the result matrix starts
     */
Matrix.setIdentityM = function(sm, smOffset) 
{       for (var i=0 ; i<16 ; i++) {
            sm[smOffset + i] = 0;
        }
        for(var i = 0; i < 16; i += 5) {
            sm[smOffset + i] = 1.0;
        }
};

    /**
     * Scales matrix m by x, y, and z, putting the result in sm.
     * <p>
     * m and sm must not overlap.
     *
     * @param sm returns the result
     * @param smOffset index into sm where the result matrix starts
     * @param m source matrix
     * @param mOffset index into m where the source matrix starts
     * @param x scale factor x
     * @param y scale factor y
     * @param z scale factor z
     */
/*     
Matrix.scaleM(sm,smOffset, m, int mOffset, float x, float y, float z) {
        for (int i=0 ; i<4 ; i++) {
            int smi = smOffset + i;
            int mi = mOffset + i;
            sm[     smi] = m[     mi] * x;
            sm[ 4 + smi] = m[ 4 + mi] * y;
            sm[ 8 + smi] = m[ 8 + mi] * z;
            sm[12 + smi] = m[12 + mi];
        }
    }
*/
    /**
     * Scales matrix m in place by sx, sy, and sz.
     *
     * @param m matrix to scale
     * @param mOffset index into m where the matrix starts
     * @param x scale factor x
     * @param y scale factor y
     * @param z scale factor z
     */
Matrix.scaleM = function(m, mOffset, x, y, z) 
{
        for (var i=0 ; i<4 ; i++) {
            var mi = mOffset + i;
            m[     mi] *= x;
            m[ 4 + mi] *= y;
            m[ 8 + mi] *= z;
        }
};

    /**
     * Translates matrix m by x, y, and z, putting the result in tm.
     * <p>
     * m and tm must not overlap.
     *
     * @param tm returns the result
     * @param tmOffset index into sm where the result matrix starts
     * @param m source matrix
     * @param mOffset index into m where the source matrix starts
     * @param x translation factor x
     * @param y translation factor y
     * @param z translation factor z
     */
/*     
Matrix.translateM = function(tm, tmOffset, m, mOffset, x, y, z) 
{
        for (var i=0 ; i<12 ; i++) {
            tm[tmOffset + i] = m[mOffset + i];
        }
        for (var i=0 ; i<4 ; i++) {
            var tmi = tmOffset + i;
            var mi = mOffset + i;
            tm[12 + tmi] = m[mi] * x + m[4 + mi] * y + m[8 + mi] * z +
                m[12 + mi];
        }
};
*/
    /**
     * Translates matrix m by x, y, and z in place.
     *
     * @param m matrix
     * @param mOffset index into m where the matrix starts
     * @param x translation factor x
     * @param y translation factor y
     * @param z translation factor z
     */
Matrix.translateM = function(m, mOffset, x,y,z) 
{
        for (var i=0 ; i<4 ; i++) {
            var mi = mOffset + i;
            m[12 + mi] += m[mi] * x + m[4 + mi] * y + m[8 + mi] * z;
        }
};

    /**
     * Rotates matrix m by angle a (in degrees) around the axis (x, y, z).
     * <p>
     * m and rm must not overlap.
     *
     * @param rm returns the result
     * @param rmOffset index into rm where the result matrix starts
     * @param m source matrix
     * @param mOffset index into m where the source matrix starts
     * @param a angle to rotate in degrees
     * @param x X axis component
     * @param y Y axis component
     * @param z Z axis component
     */
/*     
    public static void rotateM(float[] rm, int rmOffset,
            float[] m, int mOffset,
            float a, float x, float y, float z) {
        synchronized(sTemp) {
            setRotateM(sTemp, 0, a, x, y, z);
            multiplyMM(rm, rmOffset, m, mOffset, sTemp, 0);
        }
    }
*/
    /**
     * Rotates matrix m in place by angle a (in degrees)
     * around the axis (x, y, z).
     *
     * @param m source matrix
     * @param mOffset index into m where the matrix starts
     * @param a angle to rotate in degrees
     * @param x X axis component
     * @param y Y axis component
     * @param z Z axis component
     */
/*
Matrix.rotateM = function(m, mOffset, a, x, y, z) {
        Matrix.setRotateM(Matrix.sTemp, 0, a, x, y, z);
        Matrix.multiplyMM(Matrix.sTemp, 16, m, mOffset, Matrix.sTemp, 0);
        // System.arraycopy(sTemp, 16, m, mOffset, 16);
    }
}
*/
    /**
     * Creates a matrix for rotation by angle a (in degrees)
     * around the axis (x, y, z).
     * <p>
     * An optimized path will be used for rotation about a major axis
     * (e.g. x=1.0f y=0.0f z=0.0f).
     *
     * @param rm returns the result
     * @param rmOffset index into rm where the result matrix starts
     * @param a angle to rotate in degrees
     * @param x X axis component
     * @param y Y axis component
     * @param z Z axis component
     */
/*     
    public static void setRotateM(float[] rm, int rmOffset,
            float a, float x, float y, float z) {
        rm[rmOffset + 3] = 0;
        rm[rmOffset + 7] = 0;
        rm[rmOffset + 11]= 0;
        rm[rmOffset + 12]= 0;
        rm[rmOffset + 13]= 0;
        rm[rmOffset + 14]= 0;
        rm[rmOffset + 15]= 1;
        a *= (float) (Math.PI / 180.0f);
        float s = (float) Math.sin(a);
        float c = (float) Math.cos(a);
        if (1.0f == x && 0.0f == y && 0.0f == z) {
            rm[rmOffset + 5] = c;   rm[rmOffset + 10]= c;
            rm[rmOffset + 6] = s;   rm[rmOffset + 9] = -s;
            rm[rmOffset + 1] = 0;   rm[rmOffset + 2] = 0;
            rm[rmOffset + 4] = 0;   rm[rmOffset + 8] = 0;
            rm[rmOffset + 0] = 1;
        } else if (0.0f == x && 1.0f == y && 0.0f == z) {
            rm[rmOffset + 0] = c;   rm[rmOffset + 10]= c;
            rm[rmOffset + 8] = s;   rm[rmOffset + 2] = -s;
            rm[rmOffset + 1] = 0;   rm[rmOffset + 4] = 0;
            rm[rmOffset + 6] = 0;   rm[rmOffset + 9] = 0;
            rm[rmOffset + 5] = 1;
        } else if (0.0f == x && 0.0f == y && 1.0f == z) {
            rm[rmOffset + 0] = c;   rm[rmOffset + 5] = c;
            rm[rmOffset + 1] = s;   rm[rmOffset + 4] = -s;
            rm[rmOffset + 2] = 0;   rm[rmOffset + 6] = 0;
            rm[rmOffset + 8] = 0;   rm[rmOffset + 9] = 0;
            rm[rmOffset + 10]= 1;
        } else {
            float len = length(x, y, z);
            if (1.0f != len) {
                float recipLen = 1.0f / len;
                x *= recipLen;
                y *= recipLen;
                z *= recipLen;
            }
            float nc = 1.0f - c;
            float xy = x * y;
            float yz = y * z;
            float zx = z * x;
            float xs = x * s;
            float ys = y * s;
            float zs = z * s;
            rm[rmOffset +  0] = x*x*nc +  c;
            rm[rmOffset +  4] =  xy*nc - zs;
            rm[rmOffset +  8] =  zx*nc + ys;
            rm[rmOffset +  1] =  xy*nc + zs;
            rm[rmOffset +  5] = y*y*nc +  c;
            rm[rmOffset +  9] =  yz*nc - xs;
            rm[rmOffset +  2] =  zx*nc - ys;
            rm[rmOffset +  6] =  yz*nc + xs;
            rm[rmOffset + 10] = z*z*nc +  c;
        }
    }
*/
    /**
     * Converts Euler angles to a rotation matrix.
     *
     * @param rm returns the result
     * @param rmOffset index into rm where the result matrix starts
     * @param x angle of rotation, in degrees
     * @param y angle of rotation, in degrees
     * @param z angle of rotation, in degrees
     */
/*     
    public static void setRotateEulerM(float[] rm, int rmOffset,
            float x, float y, float z) {
        x *= (float) (Math.PI / 180.0f);
        y *= (float) (Math.PI / 180.0f);
        z *= (float) (Math.PI / 180.0f);
        float cx = (float) Math.cos(x);
        float sx = (float) Math.sin(x);
        float cy = (float) Math.cos(y);
        float sy = (float) Math.sin(y);
        float cz = (float) Math.cos(z);
        float sz = (float) Math.sin(z);
        float cxsy = cx * sy;
        float sxsy = sx * sy;

        rm[rmOffset + 0]  =   cy * cz;
        rm[rmOffset + 1]  =  -cy * sz;
        rm[rmOffset + 2]  =   sy;
        rm[rmOffset + 3]  =  0.0f;

        rm[rmOffset + 4]  =  cxsy * cz + cx * sz;
        rm[rmOffset + 5]  = -cxsy * sz + cx * cz;
        rm[rmOffset + 6]  =  -sx * cy;
        rm[rmOffset + 7]  =  0.0f;

        rm[rmOffset + 8]  = -sxsy * cz + sx * sz;
        rm[rmOffset + 9]  =  sxsy * sz + sx * cz;
        rm[rmOffset + 10] =  cx * cy;
        rm[rmOffset + 11] =  0.0f;

        rm[rmOffset + 12] =  0.0f;
        rm[rmOffset + 13] =  0.0f;
        rm[rmOffset + 14] =  0.0f;
        rm[rmOffset + 15] =  1.0f;
    }
*/
    /**
     * Defines a viewing transformation in terms of an eye point, a center of
     * view, and an up vector.
     *
     * @param rm returns the result
     * @param rmOffset index into rm where the result matrix starts
     * @param eyeX eye point X
     * @param eyeY eye point Y
     * @param eyeZ eye point Z
     * @param centerX center of view X
     * @param centerY center of view Y
     * @param centerZ center of view Z
     * @param upX up vector X
     * @param upY up vector Y
     * @param upZ up vector Z
     */
/*     
    public static void setLookAtM(float[] rm, int rmOffset,
            float eyeX, float eyeY, float eyeZ,
            float centerX, float centerY, float centerZ, float upX, float upY,
            float upZ) {

        // See the OpenGL GLUT documentation for gluLookAt for a description
        // of the algorithm. We implement it in a straightforward way:

        float fx = centerX - eyeX;
        float fy = centerY - eyeY;
        float fz = centerZ - eyeZ;

        // Normalize f
        float rlf = 1.0f / Matrix.length(fx, fy, fz);
        fx *= rlf;
        fy *= rlf;
        fz *= rlf;

        // compute s = f x up (x means "cross product")
        float sx = fy * upZ - fz * upY;
        float sy = fz * upX - fx * upZ;
        float sz = fx * upY - fy * upX;

        // and normalize s
        float rls = 1.0f / Matrix.length(sx, sy, sz);
        sx *= rls;
        sy *= rls;
        sz *= rls;

        // compute u = s x f
        float ux = sy * fz - sz * fy;
        float uy = sz * fx - sx * fz;
        float uz = sx * fy - sy * fx;

        rm[rmOffset + 0] = sx;
        rm[rmOffset + 1] = ux;
        rm[rmOffset + 2] = -fx;
        rm[rmOffset + 3] = 0.0f;

        rm[rmOffset + 4] = sy;
        rm[rmOffset + 5] = uy;
        rm[rmOffset + 6] = -fy;
        rm[rmOffset + 7] = 0.0f;

        rm[rmOffset + 8] = sz;
        rm[rmOffset + 9] = uz;
        rm[rmOffset + 10] = -fz;
        rm[rmOffset + 11] = 0.0f;

        rm[rmOffset + 12] = 0.0f;
        rm[rmOffset + 13] = 0.0f;
        rm[rmOffset + 14] = 0.0f;
        rm[rmOffset + 15] = 1.0f;

        translateM(rm, rmOffset, -eyeX, -eyeY, -eyeZ);
    }
}
*/
"use strict";
var Renderer = function() 
{   this.game = null;
};

Renderer.prototype.$ = function(game) 
{   this.game = game;
    return this;
};

Renderer.prototype.isLoaded = function()
{   return true;
};


    /**
     * Utility method for compiling a OpenGL shader.
     *
     * <p><strong>Note:</strong> When developing shaders, use the checkGlError()
     * method to debug shader coding errors.</p>
     *
     * @param type - Vertex or fragment shader type.
     * @param shaderCode - String containing the shader code.
     * @return - Returns an id for the shader.
     */
 Renderer.prototype.loadShader = function(type,shaderCode)
 {  var gl = this.game.gl;
    
    // create a vertex shader type (GLES20.GL_VERTEX_SHADER)
    // or a fragment shader type (GLES20.GL_FRAGMENT_SHADER)
    var shader = gl.createShader(type);

    // add the source code to the shader and compile it
    gl.shaderSource(shader, shaderCode);
    gl.compileShader(shader);
        
    //Check compile status.
    var log = gl.getShaderInfoLog(shader);
    if(log.length>0)
    {
        console.log("Error compiling the shader: " + log);
    }
    return shader;
};

Renderer.prototype.createProgram = function(vertexShaderCode, fragmentShaderCode)
{   var gl = this.game.gl;

    // prepare shaders and OpenGL program
    var vertexShader = this.loadShader(gl.VERTEX_SHADER, vertexShaderCode);
    var fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fragmentShaderCode);

    var program = gl.createProgram();             // create empty OpenGL Program
    gl.attachShader(program, vertexShader);   // add the vertex shader to program
    gl.attachShader(program, fragmentShader); // add the fragment shader to program

    gl.linkProgram(program);                  // create OpenGL program executables
        
    return program;
};



Renderer.prototype.loadImageToTexture = function(resourcename, texture, onlyalpha, callback)
{   
    var gl = this.game.gl;
    var image = new Image();
    image.addEventListener
    (   'load', function() 
        {   gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D
            (   gl.TEXTURE_2D, 
                0,  
                onlyalpha ? gl.ALPHA : gl.RGBA, 
                onlyalpha ? gl.ALPHA : gl.RGBA, 
                gl.UNSIGNED_BYTE, 
                image
            );
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            
            callback( [image.naturalWidth,image.naturalHeight] );
        }
   );
   image.src = resourcename;
};


"use strict";
// object allocator function
var VectorRenderer = function()  
{   Renderer.call(this);

    this.program = null;
    this.uMVPMatrix = null;
    this.aCorner = null;
    this.aColor = null;
        
    this.vboCorner = null;             // gl buffer holding float[2] - destination coordinates (in pixel)
    this.vboColor = null;              // gl buffer holding int[1] - color to by applied to image (also for color area rendering)
    
    // client-side buffers to prepare the data before moving it into their gl counterparts
    this.numCorners = 0;
    this.bufferCorner = null;
    this.bufferColor = null;
    // temporary data for appending corners to triangle strips 
    this.mustDublicateNextCorner = false;
    this.rotsin = 0;
    this.rotcos = 0;
    this.translatex = 0;
    this.translatey = 0;
            
    this.matrix = null; 
};
VectorRenderer.prototype = Object.create(Renderer.prototype);

// static fields
VectorRenderer.MAXCORNERS = 10000;  // number of vertices in the buffer
            
VectorRenderer.vertexShaderCode =
            "uniform mat4 uMVPMatrix;                  "+
            "attribute vec2 aCorner;                   "+   // location on screen (before transformation)
            "attribute vec4 aColor;                    "+   // color to apply to texture before rendering   
            "varying vec4 vColor;                      "+   // color to apply to the image (to be given to fragment shader)
            "void main() {                             "+
            "  vec4 p;                                 "+
            "  p[0] = aCorner[0];                      "+
            "  p[1] = aCorner[1];                      "+
            "  p[2] = 0.0;                             "+
            "  p[3] = 1.0;                             "+
            "  gl_Position = uMVPMatrix * p;           "+
            "  vColor = aColor/255.0;                  "+
            "}                                         "+
            "";    
VectorRenderer.fragmentShaderCode =
            "varying mediump vec4 vColor;                     "+  // color to apply to texture before rendering
            "void main() {                                    "+
            "   gl_FragColor = vColor;                        "+
            "}                                                "+
            "";            
VectorRenderer.sinustable =
        [ 0.0, 0.17364817766693033, 0.3420201433256687, 0.5, 
          0.6427876096865393, 0.766044443118978, 0.8660254037844386, 0.9396926207859083, 
          0.984807753012208, 1.0, 0.984807753012208, 0.9396926207859084, 
          0.8660254037844387, 0.766044443118978, 0.6427876096865395, 0.5,
          0.3420201433256689, 0.1736481776669307, 0.0, -0.17364817766693047,
          -0.34202014332566866, -0.5, -0.6427876096865393, -0.7660444431189779,
          -0.8660254037844384, -0.9396926207859082, -0.984807753012208, -1.0, 
          -0.9848077530122081, -0.9396926207859083, -0.8660254037844386, -0.7660444431189781, 
          -0.6427876096865396, -0.5, -0.34202014332566943, -0.1736481776669304  ]; 
    

//  private int viewportx;
//  private int viewporty;
//  private int viewportwidth;
//  private int viewportheight;

// --------- locations of images inside the atlas -------------


// constructor: set up opengl  and load textures
VectorRenderer.prototype.$ = function(game)
{
    Renderer.prototype.$.call(this,game);
    var gl = game.gl;
    
    // create shaders and link together
    this.program = this.createProgram(VectorRenderer.vertexShaderCode,VectorRenderer.fragmentShaderCode);
    // extract the bindings for the uniforms and attributes
    this.uMVPMatrix = gl.getUniformLocation(this.program, "uMVPMatrix");
    this.aCorner = gl.getAttribLocation(this.program, "aCorner"); 
    this.aColor = gl.getAttribLocation(this.program, "aColor");
                
    // create buffers (gl and client) for the vertices
    this.bufferCorner = new Float32Array(2*VectorRenderer.MAXCORNERS);
    this.vboCorner = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboCorner);
    gl.bufferData(gl.ARRAY_BUFFER, 4*2*VectorRenderer.MAXCORNERS, gl.DYNAMIC_DRAW);

    this.bufferColor = new Uint8Array(4*VectorRenderer.MAXCORNERS);
    this.vboColor = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboColor);
    gl.bufferData(gl.ARRAY_BUFFER, 4*VectorRenderer.MAXCORNERS, gl.DYNAMIC_DRAW);
        
    // allocate memory for projection matrix
    this.matrix = new Array(16);
        
    return this;
};

VectorRenderer.prototype.startDrawing = function()
{
    // clear client-side buffer
    this.numCorners = 0;
    this.mustDublicateNextCorner = false;
  
    // transfer coordinate system from the opengl-standard to a pixel system (0,0 is top left)
    Matrix.setIdentityM(this.matrix,0);     
    Matrix.translateM(this.matrix,0, -1.0,1.0, 0);
    Matrix.scaleM(this.matrix,0, 2.0/this.game.screenwidth, -2.0/this.game.screenheight, 1.0);
};

VectorRenderer.prototype.flush = function()
{   
    if (this.numCorners<1) { return };    
    var gl = this.game.gl;

    // transfer buffers into opengl 
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboCorner);
    gl.bufferSubData(gl.ARRAY_BUFFER,0, this.bufferCorner.subarray(0,2*this.numCorners));    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboColor);
    gl.bufferSubData(gl.ARRAY_BUFFER,0, this.bufferColor.subarray(0,4*this.numCorners)); 

    // set up gl for painting all triangles
    gl.useProgram(this.program);

    // enable all vertex attribute arrays and set pointers
    gl.enableVertexAttribArray(this.aCorner);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboCorner);
    gl.vertexAttribPointer(this.aCorner, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(this.aColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboColor);
    gl.vertexAttribPointer(this.aColor, 4, gl.UNSIGNED_BYTE, false, 0, 0);

    // set matrix and draw all triangles
    gl.uniformMatrix4fv(this.uMVPMatrix, false, this.matrix);

    // Draw all triangles
    gl.drawArrays(gl.TRIANGLE_STRIP,0,this.numCorners);

    // disable arrays
    gl.disableVertexAttribArray(this.aCorner);
    gl.disableVertexAttribArray(this.aColor);
    
    this.mustDublicateNextCorner = false;
    this.numCorners = 0;    
};


VectorRenderer.prototype.addCorner = function(x,y,argb)
{   
    var n = this.numCorners++;
    this.bufferCorner[2*n+0] = x;
    this.bufferCorner[2*n+1] = y;
    this.bufferColor[4*n+0] = (argb>>16) & 0xff;
    this.bufferColor[4*n+1] = (argb>>8) & 0xff;
    this.bufferColor[4*n+2] = (argb>>0) & 0xff;
    this.bufferColor[4*n+3] = (argb>>24) & 0xff;
};

VectorRenderer.prototype.startStrip = function()
{
    if (this.numCorners>0)
    {   var pos = 2*this.numCorners;
        this.bufferCorner[pos+0] = this.bufferCorner[pos-2];
        this.bufferCorner[pos+1] = this.bufferCorner[pos-1];
        pos = 4*this.numCorners;
        this.bufferColor[pos+0] = this.bufferColor[pos-4];
        this.bufferColor[pos+1] = this.bufferColor[pos-3];
        this.bufferColor[pos+2] = this.bufferColor[pos-2];
        this.bufferColor[pos+3] = this.bufferColor[pos-1];
        this.numCorners++;
        this.mustDublicateNextCorner = true;
    }
    this.rotsin = 0;
    this.rotcos = 1;
    this.translatex = 0;
    this.translatey = 0;
};

VectorRenderer.prototype.setStripCornerTransformation = function(rotcos, rotsin, translatex, translatey)
{   this.rotsin = rotsin;
    this.rotcos = rotcos;
    this.translatex = translatex;
    this.translatey = translatey;   
};

VectorRenderer.prototype.addStripCorner = function(x, y, argb)
{   var tx = (x*this.rotcos - y*this.rotsin + this.translatex);
    var ty = (x*this.rotsin + y*this.rotcos + this.translatey);
    this.addCorner (tx,ty, argb);
    if (this.mustDublicateNextCorner)
    {   this.addCorner(tx,ty,argb);
        this.mustDublicateNextCorner = false;
    }
};

VectorRenderer.prototype.addRectangle = function(x, y, w, h, argb)
{   this.startStrip();
    this.addStripCorner(x,y, argb);
    this.addStripCorner(x+w,y, argb);
    this.addStripCorner(x,y+h, argb);
    this.addStripCorner(x+w,y+h, argb);
};

VectorRenderer.prototype.addFrame = function(x, y, w, h, border, argb)
{   var x1 = x;
    var x2 = x+w;
    var y1 = y;
    var y2 = y+h;
    var x1_i = x+border;
    var x2_i = x+w-border;
    var y1_i = y+border;
    var y2_i = y+h-border;

    this.startStrip();
    this.addStripCorner(x1,y1,argb);
    this.addStripCorner(x1_i,y1_i,argb);
    this.addStripCorner(x2,y1,argb);
    this.addStripCorner(x2_i,y1_i,argb);
    this.addStripCorner(x2,y2,argb);
    this.addStripCorner(x2_i,y2_i,argb);
    this.addStripCorner(x1,y2,argb);
    this.addStripCorner(x1_i,y2_i,argb);
    this.addStripCorner(x1,y1,argb);
    this.addStripCorner(x1_i,y1_i,argb);
};

VectorRenderer.prototype.addCircle = function(x, y, radius, argb)
{   this.startStrip();

    for (var d=0; d<VectorRenderer.sinustable.length; d++)
    {   var nx = x + VectorRenderer.sinustable[(d+9)%36] * radius;
        var ny = y - VectorRenderer.sinustable[d] * radius;
        this.addStripCorner(x,y,argb);
        this.addStripCorner(nx,ny, argb);
    }
    this.addStripCorner (x,y, argb);
    this.addStripCorner (x+radius,y, argb);
};


VectorRenderer.prototype.addShape = function(x, y, xypairs, scaling, argb)
{   var sc = scaling/100.0;
    this.startStrip();
    for (var i=0; i+1<xypairs.length; i+=2)
    {   this.addStripCorner(x+xypairs[i]*sc, y+xypairs[i+1]*sc, argb);
    }
};

VectorRenderer.prototype.addShapeAlternateRGB = function(x, y, xypairs, scaling, argb, alternateargb)
{   var sc = scaling/100.0;
    this.startStrip();
    for (var i=0; i+1<xypairs.length; i+=2)
    {   addStripCorner(x+xypairs[i]*sc, y+xypairs[i+1]*sc, ((i&2)==0) ? argb : alternateargb);
    }
};

VectorRenderer.prototype.addRoundedRect = function(x, y, width, height, radius, outerradius, argb)
{   var argb2 = argb & 0x00ffffff; 
    
    var xc=x+width/2;
    var yc=y+height/2;
    var x1=x+width;
    var y1=y+radius;
    var x2=x+width-radius+outerradius;
    var y2=y1;

    this.startStrip();

    var sinustable = VectorRenderer.sinustable;
    
    // 1. quadrant
    for (var d=1; d<sinustable.length/4; d++)
    {   var nx1 = x+width-radius + sinustable[(d+9)%36] * radius;
        var ny1 = y+radius - sinustable[d] * radius;
        var nx2 = x+width-radius + sinustable[(d+9)%36] * outerradius;
        var ny2 = y+radius - sinustable[d] * outerradius;

        this.addStripCorner(xc,yc, argb);
        this.addStripCorner(xc,yc, argb);
        this.addStripCorner(x1,y1, argb);
        this.addStripCorner(nx1,ny1, argb);
        this.addStripCorner(x2,y2, argb2);
        this.addStripCorner(nx2,ny2, argb2);
        this.addStripCorner(nx2,ny2, argb2);

        x1=nx1;
        y1=ny1;
        x2=nx2;
        y2=ny2;
    }
    // 2. quadrant
    for (var d=sinustable.length/4; d<sinustable.length/2; d++)
    {   var nx1 = x+radius + sinustable[(d+9)%36] * radius;
        var ny1 = y+radius - sinustable[d] * radius;
        var nx2 = x+radius + sinustable[(d+9)%36] * outerradius;
        var ny2 = y+radius - sinustable[d] * outerradius;

        this.addStripCorner(xc,yc, argb);
        this.addStripCorner(xc,yc, argb);
        this.addStripCorner(x1,y1, argb);
        this.addStripCorner(nx1,ny1, argb);
        this.addStripCorner(x2,y2, argb2);
        this.addStripCorner(nx2,ny2, argb2);
        this.addStripCorner(nx2,ny2, argb2);

        x1=nx1;
        y1=ny1;
        x2=nx2;
        y2=ny2;
    }
    // 3. quadrant
    for (var d=sinustable.length/2; d<sinustable.length*3/4; d++)
    {   var nx1 = x+radius + sinustable[(d+9)%36] * radius;
        var ny1 = y+height-radius - sinustable[d] * radius;
        var nx2 = x+radius + sinustable[(d+9)%36] * outerradius;
        var ny2 = y+height-radius - sinustable[d] * outerradius;

        this.addStripCorner(xc,yc, argb);
        this.addStripCorner(xc,yc, argb);
        this.addStripCorner(x1,y1, argb);
        this.addStripCorner(nx1,ny1, argb);
        this.addStripCorner(x2,y2, argb2);
        this.addStripCorner(nx2,ny2, argb2);
        this.addStripCorner(nx2,ny2, argb2);

        x1=nx1;
        y1=ny1;
        x2=nx2;
        y2=ny2;
    }
    // 4. quadrant
    for (var d=sinustable.length*3/4; d<sinustable.length; d++)
    {
        var nx1 = x+width-radius + sinustable[(d+9)%36] * radius;
        var ny1 = y+height-radius - sinustable[d] * radius;
        var nx2 = x+width-radius + sinustable[(d+9)%36] * outerradius;
        var ny2 = y+height-radius - sinustable[d] * outerradius;

        this.addStripCorner(xc,yc, argb);
        this.addStripCorner(xc,yc, argb);
        this.addStripCorner(x1,y1, argb);
        this.addStripCorner(nx1,ny1, argb);
        this.addStripCorner(x2,y2, argb2);
        this.addStripCorner(nx2,ny2, argb2);
        this.addStripCorner(nx2,ny2, argb2);

        x1=nx1;
        y1=ny1;
        x2=nx2;
        y2=ny2;                             
    }
    // last part
    var nx1=x+width;
    var ny1=y+radius;
    var nx2=x+width-radius+outerradius;
    var ny2=ny1;
    this.addStripCorner(xc,yc, argb);                    
    this.addStripCorner(xc,yc, argb);                    
    this.addStripCorner(x1,y1, argb);
    this.addStripCorner(nx1,ny1, argb);
    this.addStripCorner(x2,y2, argb2);
    this.addStripCorner(nx2,ny2, argb2);
    this.addStripCorner(nx2,ny2, argb2); 
};

VectorRenderer.prototype.addPlayArrow = function(x, y, width, height, orientation, argb)
{
    this.startStrip();
    this.setStripCornerTransformation(orientation*(width/2)/100,0, 
        x+width/2+orientation*width*0.04,y+width/2);
    this.addStripCorner(-35,-85, argb);
    this.addStripCorner(-20,-50, argb);
    this.addStripCorner(50,0, argb);
    this.addStripCorner(30,0, argb);
    this.addStripCorner(-35,85, argb);
    this.addStripCorner(-20,50, argb);
    this.addStripCorner(-35,-85, argb);
    this.addStripCorner(-20,-50, argb);
};

VectorRenderer.prototype.addForwardArrow = function(x, y, width, height, orientation, argb)
{   this.startStrip();      
    this.setStripCornerTransformation(orientation*(width/2)/100,0, 
        x+width/2+orientation*width*0.04,y+width/2);
    this.addStripCorner(-30,-70, argb);
    this.addStripCorner(40,0, argb);
    this.addStripCorner(-30,70, argb);
};

VectorRenderer.prototype.addFastForwardArrow = function(x, y, width, height, orientation, argb)
{   this.startStrip();
    this.setStripCornerTransformation(orientation*(width/2)/100,0, 
            x+width/2-orientation*width*0.04,y+width/2);
    this.addStripCorner(-30,-70, argb);
    this.addStripCorner(-30,70, argb);
    this.addStripCorner(10,-30, argb);
    this.addStripCorner(10,30, argb);
    this.addStripCorner(10,30, argb);
    this.addStripCorner(10,70, argb);
    this.addStripCorner(10,70, argb);
    this.addStripCorner(10,-70, argb);
    this.addStripCorner(80,0, argb);
};

VectorRenderer.prototype.addSlowMotionArrow = function(x, y, width, height, orientation, argb)
{   this.startStrip();
    this.setStripCornerTransformation(orientation*(width/2)/100,0, 
        x+width/2+orientation*width*0.08,y+width/2);
    this.addStripCorner(-70,-70,argb);
    this.addStripCorner(-70,70,argb);
    this.addStripCorner(-45,-70,argb);          
    this.addStripCorner(-45,70,argb);           
    this.addStripCorner(-45,70,argb);                       
    this.addStripCorner(-30,-70, argb);
    this.addStripCorner(-30,-70, argb);
    this.addStripCorner(40,0, argb);
    this.addStripCorner(-30,70, argb);
};

VectorRenderer.prototype.addCross = function(x, y, width, height, argb)
{   this.startStrip();      
    this.setStripCornerTransformation((width*0.40)/100,0, x+width/2,y+width/2);
    this.addStripCorner(0,10, argb);
    this.addStripCorner(-70,80,argb);
    this.addStripCorner(0,0, argb);
    this.addStripCorner(-80,70, argb);
    this.addStripCorner(-10,0, argb);
    this.addStripCorner(-10,0, argb);
    this.addStripCorner(-80,-70, argb);
    this.addStripCorner(0,0, argb);
    this.addStripCorner(-70,-80, argb);
    this.addStripCorner(0,-10, argb);
    this.addStripCorner(0,-10, argb);
    this.addStripCorner(70,-80, argb);
    this.addStripCorner(0,0, argb);
    this.addStripCorner(80,-70, argb);
    this.addStripCorner(10,0, argb);
    this.addStripCorner(10,0, argb);
    this.addStripCorner(80,70, argb);
    this.addStripCorner(0,0, argb);
    this.addStripCorner(70,80, argb);
    this.addStripCorner(0,10, argb);  
};

VectorRenderer.prototype.addSquare = function(x, y, width, height, argb)
{
    this.startStrip();
    this.setStripCornerTransformation((width*0.43)/100,0, x+width/2,y+width/2);
    this.addStripCorner(-70,-70,argb);
    this.addStripCorner(-70,70,argb);
    this.addStripCorner(70,-70,argb);
    this.addStripCorner(70,70,argb);
};

VectorRenderer.prototype.addNextLevelArrow = function(x, y, width, height, argb)
{
    this.startStrip();      
    this.setStripCornerTransformation((width*0.5)/100,0, x+width/2-width*0.06,y+width/2);       
    this.addStripCorner(-50,-25,argb);
    this.addStripCorner(-50,25,argb);
    this.addStripCorner(25,-25,argb);
    this.addStripCorner(25,25,argb);
    this.addStripCorner(85,0,argb);
    this.addStripCorner(25,60,argb);
    this.addStripCorner(85,0,argb);
    this.addStripCorner(85,0,argb);
    this.addStripCorner(25,-25,argb);
    this.addStripCorner(25,-60,argb);
};

VectorRenderer.prototype.addInputFocusMarker = function(x, y, width, height, argb)
{
    var b = width/30;
    this.addFrame(x-b,y-b,width+2*b,height+2*b, b, argb);
};

VectorRenderer.prototype.addCrossArrows = function(x, y, width, height, argb)
{   
    this.startStrip();      
    this.setStripCornerTransformation(width/200.0,0, x+width/2,y+width/2);
    this.addStripCorner(-30,-50,argb);
    this.addStripCorner(-10,-50,argb);
    this.addStripCorner(0,-80,argb);
    this.addStripCorner(10,-50,argb);
    this.addStripCorner(30,-50,argb);       
    this.addStripCorner(-10,-50,argb);
    this.addStripCorner(10,-50,argb);
    this.addStripCorner(-10,0,argb);
    this.addStripCorner(10,0,argb);
    this.addStripCorner(10,0,argb);
    this.addStripCorner(-30,50,argb);
    this.addStripCorner(-30,50,argb);
    this.addStripCorner(-10,50,argb);
    this.addStripCorner(0,80,argb);
    this.addStripCorner(10,50,argb);
    this.addStripCorner(30,50,argb);        
    this.addStripCorner(-10,50,argb);
    this.addStripCorner(10,50,argb);
    this.addStripCorner(-10,0,argb);
    this.addStripCorner(10,0,argb); 
    this.addStripCorner(10,0,argb); 
    this.addStripCorner(-50,-30,argb);          
    this.addStripCorner(-50,-30,argb);
    this.addStripCorner(-50,-10,argb);
    this.addStripCorner(-80,0,argb);
    this.addStripCorner(-50,10,argb);
    this.addStripCorner(-50,30,argb);       
    this.addStripCorner(-50,-10,argb);
    this.addStripCorner(-50,10,argb);
    this.addStripCorner(0,-10,argb);
    this.addStripCorner(0,10,argb);
    this.addStripCorner(0,10,argb);
    this.addStripCorner(50,-30,argb);
    this.addStripCorner(50,-30,argb);
    this.addStripCorner(50,-10,argb);
    this.addStripCorner(80,0,argb);
    this.addStripCorner(50,10,argb);
    this.addStripCorner(50,30,argb);        
    this.addStripCorner(50,-10,argb);
    this.addStripCorner(50,10,argb);
    this.addStripCorner(0,-10,argb);
    this.addStripCorner(0,10,argb);     
};

VectorRenderer.prototype.addZoomArrows = function(x, y, width, height, argb)
{
    this.startStrip();      
    this.setStripCornerTransformation(width/200.0,0, x+width/2,y+width/2);
    this.addStripCorner(-30,-60,argb);
    this.addStripCorner(-10,-60,argb);
    this.addStripCorner(0,-90,argb);
    this.addStripCorner(10,-60,argb);
    this.addStripCorner(30,-60,argb);       
    this.addStripCorner(-10,-60,argb);
    this.addStripCorner(10,-60,argb);
    this.addStripCorner(-10,-40,argb);
    this.addStripCorner(10,-40,argb);
    this.addStripCorner(10,-40,argb);
    this.addStripCorner(-30,60,argb);
    this.addStripCorner(-30,60,argb);
    this.addStripCorner(-10,60,argb);
    this.addStripCorner(0,90,argb);
    this.addStripCorner(10,60,argb);
    this.addStripCorner(30,60,argb);        
    this.addStripCorner(-10,60,argb);
    this.addStripCorner(10,60,argb);
    this.addStripCorner(-10,40,argb);
    this.addStripCorner(10,40,argb);
};

VectorRenderer.prototype.addCheckMark = function(x, y, width, height, argb) 
{   
    this.startStrip();      
    this.setStripCornerTransformation(width/200.0,0, x+width/2,y+width/2);
    this.addStripCorner(-60,0,argb);
    this.addStripCorner(-80,20,argb);
    this.addStripCorner(-20,40,argb);
    this.addStripCorner(-20,80,argb);
    this.addStripCorner(60,-40,argb);       
    this.addStripCorner(80,-20,argb);
};

VectorRenderer.prototype.addStar = function(x, y, width,height, argb) 
{   
    this.startStrip();      
    this.setStripCornerTransformation(width/200.0,0, x+width/2,y+height/2);
    this.addStripCorner(0,0,argb);
    this.addStripCorner(0,100,argb);
    this.addStripCorner(0,0,argb);
    this.addStripCorner(-29,40,argb);
    this.addStripCorner(0,0,argb);
    this.addStripCorner(-95,30,argb);
    this.addStripCorner(0,0,argb);
    this.addStripCorner(-47,-15,argb);
    this.addStripCorner(0,0,argb);
    this.addStripCorner(-58,-80,argb);
    this.addStripCorner(0,0,argb);
    this.addStripCorner(0,-50,argb);
    this.addStripCorner(0,0,argb);
    this.addStripCorner(58,-80,argb);
    this.addStripCorner(0,0,argb);
    this.addStripCorner(47,-15,argb);
    this.addStripCorner(0,0,argb);
    this.addStripCorner(95,30,argb);
    this.addStripCorner(0,0,argb);
    this.addStripCorner(29,40,argb);};

"use strict";
// object allocator function
var TextRenderer = function()  
{   Renderer.call(this);
    this.program = 0;
    this.uMVPMatrix = 0;
    this.uTexture = 0;
    this.uTextureSize = 0;
    this.aCorner = 0;
    this.aColor = 0;
    this.aTextureCoordinates = 0;
    this.aDistanceThreshold = 0;
        
    this.iboIndex = 0;              // buffer holding short
    this.vboCorner = 0;             // buffer holding float[2] - destination coordinates (in pixel)
    this.vboColor = 0;              // buffer holding byte[4] - color 
    this.vboTextureCoordinates = 0; // buffer holding short[2] - font texture coordinates (in pixel)    
    this.vboDistanceThreshold = 0;  // buffer holding float  - distance field threshold value
    this.txFont = 0;                // texture buffer for the distance field representation of the font
    
    // client-side buffers to prepare the data before moving it into their gl counterparts
    this.numGlyphs = 0;
    this.bufferCorner = null;
    this.bufferColor = null;
    this.bufferTextureCoordinates = null;
    this.bufferDistanceThreshold = null;
            
    this.matrix = null;       // projection matrix

    this.glyph_coordinates = null;
    this.kerning = 0;   
    
    // data that needs loading
    this.textureSize = null;    
};
TextRenderer.prototype = Object.create(Renderer.prototype);


TextRenderer.WEIGHT_THIN  = 150; // 135;
TextRenderer.WEIGHT_PLAIN = 135; // 120;
TextRenderer.WEIGHT_BOLD  = 120; // 100;
    
TextRenderer.vertexShaderCode =
            "uniform mat4 uMVPMatrix;      "+
            "uniform vec2 uTextureSize;    "+   // width/height of texture in pixels
            "attribute vec2 aCorner;       "+   // location on screen (before transformation)
            "attribute vec4 aColor;               "+   // color to apply to font  
            "attribute vec2 aTextureCoordinates;  "+   // coordinate in texture (in pixels)   
            "attribute float aDistanceThreshold;  "+   // threshold for inside outside decision
            "varying vec2 vTextureCoordinates;    "+      // coordinate in texture (in 0.0 - 1.0) to be passed to fragment shader
            "varying vec4 vColor;                 "+                   // color to be passed to fragment shader
            "varying float vDistanceThreshold;    "+ // distance threshold to be passed to fragment shader
            "void main() {                        "+
            "  vec4 p;                            "+
            "  p[0] = aCorner[0];                 "+
            "  p[1] = aCorner[1];                 "+
            "  p[2] = 0.0;                        "+
            "  p[3] = 1.0;                        "+
            "  gl_Position = uMVPMatrix * p;      "+
            "  vTextureCoordinates[0] = aTextureCoordinates[0]/uTextureSize[0]; "+
            "  vTextureCoordinates[1] = aTextureCoordinates[1]/uTextureSize[1]; "+
            "  vDistanceThreshold = aDistanceThreshold/255.0;                   "+
            "  vColor = aColor / 255.0;                                         "+
            "}                                         "+
            "";    
TextRenderer.fragmentShaderCode =
            "uniform sampler2D uTexture;                      "+  // uniform specifying the texture 
            "varying mediump vec2 vTextureCoordinates;        "+  // input from vertex shader
            "varying mediump vec4 vColor;                     "+  // input from vertex shader
            "varying mediump float vDistanceThreshold;        "+  // input from vertex shader
            "void main() {                                    "+
            "   mediump float distance = texture2D(uTexture,vTextureCoordinates)[3];  "+ 
            "   gl_FragColor = vColor;                                                "+
            "   gl_FragColor[3] = vColor[3] * smoothstep(vDistanceThreshold-0.08,vDistanceThreshold+0.08,distance); "+
            "}                                                                        "+
            "";
    
TextRenderer.MAXGLYPHS = 5000;  // number of glyphs that can be rendered in one call


TextRenderer.prototype.$ = function(game)
{
    Renderer.prototype.$.call(this,game);
    var gl = game.gl;
    
        // create shaders and link together
        this.program = this.createProgram(TextRenderer.vertexShaderCode,TextRenderer.fragmentShaderCode);
        // extract the bindings for the uniforms and attributes
        this.uMVPMatrix = gl.getUniformLocation(this.program, "uMVPMatrix");
        this.uTexture = gl.getUniformLocation(this.program, "uTexture");
        this.uTextureSize = gl.getUniformLocation(this.program, "uTextureSize");
        this.aCorner = gl.getAttribLocation(this.program, "aCorner");
        this.aColor = gl.getAttribLocation(this.program, "aColor");
        this.aTextureCoordinates = gl.getAttribLocation(this.program, "aTextureCoordinates");
        this.aDistanceThreshold = gl.getAttribLocation(this.program, "aDistanceThreshold");
        
        // create index buffer
        var sb = new Uint16Array(6*TextRenderer.MAXGLYPHS);
        for (var i=0; i<TextRenderer.MAXGLYPHS; i++)
        {   sb[6*i+0] = 4*i+0; 
            sb[6*i+1] = 4*i+1; 
            sb[6*i+2] = 4*i+2; 
            sb[6*i+3] = 4*i+1; 
            sb[6*i+4] = 4*i+3; 
            sb[6*i+5] = 4*i+2; 
        }
        this.iboIndex = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iboIndex);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sb, gl.STATIC_DRAW);
        sb = null;
        
        // create buffers (gl and client) that hold 4 entries for every glyph
        this.bufferCorner = new Float32Array(2*4*TextRenderer.MAXGLYPHS);
        this.vboCorner = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboCorner);
        gl.bufferData(gl.ARRAY_BUFFER, 2*4*4*TextRenderer.MAXGLYPHS, gl.DYNAMIC_DRAW);

        this.bufferColor = new Uint8Array(4*4*TextRenderer.MAXGLYPHS);
        this.vboColor = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboColor);
        gl.bufferData(gl.ARRAY_BUFFER, 4*4*TextRenderer.MAXGLYPHS, gl.DYNAMIC_DRAW);

        this.bufferTextureCoordinates = new Uint16Array(2*4*TextRenderer.MAXGLYPHS);
        this.vboTextureCoordinates = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTextureCoordinates);
        gl.bufferData(gl.ARRAY_BUFFER, 2*4*2*TextRenderer.MAXGLYPHS, gl.DYNAMIC_DRAW);

        this.bufferDistanceThreshold = new Float32Array(4*TextRenderer.MAXGLYPHS);
        this.vboDistanceThreshold = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboDistanceThreshold);
        gl.bufferData(gl.ARRAY_BUFFER, 4*4*TextRenderer.MAXGLYPHS, gl.DYNAMIC_DRAW);

        this.matrix = new Array(16);
                                
        var that = this;    
        // load and decode the font glyph description 
        Game.getJSON
        (   "gfx/fontdesc.json", 
            function(json)
            {   that.glyph_coordinates = new Array(400);
                for (var i=0; i<json.glyphs.length; i++) 
                {   var g = json.glyphs[i];            
                    var code = g.code;
                    if (code>=0 && code<that.glyph_coordinates.length)
                    {   that.glyph_coordinates[code] = [ g.x, g.y, g.width, g.height ];
                    }
                    that.kerning = json.kerning;
                }
            }
        );
        
        // load the font bitmap
        this.txFont = gl.createTexture();        
        this.loadImageToTexture
        (   "gfx/font.png", 
            this.txFont, 
            true, 
            function(metrics) 
            {   that.textureSize = metrics;
            }
        );
        
        return this;
};

TextRenderer.prototype.isLoaded = function()
{
    return this.textureSize!==null && this.glyph_coordinates!==null;
};

TextRenderer.prototype.startDrawing = function()
{
    this.numGlyphs = 0;
        
    // transfer coordinate system from the opengl-standard to the css unit system (0,0 is top left)
    Matrix.setIdentityM(this.matrix,0);     
    Matrix.translateM(this.matrix,0, -1.0,1.0, 0);     
    Matrix.scaleM(this.matrix,0, 2.0/this.game.screenwidth, -2.0/this.game.screenheight, 1.0);
};

TextRenderer.prototype.addIconGlyph = function(code, x, y, height, argb)
{
    this.addGlyph(code,x,y,height,false,argb,120,false);
}

TextRenderer.prototype.addMirrorIconGlyph = function(code, x, y, height, argb)
{
    this.addGlyph(code,x,y,height,false,argb,120,true);
}

TextRenderer.prototype.addGlyph = function(code, x, y, height, rightaligned, argb, weight, mirror)
{
    var coordinates = code<this.glyph_coordinates.length ? this.glyph_coordinates[code] : null;
    if (coordinates==null)
    {   coordinates = this.glyph_coordinates[32];  // unknown letter default to space
    }
        
    var tx1 = coordinates[0];
    var ty1 = coordinates[1];
    var twidth = coordinates[2]; 
    var theight = coordinates[3];
    var tx2 = tx1+twidth;
    var ty2 = ty1+theight;
    if (mirror)
    {   tx1 = tx2;
        tx2 = coordinates[0];
    }
    
    var magnification = height / theight;
    var width = twidth * magnification;           
    var x1 = x - this.kerning*magnification;
    var x2 = (x1 + width);
    if (rightaligned)
    {   x2 = x + this.kerning*magnification;
        x1 = x2-width;              
    }
    var y1 = y;
    var y2 = (y + height);
    var c0 = (argb>>16) & 0xff;
    var c1 = (argb>>8)  & 0xff; 
    var c2 = (argb>>0)  & 0xff;    
    var c3 = (argb>>24) & 0xff;   
                        
    var b = this.bufferCorner;
    var pos = 2*4*this.numGlyphs;
    b[pos+0] = x1;
    b[pos+1] = y1;
    b[pos+2] = x2;
    b[pos+3] = y1;
    b[pos+4] = x1;
    b[pos+5] = y2;
    b[pos+6] = x2;
    b[pos+7] = y2;    
    b = this.bufferTextureCoordinates;
    pos = 2*4*this.numGlyphs;    
    b[pos+0] = tx1;
    b[pos+1] = ty1;
    b[pos+2] = tx2;
    b[pos+3] = ty1;
    b[pos+4] = tx1;
    b[pos+5] = ty2;
    b[pos+6] = tx2;
    b[pos+7] = ty2;
    b = this.bufferColor;
    pos = 4*4*this.numGlyphs;
    b[pos+0] = c0;
    b[pos+1] = c1;
    b[pos+2] = c2;
    b[pos+3] = c3;
    b[pos+4] = c0;
    b[pos+5] = c1;
    b[pos+6] = c2;
    b[pos+7] = c3;
    b[pos+8] = c0;
    b[pos+9] = c1;
    b[pos+10] = c2;
    b[pos+11] = c3;
    b[pos+12] = c0;
    b[pos+13] = c1;
    b[pos+14] = c2;
    b[pos+15] = c3;    
    b = this.bufferDistanceThreshold;
    pos = 4*this.numGlyphs;
    b[pos+0] = weight;
    b[pos+1] = weight;
    b[pos+2] = weight;
    b[pos+3] = weight;

    this.numGlyphs++;
    
    return width - 1*this.kerning*magnification;         
};
    
TextRenderer.prototype.flush = function()
{
        if (this.numGlyphs<1) return;
        
        var gl = this.game.gl;
        
        // transfer buffers into opengl 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboCorner);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, 
            this.bufferCorner.subarray(0,this.numGlyphs*2*4) );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboColor);        
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, 
            this.bufferColor.subarray(0,this.numGlyphs*4*4) );
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTextureCoordinates);       
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, 
            this.bufferTextureCoordinates.subarray(0,this.numGlyphs*2*4) );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboDistanceThreshold);        
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, 
            this.bufferDistanceThreshold.subarray(0,this.numGlyphs*4) );
    
        // set up gl for painting all triangles
        gl.useProgram(this.program);
        
        // set texture unit 0 to use the texture and tell shader to use texture unit 0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.txFont);
        gl.uniform1i(this.uTexture, 0);
        
        // enable all vertex attribute arrays and set pointers
        gl.enableVertexAttribArray(this.aCorner);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboCorner);
        gl.vertexAttribPointer(this.aCorner, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(this.aColor);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboColor);
        gl.vertexAttribPointer(this.aColor, 4, gl.UNSIGNED_BYTE, false, 0, 0);

        gl.enableVertexAttribArray(this.aTextureCoordinates);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTextureCoordinates);
        gl.vertexAttribPointer(this.aTextureCoordinates, 2, gl.SHORT, false, 0, 0);

        gl.enableVertexAttribArray(this.aDistanceThreshold);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboDistanceThreshold);
        gl.vertexAttribPointer(this.aDistanceThreshold, 1, gl.FLOAT, false, 0, 0);

        // set uniform data 
        gl.uniformMatrix4fv(this.uMVPMatrix, false, this.matrix);
        gl.uniform2f (this.uTextureSize, this.textureSize[0], this.textureSize[1]);

        // Draw all quads in one big call
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iboIndex);
        gl.drawElements(gl.TRIANGLES,6*this.numGlyphs, gl.UNSIGNED_SHORT, 0);

        // disable arrays
        gl.disableVertexAttribArray(this.aCorner);
        gl.disableVertexAttribArray(this.aColor);
        gl.disableVertexAttribArray(this.aTextureCoordinates);
        gl.disableVertexAttribArray(this.aDistanceThreshold);
        
        this.numGlyphs = 0;
};
    
    
TextRenderer.prototype.determineSubStringWidth = function(string, start, length, height)
{   var total = 0;
    for (var i=start; i<start+length; i++)
    {   total += this.determineGlyphWidth(string.charCodeAt(i), height);
    }
    return total;   
};

TextRenderer.prototype.determineStringWidth = function(string, height)
{   var total = 0;
    var len = string.length;
    for (var i=0; i<len; i++)
    {   total += this.determineGlyphWidth(string.charCodeAt(i), height);
    }
    return total;
};

TextRenderer.prototype.determineNumberWidth = function(number, height)
{   var total = 0;
    if (number<0)
    {   total = this.determineGlyphWidth(32,height);  
        number = -number;
    }
    do
    {   var lastdigit = number % 10;
        total += this.determineGlyphWidth(48+lastdigit,height);
        number = Math.floor(number/10);
    } while (number>0);
    return total;
};

TextRenderer.prototype.determineGlyphWidth = function(c, height)
{   var w = 0;
    if (c<this.glyph_coordinates.length)
    {   var coordinates = this.glyph_coordinates[c];
        if (coordinates!==null)
        {   var twidth = coordinates[2];
            var theight = coordinates[3];                               
            var magnification = height / theight;
            w = ((twidth*magnification) - (this.kerning*magnification));
        }
    }
    return w;
};


TextRenderer.prototype.wordWrap = function(string, height, pagewidth)
{       var v = [];
    
        var start = 0;
        var len = string.length;
        while (start<len)
        {   // skip spaces at start of lines
            if (string.charCodeAt(start)==32)
            {   start++;
            }           
            else
            {   // search until find the biggest still fitting string
                var endthatfits = start;
                var endofwords = string.indexOf(" ",start);
                if (endofwords<0) endofwords=len;
                while (this.determineSubStringWidth(string, start,endofwords-start, height) < pagewidth)
                {   endthatfits = endofwords;
                    if (endofwords==len)
                    {   break;
                    }
                    else
                    {   endofwords = string.indexOf(" ",endofwords+1);
                        if (endofwords<0)
                        {   endofwords=len;
                        }
                    }                   
                }
                // if some fitting text was found, put it into line
                if (endthatfits>start)
                {   v.push(string.substring(start,endthatfits));
                    start=endthatfits;
                }               
                // otherwise use the whole next word even if it does not fit
                else
                {   v.push(string.substring(start,endofwords));
                    start=endofwords;
                }
            }
        }           

        return v;       
};
    
TextRenderer.prototype.addString = function(string, x, y, height, rightaligned, argb, weight)
{       
// console.log("addString",string,x,y,height,rightaligned,argb,weight);
        var x2 = x;
        if (rightaligned)
        {   for (var i=string.length-1; i>=0; i--)
            {   x2 -= this.addGlyph(string.charCodeAt(i), x2,y,height, rightaligned, argb, weight, false);  
            }       
        }
        else
        {   for (var i=0; i<string.length; i++)
            {   x2 += this.addGlyph(string.charCodeAt(i), x2,y,height, rightaligned, argb, weight, false);  
            }
        }
        return x2;
};
    
TextRenderer.prototype.addNumber = function(number, x, y, height, rightaligned, argb, weight)
{
        var x2 = x;
        var minussign=false;
        if (number<0)
        {   minussign = true;
            number = -number;
        }
        if (rightaligned)
        {   do
            {   var lastdigit = number % 10;
                x2 -= this.addGlyph(48+lastdigit, x2,y,height, rightaligned, argb, weight, false);
                number = Math.floor(number/10);
            } while (number>0);
            if (minussign)
            {   x2 -= this.addGlyph (45, x2,y,height, rightaligned, argb, weight, false);
            }
        }
        else        
        {   if (minussign)
            {   x2 += this.addGlyph (45, x2,y,height, rightaligned, argb, weight, false);
            }
            var highestdigit = 1;
            while (number>=highestdigit*10)
            {   highestdigit*=10;
            } 
            while (highestdigit>0)
            {   
                var digit = Math.floor(number / highestdigit) % 10;
                x2 += this.addGlyph(48 + digit, x2,y,height,rightaligned, argb, weight, false);
                highestdigit = Math.floor(highestdigit/10);
            }
        }
        return x2;
};   
    

"use strict";
var TileRenderer = function() 
{   Renderer.call(this);
    this.program = 0;
    this.uMVPMatrix = 0;
    this.uTexture = 0;
    this.aCorner = 0;
    this.aTile = 0
    
    this.iboIndex = 0;       // buffer holding short
    this.vboCorner = 0;      // buffer holding byte[4][2] = {0,0},{1,0},{0,1},{1,1}  for each tile  
    this.vboTile = 0;        // buffer holding short[4] - x,y,tile,modifier  for each tile corner, 4 times each
    this.txTexture = 0;      // texture buffer
    
    // client-side buffers to prepare the data before moving it into their gl counterparts
    this.numTiles = 0;
    this.bufferTile = null;   // holding x,y,tile,modifier 
    this.matrix = null;       // projection matrix
    this.matrix2 = null;      // projection matrix for second player
    this.havematrix2 = false;        // is second matrix present?
    
    // data for the loading process
    this.imageList = null;        // Map: string -> array of tile indizes (array is created empty before first load)
    this.imagesRequested = null;  // Map: string -> true: all images that have been requested but are not loaded yet
    this.tilesAssigned = 0;       // number of tiles that have been assigned a spot in the texture atlas
    
    this.loadedTileSize = 0;
    this.tmpCanvas = null;
};    
TileRenderer.prototype = Object.create(Renderer.prototype);
    
    
TileRenderer.MAXTILES = 64*64;

TileRenderer.ATLASROWS = 36;
TileRenderer.ATLASCOLUMNS = 36;

    
TileRenderer.vertexShaderCode =
            "uniform mat4 uMVPMatrix;                  "+
            "attribute vec2 aCorner;                   "+    // one of 0,0  0,1  1,0,  1,1
            "attribute vec4 aTile;                     "+    // input as x,y,tile,modifiers
            "varying vec2 vTextureCoordinates;         "+    // output to fragment shader
            "float idiv(float a, float b) {            "+    //  to work around bugs in integer arithmetic
            "  return floor(a/b+0.00001);              "+    //  use only floats for calculations even if
            "}                                         "+    //  we really meant to do integer division
            "void main() {                             "+
            "  float ty = idiv(aTile[2],"+TileRenderer.ATLASCOLUMNS+".0); "+     // y position (in tiles in atlas)
            "  float tx = aTile[2]-ty*"+TileRenderer.ATLASCOLUMNS+".0;    "+     // x position (in tiles in atlas)
            "  float rotate = idiv(aTile[3],60.0);        "+     // rotation modifier
            "  float shrink = aTile[3]-rotate*60.0;       "+     // shrink modifier
            "  vTextureCoordinates[0] = (tx+aCorner[0]*0.9375)/"+TileRenderer.ATLASCOLUMNS+".0;  "+
            "  vTextureCoordinates[1] = (ty+aCorner[1]*0.9375)/"+TileRenderer.ATLASROWS+".0; "+
            "  float px = aCorner[0]-0.5;                 "+    // bring center of tile to 0/0 
            "  float py = aCorner[1]-0.5;                 "+
            "  px = px*(1.0-shrink/60.0);                 "+    // apply shrink value
            "  py = py*(1.0-shrink/60.0);                 "+
            "  float si = sin(rotate*0.017453292519943);  "+   // degrees -> rad 
            "  float co = cos(rotate*0.017453292519943);  "+
            "  float px2 = px*co + py*si;                 "+    // rotation value
            "  py = (-px*si) + py*co;                     "+
            "  px = px2;                                  "+
            "  vec4 p;                                    "+
            "  p[0] = aTile[0]+(px+0.5)*60.0; "+
            "  p[1] = aTile[1]+(py+0.5)*60.0; "+
            "  p[2] = 0.0;                               "+
            "  p[3] = 1.0;                               "+
            "  gl_Position = uMVPMatrix * p;             "+
            "} ";   
TileRenderer.fragmentShaderCode =
            "varying mediump vec2 vTextureCoordinates;        "+  // input from vertex shader
            "uniform sampler2D uTexture;                      "+  // uniform specifying the texture 
            "void main() {                                    "+
            "   gl_FragColor = texture2D(uTexture,vTextureCoordinates);  "+  
            "}                                                "+
            "";
    
    
// set up opengl  and load textures
TileRenderer.prototype.$ = function(game,imagelist)
{
    Renderer.prototype.$.call(this,game);
    var gl = game.gl;
    
    // allocate memory for projection matrix
    this.matrix = new Array(16);
    this.matrix2 = new Array(16);
                
    // create shaders and link together
    this.program = this.createProgram(TileRenderer.vertexShaderCode,TileRenderer.fragmentShaderCode);        
    // extract the bindings for the uniforms and attributes
    this.uMVPMatrix = gl.getUniformLocation(this.program, "uMVPMatrix");
    this.uTexture = gl.getUniformLocation(this.program, "uTexture");
    this.aCorner = gl.getAttribLocation(this.program, "aCorner");
    this.aTile = gl.getAttribLocation(this.program, "aTile");

    // index buffer (to paint quads, picking the vertices from the correct position)
    this.iboIndex = gl.createBuffer();
    var sb = new Uint16Array(6*TileRenderer.MAXTILES);
    for (var i=0; i<TileRenderer.MAXTILES; i++)
    {   sb[i*6+0] = 0*TileRenderer.MAXTILES+i; 
        sb[i*6+1] = 1*TileRenderer.MAXTILES+i;
        sb[i*6+2] = 2*TileRenderer.MAXTILES+i; 
        sb[i*6+3] = 1*TileRenderer.MAXTILES+i;
        sb[i*6+4] = 3*TileRenderer.MAXTILES+i; 
        sb[i*6+5] = 2*TileRenderer.MAXTILES+i; 
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iboIndex);    
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sb, gl.STATIC_DRAW);
    sb = null;
    
    // buffer for the tile corner identifiers 
    this.vboCorner = gl.createBuffer();
    var bb = new Uint8Array(TileRenderer.MAXTILES*4*2);
    for (var i=0; i<TileRenderer.MAXTILES; i++)
    {   bb[2*i+0] = 0; 
        bb[2*i+1] = 0; 
    }
    for (var i=TileRenderer.MAXTILES; i<2*TileRenderer.MAXTILES; i++)
    {   bb[2*i+0] = 1;
        bb[2*i+1] = 0; 
    }
    for (var i=2*TileRenderer.MAXTILES; i<3*TileRenderer.MAXTILES; i++)
    {   bb[2*i+0] = 0;
        bb[2*i+1] = 1; 
    }
    for (var i=3*TileRenderer.MAXTILES; i<4*TileRenderer.MAXTILES; i++)
    {   bb[2*i+0] = 1;
        bb[2*i+1] = 1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboCorner);
    gl.bufferData(gl.ARRAY_BUFFER, bb, gl.STATIC_DRAW);    
    bb = null;

    // buffer for tiles info can not be pre-computed, but client-side and gl buffers are allocated
    this.vboTile = gl.createBuffer();
    this.numTiles = 0;
    this.bufferTile = new Uint16Array(TileRenderer.MAXTILES*4);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTile);
    gl.bufferData(gl.ARRAY_BUFFER, 2*(TileRenderer.MAXTILES*4*4), gl.DYNAMIC_DRAW);
        
    // trigger loading textures
    this.imageList = new Map();
    for (var i=0; i<imagelist.length; i++)
    {   this.imageList.set(imagelist[i], new Array(0));
    }    
    this.imagesRequested = new Map();
    this.numTilesAssigned = 0;
    this.loadOrReloadAllImages();
    
    return this;
};

// handle the loading (or reloading after zoom level change) of tile textures
TileRenderer.prototype.loadOrReloadAllImages = function()
{
    // only check if reload is necessary
    if (this.loadedTileSize==this.game.pixeltilesize) { return; }
    
    var gl = this.game.gl;
    
    // if there is already an old texture atlas present, remove it
    if (this.txTexture)
    {   gl.deleteTexture(this.txTexture)
        this.txTexture = 0;
    }
    
    // memorize which size the loaded tiles are kept at
    this.loadedTileSize = this.game.pixeltilesize;
    var sizewithmargin = Math.round(this.loadedTileSize / 0.9375);  // (60->64) 

    // create the buffer for the texture atlas
    this.txTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.txTexture);
    gl.texImage2D
    (   gl.TEXTURE_2D, 0, gl.RGBA, 
        sizewithmargin*TileRenderer.ATLASCOLUMNS,
        sizewithmargin*TileRenderer.ATLASROWS,
        0, gl.RGBA, gl.UNSIGNED_BYTE, null
    );

//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // LINEAR);
//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // LINEAR); // NEAREST);             
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    // prepare temporary canvas for scaling
    this.tmpCanvas = document.createElement('canvas');
    this.tmpCanvas.width = this.loadedTileSize;
    this.tmpCanvas.height = this.loadedTileSize;
    
    // trigger loading of all images that are not currently in process of being loaded already
    this.imageList.forEach
    (   function(value,key,map)
        {   if (!this.imagesRequested.has(key))
            {   this.startLoadImage(key);
            }
        },
        this
    );
}

TileRenderer.prototype.startLoadImage = function(filename)
{
    this.imagesRequested.set(filename,true);
    var image = new Image();
    
    var that = this;
    image.addEventListener
    (   'load', function() 
        {   var gl = that.game.gl;
        
            var h = image.naturalHeight;
            var w = h;
            var cols = Math.max(1,Math.floor(image.naturalWidth/w));
            
            var tiles = that.imageList.get(filename);
            if (tiles.length<1)
            {   for (var i=0; i<cols; i++) 
                {   tiles.push(that.numTilesAssigned++);
                }
            }
            gl.bindTexture(gl.TEXTURE_2D, that.txTexture);
            var cc = that.tmpCanvas.getContext("2d");

            for (var i=0; i<cols; i++) 
            {   var sizewithmargin = Math.round(that.loadedTileSize / 0.9375);  // (60->64) 

                cc.clearRect(0,0, that.loadedTileSize, that.loadedTileSize);
                cc.drawImage
                (   image, w*i, 0, w, h, 
                    0,0, that.loadedTileSize, that.loadedTileSize
                );
//                cc.fillStyle = "orange";
//                cc.fillRect(10,10,40,40);
                
                gl.texSubImage2D
                (   gl.TEXTURE_2D, 
                    0, 
                    (tiles[i] % TileRenderer.ATLASCOLUMNS) * sizewithmargin,
                    Math.floor(tiles[i] / TileRenderer.ATLASCOLUMNS) * sizewithmargin, 
                    gl.RGBA, 
                    gl.UNSIGNED_BYTE,
                    that.tmpCanvas 
                );
            }                        
            
            that.imagesRequested.delete(filename);
            
            if (that.imagesRequested.size==0)
            {   console.log
                (   "Loaded "+that.imageList.size+" images"
                    +" into "+that.numTilesAssigned+" of " 
                    +TileRenderer.ATLASCOLUMNS * TileRenderer.ATLASROWS+" tiles"
                    +" ("+that.loadedTileSize+"x"+that.loadedTileSize+")"
                );
                that.game.setDirty();
            }
        }
    );
    image.addEventListener
    (   'error', function()
        {   console.log("Error loading image "+fullname);
        }
    );
    
    var fullname = "art/" + filename + ".png";
    image.src = fullname;
//   console.log("started loading",fullname);
};

TileRenderer.prototype.isLoaded = function()
{
    return this.imagesRequested.size == 0;
};
    
TileRenderer.prototype.getImage = function(filename)
{
    var tiles = this.imageList.get(filename);
    if ((!tiles) || tiles.length<1) 
    {   console.log("Referenced non-loaded image:",filename);
        return [];
    }
    return tiles;
};    
    
TileRenderer.prototype.startDrawing = function(offx0, offy0, offx1, offy1)
{  
    // initialize the drawing buffers
    this.numTiles = 0;
    var viewportwidth = this.game.pixelwidth;
    var viewportheight = this.game.pixelheight;
    var tilezoom = this.loadedTileSize / 60.0;
    
    // snap offsets to true pixels
    offx0 = Math.round(offx0*tilezoom) / tilezoom;
    offy0 = Math.round(offy0*tilezoom) / tilezoom;
    offx1 = Math.round(offx1*tilezoom) / tilezoom;
    offy1 = Math.round(offy1*tilezoom) / tilezoom;
    
    // when having same offsets, only one draw is necessary      
    if (offx0==offx1 && offy0==offy1)
    {   Matrix.setIdentityM(this.matrix,0);     
        Matrix.translateM(this.matrix,0, -1.0,1.0, 0);     
        Matrix.scaleM(this.matrix,0, 2.0*tilezoom/viewportwidth, -2.0*tilezoom/viewportheight, 1.0);            
        Matrix.translateM(this.matrix,0, offx0, offy0, 0);
        this.havematrix2 = false;
    }
    // must draw 2 screens with a terminator line so there is a piece of each players area visible
    else                        
    {       // calculate the normal vector (2d) of the delimiter line  (clockwise, 0=right)
            var screendiagonal = Math.sqrt(viewportwidth*viewportwidth+viewportheight*viewportheight);
            var angle = Math.atan2(offy1-offy0,offx0-offx1); 

            // start with normal matrix for first player
            Matrix.setIdentityM(this.matrix,0);
            // make the matrix tilt to let half of the screen be nearer than 0.0 (which will become invisible because of the near-plane clipping)
            this.matrix[2] = -Math.cos(angle)/(screendiagonal/viewportwidth); 
            this.matrix[6] = -Math.sin(angle)/(screendiagonal/viewportheight);
                
            // transform to a coordinate system with the units as pixels, with 0,0 at top left corner and the z=0 goes to the near plane
            Matrix.translateM(this.matrix,0, -1.0,1.0, -1.0 - (2.0/screendiagonal));     
            Matrix.scaleM(this.matrix,0, 2.0*tilezoom/viewportwidth, -2.0*tilezoom/viewportheight, 1.0);
            
            // move to desired view position 
            Matrix.translateM(this.matrix,0,offx0,offy0, 0.0);                      

            // start with normal matrix for second player
            Matrix.setIdentityM(this.matrix2,0);
            // make the matrix tilt to let half of the screen be nearer than 0.0 (which will become invisible because of the near-plane clipping)
            this.matrix2[2] = Math.cos(angle)/(screendiagonal/viewportwidth); 
            this.matrix2[6] = Math.sin(angle)/(screendiagonal/viewportheight); 
                
            // transform to a coordinate system with the units as pixels, with 0,0 at top left corner and the z=0 goes to the near plane
            Matrix.translateM(this.matrix2,0, -1.0,1.0, -1.0 - (2.0/screendiagonal));        
            Matrix.scaleM(this.matrix2,0, 2.0*tilezoom/viewportwidth, -2.0*tilezoom/viewportheight, -1.0);
            
            // move to desired view position 
            Matrix.translateM(this.matrix2,0,offx1,offy1, 0.0);

            this.havematrix2 = true;
        }
};
    
TileRenderer.prototype.addTile = function(x, y, tile)
{        
    var b = this.bufferTile;
    var target = 4*this.numTiles;
    b[target+0] = x;
    b[target+1] = y;
    b[target+2] = (tile&0x7fff);
    b[target+3] = (tile>>16)&0x7fff;
    this.numTiles++;
};

TileRenderer.prototype.startDrawingMini = function(leftborder,columns,rows)
{  
    // initialize the drawing buffers
    this.numTiles = 0;
    var viewportwidth = this.game.pixelwidth;
    var viewportheight = this.game.pixelheight;
    var pixelleft = (leftborder * this.game.pixelwidth)/this.game.screenwidth;
    var tilesize = this.loadedTileSize; 
    var tilezoom = tilesize / 120;     // use half size for decoration
    
    var offx0 = (viewportwidth/2+pixelleft/2)/tilezoom - columns*60/2;
    var offy0 = viewportheight/2/tilezoom - rows*60/2;
    var offx0 = Math.round(offx0*tilezoom) / tilezoom;
    var offy0 = Math.round(offy0*tilezoom) / tilezoom;
    
    Matrix.setIdentityM(this.matrix,0);
    Matrix.translateM(this.matrix,0, -1.0, 1.0, 0);
    Matrix.scaleM(this.matrix,0, 2.0*tilezoom/viewportwidth, -2.0*tilezoom/viewportheight, 1.0); 
    Matrix.translateM(this.matrix,0, offx0, offy0, 0);
    this.havematrix2 = false;
};

TileRenderer.prototype.startDrawDecoration = function()
{  
    // initialize the drawing buffers
    this.numTiles = 0;
    var viewportwidth = this.game.pixelwidth;
    var viewportheight = this.game.pixelheight;
    var tilezoom = this.loadedTileSize / 120;   // use half size for decoration

    Matrix.setIdentityM(this.matrix,0);
    Matrix.translateM(this.matrix,0, -1.0,1.0, 0);
    Matrix.scaleM(this.matrix,0, 2.0*tilezoom/viewportwidth, -2.0*tilezoom/viewportheight, 1.0);
    this.havematrix2 = false;
};    
    
TileRenderer.prototype.addDecorationTile = function(pixelx, pixely, tile)
{       
    var zoomfactor = (this.game.pixelwidth / this.game.screenwidth) * 120 / this.loadedTileSize;
    var b = this.bufferTile;
    var target = 4*this.numTiles;
    b[target+0] = Math.round(pixelx*zoomfactor) - 30;
    b[target+1] = Math.round(pixely*zoomfactor) - 30;
    b[target+2] = (tile&0x7fff);
    b[target+3] = (tile>>16)&0x7fff;
    this.numTiles++;
};

TileRenderer.prototype.flush = function()   
{
    // fast termination if nothing to draw
    if (this.numTiles<1) { return; }

        var g = this.game;
        var gl = g.gl;
        
        // transfer tile info buffer into opengl (consists of 4 identical parts) 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTile);
        var subarr = this.bufferTile.subarray(0,4*this.numTiles);
        for (var i=0; i<4; i++)     
        {   gl.bufferSubData(gl.ARRAY_BUFFER, i*2*4*TileRenderer.MAXTILES, subarr );
        }
        
        // set up gl for painting all quads
        gl.useProgram(this.program);
        
        // set texture unit 0 to use the texture and tell shader to use texture unit 0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.txTexture);
        gl.uniform1i(this.uTexture, 0);
        
        // enable all vertex attribute arrays and set pointers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboCorner);
        gl.enableVertexAttribArray(this.aCorner);
        gl.vertexAttribPointer(this.aCorner, 2, gl.UNSIGNED_BYTE, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTile);
        gl.enableVertexAttribArray(this.aTile);
        gl.vertexAttribPointer(this.aTile, 4, gl.SHORT, false, 0, 0);
               
        // set index array
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iboIndex);
        
        // draw the scene for one player
        gl.uniformMatrix4fv(this.uMVPMatrix, false, this.matrix);        
        gl.drawElements(gl.TRIANGLES, this.numTiles*6, gl.UNSIGNED_SHORT, 0);

        // optionally draw the scene for the second player also
        if (this.havematrix2)
        {   gl.uniformMatrix4fv(this.uMVPMatrix, false, this.matrix2);        
            gl.drawElements(gl.TRIANGLES, this.numTiles*6, gl.UNSIGNED_SHORT, 0);
        }
            
        // Disable vertex arrays
        gl.disableVertexAttribArray(this.aCorner);
        gl.disableVertexAttribArray(this.aTile);
        
        this.numTiles = 0;
};
    

"use strict";
// Tile specifier: A single 16-bit number encodes the index in the global tile 
// texture as well as rotation and shrinking effect. The opengl vertex shader will
// do the proper transformation when provided with this tile specifier.
// Organization of tiles to form animations: 
// All animations always consist of 15 FRAMESPERSTEP number of steps. 
// Normally these are just provided as an array of 15 tile specifiers. To form
// more complex objects, tile specifiers can be overlayed by appending 15 
// (or any multiple of this) more tile specifiers.


var LevelRenderer = function() 
{   TileRenderer.call(this);

    this.doneLoading = false;
    this.tmp_disable_static_tile = null;
    
    // default piece tiles: holding an animation for the case of highlight    
    // when not highlighting, only show the keyframe
    this.piecetiles = null;             // int[][]
    this.alternatepiecetiles = null;
    // special animations for context specific appearances 
    this.earthtiles = null;             // int[][] 
    this.walltiles = null;              // int[][]
    this.roundwalltiles = null;         // int[][]
    this.acidtiles_leftedge = null;     // int[][]  - contains two phases of animation 
    this.acidtiles_rightedge = null;    // int[][]  - contains two phases of animation 
    this.acidtiles_bothedges = null;    // int[][]  - contains two phases of animation 
    this.acidtiles_noedge = null;       // int[][]  - contains two phases of animation 
    
    // special animation information
    this.anim_earth_up = null;          // int[][]  -- contains animation for each configuration
    this.anim_earth_down = null;        // int[][]  -- contains animation for each configuration
    this.anim_earth_left = null;        // int[][]  -- contains animation for each configuration
    this.anim_earth_right = null;       // int[][]  -- contains animation for each configuration    
    
    this.anim_man1_nonmoving = null;
    this.anim_man2_nonmoving = null;
    this.anim_sapphire_away = null; 
    this.anim_sapphire_break = null; 
    this.anim_emerald_away = null;
    this.anim_citrine_away = null;
    this.anim_citrine_break = null;
    this.anim_ruby_away = null;   
    this.anim_rock_left = null;
    this.anim_rock_right = null;
    this.anim_bag_left = null;
    this.anim_bag_right = null;
    this.anim_bag_opening = null;
    this.anim_bomb_left = null;
    this.anim_bomb_right = null;
    this.anim_swamp_left = null;
    this.anim_swamp_right = null;
    this.anim_swamp_up = null;
    this.anim_swamp_down = null;
    this.anim_drop_left = null;
    this.anim_drop_right = null;
    this.anim_createdrop = null;
    this.anim_drophit = null;
    this.anim_lorry_left_up = null;
    this.anim_lorry_left_down = null;
    this.anim_lorry_up_right = null;
    this.anim_lorry_up_left = null;
    this.anim_lorry_right_down = null;
    this.anim_lorry_right_up = null;
    this.anim_lorry_down_left = null;
    this.anim_lorry_down_right = null;
    this.anim_bug_left_up = null;
    this.anim_bug_left_down = null;
    this.anim_bug_up_right = null;
    this.anim_bug_up_left = null;
    this.anim_bug_right_down = null;
    this.anim_bug_right_up = null;
    this.anim_bug_down_left = null;
    this.anim_bug_down_right = null;
    this.anim_timebomb_away = null;
    this.anim_timebomb_placement = null;
    this.anim_timebomb10_away = null;
    this.anim_keyred_away = null;
    this.anim_keyblue_away = null;
    this.anim_keygreen_away = null;
    this.anim_keyyellow_away = null;
    this.anim_pillow_move = null;    
    this.anim_laser_h = null;
    this.anim_laser_v = null;
    this.anim_laser_bl = null;
    this.anim_laser_br = null;
    this.anim_laser_tl = null;
    this.anim_laser_tr = null;
    this.anim_laser_left = null;  
    this.anim_laser_right = null; 
    this.anim_laser_up = null;    
    this.anim_laser_down = null; 
    this.anim_exit_closing = null;
    
    this.idle_converter = null;
};
LevelRenderer.prototype = Object.create(TileRenderer.prototype);

LevelRenderer.FRAMESPERSTEP = 15;

    // set up opengl  and load textures
LevelRenderer.prototype.$ = function(game)
{   
    TileRenderer.prototype.$.call(this,game, 
    [   "1man", "2man", 
        "1walklft", "1walkrgt", "1walkup", "1walkdwn", "1pushlft", "1pushrgt",
        "2walklft", "2walkrgt", "2walkup", "2walkdwn", "2pushlft", "2pushrgt", 
        "Earth All","Wall All", "Wall Round All",
        "Earth Right", "Sand", "Glass", "Stone Wall", "Round Stone Wall",
        "Wall Emerald", "Emerald", "Citrine", "Sapphire", "Ruby", 
        "Stone Right", "Bag", "Bomb", 
        "Exit Open", "Exit", "Swamp Move", "Swamp Grow", 
        "Drop Left", "Drop Right", "Drop Down", "Drop", "Converter", "Converter Working",
        "Timebomb", "Tickbomb", "TNT", "Safe", "Pillow", "Pillow Move", 
        "Elevator", "Conveyor Left", "Conveyor Right", 
        "Gun", "Acid", "Acid Left End", "Acid Right End", "Acid Both Ends",
        "Key Blue", "Key Red", "Key Green", "Key Yellow", 
        "Door Blue", "Door Red", "Door Green", "Door Yellow", "Door Onetime",
        "Door Onetime Closed", "Lorry", "Bug", 
        "YamYam Left", "YamYam Up", "YamYam Right", "YamYam Down", "YamYam", "Robot",
        "Explosion", "Explosion Deep", "Sapphire Break", "Citrine Break", 
        "Laser", "Laser Side", "Laser Reflect"
    ]);
    this.doneLoading = false;
    this.tmp_disable_static_tile = new Array(MAPWIDTH*MAPHEIGHT);
    Game.fillarray(this.tmp_disable_static_tile, false);
    return this;
};

LevelRenderer.prototype.isLoaded = function()    
{   
    if (this.doneLoading) return true;
    if (!TileRenderer.prototype.isLoaded.call(this)) return false;

    // ---- loading the piece tiles for key frame positions -----
    this.piecetiles = new Array(256);    
    this.alternatepiecetiles = new Array(256);    
    Game.fillarray(this.piecetiles, []);        
    // this.piecetiles[OUTSIDE] 
    this.piecetiles[MAN1] = this.getAnimation("1man");
    this.piecetiles[MAN2] = this.getAnimation("2man");                
    // this.piecetiles[AIR]
    // this.piecetiles[EARTH]     // has context-depending tiles
    this.piecetiles[SAND] = this.getAnimation("Sand");
    this.piecetiles[SAND_FULL] = this.createOverlayAnimation(this.getAnimation("Stone Right"), this.getAnimation("Sand") );    
    // this.piecetiles[WALL]       // has context-depending tiles
    // this.piecetiles[ROUNDWALL]  // has context-depending tiles
    this.piecetiles[GLASSWALL] = this.getAnimation("Glass");
    this.piecetiles[STONEWALL] = this.getAnimation("Stone Wall");
    this.piecetiles[ROUNDSTONEWALL] = this.getAnimation("Round Stone Wall");
    this.piecetiles[WALLEMERALD] = this.getAnimation("Wall Emerald");
    this.piecetiles[EMERALD] = this.getAnimation("Emerald");
    this.piecetiles[CITRINE] = this.getAnimation("Citrine");
    this.piecetiles[SAPPHIRE] = this.getAnimation("Sapphire")
    this.piecetiles[RUBY] = this.getAnimation("Ruby");
    this.piecetiles[ROCK] = this.createStillAnimation(this.getAnimation("Stone Right"));
//    this.piecetiles[ROCKEMERALD] = this.getAnimation("Stone Emerald");
    this.piecetiles[BAG] = this.createStillAnimation(this.getAnimation("Bag"));
    this.piecetiles[BOMB] = this.getAnimation("Bomb");         
    this.piecetiles[DOOR] = this.getAnimation("Exit");
    this.piecetiles[SWAMP] = this.getAnimation("Swamp Move");    
    this.piecetiles[DROP] = this.getAnimation("Drop");
    this.piecetiles[TIMEBOMB] = this.getAnimation("Timebomb");    
    this.piecetiles[ACTIVEBOMB5] = this.getAnimation("Tickbomb");
    this.piecetiles[TIMEBOMB10] = this.getAnimation("TNT");
    this.piecetiles[CONVERTER] = this.getAnimation("Converter Working");
    this.piecetiles[BOX] = this.getAnimation("Safe");
    this.piecetiles[CUSHION] = this.getAnimation("Pillow");
    this.piecetiles[ELEVATOR] = this.getAnimation("Elevator");
    this.piecetiles[CONVEYORLEFT] = this.getAnimation("Conveyor Left");
    this.piecetiles[CONVEYORLEFT].idling = true;
    this.piecetiles[CONVEYORRIGHT] = this.getAnimation("Conveyor Right");
    this.piecetiles[CONVEYORRIGHT].idling = true;
    // this.piecetiles[ACID]     // has context-depending tiles
    this.piecetiles[KEYBLUE] = this.getAnimation("Key Blue");
    this.piecetiles[KEYRED] = this.getAnimation("Key Red");
    this.piecetiles[KEYGREEN] = this.getAnimation("Key Green");
    this.piecetiles[KEYYELLOW] = this.getAnimation("Key Yellow");
    this.piecetiles[DOORBLUE] = this.getAnimation("Door Blue");
    this.piecetiles[DOORRED] = this.getAnimation("Door Red");
    this.piecetiles[DOORGREEN] = this.getAnimation("Door Green");
    this.piecetiles[DOORYELLOW] = this.getAnimation("Door Yellow");
    this.piecetiles[ONETIMEDOOR] = this.getAnimation("Door Onetime");
    this.piecetiles[LORRYLEFT] = this.createRotatedAnimation(this.getAnimation("Lorry"),180);
    this.piecetiles[LORRYDOWN] = this.createRotatedAnimation(this.getAnimation("Lorry"),-90);
    this.piecetiles[LORRYRIGHT] = this.createRotatedAnimation(this.getAnimation("Lorry"),0);
    this.piecetiles[LORRYUP] = this.createRotatedAnimation(this.getAnimation("Lorry"),90)
    this.piecetiles[BUGRIGHT] = this.createRotatedAnimation(this.getAnimation("Bug"), -90);
    this.piecetiles[BUGUP] = this.createRotatedAnimation(this.getAnimation("Bug"),0);
    this.piecetiles[BUGLEFT] = this.createRotatedAnimation(this.getAnimation("Bug"),90);
    this.piecetiles[BUGDOWN] = this.createRotatedAnimation(this.getAnimation("Bug"),180);
    this.piecetiles[YAMYAMLEFT] = this.getAnimation("YamYam Left");
    this.piecetiles[YAMYAMUP] = this.getAnimation("YamYam Up");
    this.piecetiles[YAMYAMRIGHT] = this.getAnimation("YamYam Right");
    this.piecetiles[YAMYAMDOWN] = this.getAnimation("YamYam Down");    
    this.piecetiles[YAMYAM] = this.getAnimation("YamYam");    
    this.piecetiles[YAMYAM_EXPLODE] = null; // this.getSubAnimation("Explosion", 0, 5);
    this.piecetiles[ROBOT] = this.getAnimation("Robot");
    this.piecetiles[ROBOT].idling = true;
    this.piecetiles[GUN0] = this.getAnimation("Gun");
    this.piecetiles[GUN1] = this.getAnimation("Gun");
    this.piecetiles[GUN2] = this.getAnimation("Gun");
    this.piecetiles[GUN3] = this.getAnimation("Gun"); 
    this.piecetiles[ROCK_FALLING] = this.createStillAnimation(this.getAnimation("Stone Right"));
    this.piecetiles[EMERALD_FALLING] = this.getAnimation("Emerald");
    this.piecetiles[BOMB_FALLING] = this.getAnimation("Bomb");
    this.piecetiles[BAG_FALLING] = this.createStillAnimation(this.getAnimation("Bag"));
    this.piecetiles[DOOR_OPENED] = this.getAnimation("Exit Open");
    this.piecetiles[DOOR_CLOSING] = this.getAnimation("Exit Open");
    this.piecetiles[DOOR_CLOSED] = this.getAnimation("Exit");
    this.piecetiles[LORRYLEFT_FIXED] = this.createRotatedAnimation(this.getAnimation("Lorry"),180);
    this.piecetiles[LORRYDOWN_FIXED] = this.createRotatedAnimation(this.getAnimation("Lorry"),270);
    this.piecetiles[LORRYRIGHT_FIXED] = this.createRotatedAnimation(this.getAnimation("Lorry"),0);
    this.piecetiles[LORRYUP_FIXED] = this.createRotatedAnimation(this.getAnimation("Lorry"),90)
    this.piecetiles[BUGRIGHT_FIXED] = this.createRotatedAnimation(this.getAnimation("Bug"),-90);
    this.piecetiles[BUGUP_FIXED] = this.createRotatedAnimation(this.getAnimation("Bug"),0);
    this.piecetiles[BUGLEFT_FIXED] = this.createRotatedAnimation(this.getAnimation("Bug"),90);
    this.piecetiles[BUGDOWN_FIXED] = this.createRotatedAnimation(this.getAnimation("Bug"),180);
    this.piecetiles[BOMB_EXPLODE] = this.createOverlayAnimation(this.getAnimation("Bomb"),this.getSubAnimation("Explosion", 0, 5));
    this.piecetiles[EXPLODE1_AIR] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_AIR] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_AIR] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_AIR] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_EMERALD] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_EMERALD] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_EMERALD] = this.createOverlayAnimation(this.getAnimation("Emerald"),this.getSubAnimation("Explosion", 3, 5));
    this.piecetiles[EXPLODE4_EMERALD] = this.createOverlayAnimation(this.getAnimation("Emerald"),this.getSubAnimation("Explosion", 4, 5));
    this.piecetiles[EXPLODE1_SAPPHIRE] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_SAPPHIRE] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_SAPPHIRE] = this.createOverlayAnimation(this.getAnimation("Sapphire"),this.getSubAnimation("Explosion", 3, 5));
    this.piecetiles[EXPLODE4_SAPPHIRE] = this.createOverlayAnimation(this.getAnimation("Sapphire"),this.getSubAnimation("Explosion", 4, 5));
    this.piecetiles[BIGBOMB_EXPLODE] = this.createOverlayAnimation(this.getAnimation("TNT"),this.getSubAnimation("Explosion Deep", 0, 5));
    this.piecetiles[BUG_EXPLODE] = null; // this.getSubAnimation("Explosion", 0, 5);
    this.piecetiles[LORRY_EXPLODE] = null; // this.getSubAnimation("Explosion", 0, 5);
    this.piecetiles[ACTIVEBOMB0] = this.getAnimation("Timebomb");
    this.piecetiles[ACTIVEBOMB1] = this.getAnimation("Tickbomb");
    this.piecetiles[ACTIVEBOMB2] = this.getAnimation("Timebomb");
    this.piecetiles[ACTIVEBOMB3] = this.getAnimation("Tickbomb");
    this.piecetiles[ACTIVEBOMB4] = this.getAnimation("Timebomb");
    this.piecetiles[TIMEBOMB_EXPLODE] = this.createOverlayAnimation(this.getAnimation("Tickbomb"),this.getSubAnimation("Explosion", 0, 5));
    this.piecetiles[RUBY_FALLING] = this.getAnimation("Ruby");
    this.piecetiles[SAPPHIRE_FALLING] = this.getAnimation("Sapphire"); 
    this.piecetiles[BAG_OPENING] = this.getAnimation("Bag");
    this.piecetiles[SAPPHIRE_BREAKING] = this.getAnimation("Sapphire Break");
    this.piecetiles[EXPLODE1_BAG] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_BAG] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_BAG] = this.createOverlayAnimation(
		this.createStillAnimation(this.getAnimation("Bag")),
		this.getSubAnimation("Explosion", 3, 5));
    this.piecetiles[EXPLODE4_BAG] = this.createOverlayAnimation(
		this.createStillAnimation(this.getAnimation("Bag")),
		this.getSubAnimation("Explosion", 4, 5));
    this.piecetiles[MAN1_LEFT] = this.getSubAnimation("1walklft", 0,2);
    this.piecetiles[MAN1_RIGHT] = this.getSubAnimation("1walkrgt", 0,2);
    this.piecetiles[MAN1_UP] = this.getAnimation("1walkup");
    this.piecetiles[MAN1_DOWN] = this.getAnimation("1walkdwn");    
    this.piecetiles[MAN1_DIGLEFT] = this.getSubAnimation("1walklft", 0,2);
    this.piecetiles[MAN1_DIGRIGHT] = this.getSubAnimation("1walkrgt", 0,2);
    this.piecetiles[MAN1_DIGUP] = this.getSubAnimation("1walkup", 0,2);
    this.piecetiles[MAN1_DIGDOWN] = this.getSubAnimation("1walkdwn", 0,2);
    this.piecetiles[MAN1_PUSHLEFT] = this.getSubAnimation("1pushlft", 0,2);
    this.piecetiles[MAN1_PUSHRIGHT] = this.getSubAnimation("1pushrgt", 0,2);
    this.piecetiles[MAN1_PUSHUP] = this.getAnimation("1walkup");
    this.piecetiles[MAN1_PUSHDOWN] = this.getAnimation("1walkdwn");    
    this.alternatepiecetiles[MAN1_LEFT] = this.getSubAnimation("1walklft", 1,2);
    this.alternatepiecetiles[MAN1_RIGHT] = this.getSubAnimation("1walkrgt", 1,2);
    this.alternatepiecetiles[MAN1_DIGLEFT] = this.getSubAnimation("1walklft", 1,2);
    this.alternatepiecetiles[MAN1_DIGRIGHT] = this.getSubAnimation("1walkrgt", 1,2);
    this.alternatepiecetiles[MAN1_PUSHLEFT] = this.getSubAnimation("1pushlft", 1,2);
    this.alternatepiecetiles[MAN1_PUSHRIGHT] = this.getSubAnimation("1pushrgt", 1,2);    
    this.piecetiles[MAN2_LEFT] = this.getSubAnimation("2walklft", 0,2);
    this.piecetiles[MAN2_RIGHT] = this.getSubAnimation("2walkrgt", 0,2);
    this.piecetiles[MAN2_UP] = this.getAnimation("2walkup");
    this.piecetiles[MAN2_DOWN] = this.getAnimation("2walkdwn");
    this.piecetiles[MAN2_DIGLEFT] = this.getSubAnimation("2walklft", 0,2);
    this.piecetiles[MAN2_DIGRIGHT] = this.getSubAnimation("2walkrgt", 0,2);
    this.piecetiles[MAN2_DIGUP] = this.getSubAnimation("2walkup", 0,2);
    this.piecetiles[MAN2_DIGDOWN] = this.getSubAnimation("2walkdwn", 0,2);
    this.piecetiles[MAN2_PUSHLEFT] = this.getSubAnimation("2pushlft", 0,2);
    this.piecetiles[MAN2_PUSHRIGHT] = this.getSubAnimation("2pushrgt", 0,2);
    this.piecetiles[MAN2_PUSHUP] = this.getAnimation("2walkup");
    this.piecetiles[MAN2_PUSHDOWN] = this.getAnimation("2walkdwn");
    this.alternatepiecetiles[MAN2_LEFT] = this.getSubAnimation("2walklft", 1,2);
    this.alternatepiecetiles[MAN2_RIGHT] = this.getSubAnimation("2walkrgt", 1,2);
    this.alternatepiecetiles[MAN2_DIGLEFT] = this.getSubAnimation("2walklft", 1,2);
    this.alternatepiecetiles[MAN2_DIGRIGHT] = this.getSubAnimation("2walkrgt", 1,2);
    this.alternatepiecetiles[MAN2_PUSHLEFT] = this.getSubAnimation("2pushlft", 1,2);
    this.alternatepiecetiles[MAN2_PUSHRIGHT] = this.getSubAnimation("2pushrgt", 1,2);    
    this.piecetiles[CITRINE_FALLING] = this.getAnimation("Citrine");
    this.piecetiles[CITRINE_BREAKING] = this.getAnimation("Citrine");
    this.piecetiles[ONETIMEDOOR_CLOSED] = this.getAnimation("Door Onetime Closed");
    this.piecetiles[EXPLODE1_TNT] = this.getSubAnimation("Explosion Deep", 1, 5);
    this.piecetiles[EXPLODE2_TNT] = this.getSubAnimation("Explosion Deep", 2, 5);
    this.piecetiles[EXPLODE3_TNT] = this.getSubAnimation("Explosion Deep", 3, 5);
    this.piecetiles[EXPLODE4_TNT] = this.getSubAnimation("Explosion Deep", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM0] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM0] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM0] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM0] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM1] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM1] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM1] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM1] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM2] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM2] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM2] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM2] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM3] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM3] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM3] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM3] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM4] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM4] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM4] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM4] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM5] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM5] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM5] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM5] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM6] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM6] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM6] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM6] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM7] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM7] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM7] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM7] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM8] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM8] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM8] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM8] = this.getSubAnimation("Explosion", 4, 5);

    // ---- context depending tile animations ---
    this.earthtiles = new Array(16);
    for (var i=0; i<16; i++) 
    {   this.earthtiles[i] = this.getSubAnimation("Earth All", 15-i, 16);
    }                   
    this.piecetiles[EARTH] = this.earthtiles[0];
    this.walltiles =  new Array(9);
    this.walltiles[0] = this.getSubAnimation("Wall All", 5, 9);  // nothing - wall - nothing      
    this.walltiles[1] = this.getSubAnimation("Wall All", 6, 9);  // wall    - wall - nothing
    this.walltiles[2] = this.getSubAnimation("Wall All", 2, 9);  // rounded - wall - nothing          
    this.walltiles[3] = this.getSubAnimation("Wall All", 7, 9);  // nothing - wall - wall         
    this.walltiles[4] = this.getSubAnimation("Wall All", 8, 9);  // wall    - wall - wall         
    this.walltiles[5] = this.getSubAnimation("Wall All", 0, 9);  // rounded - wall - wall     ??          
    this.walltiles[6] = this.getSubAnimation("Wall All", 3, 9);  // nothing - wall - rounded          
    this.walltiles[7] = this.getSubAnimation("Wall All", 1, 9);  // wall    - wall - rounded  ??          
    this.walltiles[8] = this.getSubAnimation("Wall All", 4, 9);  // rounded - wall - rounded          
    this.piecetiles[WALL] = this.walltiles[0];
    this.roundwalltiles = new Array(4);
    for (var i=0; i<4; i++) 
    {   this.roundwalltiles[i] = this.getSubAnimation("Wall Round All", i, 4);
    }                   
    this.piecetiles[ROUNDWALL] = this.roundwalltiles[0];
    this.acidtiles_noedge = new Array(2);
    this.acidtiles_noedge[0] = this.getSubAnimation("Acid",0,2);
    this.acidtiles_noedge[0].idling = true;
    this.acidtiles_noedge[1] = this.getSubAnimation("Acid",1,2)        
    this.acidtiles_noedge[1].idling = true;
    this.acidtiles_leftedge = new Array(2);
    this.acidtiles_leftedge[0] = this.getSubAnimation("Acid Left End",0,2);
    this.acidtiles_leftedge[0].idling = true;
    this.acidtiles_leftedge[1] = this.getSubAnimation("Acid Left End",1,2);
    this.acidtiles_leftedge[1].idling = true;
    this.acidtiles_rightedge = new Array(2);
    this.acidtiles_rightedge[0] = this.getSubAnimation("Acid Right End",0,2);
    this.acidtiles_rightedge[0].idling = true;
    this.acidtiles_rightedge[1] = this.getSubAnimation("Acid Right End",1,2);
    this.acidtiles_rightedge[1].idling = true;
    this.acidtiles_bothedges = new Array(2);
    this.acidtiles_bothedges[0] = this.getSubAnimation("Acid Both Ends",0,2);
    this.acidtiles_bothedges[0].idling = true;
    this.acidtiles_bothedges[1] = this.getSubAnimation("Acid Both Ends",1,2);
    this.acidtiles_bothedges[1].idling = true;
    this.piecetiles[ACID] = this.acidtiles_noedge[0];
    
       
    // load animations that can not be directly attached to a piece as their default 
    // (and piece tiles that are complicated to calculated in the code above)    
    this.anim_earth_right = new Array(16);
    var anim_removal = this.getAnimation("Earth Right");
    for (var i=0; i<16; i++) 
    {   this.anim_earth_right[i] = this.createOverlayAnimation(this.earthtiles[i], anim_removal);
    }
    this.anim_earth_up = new Array(16);
    anim_removal = this.createRotatedAnimation(anim_removal, 90);
    for (var i=0; i<16; i++) 
    {   this.anim_earth_up[i] = this.createOverlayAnimation(this.earthtiles[i], anim_removal);
    }
    this.anim_earth_left = new Array(16);
    anim_removal = this.createRotatedAnimation(anim_removal, 90);
    for (var i=0; i<16; i++)
    {   this.anim_earth_left[i] = this.createOverlayAnimation(this.earthtiles[i], anim_removal);       
    }
    this.anim_earth_down = new Array(16);
    anim_removal = this.createRotatedAnimation(anim_removal, 90);
    for (var i=0; i<16; i++) 
    {   this.anim_earth_down[i] = this.createOverlayAnimation(this.earthtiles[i], anim_removal);
    }
    
    this.anim_man1_nonmoving = this.createStillAnimation(this.piecetiles[MAN1]);
    this.anim_man2_nonmoving = this.createStillAnimation(this.piecetiles[MAN2]);
    this.anim_rock_right = this.getAnimation("Stone Right");    
    this.anim_rock_left = this.createRevertedAnimation(this.anim_rock_right);
    this.anim_bag_right = this.createRotatingAnimation(this.createStillAnimation(this.getAnimation("Bag")), 0,-360);
    this.anim_bag_left = this.createRotatingAnimation(this.createStillAnimation(this.getAnimation("Bag")), 0,360);
    this.anim_bomb_left = this.getAnimation("Bomb");
    this.anim_bomb_right = this.createRevertedAnimation(this.getAnimation("Bomb"));        
    this.anim_sapphire_break = this.getAnimation("Sapphire Break");
    this.anim_citrine_break = this.getAnimation("Citrine Break");
    this.anim_bag_opening = this.getAnimation("Bag");
    this.anim_door_opening = this.getAnimation("Exit"); 
    this.anim_door_closing = this.createRevertedAnimation(this.getAnimation("Exit"));    
    this.anim_swamp_up = this.getAnimation("Swamp Grow");
    this.anim_swamp_left = this.createRotatedAnimation(this.anim_swamp_up, 90);
    this.anim_swamp_right = this.createRotatedAnimation(this.anim_swamp_up, -90);      
    this.anim_swamp_down = this.createRotatedAnimation(this.anim_swamp_up, -180);      
    this.anim_drop_left = this.getAnimation("Drop Left");    
    this.anim_drop_right = this.getAnimation("Drop Right");    
    this.anim_createdrop = this.getAnimation("Drop Down");    
    this.anim_drophit = this.createOverlayAnimation(this.getAnimation("Drop"),this.getAnimation("Swamp Grow"));   
    this.anim_pillow_move = this.getAnimation("Pillow Move");
    this.anim_lorry_right_up = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 0,90);
    this.anim_lorry_up_left = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 90,180);
    this.anim_lorry_left_down = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 180,270);
    this.anim_lorry_down_right = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 270,360);
    this.anim_lorry_right_down = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 0,-90);
    this.anim_lorry_down_left = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 270,180);
    this.anim_lorry_left_up = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 180, 90);
    this.anim_lorry_up_right = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 90, 0);
    this.anim_bug_right_up = this.createRotatingAnimation(this.piecetiles[BUGUP], -90,0);
    this.anim_bug_up_left = this.createRotatingAnimation(this.piecetiles[BUGUP], 0,90);
    this.anim_bug_left_down = this.createRotatingAnimation(this.piecetiles[BUGUP], 90,180);
    this.anim_bug_down_right = this.createRotatingAnimation(this.piecetiles[BUGUP], 180,270);
    this.anim_bug_right_down = this.createRotatingAnimation(this.piecetiles[BUGUP], 270,180);
    this.anim_bug_down_left = this.createRotatingAnimation(this.piecetiles[BUGUP], 180,90);
    this.anim_bug_left_up = this.createRotatingAnimation(this.piecetiles[BUGUP], 90, 0);
    this.anim_bug_up_right = this.createRotatingAnimation(this.piecetiles[BUGUP], 0, -90);        
    this.anim_sapphire_away = this.createShrinkAnimation(this.piecetiles[SAPPHIRE][0]);
    this.anim_emerald_away = this.createShrinkAnimation(this.piecetiles[EMERALD][0]); 
    this.anim_citrine_away = this.createShrinkAnimation(this.piecetiles[CITRINE][0]);
    this.anim_ruby_away = this.createShrinkAnimation(this.piecetiles[RUBY][0]);   
    this.anim_timebomb_away = this.createShrinkAnimation(this.piecetiles[TIMEBOMB][0]);
    this.anim_timebomb_placement = this.createRotatingAnimation(
        this.createRevertedAnimation(this.createShrinkAnimation(this.piecetiles[ACTIVEBOMB5][0])), 20,0);
    this.anim_timebomb10_away = this.createShrinkAnimation(this.piecetiles[TIMEBOMB10][0]);
    this.anim_keyred_away = this.createShrinkAnimation(this.piecetiles[KEYRED][0]);
    this.anim_keyblue_away = this.createShrinkAnimation(this.piecetiles[KEYBLUE][0]);
    this.anim_keygreen_away = this.createShrinkAnimation(this.piecetiles[KEYGREEN][0]);
    this.anim_keyyellow_away = this.createShrinkAnimation(this.piecetiles[KEYYELLOW][0]);    
    this.anim_laser_v = this.getAnimation("Laser");
    this.anim_laser_h = this.createRotatedAnimation(this.anim_laser_v, 90);
    this.anim_laser_br = this.getAnimation("Laser Side");
    this.anim_laser_tr = this.createRotatedAnimation(this.anim_laser_br, 90);
    this.anim_laser_tl = this.createRotatedAnimation(this.anim_laser_br, 180);
    this.anim_laser_bl = this.createRotatedAnimation(this.anim_laser_br, 270);    
    this.anim_laser_down = this.getAnimation("Laser Reflect");
    this.anim_laser_right = this.createRotatedAnimation(this.anim_laser_down, 90);     
    this.anim_laser_up = this.createRotatedAnimation(this.anim_laser_down, 180);       
    this.anim_laser_left = this.createRotatedAnimation(this.anim_laser_down, 270); 
    this.anim_exit_closing = this.createRevertedAnimation(this.getAnimation("Exit"));
    
    this.idle_converter = this.getAnimation("Converter");
    this.idle_converter.idling = true;  // store extra attribute into array
    
    // finished defining all animations
    this.doneLoading = true;
    return true;
};

LevelRenderer.prototype.getAnimation = function(filename)
{
    return this.getSubAnimation(filename,0,1);
};

LevelRenderer.prototype.getSubAnimation = function(filename, segment, totalsegments)
{
    var tiles = this.getImage(filename);
    var numtiles = tiles.length;
    var a = new Array(LevelRenderer.FRAMESPERSTEP);
    for (var i=0; i<LevelRenderer.FRAMESPERSTEP; i++)
    {   var t = LevelRenderer.FRAMESPERSTEP*segment + i;
        a[i] = tiles[Math.floor(t*numtiles / (LevelRenderer.FRAMESPERSTEP*totalsegments))];
    }
    return a;
}
 
LevelRenderer.prototype.createStillAnimation = function(tileanimation)
{
    var a = new Array(LevelRenderer.FRAMESPERSTEP);    
    for (var i=0; i<a.length; i++)
    {   a[i] = tileanimation[0];
    }
    return a;
};
    
LevelRenderer.prototype.createShrinkAnimation = function(tile)
{
    var a = new Array(LevelRenderer.FRAMESPERSTEP);
    for (var i=0; i<a.length; i++)
    {   a[i] = tile + (Math.floor((60*i)/LevelRenderer.FRAMESPERSTEP) << 16);
    }
    return a;
};

LevelRenderer.prototype.createOverlayAnimation = function(a1,a2)
{
    return a1.concat(a2);
};
        
LevelRenderer.prototype.createRevertedAnimation = function(a)
{
    var b = new Array(a.length);
    for (var j=0; j<a.length; j+=LevelRenderer.FRAMESPERSTEP)     
    {   for (var i=0; i<LevelRenderer.FRAMESPERSTEP; i++)
        {   var i2 = (i==0) ? 0 : LevelRenderer.FRAMESPERSTEP-i;  
            b[j+i] = a[j+i2];       
        }
    }
    return b;   
};
        
LevelRenderer.prototype.createRotatedAnimation = function(a, degree)
{
    var b = new Array(a.length);
    for (var i=0; i<a.length; i++)
    {   var t = a[i] & 0xffff;
        var s = (a[i]>>16)%60;
        var r = Math.floor((a[i]>>16)/60);
        r = (r + degree + 3600) % 360;
        b[i] = t | ((s+r*60)<<16);      
    }
    return b;   
};
    
LevelRenderer.prototype.createRotatingAnimation = function(a, start, end)
{
    var b = new Array(a.length);
    for (var i=0; i<a.length; i++)
    {   var t = a[i] & 0xffff;
        var s = ((a[i]>>16)&0xffff) % 60;
        var r = Math.floor(((a[i]>>16)&0xffff) / 60);
            
        var degree = start + Math.floor((i*(end-start))/LevelRenderer.FRAMESPERSTEP);
        r = (r + degree + 3600) % 360;
        b[i] = t | ((s+r*60)<<16);      
    }
    return b;   
};
            
   
// -------------- draw the whole scene as defined by the logic -----------
LevelRenderer.prototype.draw = function(logic, frames_until_endposition)
{               
    // determine which part of the logic area needs to be painted
    var populatedwidth = logic.level.datawidth;
    var populatedheight = logic.level.dataheight;

    // do first parse of dynamic info to determine which static tiles should be suppressed
    var tmp_disable_static_tile = this.tmp_disable_static_tile;
    Game.fillarray(tmp_disable_static_tile,false);    
    
    var animstart = 0;
    var animend = 0;
    var frameindex = 0;
    if (frames_until_endposition>0)
    {   animstart = logic.getFistAnimationOfTurn();
        animend = logic.getAnimationBufferSize();
        frameindex = LevelRenderer.FRAMESPERSTEP - frames_until_endposition;
    }
    
    for (var idx=animstart; idx<animend; idx++)
    {       var trn = logic.getAnimation(idx);
            var x = (trn>>22) & 0x03f;
            var y = (trn>>16) & 0x03f;
            switch (trn & OPCODE_MASK)
            {   case TRN_TRANSFORM:
                {   tmp_disable_static_tile[x+y*MAPWIDTH] = true;
                    break;
                }
                case TRN_MOVEDOWN:
                {   tmp_disable_static_tile[x+(y+1)*MAPWIDTH] = true;
                    break;
                }
                case TRN_MOVEUP:
                {   tmp_disable_static_tile[x+(y-1)*MAPWIDTH] = true;
                    break;
                }
                case TRN_MOVELEFT:
                {   tmp_disable_static_tile[x+y*MAPWIDTH-1] = true;
                    break;
                }
                case TRN_MOVERIGHT:
                {   tmp_disable_static_tile[x+y*MAPWIDTH+1] = true;
                    break;
                }
                case TRN_MOVEDOWN2:
                {   tmp_disable_static_tile[x+(y+1)*MAPWIDTH] = true;
                    tmp_disable_static_tile[x+(y+2)*MAPWIDTH] = true;
                    break;
                }
                case TRN_MOVEUP2:
                {   tmp_disable_static_tile[x+(y-1)*MAPWIDTH] = true;
                    tmp_disable_static_tile[x+(y-2)*MAPWIDTH] = true;
                    break;
                }
                case TRN_MOVELEFT2:
                {   tmp_disable_static_tile[x+y*MAPWIDTH-1] = true;
                    tmp_disable_static_tile[x+y*MAPWIDTH-2] = true;
                    break;
                }
                case TRN_MOVERIGHT2:
                {   tmp_disable_static_tile[x+y*MAPWIDTH+1] = true;
                    tmp_disable_static_tile[x+y*MAPWIDTH+2] = true;
                    break;
                }  
                case TRN_HIGHLIGHT:
                {   var p = trn & 0xff;
                    if (logic.piece(x,y) == p)     // highlights disable static rest image of same piece
                    {   tmp_disable_static_tile[x+y*MAPWIDTH] = true;
                    }
                    break;
                }       
            }               
    }       
        
    // paint the non-suppressed static tiles 
    for (var y=0; y<populatedheight; y++)
    {   for (var x=0; x<populatedwidth; x++)
        {   if (!tmp_disable_static_tile[x+y*MAPWIDTH])
            {   var anim = this.determineTileAt(logic,frameindex===0,x,y); 
                if (anim!=null)  
                {   if (anim.idling) 
                    {   this.addNonMoveAnimationToBuffers(frameindex, anim, x,y);
                    }
                    else
                    {   this.addNonMoveAnimationToBuffers(0, anim, x,y);
                    }
                }
            }
        }
    }       
        
    // do second parse of dynamic info to create animation tiles 
    for (var idx=animstart; idx<animend; idx++)
    {       var trn = logic.getAnimation(idx);
            var x = (trn>>22) & 0x03f;
            var y = (trn>>16) & 0x03f;
            var oldpiece = ((trn>>8)&0xff);
            var newpiece = (trn & 0xff);
            switch (trn & OPCODE_MASK)
            {   case TRN_TRANSFORM:
                {   var anim = this.determineTransformAnimation(oldpiece, newpiece, x,y, logic);
                    if (anim!=null)
                    {   this.addNonMoveAnimationToBuffers(frameindex, anim, x,y);
                    }
                    break;
                }   
                case TRN_MOVEDOWN:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, 0,1, logic);
                    break;
                }
                case TRN_MOVEUP:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, 0,-1, logic);
                    break;
                }
                case TRN_MOVELEFT:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, -1,0, logic);
                    break;
                }
                case TRN_MOVERIGHT:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, 1,0, logic);
                    break;
                }
                case TRN_MOVEDOWN2:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, 0,2, logic);
                    break;
                }
                case TRN_MOVEUP2:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, 0,-2, logic);
                    break;
                }
                case TRN_MOVELEFT2:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, -2,0, logic);
                    break;
                }
                case TRN_MOVERIGHT2:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, 2,0, logic);
                    break;
                }                   
                case TRN_HIGHLIGHT:
                {   var anim = this.determineHighlightAnimation(newpiece, x,y,logic);
                    if (anim!=null)
                    {   this.addNonMoveAnimationToBuffers(frameindex, anim, x,y);
                    }           
                    break;
                }                   
            }               
    }
};
            
LevelRenderer.prototype.addMoveAnimationToBuffers = function
(   frameindex, oldpiece, newpiece, x1, y1, dx, dy, logic )
{    
    var anim = this.determineMoveAnimation
    (   oldpiece,newpiece,x1,y1,dx,dy, 
        frameindex>7, logic
    );
    if (anim)
    {   // determine correct position
        var x2 = x1 + dx;
        var y2 = y1 + dy;
        var d = 60*frameindex/LevelRenderer.FRAMESPERSTEP;
        var px = 60*x1+d*(x2-x1);
        var py = 60*y1+d*(y2-y1);
		// special movement handling for the bag animations
		if (anim===this.anim_bag_left || anim===this.anim_bag_right)
		{	py -= 7 * (Math.cos(frameindex*2*Math.PI/LevelRenderer.FRAMESPERSTEP)-1);
		}			
        for (var i=frameindex; i<anim.length; i+=LevelRenderer.FRAMESPERSTEP)
        {   this.addTile(px,py,anim[i]);
        }
    }   
};

LevelRenderer.prototype.addNonMoveAnimationToBuffers = function(frameindex, anim, x1, y1)
{
    for (var i=frameindex; i<anim.length; i+=LevelRenderer.FRAMESPERSTEP)
    {   this.addTile(60*x1,60*y1,anim[i]);
    }
};
        
LevelRenderer.prototype.determineMoveAnimation = function
(   oldpiece, newpiece, x, y, dx, dy, 
    secondhalf, logic
)
{
    switch (oldpiece)
    {   case ROCK:
        case ROCK_FALLING:
        {   if (oldpiece!=newpiece || logic.is_player_piece_at(x,y)
			  || (oldpiece===ROCK && newpiece==ROCK && logic.is(x,y+1,ELEVATOR))) 
            {   if (dx<0) { return this.anim_rock_left; }
                else if (dx>0) { return this.anim_rock_right; }
            }
            break;
        }
        case BAG:
        case BAG_FALLING:
        case BAG_OPENING:
        {   if (oldpiece!=newpiece || logic.is_player_piece_at(x,y)
			|| (oldpiece===BAG && newpiece==BAG && logic.is(x,y+1,ELEVATOR)))
            {   if (dx<0) { return this.anim_bag_left; }
                else if (dx>0) { return this.anim_bag_right; }                           
            }
            break;
        }
        case BOMB:
        case BOMB_FALLING:
        {   if (dx<0) { return this.anim_bomb_left; }
            else if (dx>0) { return this.anim_bomb_right; }
            break;      
        }
        case CUSHION:
        {   return this.anim_pillow_move;
        }
    }
    
    var eventurn = (logic.getTurnsDone()&1)==1;
    var t1 = (eventurn && this.alternatepiecetiles[oldpiece]) || this.piecetiles[oldpiece];
    var t2 = (eventurn && this.alternatepiecetiles[newpiece]) || this.piecetiles[newpiece];
    
    // when doing "far" animations, there could be a change of visual in the middle of the action
    if (Math.abs(dx)>1 || Math.abs(dy)>1)
    {   return secondhalf ? t2 : t1;
    }
    
    // when no animation is explicitly defined, use the default animation 
    return t2;
};
    
LevelRenderer.prototype.determineTransformAnimation = function (oldpiece, newpiece, originatingx, originatingy, logic)
{
    switch (oldpiece)
    {   
        case BAG:
        case BAG_FALLING:
        case BAG_OPENING:             
        {   if (newpiece==EMERALD) { return this.anim_bag_opening; }
            break;
        }
        case EMERALD:
        {   if (newpiece==AIR) { return this.anim_emerald_away; }
            break;
        }
        case SAPPHIRE:
        {   if (newpiece==AIR) { return this.anim_sapphire_away; }
            break;              
        }
        case SAPPHIRE_BREAKING:
        {   if (newpiece==AIR) { return this.anim_sapphire_break; }
            break;              
        }
        case CITRINE:
        {   if (newpiece==AIR) { return this.anim_citrine_away; }
            break;              
        }
        case CITRINE_BREAKING:
        {   if (newpiece==AIR) { return this.anim_citrine_break; }
            break;              
        }
        case RUBY:
        {   if (newpiece==AIR) { return this.anim_ruby_away; }
            break;              
        }
        case TIMEBOMB:
        {   if (newpiece==AIR) { return this.anim_timebomb_away; }
            break;              
        }
        case TIMEBOMB10:
        {   if (newpiece==AIR) { return this.anim_timebomb10_away; }
            break;              
        }
        case KEYRED:
        {   if (newpiece==AIR) { return this.anim_keyred_away; }
            break;              
        }
        case KEYBLUE:
        {   if (newpiece==AIR) { return this.anim_keyblue_away; }
            break;              
        }
        case KEYGREEN:
        {   if (newpiece==AIR) { return this.anim_keygreen_away; }
            break;              
        }
        case KEYYELLOW:
        {   if (newpiece==AIR) { return this.anim_keyyellow_away; }
            break;              
        }
        case EARTH_UP:    
        {   return this.anim_earth_up[this.earthJaggedConfiguration(logic,originatingx,originatingy)]; 
        }
        case EARTH_DOWN:  
        {   return this.anim_earth_down[this.earthJaggedConfiguration(logic,originatingx,originatingy)];
        }
        case EARTH_LEFT:  
        {   return this.anim_earth_left[this.earthJaggedConfiguration(logic,originatingx,originatingy)];
        }
        case EARTH_RIGHT: 
        {   return this.anim_earth_right[this.earthJaggedConfiguration(logic,originatingx,originatingy)];
        }
        case LORRYLEFT:
        case LORRYLEFT_FIXED:
        {   if (newpiece==LORRYUP || newpiece==LORRYUP_FIXED) { return this.anim_lorry_left_up; }
            else if (newpiece==LORRYDOWN || newpiece==LORRYDOWN_FIXED) { return this.anim_lorry_left_down; }
            break;
        }
        case LORRYRIGHT:
        case LORRYRIGHT_FIXED:
        {   if (newpiece==LORRYDOWN || newpiece==LORRYDOWN_FIXED) { return this.anim_lorry_right_down; }
            else if (newpiece==LORRYUP || newpiece==LORRYUP_FIXED) { return this.anim_lorry_right_up; }
            break;
        }
        case LORRYDOWN:
        case LORRYDOWN_FIXED:
        {   if (newpiece==LORRYLEFT || newpiece==LORRYLEFT_FIXED) { return this.anim_lorry_down_left; }
            else if (newpiece==LORRYRIGHT || newpiece==LORRYRIGHT_FIXED) { return this.anim_lorry_down_right; }
            break;
        }
        case LORRYUP:
        case LORRYUP_FIXED:
        {   if (newpiece==LORRYLEFT || newpiece==LORRYLEFT_FIXED) { return this.anim_lorry_up_left; }
            else if (newpiece==LORRYRIGHT || newpiece==LORRYRIGHT_FIXED) { return this.anim_lorry_up_right; }
            break;
        }
        case BUGLEFT:
        case BUGLEFT_FIXED:
        {   if (newpiece==BUGUP || newpiece==BUGUP_FIXED) { return this.anim_bug_left_up; }
            else if (newpiece==BUGDOWN || newpiece==BUGDOWN_FIXED) { return this.anim_bug_left_down; }
            break;
        }   
        case BUGRIGHT:
        case BUGRIGHT_FIXED:
        {   if (newpiece==BUGDOWN || newpiece==BUGDOWN_FIXED) { return this.anim_bug_right_down; }
            else if (newpiece==BUGUP || newpiece==BUGUP_FIXED) { return this.anim_bug_right_up; }
            break;
        }
        case BUGDOWN:
        case BUGDOWN_FIXED:
        {   if (newpiece==BUGLEFT || newpiece==BUGLEFT_FIXED) { return this.anim_bug_down_left; }
            else if (newpiece==BUGRIGHT || newpiece==BUGRIGHT_FIXED) { return this.anim_bug_down_right; }
            break;
        }
        case BUGUP:
        case BUGUP_FIXED:
        {   if (newpiece==BUGLEFT || newpiece==BUGLEFT_FIXED) { return this.anim_bug_up_left; }
            else if (newpiece==BUGRIGHT || newpiece==BUGRIGHT_FIXED) { return this.anim_bug_up_right; }
            break;
        }
		case BOMB_EXPLODE:
		case EXPLODE1_AIR:
		case EXPLODE2_AIR:
		case EXPLODE3_AIR:
		case EXPLODE4_AIR:
		case EXPLODE1_EMERALD:
		case EXPLODE2_EMERALD:
		case EXPLODE3_EMERALD:
		case EXPLODE4_EMERALD:
		case EXPLODE1_SAPPHIRE:
		case EXPLODE2_SAPPHIRE:
		case EXPLODE3_SAPPHIRE:
		case EXPLODE4_SAPPHIRE:
		case BIGBOMB_EXPLODE:
		case LORRY_EXPLODE:
		case BUG_EXPLODE:
		case TIMEBOMB_EXPLODE:
		case EXPLODE1_BAG:
		case EXPLODE2_BAG:
		case EXPLODE3_BAG:
		case EXPLODE4_BAG:
		case EXPLODE1_TNT:
		case EXPLODE2_TNT:
		case EXPLODE3_TNT:
		case EXPLODE4_TNT:
		case YAMYAM_EXPLODE:
		case EXPLODE1_YAMYAM0:
		case EXPLODE2_YAMYAM0:
		case EXPLODE3_YAMYAM0:
		case EXPLODE4_YAMYAM0:
		case EXPLODE1_YAMYAM1:
		case EXPLODE2_YAMYAM1:
		case EXPLODE3_YAMYAM1:
		case EXPLODE4_YAMYAM1:
		case EXPLODE1_YAMYAM2:
		case EXPLODE2_YAMYAM2:
		case EXPLODE3_YAMYAM2:
		case EXPLODE4_YAMYAM2:
		case EXPLODE1_YAMYAM3:
		case EXPLODE2_YAMYAM3:
		case EXPLODE3_YAMYAM3:
		case EXPLODE4_YAMYAM3:
		case EXPLODE1_YAMYAM4:
		case EXPLODE2_YAMYAM4:
		case EXPLODE3_YAMYAM4:
		case EXPLODE4_YAMYAM4:
		case EXPLODE1_YAMYAM5:
		case EXPLODE2_YAMYAM5:
		case EXPLODE3_YAMYAM5:
		case EXPLODE4_YAMYAM5:
		case EXPLODE1_YAMYAM6:
		case EXPLODE2_YAMYAM6:
		case EXPLODE3_YAMYAM6:
		case EXPLODE4_YAMYAM6:
		case EXPLODE1_YAMYAM7:
		case EXPLODE2_YAMYAM7:
		case EXPLODE3_YAMYAM7:
		case EXPLODE4_YAMYAM7:
		case EXPLODE1_YAMYAM8:
		case EXPLODE2_YAMYAM8:
		case EXPLODE3_YAMYAM8:
		case EXPLODE4_YAMYAM8:
		{	// explosions use the animation attached to the old piece
			return this.piecetiles[oldpiece]; 	
		}			
    }
    switch (newpiece)
    {   case MAN1: { return this.anim_man1_nonmoving; }
        case MAN2: { return this.anim_man2_nonmoving; }   
        case ACTIVEBOMB5:
        {   if (oldpiece==AIR) { return this.anim_timebomb_placement; }
            break;
        }
        case DROP:
        {   if (oldpiece==AIR) { return this.anim_createdrop; }
            else if (oldpiece==SWAMP_LEFT) { return this.anim_drop_left; }
            else if (oldpiece==SWAMP_RIGHT) { return this.anim_drop_right; }
            break;
        }
        case SWAMP_UP: { return this.anim_swamp_up; }
        case SWAMP_DOWN: { return (oldpiece==EARTH) ? this.anim_swamp_down : null; }
        case SWAMP_LEFT: { return (oldpiece==EARTH) ? this.anim_swamp_left : null; }
        case SWAMP_RIGHT: { return (oldpiece==EARTH) ? this.anim_swamp_right : null; }
        case SWAMP: 
        {   if (oldpiece==DROP) { return this.anim_drophit; }
            else                { return null;  }  // do not draw over direction-dependent animation
        }
        case DOOR_OPENED: 
        {   if (oldpiece==DOOR) return this.piecetiles[DOOR]; 
            break;
        }
        case DOOR_CLOSING: 
        {   return null;  // prevent man being over-drawn by door
        }
        case DOOR_CLOSED: 
        {   if (oldpiece==DOOR_CLOSING) { return this.anim_exit_closing; }
            break;
        }
        case ONETIMEDOOR_CLOSED: { return this.piecetiles[ONETIMEDOOR]; }
        case CUSHION: 
        {   if (oldpiece==CUSHION_BUMPING) { return null; }
            break;
        }
        case CUSHION_BUMPING:
        {   if (oldpiece==CUSHION) { return this.piecetiles[CUSHION]; }
            break;
        }    
        case SAND_FULL:
        {   return this.piecetiles[SAND];
            break;
        }
        case ACID:
        {   var n = 1 - logic.getTurnsDone()&1;
            var pl = logic.piece(originatingx-1,originatingy);
            var pr = logic.piece(originatingx+1,originatingy);
            if (pl===ACID)
            {   if (pr==ACID) { return this.acidtiles_noedge[n]; }
                else { return this.acidtiles_rightedge[n]; }
            }
            else
            {   if (pr===ACID) { return this.acidtiles_leftedge[n]; }
                else { return this.acidtiles_bothedges[n]; }               
            }
        }
    }
    // when no animation is explicitly defined, use the default animation of the new piece (covers many "falling" and "pushing" actions)
    return this.piecetiles[newpiece]; 
};

LevelRenderer.prototype.determineHighlightAnimation = function (highlightpiece, originatingx, originatingy, logic)
{
    switch (highlightpiece)
    {   case EARTH:
        {   return this.earthtiles[this.earthJaggedConfiguration(logic, originatingx, originatingy)];
        }
        case LASER_V: { return this.anim_laser_v; }
        case LASER_H: { return this.anim_laser_h; }
        case LASER_BL: { return this.anim_laser_bl; }
        case LASER_BR: { return this.anim_laser_br; }
        case LASER_TL: { return this.anim_laser_tl; }
        case LASER_TR: { return this.anim_laser_tr; }
        case LASER_L: { return this.anim_laser_left; }
        case LASER_R: { return this.anim_laser_right; }
        case LASER_U: { return this.anim_laser_up; }
        case LASER_D: { return this.anim_laser_down; }
    }        
    
    return this.piecetiles[highlightpiece];
}; 
    
LevelRenderer.prototype.determineTileAt = function(logic, iskeyframe, x, y)
{   
    // various appearances of the earth piece
    var p = logic.piece(x,y);
    switch (p)
    {   case EARTH:
        {   var jagged = this.earthJaggedConfiguration(logic,x,y);
            return this.earthtiles[jagged];         
        }
        case WALL:
        {   var c=0;
            var p2 = logic.piece(x-1,y);
            if (p2===WALL) {   c++; }
            else if (p2==ROUNDWALL) { c+=2; }
            p2 = logic.piece(x+1,y);
            if (p2===WALL) { c+=3; }
            else if (p2===ROUNDWALL) { c+=6; }
            return this.walltiles[c];
        }
        case ROUNDWALL:
        {   var c=0;
            var pl = logic.piece(x-1,y);
            var pr = logic.piece(x+1,y);
            if (pl===WALL || pl===ROUNDWALL) { c++; }
            if (pr==WALL || pr==ROUNDWALL) { c+=2; }
            return this.roundwalltiles[c];
        }
        case CONVERTER: 
        {   return this.idle_converter; 
        }
        case ACID:
        {   var n = (iskeyframe?logic.getTurnsDone():logic.getTurnsDone()-1)&1;
            var pl = logic.piece(x-1,y);
            var pr = logic.piece(x+1,y);
            var t;
            if (pl===ACID)
            {   if (pr==ACID) { t=this.acidtiles_noedge[n]; }
                else { t=this.acidtiles_rightedge[n]; }
            }
            else
            {   if (pr===ACID) { t=this.acidtiles_leftedge[n]; }
                else { t=this.acidtiles_bothedges[n]; }               
            }
            return t;
        }
        case MAN1_LEFT:
        case MAN1_RIGHT:
        case MAN1_PUSHLEFT:
        case MAN1_PUSHRIGHT:
        case MAN1_DIGLEFT:
        case MAN1_DIGRIGHT:
        case MAN2_LEFT:
        case MAN2_RIGHT:
        case MAN2_PUSHLEFT:
        case MAN2_PUSHRIGHT:
        case MAN2_DIGLEFT:
        case MAN2_DIGRIGHT:
        {   // check if need alternate animation for odd turns
            if (((iskeyframe?logic.getTurnsDone():logic.getTurnsDone()-1)&1) == 0)
            {   return this.alternatepiecetiles[p];
            }
            break;
        }                   
    }    
    // default handling of resting pieces
    return this.piecetiles[p];       
};
    
LevelRenderer.prototype.earthJaggedConfiguration = function(logic, x, y)
{
    if (makesEarthEdgeJagged(logic.piece(x,y-1)))
    {   if (makesEarthEdgeJagged(logic.piece(x,y+1)))                       
        {   if (makesEarthEdgeJagged(logic.piece(x-1,y)))
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 0:4;                      
            }
            else
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 3:10;                         
            }
        }
        else
        {   if (makesEarthEdgeJagged(logic.piece(x-1,y)))                       
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 2:9;                      
            }
            else
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 8:14;                         
            }
        }
    }
    else
    {   if (makesEarthEdgeJagged(logic.piece(x,y+1)))                       
        {   if (makesEarthEdgeJagged(logic.piece(x-1,y)))                       
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 1:7;                      
            }
            else
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 6:13;                         
            }
        }
        else
        {   if (makesEarthEdgeJagged(logic.piece(x-1,y)))                       
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 5:12;                         
            }
            else
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 11:15;                        
            }
        }
    }   

    function makesEarthEdgeJagged(piece)
    {
        switch (piece)
        {   case EARTH: 
            case WALL:  
            case STONEWALL: 
            case GLASSWALL: 
            case WALLEMERALD:
            case SWAMP:             
            case SAND:
            case SAND_FULL:             
            case MAN1_DIGLEFT:
            case MAN2_DIGLEFT:
            case MAN1_DIGRIGHT:
            case MAN2_DIGRIGHT:
            case MAN1_DIGUP:
            case MAN2_DIGUP:
            case MAN1_DIGDOWN:
            case MAN2_DIGDOWN:      return false;            
            default:                return true;
        }
    }    
}
    
   
// --------------------------- direct piece tile rendering -----------------

LevelRenderer.prototype.addDecorationPieceToBuffer = function(pixelx, pixely, piece)
{       
        var anim = this.piecetiles[piece];
        if (anim)
        {   this.addDecorationTile(pixelx,pixely,anim[0]);
        }
};

LevelRenderer.prototype.addRestingPieceToBuffer = function(x, y, piece)
{       
        var anim = this.piecetiles[piece];
        if (anim)
        {   for (var i=0; i<anim.length; i+=LevelRenderer.FRAMESPERSTEP)
            {   this.addTile(x,y,anim[i]);
            }
        }
};

"use strict";
var LevelSoundPlayer = function()
{
    this.all = null;
    this.tmp_counters = null;
    
    this.sound_acid = null;
    this.sound_bagconv = null;
    this.sound_bagfall = null;
    this.sound_bagopen = null;
//  public final Sound sound_bagroll;
//  public final Sound sound_blastvip;
//  public final Sound sound_bombroll;
    this.sound_bombtick = null;
    this.sound_bug = null;
//  public final Sound sound_clock;
    this.sound_cushion = null;
    this.sound_die = null;
    this.sound_dig = null;
    this.sound_drop = null;
    this.sound_elevator = null;
    this.sound_emldconv = null;
    this.sound_emldfall = null;
    this.sound_emldroll = null;
    this.sound_exitclos = null;
    this.sound_exitopen = null;
    this.sound_explode = null;
    this.sound_grabbomb = null;
    this.sound_grabemld = null;
    this.sound_grabkey = null;
    this.sound_grabruby = null;
    this.sound_grabsphr = null;
    this.sound_laser = null;
    this.sound_lorry = null;
    this.sound_lose = null;
    this.sound_pcushion = null;
    this.sound_push = null;
    this.sound_pushbag = null;
    this.sound_pushbomb = null;
    this.sound_pushbox = null;
    this.sound_robot = null;
    this.sound_rubyconv = null;
    this.sound_rubyfall = null;
    this.sound_rubyroll = null;
    this.sound_setbomb = null;
    this.sound_sphrbrk = null;
    this.sound_sphrconv = null;
    this.sound_sphrfall = null;
    this.sound_sphrroll = null;
    this.sound_stnconv = null;
    this.sound_stnfall = null;
    this.sound_stnhard = null;
    this.sound_stnroll = null;
    this.sound_swamp = null;
    this.sound_usedoor = null;
//  public final Sound sound_wheel;
    this.sound_win = null;
    this.sound_yamyam = null;
};

LevelSoundPlayer.volumetable = 
[
    100, 
    100, 90, 80, 70, 60, 55, 50, 45, 40, 35, 
    30,  27, 25, 22, 20, 18, 16, 14, 12, 11, 
    10, 9, 8, 7, 6, 5, 3, 2, 1, 0, 
];

LevelSoundPlayer.prototype.$ = function()
{
    this.all = [];
    this.tmp_counters = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    
    this.sound_acid = this.load("acid");        
    this.sound_bagconv = this.load("bagconv");
    this.sound_bagfall = this.load("bagfall");   
    this.sound_bagopen = this.load("bagopen");
    this.sound_bagroll = this.load("bagroll");
//      sound_bombroll = this.load("bombroll");
    this.sound_bombtick = this.load("bombtick");
    this.sound_bug = this.load("bug");
    this.sound_cushion = this.load("cushion");
    this.sound_die = this.load("die");
    this.sound_dig = this.load("dig");
    this.sound_drop = this.load("drop");
    this.sound_elevator = this.load("elevator");
    this.sound_emldconv = this.load("emldconv");
    this.sound_emldfall = this.load("emldfall");
    this.sound_emldroll = this.load("emldroll");
    this.sound_exitclos = this.load("exitclos");
    this.sound_exitopen = this.load("exitopen");
    this.sound_explode = this.load("explode");
    this.sound_grabbomb = this.load("grabbomb");
    this.sound_grabemld = this.load("grabemld");
    this.sound_grabkey = this.load("grabkey");
    this.sound_grabruby = this.load("grabruby");
    this.sound_grabsphr = this.load("grabsphr");
    this.sound_laser = this.load("laser");
    this.sound_lorry = this.load("lorry");
    this.sound_lose = this.load("lose");
    this.sound_pcushion = this.load("pcushion");
    this.sound_push = this.load("push");
    this.sound_pushbag = this.load("pushbag");
    this.sound_pushbomb = this.load("pushbomb");
    this.sound_pushbox = this.load("pushbox");
    this.sound_robot = this.load("robot");
    this.sound_rubyconv = this.load("rubyconv");
    this.sound_rubyfall = this.load("rubyfall");
    this.sound_rubyroll = this.load("rubyroll");
    this.sound_setbomb = this.load("setbomb");
    this.sound_sphrbrk = this.load("sphrbrk");
    this.sound_sphrfall = this.load("sphrfall");
    this.sound_sphrconv = this.load("sphrconv");
    this.sound_sphrroll = this.load("sphrroll");
    this.sound_stnconv = this.load("stnconv");
    this.sound_stnfall = this.load("stnfall");
    this.sound_stnhard = this.load("stnhard");
    this.sound_stnroll = this.load("stnroll");
    this.sound_swamp = this.load("swamp");
    this.sound_usedoor = this.load("usedoor");
    this.sound_win = this.load("win");
    this.sound_yamyam = this.load("yamyam");
    
    return this;
};

LevelSoundPlayer.prototype.load = function(filename)
{
    var s = 
    {   howl: new Howl({ src: [ "sound/" + filename + ".wav" ]  }),
        volume: 0
    };
    this.all.push(s);
    return s;
};

/**
 * Decodes everything that has happened in the logic in this step and will
// prepare playing sounds as needed.
 * Return: true, if a sound was played that should lead to a screen shake effect
 */
LevelSoundPlayer.prototype.preparePlaying = function(logic)
{
    var shake = false;

    // clear all volume values of all sounds
    for (var i=0; i<this.all.length; i++) { this.all[i].volume = 0; }
    
    // init the temporary counters
    for (var i=0; i<this.tmp_counters.length; i++) { this.tmp_counters[i] = logic.counters[i]; }
    
    // scan in reverse to make it possible to keep track of the counter values
    var animstart = logic.getFistAnimationOfTurn();
    var animend = logic.getAnimationBufferSize();    
    for (var idx=animend-1; idx>=animstart; idx--)    
    {   var trn = logic.getAnimation(idx);
        var x = (trn>>22) & 0x03f;
        var y = (trn>>16) & 0x03f;
        var vol = this.determineSoundEffectVolume(logic,x,y);
        switch (trn & OPCODE_MASK)
        {   case TRN_TRANSFORM: 
            {   var oldpiece = ((trn>>8)&0xff);
                var newpiece = (trn & 0xff);
                var sound = this.determineTransformSound(logic, oldpiece, newpiece);
                if (sound!=null)
                {   sound.volume = Math.max(sound.volume, vol);
                    if (sound==this.sound_explode && vol>=70) { shake = true; }
                }
                break;
            }
            case TRN_MOVEDOWN:
            {   this.createSoundForMoveTransaction(trn, 0,1, vol);
                break;
            }
            case TRN_MOVEUP:
            {   this.createSoundForMoveTransaction(trn, 0,-1, vol);
                break;
            }
            case TRN_MOVELEFT:
            {   this.createSoundForMoveTransaction(trn, -1,0, vol);
                break;
            }
            case TRN_MOVERIGHT:
            {   this.createSoundForMoveTransaction(trn, 1,0, vol);
                break;
            }
            case TRN_MOVEDOWN2:
            {   this.createSoundForMoveTransaction(trn, 0,2, vol);
                break;
            }
            case TRN_MOVEUP2:
            {   this.createSoundForMoveTransaction(trn, 0,-2, vol);
                break;
            }
            case TRN_MOVELEFT2:
            {   this.createSoundForMoveTransaction(trn, -2,0, vol);
                break;
            }
            case TRN_MOVERIGHT2:
            {   this.createSoundForMoveTransaction(trn, 2,0, vol);
                break;
            }
            case TRN_HIGHLIGHT:
            {   //int mapindex = (trn>>16) & 0x0fff;
                var highlightpiece = trn&0xff;
                var sound = this.determineHighlightSound(highlightpiece);
                if (sound!=null) { sound.volume = Math.max(sound.volume, vol); }
                break;
            }    
            case TRN_COUNTER:
            {   var index = (trn>>20) & 0xff;
                var increment = trn & 0xfffff;
                if (increment >= 0x80000) increment-=0x100000;
                this.tmp_counters[index] -= increment;
                var sound = this.determineCounterSound(logic,index,increment,this.tmp_counters);
                if (sound!=null) { sound.volume = 100; };
                break;
            }           
        }
    }    
    // tell calling program about shake effect
    return shake;    
};

LevelSoundPlayer.prototype.playNow = function()
{
    // play all sounds that have been decided need playing
    for (var i=0; i<this.all.length; i++) 
    {   var s = this.all[i];
        if (s.volume>0) 
        {   s.howl.volume(s.volume/100.0);
            s.howl.play(); 
        }
    }
};
    
LevelSoundPlayer.prototype.createSoundForMoveTransaction = function (trn,dx,dy,vol)
{   var oldpiece = ((trn>>8)&0xff);
    var newpiece = (trn & 0xff);
    var sound = this.determineMoveSound(oldpiece, newpiece, dx, dy);
    if (sound!=null) { sound.volume = Math.max(sound.volume, vol); }
};   
    
LevelSoundPlayer.prototype.determineSoundEffectVolume = function(logic, x, y)
{   // determine distance to nearest player
    var mindist = LevelSoundPlayer.volumetable.length-1;
    for (var i=0; i<logic.getNumberOfPlayers(); i++)
    {   var d = Math.max
        (   Math.abs(logic.getPlayerPositionX(i) - x),
            Math.abs(logic.getPlayerPositionY(i) - y)
        );
        if (d < mindist) { mindist = d; }           
    }
    return LevelSoundPlayer.volumetable[mindist];
};
    
    
    // ------------- determine sound effects for various things that happen in the game -----
    
LevelSoundPlayer.prototype.determineTransformSound = function(logic, oldpiece, newpiece)
{
    // special handling for game solving or for dying
    if (logic.whose_player_piece(oldpiece)>=0 && logic.whose_player_piece(newpiece)<0)
    {   if (newpiece==DOOR_CLOSING)       
        {   return this.sound_exitclos;
        }
        else
        {   return this.sound_die;
        }
    }       

    switch (oldpiece)
    {   case EARTH:
        {   if 
            (   newpiece==AIR || 
                newpiece==EARTH_UP || 
                newpiece==EARTH_DOWN || 
                newpiece==EARTH_LEFT || 
                newpiece==EARTH_RIGHT
            )
            {   return this.sound_dig;
            }
            break;
        }
        case ROCK_FALLING:
        {   if (newpiece==ROCK)
            {   return this.sound_stnfall;
            }
            break;
        }
        case BAG_FALLING:
        {   if (newpiece==BAG) { return this.sound_bagfall; }
            break;
        }
        case EMERALD_FALLING:
        {   if (newpiece==EMERALD) { return this.sound_emldfall; }
            break;
        }
        case SAPPHIRE_FALLING:
        {   if (newpiece==SAPPHIRE) { return this.sound_sphrfall; }
            break;
        }
        case RUBY_FALLING:
        {   if (newpiece==RUBY) { return this.sound_rubyfall; }
            break;
        }
        case BOMB_FALLING: 
        {   if (newpiece==BOMB) { return this.sound_cushion; }
            break;
        }
        case CITRINE_FALLING:
        {   if (newpiece==CITRINE) { return this.sound_cushion; }
            break;
        }
        case EMERALD:
        {   if (newpiece==AIR) { return this.sound_grabemld; }
            break;
        }
        case SAPPHIRE:
        {   if (newpiece==AIR) { return this.sound_grabsphr; }
            break;
        }
        case RUBY:
        {   if (newpiece==AIR) { return this.sound_grabruby; }
            break;
        }
        case CITRINE:
        {   if (newpiece==AIR) { return this.sound_grabruby; }
            break;
        }
        case SAPPHIRE_BREAKING: 
        {   return this.sound_sphrbrk; 
        }
        case CITRINE_BREAKING:
        {   return this.sound_sphrbrk;
        }    
        case TIMEBOMB:
        case TIMEBOMB10:
        {   if (newpiece==AIR) { return this.sound_grabbomb; }
            break;
        }
        case KEYRED:
        case KEYBLUE:
        case KEYGREEN:
        case KEYYELLOW:
        {   if (newpiece==AIR) { return this.sound_grabkey; }
            break;
        }
        case BAG:
        {   if (newpiece==EMERALD || newpiece==BAG_OPENING)
            {   return this.sound_bagopen;
            }               
            break;          
        }
        case ACTIVEBOMB5:
        case ACTIVEBOMB4:
        case ACTIVEBOMB3:
        case ACTIVEBOMB2:
        case ACTIVEBOMB1:
        case ACTIVEBOMB0:
        {   return this.sound_bombtick;
        }
        case DROP:    
        {   return this.sound_drop;  
        }   
    }
    
    switch (newpiece)
    {   case ACID:
        {   if (oldpiece!=newpiece) { return this.sound_acid; }
            break;
        }
        case BUGUP:
        case BUGDOWN:
        case BUGLEFT:
        case BUGRIGHT:
        case BUGUP_FIXED:
        case BUGDOWN_FIXED:
        case BUGLEFT_FIXED:
        case BUGRIGHT_FIXED:
        {   return this.sound_bug;
        }
        case LORRYUP:
        case LORRYDOWN:
        case LORRYLEFT:
        case LORRYRIGHT:
        case LORRYUP_FIXED:
        case LORRYDOWN_FIXED:
        case LORRYLEFT_FIXED:
        case LORRYRIGHT_FIXED:    
        {   return this.sound_lorry;             
        }
        case SWAMP:
        {   return this.sound_swamp;
        }    
//          case Logic.DOOR_CLOSED:
//              return sound_exitclos;
        case DOOR_OPENED:
        {   return this.sound_exitopen;
        }     
        case EXPLODE1_AIR:
        case EXPLODE1_EMERALD:
        case EXPLODE1_SAPPHIRE:
        case EXPLODE1_BAG:
        case EXPLODE1_YAMYAM0:
        case EXPLODE1_YAMYAM1:
        case EXPLODE1_YAMYAM2:
        case EXPLODE1_YAMYAM3:
        case EXPLODE1_YAMYAM4:
        case EXPLODE1_YAMYAM5:
        case EXPLODE1_YAMYAM6:
        case EXPLODE1_YAMYAM7:
        case EXPLODE1_YAMYAM8:
        {   return this.sound_explode;
        }    
        case ACTIVEBOMB5:
        {   return this.sound_setbomb;
        }
        case ONETIMEDOOR_CLOSED:
        {   return this.sound_usedoor;
        }
        return null;
    }
};
    
LevelSoundPlayer.prototype.determineMoveSound = function(oldpiece, newpiece, dx, dy)
{
    switch (oldpiece)
    {   case ROCK:
        case ROCK_FALLING:
        {   if (dx<0||dx>0)
            {   return newpiece==ROCK_FALLING ? this.sound_stnroll : this.sound_push;
            }
            else if (dy>=2)
            {   return this.sound_stnconv;
            }
            break;
        }
        case BAG:
        case BAG_FALLING:
        {   if (dx<0||dx>0)
            {   return newpiece==BAG_FALLING ? this.sound_pushbomb : this.sound_pushbag;
            }
            break;
        }
        case EMERALD:
        case EMERALD_FALLING:
        {   if (dx<0||dx>0)
            {   return this.sound_emldroll;
            }
            else if (dy>=2)
            {   return this.sound_emldconv;
            }
            break;
        }
        case SAPPHIRE:
        case SAPPHIRE_FALLING:
        {   if (dx<0||dx>0)
            {   return this.sound_sphrroll;
            }
            else if (dy>=2)
            {   return this.sound_sphrconv;
            }
            break;
        }
        case RUBY:
        case RUBY_FALLING:
        {   if (dx<0||dx>0)
            {   return this.sound_rubyroll;
            }
            else if (dy>=2)
            {   return this.sound_rubyconv;
            }
            break;
        }
        case CITRINE:
        case CITRINE_FALLING:
        {   if (dx<0||dx>0)
            {   // return sound_rubyroll;
            }
            break;
        }
        case BOMB:
        {   if (dx<0||dx>0)
            {   return newpiece==BOMB_FALLING ? this.sound_pushbomb : this.sound_pushbomb;
            }
            break;
        }
        case CUSHION:
        {   return this.sound_pcushion;
        }
        case BOX:
        {   return this.sound_pushbox;
        }
        case ELEVATOR:
        {   return this.sound_elevator;
        }
        case ROBOT:
        {   return this.sound_robot;             
        }
    }
    switch (newpiece)
    {   case BUGUP:
        case BUGDOWN:
        case BUGLEFT:
        case BUGRIGHT:
        case BUGUP_FIXED:
        case BUGDOWN_FIXED:
        case BUGLEFT_FIXED:
        case BUGRIGHT_FIXED:
        {   return this.sound_bug;
        }
        case LORRYUP:
        case LORRYDOWN:
        case LORRYLEFT:
        case LORRYRIGHT:
        case LORRYUP_FIXED:
        case LORRYDOWN_FIXED:
        case LORRYLEFT_FIXED:
        case LORRYRIGHT_FIXED:    
        {   return this.sound_lorry;             
        }
    }
    return null;    
};

LevelSoundPlayer.prototype.determineHighlightSound = function(highlightpiece)
{
    switch (highlightpiece)
    {   case LASER_H:
        case LASER_V:
        case LASER_BL:
        case LASER_BR:
        case LASER_TL:
        case LASER_TR:
        {   return this.sound_laser;
        }
        case DOORRED:
        case DOORBLUE:
        case DOORGREEN:
        case DOORYELLOW:
        {   return this.sound_usedoor;
        }       
        case CUSHION_BUMPING:
        {   return this.sound_cushion;           
        }
    }
    return null;
};

LevelSoundPlayer.prototype.determineCounterSound = function(logic, index, increment, countersbefore)
{
    var cb = countersbefore[index];
    if (index==CTR_EXITED_PLAYER1 || index==CTR_EXITED_PLAYER2)
    {   var since = 0;
        if (logic.getNumberOfPlayers()<=1)
        {   since = countersbefore[CTR_EXITED_PLAYER1];
        }
        else
        {   since = Math.min(countersbefore[CTR_EXITED_PLAYER1],countersbefore[CTR_EXITED_PLAYER2]);
        }
        if (since==3) { return this.sound_win; }
    }
        
    if (index==CTR_EMERALDSTOOMUCH && cb>=0 && cb+increment<0)
    {   return this.sound_lose;
    }
    return null;            
};


"use strict";
var Game = function()  
{   this.canvas = null;
    this.overlay = null;
    this.gl = null;
    this.exitcall = null;
    
    this.screenwidth = 0;        // size of surface in css units
    this.screenheight = 0;  
    this.pixelwidth = 0;         // size in true pixels (renderer will scale)
    this.pixelheight = 0;    
    this.pixeltilesize = 0;      // size of one tile in true pixels
    
    this.levelRenderer = null;
    this.textRenderer = null;
    this.vectorRenderer = null;

    this.soundPlayer = null;
    this.musicPlayer = null;
    this.musicName = null;

    this.screens = null;
    this.needRedraw = false;
    this.usingKeyboardInput = false;

    this.levels = null;    
    
    // input handling flags
    this.isTouch = false;
    this.isPointerDown = false;
	
	this.connectedControllers = [];
};


Game.DEVELOPERMODE = false;
Game.DEFAULTSOLVEDGRADE = -3*60;  // 3 minutes waiting time before level is considered "known"

// construction of game object (handles loading of persistant state also)
Game.prototype.$ = function()
{
    var that = this;
    
    console.log("Starting up Sapphire Yours...");
    var options = 
    {   alpha: false,    
        stencil: false,
        antialias: false, 
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false
    };           
        
    this.canvas = document.getElementById("canvas");
    this.gl = this.canvas.getContext("webgl", options);
    if (!this.gl) { this.gl = this.canvas.getContext("experimental-webgl", options ); }        
    if (!this.gl) { return; }
    
    this.screens = [];

    // decide about initial sizes (also tile size in pixels)
    setScreenAndCanvasSize();

    // create the renderers and load data
    this.loadRenderers();
                       
    // default to touch/mouse input unless otherwise directed 
    this.usingKeyboardInput = false;

    // clear the music player object - will be immediately filled 
    this.musicPlayer = null;
    this.startMusic("silence");

    // show a loading screen at start
    this.addScreen(new LoadingScreen().$(this));
        
    // install input handlers
    document.addEventListener
    (   'keydown', function(event)
        {   if (!that.overlay) 
            {   that.onKeyDown(KeyEvent.toNumericCode(event.key)); 
            }
            if (event.key=="Tab")
            {   event.preventDefault();
            }
        }
    );
    document.addEventListener
    (   'keyup', function(event)
        {   if (!that.overlay) 
            {   that.onKeyUp(KeyEvent.toNumericCode(event.key)); 
            }
            if (event.key=="Tab") 
            {   event.preventDefault();
            }
        }
    );    
    document.addEventListener
    (   'keypress', function(event)
        {   if (event.key=="Tab") 
            {   event.preventDefault();
            }
        }
    );    
    this.canvas.addEventListener
    (   'mousedown', function(event)
        {   if (!that.overlay) that.onMouseDown(event); 
        }
    );
    this.canvas.addEventListener
    (   'mouseup', function(event)
        {   if (!that.overlay) that.onMouseUp(event);
        }
    );
    this.canvas.addEventListener
    (   'mousemove', function(event)
        {   if (!that.overlay) that.onMouseMove(event);
        }
    );
    this.canvas.addEventListener
    (   'mouseleave', function(event)
        {   if (!that.overlay) that.onMouseLeave(event);
        }
    );    
    this.canvas.addEventListener
    (   'mousewheel', function(event)
        {   if (event.wheelDelta>0) 
			{	that.onKeyDown(KeyEvent.UP);
				that.onKeyUp(KeyEvent.UP);
			}
			else
			{	that.onKeyDown(KeyEvent.DOWN);
				that.onKeyUp(KeyEvent.DOWN);
			}
        }
    );    
    this.canvas.addEventListener
    (   'touchstart', function(event)
        {   if (!that.overlay) that.onTouchStart(event);
        }
    );
    this.canvas.addEventListener
    (   'touchend', function(event)
        {   if (!that.overlay) that.onTouchEnd(event);
        }
    );
    this.canvas.addEventListener
    (   'touchcancel', function(event)
        {   if (!that.overlay) that.onTouchCancel(event);
        }
    );
    this.canvas.addEventListener
    (   'touchmove', function(event)
        {   if (!that.overlay) that.onTouchMove(event);
        }
    );
    
    // handle canvas size changes
    window.addEventListener
    (   'resize', function(event)
        {   var wbefore = that.screenwidth;
            var hbefore = that.screenheight;
            var pwbefore = that.pixelwidth;
            var phbefore = that.pixelheight;
            setScreenAndCanvasSize();
            if 
            (   wbefore!=that.screenwidth || hbefore!=that.screenheight
                || pwbefore!=that.pixelwidth || phbefore!=that.pixelheight
            ) 
            {   if (that.levelRenderer) { that.levelRenderer.loadOrReloadAllImages(); }                
                that.notifyScreensAboutResize(); 
                that.setDirty();
            }
        }
    );   

	// handle game controllers connect and disconnect events
	window.addEventListener
	(	"gamepadconnected", function(e) 
		{	
			console.log("connected: "+e.gamepad,e.gamepad.index,e.gamepad.id);
			while (that.connectedControllers.length <= e.gamepad.index) { that.connectedControllers.push(null); }
			that.connectedControllers[e.gamepad.index] = [ 0, false, false, false, false, false, false, false, false ];
		}
	)
	window.addEventListener
	(	"gamepaddisconnected", function(e) 
		{	console.log("disconnected: "+e.gamepad,e.gamepad.index,e.gamepad.id);
			that.connectedControllers[e.gamepad.index] = null;
		}
	)
    
    // set up game loop
    window.requestAnimationFrame (ftick);    
    return this;
    
    function ftick() 
    {   that.tick();    // in case of exception stop the loop
		if (that.levels==null && that.levelRenderer!=null && that.levelRenderer.isLoaded()) 
		{	that.continueAfterLoadingRenderers();
		}
        window.requestAnimationFrame(ftick);        
    }
        
    // computation for best canvas size
    function setScreenAndCanvasSize() 
    {   var ratio = window.devicePixelRatio || 1;
        var csswidth = Math.round(window.innerWidth);
        var cssheight = Math.round(window.innerHeight);
        var pixelwidth = Math.round(window.innerWidth*ratio);
        var pixelheight = Math.round(window.innerHeight*ratio);        
        that.screenwidth = csswidth;
        that.screenheight = cssheight;    
        that.pixelwidth = pixelwidth;
        that.pixelheight = pixelheight;        
        that.canvas.width = pixelwidth;
        that.canvas.height = pixelheight;   
        that.canvas.style["width"] = csswidth+"px";
        that.canvas.style["height"] = cssheight+"px";
        that.pixeltilesize = Math.round(ratio*30)*2; // always use even number of pixel 
        
//        console.log
//        (   "css size:",csswidth,cssheight,
//            "pixel size:",pixelwidth,pixelheight,
//            "tile size:",that.pixeltilesize
//        );
    }          
};
        
Game.prototype.continueAfterLoadingRenderers = function()
{
	var that = this;
    // cause further loading to progress
    this.levels = [];
    
    // start in editor mode - no need to load integrated levels
    if (Game.geturlparameter("editor",null) != null)
    {   var l = new Level().$(null,null);
        that.replaceTopScreen(new EditorScreen().$(that,l)); 
        that.soundPlayer = (new LevelSoundPlayer()).$();
    } 
    // start game normally
    else
    {   this.loadIntegratedLevelPack
        (   "all.json",
            function() 
            {   that.replaceTopScreen(new LevelSelectionScreen().$(that));  
                that.soundPlayer = (new LevelSoundPlayer()).$();
            }
        );
    }
};
    
// ---------------- handling of global game information ---------
    
Game.prototype.setLevelSolvedGrade = function(level, solvedgrade)
{
//   console.log("setLevelSolvedGrade to "+solvedgrade);
   if (window.localStorage)
   {    
        window.localStorage[level.getHash()] = "" + solvedgrade;
//        console.log("stored",level.getHash(),""+solvedgrade);
   }
};  

Game.prototype.getLevelSolvedGrade = function(level)
{
    var sg = Game.DEFAULTSOLVEDGRADE;
    if (window.localStorage)
    {   var s = window.localStorage[level.getHash()];
        if (s)
        {   sg = parseInt(s);
        }
    }    
// console.log("getLevelSolvedGrade="+sg);    
    return sg;
};
        
Game.prototype.setMusicActive = function(active)
{
};

Game.prototype.getMusicActive = function()
{
    return false;
};      
    
    
Game.prototype.loadIntegratedLevelPack = function(filename, callback)
{
    var levels = this.levels;
    Game.getJSON
    (   "levels/"+filename, function(data) 
        {   if (data && data.length) 
            {   for (var i=0; i<data.length; i++)
                {   levels.push(new Level().$(null,data[i]));
                }
            }
            callback();
        }
    );
};

/** 
* Try to store a level into the local file system.
*/ 
     
Game.prototype.writeLevelToLocalSystem = function(l)
{
    var fileContents=JSON.stringify(l.toJSON(), null, 2);
    var fileName= l.filename === null ? "unnamed.sy" : l.filename;

    var pp = document.createElement('a');
    pp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents));
    pp.setAttribute('download', fileName);
    pp.click();
};              

Game.prototype.loadLevelFromLocalSystem = function(callback)
{
//    console.log("try opening file picker");
    var pp = document.createElement('input');
    pp.setAttribute('type', 'file');
    pp.setAttribute('accept', '.sy');
    
    pp.addEventListener('change', function()
        {   
//        console.log("file picker change event: "+pp.files.length);
            if (pp.files.length>0)
            {   var fname = pp.files[0].name;
//                console.log("picked",fname);
        
                var reader = new FileReader();
                reader.addEventListener('loadend', function(e)
                    {   
//                       console.log("received file: "+reader.result);
                        callback( (new Level()).$(fname,JSON.parse(reader.result)) );
                    }
                );   
                reader.readAsText(pp.files[0]);
            }                
        }        
    );
    
    pp.click();
};

// constant game loop
Game.prototype.tick = function()
{
	// query all connected controllers
	if (this.connectedControllers.length>0)
	{	var gp = navigator.getGamepads();
		for (var i=0; i<this.connectedControllers.length; i++)
		{	if (this.connectedControllers[i]) { this.processControllerInput(i,this.connectedControllers[i], gp[i]); }	
		}
	}
	
    // topmost screen always gets the tick action (other screens do not animate)
    if (this.screens.length>0)
    {   this.getTopScreen().tick();
    }
    
    // when anything changed in the display, redraw
    if (this.needRedraw) 
    {   var loaded = this.loadRenderers();
		if (loaded || (this.screens.length>0 && (this.screens[0] instanceof LoadingScreen) && this.textRenderer.isLoaded()))
        {   this.needRedraw = false;
            try { this.draw(); } 
            catch (e) { console.warn(e); }            
        }
    }
};

Game.prototype.draw = function()
{
    var gl = this.gl;
    gl.viewport(0,0,this.pixelwidth,this.pixelheight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // paint current contents of all the screens begin from the bottom still visible screen
    var bottom = 0;
    for (var i=1; i<this.screens.length; i++)
    {   
        if (!this.screens[i].isOverlay())
        {   bottom = i; 
        }
    }
    
    for (var i=bottom; i<this.screens.length; i++)
    {   
//        console.log("draw",this.screens[i]);
        this.screens[i].draw();        
    }
    
    gl.disable(gl.BLEND);   

    var e = gl.getError();
    if (e) 
    {   console.log("WebGL error on drawing: "+e);
    }

};

Game.prototype.notifyScreensAboutResize = function()
{
    for (var i=0; i<this.screens.length; i++)
    {   this.screens[i].onResize();        
    }    
};

// -------------- handling of opening/closing screens and screens notifying changes -------
    
Game.prototype.setDirty = function()    
{   this.needRedraw = true;
};
    
    
Game.prototype.addScreen = function(screen)
{   this.screens.push(screen);
    this.setDirty();
};
    
Game.prototype.removeScreen = function()
{
    this.setDirty();
    if (this.screens.length<=1)
    {   // do not leave game completely
        // this.screens = [];
        // (this.exitcall)();      // after closing last remaining screen, try to exit program
    }
    else
    {   var olds = this.screens.pop();
        var news = this.screens[this.screens.length-1];
        olds.discard();         
        news.reactivate();
    }
};

Game.prototype.replaceTopScreen = function(screen)
{
    this.setDirty();
    var old = this.screens.pop();
    this.screens.push(screen);
    old.discard();
};
    
Game.prototype.getTopScreen = function()
{
    return this.screens.length>0 ? this.screens[this.screens.length-1] : null;
};

Game.prototype.openTextInputDialog = function(labeltext,initvalue, callback)
{
    this.overlay = document.createElement("div");
    this.overlay.style.position = "absolute";
    this.overlay.style.left = "0px";
    this.overlay.style.top = "0px";
    this.overlay.style.width = "100%";
    this.overlay.style.height = "100%";
    this.overlay.style["background-color"] = "black";
    
    var label = document.createElement("par");
    label.style["color"] = "white";
    label.style["font-family"] = "verdana";
    label.style["font-size"] = "2em";
    label.appendChild(document.createTextNode(labeltext));
    this.overlay.appendChild(label);  
   
    this.overlay.appendChild(document.createElement("br"));
    
    var input = document.createElement("input");
    input.type = "text";
    input.value = initvalue;
    input.style["color"] = "white";
    input.style["background-color"] = "black";
    input.style["font-family"] = "verdana";
    input.style["font-size"] = "2em";
    input.style["box-sizing"] = "border-box";
    input.style["border"] = "0.05em solid #9ecaed";
    input.style["border-radius"] = "0.1em";
    this.overlay.appendChild(input);      
    
    var that = this;
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === "Escape") {
            if (that.overlay)
            {   var text = input.value;                
                var o = that.overlay;
                that.overlay = null;
                o.remove();
                callback(text);
                event.stopPropagation();
            }
        }
    });
    
    this.canvas.parentNode.appendChild(this.overlay);
    input.focus();      
};
        

// --------- loading renderers (will be triggered by system or by user key ----
Game.prototype.loadRenderers = function()
{   
	var isdone = false;
	
    // load renderers in sequence 
	if (this.vectorRenderer==null)
	{   this.vectorRenderer = new VectorRenderer().$(this);
		console.log("VectorRenderer created");
	}
	else if (!this.vectorRenderer.isLoaded()) {}
	else if (this.textRenderer==null) {
		this.textRenderer = new TextRenderer().$(this);
		console.log("TextRenderer created");
	}
	else if (!this.textRenderer.isLoaded()) {}
	else if (this.levelRenderer==null) { 
		this.levelRenderer = new LevelRenderer().$(this);
		console.log("LevelRenderer created");      
	}
    else if (this.levelRenderer.isLoaded())
	{	isdone = true;
	}
	
    // check if any error has occured
    var e = this.gl.getError();
    if (e) 
    {   console.log("WebGL error on creating renderers: "+e);
    }
	
	return isdone;
}
 

// ---- handling of keyboard input events -----
Game.prototype.onKeyDown = function(keycode) 
{    
    this.usingKeyboardInput = true;
        
    if (this.screens.length>0 && (keycode==KeyEvent.BACK))
    {   this.getTopScreen().onBackNavigation();
    }
    else if (this.screens.length>0)
    {   this.getTopScreen().onKeyDown(keycode);
    }
};
Game.prototype.onKeyUp = function(keycode) 
{        
    if (this.screens.length>0)
    {
        this.getTopScreen().onKeyUp(keycode);
    }
};

// ---- handling of mouse events - translate to simplified "pointer" events ---
Game.prototype.onMouseDown = function(e)
{
    if (!this.isTouch) 
    {   var b = this.canvas.getBoundingClientRect();            
        var cx = Math.round( ((e.clientX-b.left)/b.width) * this.screenwidth );
        var cy = Math.round( ((e.clientY-b.top)/b.height) * this.screenheight ); 
        if (this.screens.length>0)
        {   if (this.isPointerDown)
            {   //console.log("pointer move: ",cx,cy);
                this.getTopScreen().onPointerMove(cx,cy);
            }
            else
            {   //console.log("pointer down: ",cx,cy);
                this.getTopScreen().onPointerDown(cx,cy);
            }
        }
        this.isPointerDown = true;             
    }        
};
Game.prototype.onMouseUp = function(e)
{
    if (!this.isTouch) 
    {   
        if (this.screens.length>0 && this.isPointerDown)
        {   //console.log("pointer up");
            this.getTopScreen().onPointerUp();
        }
        this.isPointerDown = false;
    }
};
Game.prototype.onMouseMove = function(e)
{
    if (!this.isTouch) 
    {   var b = this.canvas.getBoundingClientRect();            
        var cx = Math.round( ((e.clientX-b.left)/b.width) * this.screenwidth );
        var cy = Math.round( ((e.clientY-b.top)/b.height) * this.screenheight );
                
        if (this.screens.length>0 && this.isPointerDown)
        {   //console.log("pointer move: ",cx,cy);
            this.getTopScreen().onPointerMove(cx,cy);
        }
    }
};
Game.prototype.onMouseLeave = function(e) 
{ 
    if (!this.isTouch) 
    {   if (this.isPointerDown && this.screens.length>0)
        {   //console.log("pointer up");
            this.getTopScreen().onPointerUp();
        } 
        this.isPointerDown = false;
    }
};
        
// ----- handling of touch events - these are translated to pointer events --- 
Game.prototype.onTouchStart = function(e) 
{ 
};
Game.prototype.onTouchEnd = function(e)
{         
};
Game.prototype.onTouchCancel = function(e)
{
};
Game.prototype.onTouchMove = function(e)
{
};

// ---- handling of controller states - these are translated to key presses ---
Game.prototype.processControllerInput = function(idx,states, gp)
{
	// query current state of controller
	var isleft = false;
	var isright = false;
	var isup = false;
	var isdown = false;
	var isa = false;
	var isb = false;
	var isback  = false;
	var isforward  = false;
	if (gp.axes && gp.axes.length>=2)
	{	if (gp.axes[1]<-0.9) { isup=true; }
		if (gp.axes[1]>0.9) { isdown=true; }
		if (gp.axes[0]<-0.9) { isleft=true; isup=false; isdown=false; }
		if (gp.axes[0]>0.9) { isright=true; isup=false; isdown=false; }
	}
	var buttons = gp.buttons;
	if (buttons.length>0 && buttons[0].pressed) { isa = true; }
	if (buttons.length>1 && buttons[1].pressed) { isb = true; }
	if (buttons.length>2 && buttons[2].pressed) { isback = true; }
	if (buttons.length>3 && buttons[3].pressed) { isforward = true; }
	if (buttons.length>8 && buttons[8].pressed) { isback = true; }
	if (buttons.length>9 && buttons[9].pressed) { isforward = true; }
	if (buttons.length>12 && buttons[12].pressed) { isup = true; isdown=false; isleft=false; isright=false; }
	if (buttons.length>13 && buttons[13].pressed) { isup = false; isdown=true; isleft=false; isright=false; }
	if (buttons.length>14 && buttons[14].pressed) { isup = false; isdown=false; isleft=true; isright=false; }
	if (buttons.length>15 && buttons[15].pressed) { isup = false; isdown=false; isleft=false; isright=true; }
		
	// check differences to previous state and generate events
	states[0]++; // increase time counter
	dobutton(this,1,isleft,KeyEvent.LEFT);
	dobutton(this,2,isright,KeyEvent.RIGHT);
	dobutton(this,3,isup,KeyEvent.UP);
	dobutton(this,4,isdown,KeyEvent.DOWN);
	dobutton(this,5,isa,KeyEvent.A);
	dobutton(this,6,isb,KeyEvent.B);
	dobutton(this,7,isback,KeyEvent.BACK);
	dobutton(this,8,isforward,KeyEvent.FORWARD);
	
	function dobutton(game,idx,pressed,keycode)
	{
		if (!pressed)
		{	if (states[idx])
			{	states[idx]=false;
				game.onKeyUp(keycode);
			}
		}
		else
		{	var now = states[0];
			if (!states[idx])
			{	states[idx] = now + 30;  // initial key repeat delay
				game.onKeyDown(keycode);
			}
			else if (now >= states[idx])
			{	states[idx] = now + 3;  // subsequent key repeat delay
				game.onKeyDown(keycode);
			}	
		}
	}
};
	
// -------------- handling music playback --------

Game.prototype.startMusic = function(filename)
{
    // NOT YET IMPLEMENTED
};

Game.prototype.stopMusic = function()
{
    this.startMusic(null);
};

Game.prototype.startCategoryMusic = function (category)
{
    switch (category)
    {   case 0:  // "Fun"
            this.startMusic("Time");
            break;              
        case 1: // "Travel"
            this.startMusic("Calm");
            break;
        case 2: // "Action"
            this.startMusic("Action");
            break;
        case 3: // "Fight"
            this.startMusic("Granite");
            this.break;
        case 4: // "Puzzle"
            this.startMusic("Crystal");
            this.break;
        case 5: // "Science"
            this.startMusic("Only Solutions");
            break;
        case 6: // "Work"
            this.startMusic("Time");
            this.break;        
    }
};

    
// --------------------- static toolbox methods ------------------------------

Game.getColorForDifficulty = function(difficulty)
{
    switch(difficulty)
    {   case 1:  // previously Simple
        case 2:     // Easy
            return Game.argb(102,204,255);
        case 3:     // Moderate
            return Game.argb(38,139,255);
        case 4:     // Normal
            return Game.argb(51,204,20);
        case 5:     // Tricky
            return Game.argb(74,255,38);
        case 6:     // Tough
            return Game.argb(255,248,51);
        case 7:     // Difficult
            return Game.argb(255,128,0);
        case 8:     // Hard
            return Game.argb(255,36,20);
        case 9:     // M.A.D.
            return Game.argb(204,15,8);
        default:
            return Game.argb(170,170,170);
    }
};
    
Game.getNameForDifficulty = function(difficulty)
{
    switch(difficulty)
    {   case 1:  // previously Simple
        case 2:
            return "Easy";
        case 3:
            return "Moderate";
        case 4:
            return "Normal";
        case 5:
            return "Tricky";
        case 6:
            return "Tough";
        case 7:
            return "Difficult";
        case 8:
            return "Hard";
        case 9:
            return "M.A.D.";
        default:
            return "unrated";
    }
};

Game.getNameForCategory = function(category)    
{
    switch (category)
    {   case 0: 
            return "Fun";
        case 1:
            return "Travel";            
        case 2:
            return "Speed";
        case 3:
            return "Fighting";
        case 4: 
            return "Puzzle";
        case 5: 
            return "Science";
        case 6:
            return "Work";
        case 7:
            return "Survival";
        default:
            return "unknown";
    }
};

Game.getIconForCategory = function(category)    
{
    switch (category)
    {   case 0:  // Fun
            return 1;
        case 1:  // Travel
            return 2;
        case 2:  // Speed
            return 3;
        case 3:  // Fighting
            return 5;
        case 4:  // Puzzle
            return 6;
        case 5:  // Science
            return 7;
        case 6:  // Work
            return 8;
        case 7:  // Survival
            return 4;
        default:
            return "unknown";
    }
};

Game.getIconForDifficulty = function(difficulty)    
{
    return 9 + difficulty;
}

    
Game.argb = function(r, g, b)
{
    return 0xff000000 | (r<<16) | (g<<8) | (b<<0);
};


Game.getJSON = function(url, callback) 
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType("text/plain");
    xmlhttp.onreadystatechange = function() 
    {   if (this.readyState == 4)
        {   if (this.status == 200) 
            {   var myObj = JSON.parse(this.responseText);
                callback(myObj);
            }
            else
            {   callback(null);
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
};

Game.arraycopy = function(from,fromstart,to,tostart,length)
{
    if (from>to)
    {   for (var i=0; i<length; i++) to[tostart+i] = from[fromstart+i];
    }
    else
    {   for (var i=length-1; i>=0; i--) to[tostart+i] = from[fromstart+i];
    }    
};

Game.fillarray = function(a, value)
{   
    if (a.fill) 
    {   a.fill(value); 
    }
    else
    {   for (var i=0; i<a.length; i++) { a[i] = value; };
    }
};

Game.currentTimeMillis = function()
{
    return Date.now();
};


/** 
 * 	Create string of the form m:ss of a given number of seconds. 
 *  Only non-negative seconds work correctly.
 */ 
Game.buildTimeString = function(seconds)
{
    var s = seconds%60;
    var m = (seconds - s)/60;
    if (s>=10)
    {   return m+":"+s;
    }
    else
    {	return m+":0"+s;
    }			
};

// decode url parameters
Game.geturlparameter = function(key, defaultvalue) 
{   var urlparameters = {};
    if (window.location.search) {
      var chunks = window.location.search.replace("?","&").split("&");
      for (var i=0; i<chunks.length; i++) {
        var chunk = chunks[i];
        var eqidx = chunk.indexOf("=")
        if (eqidx>0) {
          var k = chunk.substring(0,eqidx);
          var v = decodeURIComponent(chunk.substring(eqidx+1)).trim();
          if (k===key) { return v; }
        }
      }
    }
    return defaultvalue;
}

"use strict";
var KeyEvent = {
    
    BACK:   0x00001006,  // back/cancel
    FORWARD:0x00001007,  // start or contect dependent

    UP:     0x00001000,         
    DOWN:   0x00001001,
    LEFT:   0x00001002,
    RIGHT:  0x00001003,
    A:      0x00001004,  // confirmation (or main action)
    B:      0x00001005,  // auxiliary action
    
    UP2:    0x00001010,         
    DOWN2:  0x00001011,
    LEFT2:  0x00001012,
    RIGHT2: 0x00001013,
    A2:     0x00001014,
    B2:     0x00001015,

    toNumericCode: function(c)
    {   switch (c)         
        {   case "Up":
            case "ArrowUp":         { return KeyEvent.UP; }
            case "Down":
            case "ArrowDown":       { return KeyEvent.DOWN; }
            case "Left":
            case "ArrowLeft":       { return KeyEvent.LEFT; }
            case "Right":
            case "ArrowRight":      { return KeyEvent.RIGHT; }
            case "Enter":           { return KeyEvent.FORWARD; }
            case " ":    
            case "Space":           { return KeyEvent.A; }
            case "Shift":
            case "ShiftLeft":       { return KeyEvent.B; }
            case "Esc":
            case "Escape":          { return KeyEvent.BACK; }
            case "W":
            case "w":
            case "KeyW":            { return KeyEvent.UP2; }
            case "S":
            case "s":
            case "KeyS":            { return KeyEvent.DOWN2; }
            case "A":
            case "a":
            case "KeyA":            { return KeyEvent.LEFT2; }
            case "D":
            case "d":
            case "KeyD":            { return KeyEvent.RIGHT2; }
            case "Q":
            case "q":
            case "KeyQ":            { return KeyEvent.A2; }
            case "E":
            case "e":
            case "KeyE":            { return KeyEvent.B2; }

            default:                
            {   console.log("unknown key ["+c+"]");
                if (c>0 && c<256) return c;
                else              return 32;  
            }
        }
    }
};


var Button = function()
{
    this.game = null;    
    this.x = 0.0;
    this.y = 0.0;
    this.width = 0.0;
    this.height = 0.0;
    this.triggeraction = null;    
    this.isPressed = false;
};

Button.prototype.$ = function(game, x, y, width, height, triggeraction)
{
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.triggeraction = triggeraction;
    this.isPressed = false;
};
    
Button.prototype.draw = function(vr) 
{                       
};
    
Button.prototype.setPosition = function(x,y)
{   
    this.x = x;
    this.y = y;
};
    
    // ------------------- handle touch input commands ------------
Button.prototype.onPointerDown = function(x, y)
{
    if (x>=this.x && x<this.x+this.width && y>=this.y && y<this.y+this.height)
    {   this.isPressed = true;
        return true;        
    }
    return false;
};
    
Button.prototype.onPointerUp = function()
{
    if (this.isPressed)
    {   this.isPressed = false;
        this.triggeraction.run();
    }
};
        
Button.prototype.onPointerMove = function(x, y)
{
    if (!this.isPressed)
    {   return;
    }
    this.isPressed = (x>=this.x && x<this.x+this.width && y>=this.y && y<this.y+this.height);
};


var PauseButton = function()
{   Button.call(this);
};
PauseButton.prototype = Object.create(Button.prototype);
    
PauseButton.shape_pausebutton = [ 
        -60,-100,-20,-100,-60,100,-20,100, -20,100,     
        20,-100,20,-100, 60,-100,20,100,60,100 
    ];


PauseButton.prototype.$ = function(game, x, y, width, height, triggeraction)
{
    Button.prototype.$(game,x,y,width,height,triggeraction); 
    return this;
};

PauseButton.prototype.draw = function(vr) 
{                
    var width = this.width;
    var height = this.height;
    var x = this.x;
    var y = this.y;
    vr.addRoundedRect(x,y,width,height, width/2, width/2+1.0, this.isPressed ?  0xff666666 : 0xdd000000);
    vr.addShape(x+width/2,y+height/2, PauseButton.shape_pausebutton, width/3.0, 0xffffffff);
};

"use strict";
var Screen = function() 
{   this.game = null;   
};

Screen.prototype.$ = function(game)
{
    this.game = game;
    return this;
};

Screen.prototype.discard = function()
{
};

Screen.prototype.setDirty = function()
{
    this.game.setDirty();
};


// can be overwritten to get notified about events and things to do
// and things to report


Screen.prototype.tick = function()
{
};

Screen.prototype.draw = function()
{
};

Screen.prototype.reactivate = function()
{
};

Screen.prototype.isOverlay = function()
{   return false;
};

Screen.prototype.onResize = function()
{
};

// ---- default key event handlers  ----
Screen.prototype.onKeyDown = function(keycode)
{
};

Screen.prototype.onKeyUp = function(keycode)
{
};

Screen.prototype.onBackNavigation = function()
{
    this.game.removeScreen();
};
    
// interface for simplified touch events. 
Screen.prototype.onPointerDown = function(x, y)
{
};

Screen.prototype.onPointerUp = function()
{
};

Screen.prototype.onPointerMove = function(x,y)
{
};



"use strict";
var LoadingScreen = function() 
{
    Screen.call(this);
};
LoadingScreen.prototype = Object.create(Screen.prototype);

LoadingScreen.prototype.$ = function(game)
{   Screen.prototype.$.call(this,game);
    return this;
};

LoadingScreen.prototype.draw = function()
{    
    var tr = this.game.textRenderer;
    tr.startDrawing (this.game.screenwidth, this.game.screenheight);    
    
	var msg = "Loading...";
	var h = 50;
    tr.addString
	(	msg, 
		this.game.screenwidth/2 - tr.determineStringWidth(msg,40)/2, 
		this.game.screenheight/2 - h/2,
		h, 
		false, 
		0xffffffff, 
		TextRenderer.WEIGHT_PLAIN
	);
    tr.flush();    
};

"use strict";
var TestScreen = function() 
{
    Screen.call(this);
    this.t = 0;
};
TestScreen.prototype = Object.create(Screen.prototype);

TestScreen.prototype.$ = function(game)
{   Screen.prototype.$.call(this,game);
    this.t = 0;
    return this;
};

TestScreen.prototype.tick = function()
{   this.t = (this.t + 1) % 600;  
//    if (this.t<=300) 
    this.setDirty();
};

TestScreen.prototype.draw = function()
{    
    var screenwidth = this.game.screenwidth;
    var screenheight = this.game.screenheight;

    var vr = this.game.vectorRenderer;
    vr.startDrawing (screenwidth, screenheight);  
    var tr = this.game.textRenderer;
    tr.startDrawing (screenwidth, screenheight);    
    var gr = this.game.gfxRenderer;
    gr.startDrawing (screenwidth, screenheight);    
    
    vr.addRoundedRect(10,10,100,100, 5,10, Game.getColorForDifficulty(3));   
    var s = 150;
    if (this.t<300) {
        if (this.t<150) s = 150 - this.t/2;
        else            s = 150 - (300-this.t)/2;
    }
    vr.addCrossArrows(250-s/2,250-s/2, s,s, Game.getColorForDifficulty(4));        
    
    tr.addString("Hello World", 50,350, 50, false, Game.getColorForDifficulty(5), 
           TextRenderer.WEIGHT_PLAIN);
           
    gr.addGraphic(gr.TITLEPICTURE, 200,11, 100,100);
           
    gr.flush();
    vr.flush();
    tr.flush();    
    tir.flush();
};

"use strict";
var LevelSelectionScreen = function()
{
    Screen.call(this);
    
    this.selectednumberofplayers = 0;
    this.selectingcriterium = false;
    this.selectedcriterium = 0;
    this.selectedlevel = 0;
    
    this.filteredlevels = [];    
    this.listscrolly = 50;
    
    this.pointerdownx = 0;
    this.pointerdowny = 0;
    this.pointerdowntime = 0;
    this.pointerx = 0;
    this.pointery = 0;
    this.pointeractive = false;    
};
LevelSelectionScreen.prototype = Object.create(Screen.prototype);

LevelSelectionScreen.prototype.$ = function (game)
{   Screen.prototype.$.call(this,game);

    this.selectednumberofplayers = 1;
    this.selectingcriterium = true;
    this.selectedcriterium = 0;
    this.selectedlevel = this.filterAndSortLevels();
    return this;
};

    
LevelSelectionScreen.prototype.draw = function()
{
    var menuwidth = Math.min(320, this.game.screenwidth);                 
    
    var background = 0xff000000;
    var buttonnormal = 0xff303030;
    var rowheight = 32;
    var textcolor = 0xffbbbbbb;
    var bigtext = 30;
    var smalltext = 21;

    var vr = this.game.vectorRenderer;
    var tr = this.game.textRenderer;
    var lr = this.game.levelRenderer;
    
    // paint level underlay
    if (this.selectedlevel<this.filteredlevels.length && this.filteredlevels.length>0)
    {   var l = this.filteredlevels[Math.max(this.selectedlevel,0)];
        var lo = (new Logic()).$();
        lo.attach(l, (new Walk()).$randomseed(0));
        lr.startDrawingMini(menuwidth, l.getWidth(),l.getHeight());
        lr.draw(lo, 0);
        lr.flush();
    }        
    
    vr.startDrawing();
    tr.startDrawing();
    lr.startDrawDecoration();    
    vr.addRoundedRect(0,0,menuwidth,this.game.screenheight, 3, 4, background);
    var x = 10;
    var y = 5;
    
    // mode to select a category/difficulty
    if (this.selectingcriterium)
    {           
        var titlecolor = 0xff2689fb;
        lr.addDecorationPieceToBuffer (x+17,y+19,SAPPHIRE);
        tr.addString
        (   "Sapphire", x+40, y, smalltext,
            false, titlecolor, TextRenderer.WEIGHT_BOLD
        );
        tr.addString
        (   "Yours", x+40, y+18, smalltext,
            false, titlecolor, TextRenderer.WEIGHT_BOLD
        );

        var numbuttonwidth = 32;
        var numbuttonheight = 32;
        x2 = menuwidth - 12 - numbuttonwidth;
        var str = ""+(this.selectednumberofplayers);
		var isselected = this.selectedcriterium<0;
        vr.addRoundedRect(x2,y, numbuttonwidth, numbuttonheight, 3,4,  isselected ? titlecolor : 0xff444444);
        tr.addString
        (   str, 
                x2 + numbuttonwidth/2 - tr.determineStringWidth(str,bigtext)/2, 
                y + (numbuttonheight-bigtext)/2, 
                bigtext, 
                false, 
                isselected ? 0xff444444 : titlecolor,
                TextRenderer.WEIGHT_BOLD
        );
        
        y+=60;

        var buttonheight = rowheight-2;
        var buttonwidth = menuwidth/2 - x - 2;
        
        tr.addString
        (   "Difficulty", x, y, bigtext,
            false, textcolor, TextRenderer.WEIGHT_PLAIN
        );
        y += rowheight;
        
        for (var bu=0; bu<8; bu++)
        {   var column = bu%2;
            var x2 = x+column*(buttonwidth+2);
            var d = pos2difficulty(bu);
            var sel = (this.selectedcriterium==bu);
            vr.addRoundedRect
            (   x2,y,buttonwidth,buttonheight, 3,4, 
                sel ? Game.getColorForDifficulty(d) : buttonnormal
            );
            tr.addString
            (   " " + String.fromCharCode(Game.getIconForDifficulty(d)) 
                + " " + Game.getNameForDifficulty(d), 
                x2, 
                y + (buttonheight-smalltext)/2, 
                smalltext, 
                false, 
                sel ? 0xff000000 : Game.getColorForDifficulty(d), 
                TextRenderer.WEIGHT_BOLD
            );
            if (column==1) { y+=rowheight; }
        }
        
        y += rowheight/2;
        tr.addString
        (   "Category", x, y, rowheight, 
            false, textcolor, TextRenderer.WEIGHT_PLAIN
        );
        y += rowheight;
        
        for (var bu=8; bu<16; bu++)
        {   var column = bu%2;
            var x2 = x+column*(buttonwidth+2);
            var c = pos2category(bu);
            var sel = (this.selectedcriterium==bu);
            vr.addRoundedRect
            (   x2,y,buttonwidth,buttonheight, 3,4, 
                sel ? textcolor : buttonnormal
            );
            tr.addString
            (   " " + String.fromCharCode(Game.getIconForCategory(c)) 
                    + " " + Game.getNameForCategory(c), 
                x2, 
                y + (buttonheight-smalltext)/2, 
                smalltext, 
                false,
                sel ? 0xff000000 : 0xffffffff, TextRenderer.WEIGHT_BOLD
            );
            if (column==1) { y+=rowheight; }
        }
    }
    // mode to select an individual level
    else
    {
        y = this.listscrolly;
        var d = pos2difficulty(this.selectedcriterium);
        var c = pos2category(this.selectedcriterium);

        var buttonheight = rowheight-2;
        var buttonwidth = menuwidth - 2*x - 2;

        for (var i=0; i<this.filteredlevels.length; i++)
        {             
            var l = this.filteredlevels[i];            
            var color = Game.getColorForDifficulty(l.getDifficulty());
            var sel = (this.selectedlevel==i);            
            if (sel)
            {   vr.addRoundedRect
                (   x,y,buttonwidth,buttonheight, 3,4, 
                    color
                );
            }
            else
            {   vr.addRectangle
                (   x,y,buttonwidth,buttonheight, 
                    buttonnormal
                );
            }
            
            var solve = this.game.getLevelSolvedGrade(l);
            if (solve>=1)
            {   vr.addFrame(x+1,y+1,buttonheight-6,buttonheight-2, solve, sel ? 0xff000000 : color);
            }

            tr.addString
            (   " " 
                + String.fromCharCode
                (   c<0 ? Game.getIconForCategory(l.getCategory())
                        : Game.getIconForDifficulty(l.getDifficulty()) 
                )
                + "  " + l.getTitle(), 
                x, 
                y + (buttonheight-smalltext)/2, 
                smalltext, 
                false,
                sel ? 0xff000000 : color, TextRenderer.WEIGHT_BOLD
            );
            
            y += rowheight;
        }
        
        vr.flush();
        tr.flush();

        {   var color = textcolor;
            
            y = 5;
            vr.addRectangle(0,0, menuwidth,50, 0xff000000);        
            if (d>=0) 
            {   color = Game.getColorForDifficulty(d);
                tr.addString
                (   Game.getNameForDifficulty(d), x, y, bigtext,
                    false, color, TextRenderer.WEIGHT_PLAIN
                );
            } 
            if (c>=0) 
            {   tr.addString
                (   Game.getNameForCategory(c), x, y, bigtext,
                    false, textcolor, TextRenderer.WEIGHT_PLAIN
                );
            }
            
            var exitbuttonwidth = 32;
            var exitbuttonheight = 32;
            var x2 = menuwidth-12 - exitbuttonwidth;
            var isselected = this.pointeractive 
            && this.isClickedExitButton(this.pointerdownx,this.pointerdowny);
		    if (this.selectedlevel<0) { isselected=true; }
            vr.addRoundedRect(x2,y, exitbuttonwidth, exitbuttonheight, 3,4, isselected ? color : 0xff444444);
            vr.addCross(x2,y, exitbuttonwidth, exitbuttonheight, isselected ? 0xff444444 : color);        
        }
    }
    
    vr.flush();
    tr.flush();
    lr.flush();
};

LevelSelectionScreen.prototype.computeClickedCriterium = function(x, y)
{ 
    var rowheight = 32;
    var columnwidth = 160;    
    var top = 96;
    if (y>=top && x<2*columnwidth)
    {   var row = Math.floor((y-top) / rowheight);
        var column = Math.floor(x / columnwidth);
        if (column<=1 && row<=3) { return row*2 + column; }
    }
    var top = 272;
    if (y>=top && x<2*columnwidth)
    {   var row = Math.floor((y-top) / rowheight);
        var column = Math.floor(x / columnwidth);
        if (column<=1 && row<=3) { return 8 + row*2 + column; }
    }
    
    return -1;
};

LevelSelectionScreen.prototype.isClickedNumberOfPlayers = function(x, y)
{
    var menuwidth = Math.min(320, this.game.screenwidth);                 
    return /*x >= menuwidth-12 - 40 &&*/ x<menuwidth && y<40;
};

LevelSelectionScreen.prototype.isClickedExitButton = function(x, y)
{
    var menuwidth = Math.min(320, this.game.screenwidth); 
    return x >= menuwidth-12 - 40 && x<menuwidth && y<40;
};

function pos2difficulty(pos)
{
    if (pos<0 || pos>=8) { return -1; }
    return 2 + Math.floor(pos/2) + 4*(pos%2);
}
function pos2category(pos)
{
    switch (pos)
    {   case 8:    return 0;   // Fun
        case 10:   return 4;   // Puzzle
        case 12:  return 1;    // Travel
        case 14:  return 6;    // Work
        case 9:   return 5;    // Science
        case 11:  return 2;    // Speed
        case 13:  return 7;    // Survival
        case 15:  return 3;    // Fighting
        default: return -1;
    }    
}

LevelSelectionScreen.prototype.filterAndSortLevels = function()
{
    var prefered = 0;
    this.filteredlevels.length = 0;

    var pos = this.selectedcriterium>=0 ? this.selectedcriterium : 0;    
    for (var i=0; i<this.game.levels.length; i++)
    {   var l = this.game.levels[i];
        if 
        (   l.getNumberOfPlayers() === this.selectednumberofplayers
        &&  (   pos2difficulty(pos) === l.getDifficulty() 
                || pos2category(pos) === l.getCategory()
            )
        )
        {   this.filteredlevels.push(l);            
        }
    }
    
    this.filteredlevels.sort
    (   function(la, lb) 
        {   if (pos2category(pos)>=0) 
            {   var dd = la.getDifficulty() - lb.getDifficulty();
                if (dd!=0) return dd;
            }
            var a = la.getTitle();
            var b = lb.getTitle();
            return (a<b?-1:(a>b?1:0));  
        }
    );    

//    // use different default level in certain cases
//    if (pos2difficulty(pos) == 2)
//    {   for (var i=0; i<this.filteredlevels.length; i++)
//        {   var t = this.filteredlevels[i].getTitle();
//            if (t==="Basic Mining" || t=="Two Miners") 
//            {   prefered=i;
//            }
//        }
//    }
    return prefered; // the default level for this sorting
}

LevelSelectionScreen.prototype.scrollToVisible = function()
{
    if (this.selectingcriterium) { return; }
    var top = 50;    
    var bottom = this.game.screenheight - 5;            
    var lineheight = 32;
    var h = this.filteredlevels.length * lineheight;   
	if (top+h<=bottom) 
    {   this.listscrolly=top; 
    }
    else
    {   var cursory = this.listscrolly + lineheight*this.selectedlevel;
        if (this.listscrolly+h<bottom) { this.listscrolly=bottom-h; }
        if (cursory<top)
        {   this.listscrolly += (top-cursory);
        }
        else if (cursory>bottom-lineheight)
        {   this.listscrolly -= (cursory-(bottom-lineheight));
        }
        if (this.listscrolly>top) { this.listscrolly=top; }
    }
}

// ---- key event handlers --
LevelSelectionScreen.prototype.onKeyDown = function(keycode)
{    
    if (this.selectingcriterium)
    {   switch (keycode)
        {   case KeyEvent.LEFT:
            {   this.selectedcriterium = this.selectedcriterium & ~1;                
                this.selectedlevel = this.filterAndSortLevels();
                this.setDirty();
                break;
            }
            case KeyEvent.RIGHT:
            {   this.selectedcriterium = this.selectedcriterium | 1;                
                this.selectedlevel = this.filterAndSortLevels();
                this.setDirty();
                break;
            }
            case KeyEvent.UP:
            {   if (this.selectedcriterium-2>=0) 
                {   this.selectedcriterium -= 2;                    
                    this.selectedlevel = this.filterAndSortLevels();
                    this.setDirty();
                }
				else if (this.selectedcriterium>-1)
				{	this.selectedcriterium = -1;                    
                    this.selectedlevel = this.filterAndSortLevels();
                    this.setDirty();
				}
                break;
            }
            case KeyEvent.DOWN:
            {   if (this.selectedcriterium==-1)
				{	this.selectedcriterium = 0;                    
                    this.selectedlevel = this.filterAndSortLevels();
                    this.setDirty();
				}
				else if (this.selectedcriterium+2<16) 
                {   this.selectedcriterium += 2;                    
                    this.selectedlevel = this.filterAndSortLevels();
                    this.setDirty();
                }
                break;
            }            
            case KeyEvent.A:
            case KeyEvent.B:
            case KeyEvent.FORWARD:
            {   if (this.selectedcriterium<0)
				{	this.selectednumberofplayers = (this.selectednumberofplayers===1) ? 2:1;
					this.selectedlevel = this.filterAndSortLevels();
					this.setDirty(); 
				}
				else
				{	this.selectingcriterium = false;                
					this.scrollToVisible();
					this.setDirty();
				}
                break;
            }
        }
    }    
    // selecting individual level
    else
    {   switch (keycode)
        {   case KeyEvent.UP:
            {   if (this.selectedlevel>-1) 
                {   this.selectedlevel--;
                    this.scrollToVisible();
                    this.setDirty();
                }
                break;
            }
            case KeyEvent.DOWN:
            {   if (this.selectedlevel<this.filteredlevels.length-1) 
                {   this.selectedlevel++
                    this.scrollToVisible();
                    this.setDirty();
                }
                break;
            }
            case KeyEvent.A:
            case KeyEvent.B:
            case KeyEvent.FORWARD:
            {   if (this.selectedlevel<0)
				{	this.selectingcriterium = true;
					this.setDirty();
				}
				else
				{	this.startSelectedLevel();
				}
                break;
            }
        }        
    }
    
    Screen.prototype.onKeyDown.call(this,keycode);
};

LevelSelectionScreen.prototype.onPointerDown = function(x, y)
{
    var menuwidth = Math.min(320, this.game.screenwidth);                 
    var rowheight = 32;
    
    this.pointerdownx = x;
    this.pointerdowny = y;
    this.pointerx = x;
    this.pointery = y;
    this.pointeractive = true;    
    this.pointerdowntime = Game.currentTimeMillis();
    
    if (this.selectingcriterium)
    {   var c = this.computeClickedCriterium(x,y);
        if (c>=0)
        {   this.selectedcriterium = c;
            this.selectedlevel = this.filterAndSortLevels();
        }
        else if (this.isClickedNumberOfPlayers(x,y))
        {   this.selectednumberofplayers = (this.selectednumberofplayers===1) ? 2:1;
            this.selectedlevel = this.filterAndSortLevels();
        }
    }
    else
    {   if (x<menuwidth && y>=5+rowheight && y>=this.listscrolly)
        {   var row = Math.floor((y - this.listscrolly) / rowheight);
            if (row>=0 && row<this.filteredlevels.length)
            {   this.selectedlevel = row;
            }
        }       
    }
    this.setDirty();
};

LevelSelectionScreen.prototype.onPointerMove = function(x,y)
{
    var menuwidth = Math.min(300, this.game.screenwidth);                 
    var dy = y - this.pointery;
    this.pointerdowntime -= Math.abs(dy*10);
    
    this.pointerx = x;
    this.pointery = y;
    this.pointeractive = true;    
    
    if (!this.selectingcriterium && x<menuwidth && this.pointerdownx<menuwidth && y>40 && dy!=0)
    {   this.listscrolly += dy;
        this.scrollToVisible();
        this.setDirty();
    }
};

LevelSelectionScreen.prototype.onPointerUp = function()
{
    var x = this.pointerx;
    var y = this.pointery;
    this.pointeractive = false;
    var shortclick = Game.currentTimeMillis() < this.pointerdowntime + 500;
    
    if (this.selectingcriterium)
    {   if (shortclick)
        {   var c = this.selectedcriterium;
            this.computeClickedCriterium(this.pointerx,this.pointery);
            if (c>=0 
            && c==this.computeClickedCriterium(x,y)
            && c==this.computeClickedCriterium(this.pointerdownx,this.pointerdowny)
            )
            {   this.selectingcriterium = false;                
                this.scrollToVisible();      
            }
        }
    }
    else if 
    (   this.isClickedExitButton(this.pointerdownx,this.pointerdowny)
        && this.isClickedExitButton(x,y)
    )
    {   this.selectingcriterium = true;                
    }       
    else    
    {   if (shortclick)
        {   var menuwidth = Math.min(300, this.game.screenwidth);                 
            var rowheight = 32;
            if (x<menuwidth && y>=5+rowheight && y>=this.listscrolly)
            {   var row = Math.floor((y - this.listscrolly) / rowheight);
                if (row>=0 && row<this.filteredlevels.length && this.selectedlevel==row)
                {   this.startSelectedLevel();
                }
            }       
        }
    }
    
    this.setDirty();
};
  
LevelSelectionScreen.prototype.onBackNavigation = function()
{
    if (!this.selectingcriterium)
    {   this.selectingcriterium=true;
        this.setDirty();
    }
}
  
LevelSelectionScreen.prototype.getSelectedLevel = function()
{
    if (this.filteredlevels.length>this.selectedlevel)
    {   return this.filteredlevels[this.selectedlevel];
    }
    return null;
}
  
LevelSelectionScreen.prototype.startSelectedLevel = function()
{
    var l = this.getSelectedLevel();
    if (l!=null)
    {   var gs = new GameScreen().$
        (   this.game, l, null, 
            false
        );
        this.game.addScreen(gs);
        gs.afterScreenCreation();                      
    }                   
};

LevelSelectionScreen.prototype.startSubsequentLevel = function()
{
    if (this.selectedlevel+1<this.filteredlevels.length)
    {   this.selectedlevel++;
        this.startSelectedLevel();
    }
    else if (this.selectedlevel>0)
    {   this.selectedlevel=0;
        this.startSelectedLevel();
    }
};

"use strict";
var GameScreen = function()
{   Screen.call(this);

    this.level = null;
    this.logic = null;
    this.walk = null;
    this.startFromEditor = false;
    
    this.step = 0;
    this.frames_left = 0;
    this.playmode = 0;
    this.playbackspeed = 0;
    this.slowmotion_counter = 0;
    this.singlestep = false;
    this.time_at_record_start = 0;
    this.diduse_undo = false;
    this.diduse_singlestep = false;

    this.screenscrollx0 = 0;
    this.screenscrolly0 = 0;
    this.screenscrollx1 = 0;
    this.screenscrolly1 = 0;
    
    this.gamePadMUX = null;
    this.keyboardTranslator = null;
    this.inputGrid = null;
    this.menuButtonIsPressed = false;
    
    this.inputfocushighlightplayer = 0;
    this.inputfocushighlightx = 0;
    this.inputfocushighlighty = 0;
    this.inputmodeswitchtime = 0;
    this.screenshaketime = 0;
}
GameScreen.prototype = Object.create(Screen.prototype);
    
GameScreen.PLAYMODE_RECORD = 0;
GameScreen.PLAYMODE_DEMO   = 1;
GameScreen.PLAYMODE_UNDO   = 2;
GameScreen.PLAYMODE_REPLAY = 3;


GameScreen.prototype.$ = function (game, le, unfinishedwalk, startFromEditor)
{   Screen.prototype.$.call(this,game);        

    this.level = le;
    this.startFromEditor = startFromEditor;
    this.logic = null;
    this.frames_left=0;
    this.playmode = GameScreen.PLAYMODE_RECORD;
        
    // re-start existing walk
    if (unfinishedwalk!=null)
    {   this.walk = unfinishedwalk;
        this.step = this.walk.getTurns();
    }
    // build new walk
    else 
    {   this.walk = new Walk().$randomseed(Math.floor(Math.random()*1000000));
        this.step = 0;
    }
    this.logic = new Logic().$();
    this.logic.attach(this.level,this.walk);
    this.logic.gototurn(this.step);
                
    this.gamePadMUX = [ new GamePadInputBuffer().$(), new GamePadInputBuffer().$() ];
    this.keyboardTranslator = new KeyboardToGamepadTranslator().$(this.gamePadMUX[0], this.gamePadMUX[1]);
    this.inputGrid = [ new TouchInputGrid().$(game, 0x998888ff), new TouchInputGrid().$(game, 0xaa77ff55) ];        
    this.menuButtonIsPressed = false;
 
    this.adjustScrolling(true);      

    return this;
}

GameScreen.prototype.afterScreenCreation = function()
{
	var t = this.level.getTitle();	
    if (!this.startFromEditor && t.charCodeAt(1)==46)
    {   this.createMenuScreen(this.step!=0);
    }       
    if (this.game.getMusicActive()) 
    {   this.game.startCategoryMusic(this.level.getCategory());
    }        
}
        
GameScreen.prototype.discard = function()
{
    this.game.stopMusic();
}


GameScreen.prototype.tick = function()
{
    var frames = 1; // this.timeCalc.calculateLogicFrames();

    switch (this.playmode)
    {   case GameScreen.PLAYMODE_RECORD:
            for (var i=0; i<frames; i++)
            {   this.gameRecording();
            }
            this.adjustScrolling(false);

            if (this.logic.isOverForSomeTime()) 
            {   this.createMenuScreen(false);
            }
            break;
            
        case GameScreen.PLAYMODE_DEMO:
        case GameScreen.PLAYMODE_REPLAY:
            for (var i=0; i<frames; i++)
            {   this.gamePlayback();
            }
            this.adjustScrolling(true);              
            break;           
            
        case GameScreen.PLAYMODE_UNDO:
            for (var i=0; i<frames; i++)
            {   this.gameUndo();
            }
            this.adjustScrolling(true);
            break;
    }
    
    this.setDirty();
};

GameScreen.prototype.draw = function()
{           
    var screenwidth = this.game.screenwidth;
    var screenheight = this.game.screenheight;
    
    // handle screen shaking feature
    var screenshake=0;
    if (this.screenshaketime>0)
    {   this.screenshaketime--;
        screenshake = 1 * (this.screenshaketime%2);
    }       
    
    // paint the level tiles in a big action
    var lr = this.game.levelRenderer; 
    if (lr!=null && (this.logic!=null))
    {   lr.startDrawing
        (   this.screenscrollx0,this.screenscrolly0+screenshake,
            this.screenscrollx1, this.screenscrolly1+screenshake
        );
        lr.draw(this.logic, this.frames_left); 
        lr.flush();
    }

    // set up the renderers for decoration rendering
    var statusbarheight = 50;
    var statustextheight = statusbarheight*0.4;
    var statustilesize = statusbarheight*0.75;        
    
    lr.startDrawDecoration();
    var tr = this.game.textRenderer;
    tr.startDrawing();
    var vr = this.game.vectorRenderer;
    vr.startDrawing();

    // add a focus highlight
    if (this.inputmodeswitchtime>0)
    {   this.inputmodeswitchtime--;
    }           
/*    if (this.inputfocushighlightx>=0 && this.inputfocushighlighty>=0 && this.inputmodeswitchtime>0)
    {   
        vr.addInputFocusMarker (
          this.inputfocushighlightx+(this.inputfocushighlightplayer==0
                  ?this.screenscrollx0:this.screenscrollx1)-this.screentilesize/2, 
          this.inputfocushighlighty+(this.inputfocushighlightplayer==0
                  ?this.screenscrolly0:this.screenscrolly1)-this.screentilesize/2, 
          this.screentilesize, this.screentilesize, 
           ((((this.inputmodeswitchtime%20)*255)/20)<<24) | 0x00ffffff
        );            
    }
*/
    
    // paint status display  if not having pause menu open anyway
    if (this.game.getTopScreen()==this)
    {
        var hspace = 5;    
        var mbuttonwidth = 50;
        var y1 = screenheight-statusbarheight-2*hspace;
        var x1 = 2*hspace;
        var ycenter = y1+statusbarheight/2;
        var x = x1;
        
        // space for pause-button
        x += mbuttonwidth;
        
        // timer
        var y = ycenter-statustextheight/2;
        var sec = Math.floor(this.logic.getTurnsDone()/4);  // fixed rate: 4 turns per second
        var min = Math.floor(sec/60);
        sec = sec%60;            
        x += hspace;
        x = tr.addNumber(min, x,y,statustextheight, false,  0xffffffff, TextRenderer.WEIGHT_BOLD);
		var secpos = x;
        x = tr.addString(sec<10?":0":":", x,y,statustextheight, false,  0xffffffff, TextRenderer.WEIGHT_BOLD);
        x = tr.addNumber(sec, x,y,statustextheight, false,  0xffffffff, TextRenderer.WEIGHT_BOLD);
		
        // gem count-down
        x = secpos + 25 + hspace;
        lr.addDecorationPieceToBuffer (x+statustilesize/2,ycenter,EMERALD);  
        x += statustilesize;
        var needed = this.logic.getNumberOfEmeraldsStillNeeded();
        x = tr.addNumber
		(	needed<0 ? 0:needed,  
			x,y,statustextheight, 
            false,  
			this.logic.canStillGetEnoughEmeralds() || (sec%2==0) ? 0xffffffff : 0xffff3333, 
			TextRenderer.WEIGHT_BOLD
		);
        x += hspace;
        
        // draw collected bombs and keys of both players 
        for (var p=0; p<2; p++) 
        {   var bombs = this.logic.getCollectedTimeBombs(p);
            var keys = this.logic.getCollectedKeys(p);
            if (bombs>0)
            {   x += hspace;
                lr.addDecorationPieceToBuffer (x+statustilesize/2,ycenter,TIMEBOMB);
                x += statustilesize;  
                x = tr.addNumber(bombs,  x,y,statustextheight, 
                    false,  0xffffffff, TextRenderer.WEIGHT_BOLD); 
                x += hspace;
            }           
            if (keys!=0)
            {   if ((keys&0x01) != 0)
                {   lr.addDecorationPieceToBuffer (x+statustilesize/4,ycenter,KEYRED);  
                    x+=statustilesize/2;
                }
                if ((keys&0x02) != 0)
                {   lr.addDecorationPieceToBuffer (x+statustilesize/4,ycenter,KEYGREEN);  
                    x+=statustilesize/2;
                }
                if ((keys&0x04) != 0)
                {   lr.addDecorationPieceToBuffer (x+statustilesize/4,ycenter,KEYBLUE);  
                    x+=statustilesize/2;
                }
                if ((keys&0x08) != 0)
                {   lr.addDecorationPieceToBuffer (x+statustilesize/4,ycenter,KEYYELLOW);  
                    x+=statustilesize/2;
                }
                x += hspace;
            }
        }
        
        // background area
        x += hspace;
        var radius = statusbarheight/10;
        vr.addRoundedRect(x1, y1, x-x1,statusbarheight, radius, radius+1.0, 0xbb000000);
        
        // pause button
        vr.addRoundedRect(x1,y1, mbuttonwidth,statusbarheight, radius, radius+1.0, 
               this.menuButtonIsPressed ? 0xff666666 : 0xff333333);
        var col = Game.getColorForDifficulty(this.level.getDifficulty());
            
        x = x1+mbuttonwidth/2-8;
        var y = ycenter - statusbarheight/4;        
        vr.addRectangle(x,y, 5,statusbarheight/2, col);
        vr.addRectangle(x+10,y, 5,statusbarheight/2, col);
    }
    
    // flush everything to the screen in correct order
    vr.flush();                     
    tr.flush();    // paint text on top of box         
    lr.flush();     // paint images on top of box

    // paint the touch motion raster(s)
    for (var i=0; i<this.inputGrid.length; i++)      
    {   this.inputGrid[i].draw(screenwidth, screenheight);
    }
};

GameScreen.prototype.isMenuButtonHit = function(x,y)
{
    var statusbarheight = 50;
    var mbuttonwidth = 50;
    var hspace = 5;    
    var y1 = this.game.screenheight-statusbarheight-2*hspace;
    var x1 = 2*hspace;
    
    var hit = x>=x1 && x<x1+mbuttonwidth && y>=y1 && y<y1+statusbarheight;
    return hit;
};

GameScreen.prototype.reactivate = function()
{
    Screen.prototype.reactivate.call(this);
    for (var i=0; i<this.gamePadMUX.length; i++)
    {   this.gamePadMUX[i].reset();
    }       
    this.keyboardTranslator.reset();
    for (var i=0; i<this.inputGrid.length; i++)
    {   this.inputGrid[i].reset();
    }                   
};

        
GameScreen.prototype.adjustScrolling = function(force)
{
    // calculate screen width and height in one 60th of a tile
    var screenwidth = this.game.pixelwidth * 60 / this.game.pixeltilesize;
    var screenheight = this.game.pixelheight * 60 / this.game.pixeltilesize;
    var screentilesize = 60; // this.game.pixeltilesize;
    var frames_left = this.frames_left;

    this.inputfocushighlightx = -1;
    this.inputfocushighlighty = -1;      
    var populatedwidth = this.logic.getPopulatedWidth();
    var populatedheight = this.logic.getPopulatedHeight();                   

    // first parse of the transaction data to extract the information about player movements
    var playerx_at_end_0 = this.logic.getPlayerPositionX(0);
    var playerx_at_begin_0 = playerx_at_end_0;
    var playery_at_end_0 = this.logic.getPlayerPositionY(0);
    var playery_at_begin_0 = playery_at_end_0;
    var playerx_at_end_1 = this.logic.getPlayerPositionX(1);
    var playerx_at_begin_1 = playerx_at_end_1;
    var playery_at_end_1 = this.logic.getPlayerPositionY(1);
    var playery_at_begin_1 = playery_at_end_1;

    if (frames_left>0)
    {
        var animstart = this.logic.getFistAnimationOfTurn();
        var animend = this.logic.getAnimationBufferSize();
        for (var idx=animstart; idx<animend; idx++)
        {
            var trn = this.logic.getAnimation(idx);
            if ((trn & OPCODE_MASK)==TRN_COUNTER)              
            {   var index = (trn>>20) & 0xff;
                var increment = trn & 0xfffff;
                if (increment>=0x80000) increment-=0x100000; // sign extend
                switch (index) 
                {   case CTR_MANPOSX1:
                        playerx_at_begin_0 -= increment;
                        break;
                    case CTR_MANPOSY1:
                        playery_at_begin_0 -= increment;
                        break;
                    case CTR_MANPOSX2:
                        playerx_at_begin_1 -= increment;
                        break;
                    case CTR_MANPOSY2:
                        playery_at_begin_1 -= increment;
                        break;
                }                       
            }           
        }
    }
        
    // compute current player positions
    var playerposx0 = interpolatePixels(playerx_at_begin_0*screentilesize+screentilesize/2,
                                            playerx_at_end_0*screentilesize+screentilesize/2, frames_left); 
    var playerposy0 = interpolatePixels(playery_at_begin_0*screentilesize+screentilesize/2, 
                                            playery_at_end_0*screentilesize+screentilesize/2, frames_left);
    var playerposx1 = interpolatePixels(playerx_at_begin_1*screentilesize+screentilesize/2, 
                                            playerx_at_end_1*screentilesize+screentilesize/2, frames_left); 
    var playerposy1 = interpolatePixels(playery_at_begin_1*screentilesize+screentilesize/2, 
                                            playery_at_end_1*screentilesize+screentilesize/2, frames_left);                                                             
                                           
    // when input is switched to second player, move highlight there also 
    if (this.logic.getNumberOfPlayers()>1 && this.keyboardTranslator.hasSwitchedControls())
    {   this.inputfocushighlightx = playerposx1;
        this.inputfocushighlighty = playerposy1;
        this.inputfocushighlightplayer = 1;
    }   
    // otherwise keep first player highlighted
    else 
    {   this.inputfocushighlightx = playerposx0;
        this.inputfocushighlighty = playerposy0;         
        this.inputfocushighlightplayer = 0;
    }
                    
    // when target was selected, use the arrow head as player position
    if (this.inputGrid[0].hasDestination())
    { 
        playerposx0 = this.inputGrid[0].getDestinationX() * screentilesize + screentilesize/2;
        playerposy0 = this.inputGrid[0].getDestinationY() * screentilesize + screentilesize/2;
    }           
    if (this.inputGrid[1].hasDestination())
    { 
        playerposx1 = this.inputGrid[1].getDestinationX() * screentilesize + screentilesize/2;
        playerposy1 = this.inputGrid[1].getDestinationY() * screentilesize + screentilesize/2;
    }

    // when only one player, computation is quite easy
    if (this.logic.getNumberOfPlayers()<=1)
    {
        // when scrolling is not locked, compute the desired scroll position
        if (force || !this.inputGrid[0].isTouchInProgress())             
        {   // when scrolling is re-enabled, do fast scrolling to the target position
            var step = force ? 1000000000 : (screentilesize/3);  
            this.screenscrollx0 = approach(this.screenscrollx0, 
                calculateScreenOffsetX(screenwidth, screentilesize, playerposx0, populatedwidth, true), step);
            this.screenscrolly0 = approach(this.screenscrolly0, 
                calculateScreenOffsetY(screenheight, screentilesize, playerposy0, populatedheight, true), step);
        }                               
        // use the values also for second set of values to only get a single screen
        this.screenscrollx1 = this.screenscrollx0;            
        this.screenscrolly1 = this.screenscrolly0;   
    }
        
    // for the two-player mode, the calculation is also done with locking the scolling when any drag is in progress
    else
    {   
        // when the players are near together, compute an average position
        var splitthreasholdx = screenwidth/4;
        var splitthreasholdy = screenheight/4;  
        // in two-player mode, when the players are not too far separated, use a middle-position for both views
        if ( Math.abs(playerposx0 - playerposx1) < 2*splitthreasholdx)
        {   playerposx0 = playerposx1 = (playerposx0 + playerposx1)/2;  
        }
        // otherwise tear apart the views
        else if (playerposx0<playerposx1)
        {   playerposx0+=splitthreasholdx;
            playerposx1-=splitthreasholdx;          
        }
        else
        {   playerposx0-=splitthreasholdx;
            playerposx1+=splitthreasholdx;          
        }                           
        if ( Math.abs(playerposy0 - playerposy1) < 2*splitthreasholdy)
        {   playerposy0 = playerposy1 = (playerposy0 + playerposy1)/2;  
        } 
        else if (playerposy0<playerposy1)
        {   playerposy0+=splitthreasholdy;
            playerposy1-=splitthreasholdy;          
        }
        else
        {   playerposy0-=splitthreasholdy;
            playerposy1+=splitthreasholdy;          
        }          

        // when scrolling is not locked, compute the desired scroll position
        if (force || (!this.inputGrid[0].isTouchInProgress() && !this.inputGrid[1].isTouchInProgress()))              
        {   // when scrolling is re-enabled, do fast scrolling to the target position
            var step = force ? 1000000000 : (screentilesize/3);  
            this.screenscrollx0 = approach(this.screenscrollx0, 
                calculateScreenOffsetX(screenwidth, screentilesize, playerposx0, populatedwidth, true), step);
            this.screenscrolly0 = approach(this.screenscrolly0, 
                calculateScreenOffsetY(screenheight, screentilesize, playerposy0, populatedheight, true), step);
            this.screenscrollx1 = approach(this.screenscrollx1, 
                calculateScreenOffsetX(screenwidth, screentilesize, playerposx1, populatedwidth, true), step);
            this.screenscrolly1 = approach(this.screenscrolly1, 
                calculateScreenOffsetY(screenheight, screentilesize, playerposy1, populatedheight, true), step);
        }
    }
   
    // after computation send current scrolling information to the touch input handler(s)
    var ratio = (this.game.pixeltilesize/60.0) * (this.game.screenwidth / this.game.pixelwidth);
    this.inputGrid[0].synchronizeWithGame(
            this.screenscrollx0*ratio, this.screenscrolly0*ratio, 60*ratio, playerx_at_end_0, playery_at_end_0);
    if (this.inputGrid.length>1)
    {   this.inputGrid[1].synchronizeWithGame(
            this.screenscrollx1*ratio, this.screenscrolly1*ratio, 60+ratio, playerx_at_end_1, playery_at_end_1);
    }
    
    function approach(value, target, step)
    {   
        if (value<target)
        {   if (value+step<target)
            {   return Math.round(value+step);
            }
        }
        else if (value>target)
        {   if (value-step>target)
            {   return Math.round(value-step);
            }
        }
        return Math.round(target);
    }    
    function interpolatePixels(pix1, pix2, frames_until_endposition)
    {
        var f2 = LevelRenderer.FRAMESPERSTEP - frames_until_endposition;
        return (pix1*frames_until_endposition + pix2*f2) / LevelRenderer.FRAMESPERSTEP;     
    }
    function calculateScreenOffsetX(displaywidth, screentilewidth, pixelx, populatedwidth, stopatedges)
    {
        var lw = screentilewidth*populatedwidth;  // size of the populated area in pixel
        // when level fits into display completely, just simply center it 
        if (displaywidth>lw)
        {   return (displaywidth - lw) / 2;
        }
        // move screen to have player in center
        var ox = (displaywidth/2) - pixelx;
        // but stop at edges in single-player mode
        if (stopatedges)
        {   if (ox>0) 
            {   ox=0;       
            }
            else if (ox+lw<displaywidth)
            {   ox = displaywidth-lw;
            }
        }
        return ox;
    }            
    function calculateScreenOffsetY(displayheight, screentileheight, pixely, populatedheight, stopatedges)
    {
        var lh = screentileheight*populatedheight;
        // when level fits into display completely, just simply center it 
        if (displayheight>=lh)
        {   return (displayheight - lh) / 2;
        }
        // move screen to have player in center
        var oy = (displayheight/2) - pixely;
        // but stop at edges in single-player mode
        if (stopatedges)
        {   if (oy>0) 
            {   oy=0;       
            }
            else if (oy+lh<displayheight)
            {   oy = displayheight-lh;
            }
        }
        return oy;
    }
};
    
    
GameScreen.prototype.gameRecording = function()
{
    this.frames_left--;
    if (this.frames_left<0)
    {               
        // prevent time progress in singlestep mode when no movement is present
        if (this.singlestep && !(this.logic.isSolved() || this.logic.isKilled()))
        {   var havemove = false;
            for (var i=0; i<this.gamePadMUX.length; i++)
            {   havemove = havemove || this.inputGrid[i].hasNextMovement() || this.gamePadMUX[i].hasNextMovement();           
            }               
            if (!havemove)
            {   this.frames_left=0;
                return;
            }
        }
        
        // normal game progress
        this.step++;
        while (this.walk.currentNumberOfCompleteTurns()<this.step)
        {   var m0 = this.inputGrid[0].nextMovement();  
            if (m0!=Walk.MOVE_REST)
            {   this.gamePadMUX[0].reset();                      
            }
            else
            {   m0 = this.gamePadMUX[0].nextMovement();
                if (m0!=Walk.MOVE_REST)
                {   this.inputGrid[0].reset();
                    this.inputmodeswitchtime = 0;
                }
            }
            var m1 = this.inputGrid[1].nextMovement();  
            if (m1!=Walk.MOVE_REST)
            {   this.gamePadMUX[1].reset();
            }
            else
            {   m1 = this.gamePadMUX[1].nextMovement();
                if (m1!=Walk.MOVE_REST)
                {   this.inputGrid[1].reset();
                    this.inputmodeswitchtime = 0;
                }
            }    
            this.walk.recordMovements(m0,m1);
        }
            
        this.logic.gototurn(this.step);
        this.frames_left = LevelRenderer.FRAMESPERSTEP-1;
        if (this.game.soundPlayer.preparePlaying(this.logic))
        {   this.screenshaketime = 3;
        }
        this.game.soundPlayer.playNow();
    }
};
    
GameScreen.prototype.gamePlayback = function()
{
    if (this.playbackspeed==0)   // this means slow motion forward   
    {   this.slowmotion_counter++;
        if (this.slowmotion_counter<10)
        {   return;
        }
        this.slowmotion_counter=0;
        this.frames_left--;
    }
    else
    {   this.frames_left -= this.playbackspeed;      
    }
        
    while (this.frames_left<0)           
    {   if (this.step<=this.logic.getTurnsInWalk())
        {   this.step++;
            this.logic.gototurn(this.step);
            this.frames_left += LevelRenderer.FRAMESPERSTEP;             
            if (this.playbackspeed==1) 
            {   if (this.game.soundPlayer.preparePlaying(this.logic))
                {   this.screenshaketime = 3;
                }
                this.game.soundPlayer.playNow();
            }               
        }
        else
        {   this.frames_left = 0;
            this.createMenuScreen(true);
        }        
    }
    while (this.frames_left>=LevelRenderer.FRAMESPERSTEP || (this.step==0 && this.frames_left>0))          
    {   if (this.step>0)
        {   this.step--;
            this.logic.gototurn(this.step);
            this.frames_left -= LevelRenderer.FRAMESPERSTEP;             
        }
        else
        {   this.frames_left = 0;
            this.createMenuScreen(true);
        }        
    }           
};
    
//  private void gamePlaybackSeek(int offset)
//  {
//      frames_left = 0;
//      if (offset<0)
//      {   step = Math.max(offset+step,0);
//          logic.gototurn(step);
//      }
//      else if (offset>0)
//      {   step = Math.min(offset+step, logic.getTurnsInWalk());
//          logic.gototurn(step);
//      }
//  }
    

GameScreen.prototype.gameUndo = function()
{
    if (this.step<=0)
    {   this.playmode=GameScreen.PLAYMODE_RECORD;   
        this.createMenuScreen(false);
    }
    else
    {   this.frames_left++;
        if (this.frames_left>LevelRenderer.FRAMESPERSTEP-1)
        {   this.step--;
            this.logic.gototurn(this.step);
            this.walk.trimRecord(this.step);
            this.frames_left = 0;
            if ( this.step<=0)       
            {   this.playmode = GameScreen.PLAYMODE_RECORD;
                this.createMenuScreen(false);                
            }
        }
    }
};

GameScreen.prototype.startRecordingTimeMeasurement = function()
{
    this.time_at_record_start = Game.currentTimeMillis();   
};

GameScreen.prototype.stopRecordingTimeMeasurement = function()
{   
    if (this.time_at_record_start>0)
    {   var seconds = Math.floor((Game.currentTimeMillis() - this.time_at_record_start) / 1000);
        this.time_at_record_start = 0;
        if (seconds>0)
        {   var solvegrade = this.game.getLevelSolvedGrade(this.level);
            if (solvegrade<0)
            {   solvegrade += seconds;
                if (solvegrade>0) { solvegrade=0; }
                this.game.setLevelSolvedGrade(this.level, solvegrade);
            }
        }
    }    
};
    
GameScreen.prototype.createMenuScreen = function(onlypopup)
{
    // do not open menu twice
    if (this.game.getTopScreen() != this)
    {   return;
    }        
    // remove arrow that could still be in the queue
    for (var i=0; i<this.inputGrid.length; i++)
    {   this.inputGrid[i].reset();
    }               
    
    this.stopRecordingTimeMeasurement();
        
    // create the menu screen
    var m = new PauseMenu().$(this.game,this, this.level, onlypopup ? PauseMenu.MENUACTION_CONTINUERECORDING : PauseMenu.MENUACTION_EXIT);
        
    // this only a small user-triggered menu for commands during game progress
    if(onlypopup)
    {   
        if (this.playmode==GameScreen.PLAYMODE_RECORD || this.playmode==GameScreen.PLAYMODE_UNDO)
        {   m.addPriorityAction(PauseMenu.MENUACTION_UNDO);
            m.addDefaultAction(PauseMenu.MENUACTION_CONTINUERECORDING);
            m.addPriorityAction(this.startFromEditor ? PauseMenu.MENUACTION_EXITTOEDITOR : PauseMenu.MENUACTION_EXIT);
            m.addAction(PauseMenu.MENUACTION_RESTART);              
            if (this.level.getDifficulty()>=5 || Game.DEVELOPERMODE)
            {   if (this.singlestep) 
                {   m.addAction(PauseMenu.MENUACTION_SINGLESTEP_OFF);
                }
                else 
                {   m.addAction(PauseMenu.MENUACTION_SINGLESTEP_ON);
                }
            }
            if (this.level.numberOfDemos()>0)
            {   var solvegrade = this.game.getLevelSolvedGrade(this.level);
                if (solvegrade>=0 || Game.DEVELOPERMODE) 
                {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO);                     
                    if (this.level.numberOfDemos()>1)
                    {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO2);
                    }
                    if (this.level.numberOfDemos()>2)
                    {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO3);
                    }                               
                }
                else  
                {   m.addNonAction("Demo in "+Game.buildTimeString(-solvegrade));
                }
            }               
        }
        else if (this.playmode==GameScreen.PLAYMODE_DEMO || this.playmode==GameScreen.PLAYMODE_REPLAY)
        {   if (this.step<this.logic.getTurnsInWalk())
            {   m.addPriorityAction(PauseMenu.MENUACTION_FASTFORWARD);
                m.addDefaultAction(PauseMenu.MENUACTION_FORWARD);
                if (this.step>0)
                {   m.addAction(PauseMenu.MENUACTION_BACKWARD);
                    m.addAction(PauseMenu.MENUACTION_FASTBACKWARD);
                }
                m.addAction(PauseMenu.MENUACTION_SLOWMOTION);
            }
            else 
            {   m.addPriorityAction(PauseMenu.MENUACTION_FASTBACKWARD);
                m.addDefaultAction(PauseMenu.MENUACTION_BACKWARD);
            }
            m.addPriorityAction(this.playmode==GameScreen.PLAYMODE_DEMO ? PauseMenu.MENUACTION_LEAVEDEMO : PauseMenu.MENUACTION_LEAVEREPLAY);
            m.addAction(this.startFromEditor ? PauseMenu.MENUACTION_EXITTOEDITOR : PauseMenu.MENUACTION_EXIT);
            m.setMessage(this.playmode==GameScreen.PLAYMODE_DEMO ? "Viewing demo" : "Viewing replay");
        }
//        m.addAction(this.game.getMusicActive() ? PauseMenu.MENUACTION_MUSIC_OFF_POPUP : PauseMenu.MENUACTION_MUSIC_ON_POPUP);                    
    }
    // this menu will be used before start of game or after the end (non-user triggered)
    else
    {   
        if (this.playmode!=GameScreen.PLAYMODE_RECORD)
        {   console.log("Must not open 'big' in-game menu outside record mode");
            return;
        }
                    
        if (this.logic.isKilled())
        {   m.addPriorityAction(PauseMenu.MENUACTION_RESTART);
            m.addDefaultAction(PauseMenu.MENUACTION_UNDO);              
            m.addPriorityAction(this.startFromEditor ? PauseMenu.MENUACTION_EXITTOEDITOR : PauseMenu.MENUACTION_EXIT);               
            if (this.game.getLevelSolvedGrade(this.level)>=0 || Game.DEVELOPERMODE)
            {   if (this.level.numberOfDemos()>0)
                {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO);
                }
                if (this.level.numberOfDemos()>1)
                {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO2);
                }
                if (this.level.numberOfDemos()>2)
                {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO3);
                }
            }
            m.setMessage("Player was killed.");
        }
        else if (this.logic.isSolved()) 
        {   if (this.startFromEditor)
            {   m.addPriorityAction(PauseMenu.MENUACTION_EXITTOEDITOR);
            }
            else
            {   m.addDefaultAction(PauseMenu.MENUACTION_NEXTLEVEL);
                m.addPriorityAction(PauseMenu.MENUACTION_EXIT);
            }
            m.addAction(PauseMenu.MENUACTION_RESTART);
            m.addAction(PauseMenu.MENUACTION_REPLAY);
            if (this.startFromEditor)
            {   m.addAction(PauseMenu.MENUACTION_STOREWALK);
            }

            // check if the solution was done without assistances
            if (this.diduse_singlestep)
            {   m.setMessage("Solved using single steps.");
                this.game.setLevelSolvedGrade(this.level,1);
            }
            else if (this.diduse_undo)
            {   m.setMessage("Solved using undo.");
                this.game.setLevelSolvedGrade(this.level,1);
            }
            else 
            {   var time = this.logic.totalTimeForSolution();
                m.setMessage("Directly solved in "+getTurnTimeString(time)+"!");
                this.game.setLevelSolvedGrade(this.level,2);
            }
        }
        else if (this.step==0)
        {   m.addDefaultAction(PauseMenu.MENUACTION_START);
            m.addPriorityAction(this.startFromEditor ? PauseMenu.MENUACTION_EXITTOEDITOR : PauseMenu.MENUACTION_EXIT);               
            if (this.game.getLevelSolvedGrade(this.level)>=0 || Game.DEVELOPERMODE)
            {   if (this.level.numberOfDemos()>0)
                {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO);
                }
                if (this.level.numberOfDemos()>1)
                {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO2);
                }
                if (this.level.numberOfDemos()>2)
                {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO3);
                }
            }
        }       
        else        // this should never be used...
        {   console.log("invalid state at menu creation!");
        }
//        m.addAction(this.game.getMusicActive() ? PauseMenu.MENUACTION_MUSIC_OFF : PauseMenu.MENUACTION_MUSIC_ON);                   
    }

    m.layout();
    this.game.addScreen(m);

    function getTurnTimeString(turns)
    {
        var hsec = Math.floor(turns * LevelRenderer.FRAMESPERSTEP / 0.6);   // fix rate: 60 logic-frames / second
        var sec = Math.floor(hsec/100);
        var min = Math.floor(sec/60);
        hsec = hsec%100;   
        sec = sec%60;
        return min+(sec<10?":0":":")+sec+(hsec<10?":0":":")+hsec;
    }    
};

    // -------------------- actions from the ingame-menu ---------------
GameScreen.prototype.menuAction = function(id)
{   
    switch (id)
    {   case PauseMenu.MENUACTION_EXIT:
        {   this.game.removeScreen();
            break;
        }
        case PauseMenu.MENUACTION_EXITTOEDITOR:
        {   this.game.removeScreen();
            this.game.getTopScreen().afterScreenCreation();
            break;
        }
        case PauseMenu.MENUACTION_START:    
        case PauseMenu.MENUACTION_RESTART:
        {   this.diduse_undo = false;
            this.diduse_singlestep = this.singlestep;

            this.step=0;
            this.frames_left=0;
            this.playmode = GameScreen.PLAYMODE_RECORD;
            this.walk.initialize(Math.floor((Math.random()*1000000)));
            this.logic.attach(this.level,this.walk);
            this.adjustScrolling(true);
            this.startRecordingTimeMeasurement();
            break;
        }       
        case PauseMenu.MENUACTION_CONTINUERECORDING:
        {   this.playmode = GameScreen.PLAYMODE_RECORD;         
            this.startRecordingTimeMeasurement();
            break;
        }       
        case PauseMenu.MENUACTION_LEAVEDEMO:
        {   this.logic.attach(this.level,this.walk);
            this.logic.gototurn(this.walk.getTurns());
            this.step=this.walk.getTurns();
            this.frames_left=0;
            this.playmode=GameScreen.PLAYMODE_RECORD;
            this.adjustScrolling(true);
            this.startRecordingTimeMeasurement();
            break;
        } 
        case PauseMenu.MENUACTION_LEAVEREPLAY:
        {   this.logic.attach(this.level,this.walk);
            this.logic.gototurn(this.walk.getTurns());
            this.step=this.walk.getTurns();
            this.frames_left=0;
            this.playmode=GameScreen.PLAYMODE_RECORD;
            this.adjustScrolling(true);
            this.createMenuScreen(false);
            this.startRecordingTimeMeasurement();
            break;                      
        }
        case PauseMenu.MENUACTION_REPLAY:
        {   this.step=0;
            this.frames_left=0;
            this.playmode = GameScreen.PLAYMODE_REPLAY;
            this.playbackspeed = 1;
            this.slowmotion_counter = 0;
            this.logic.gototurn(this.step);               
            break;
        }    
        case PauseMenu.MENUACTION_SHOWDEMO:
        case PauseMenu.MENUACTION_SHOWDEMO2:
        case PauseMenu.MENUACTION_SHOWDEMO3:
        {   var idx = id==(PauseMenu.MENUACTION_SHOWDEMO) ? 0 : (1 + (id-PauseMenu.MENUACTION_SHOWDEMO2));
            if (this.level.numberOfDemos()>idx)
            {   this.logic.attach(this.level,this.level.getDemo(idx));
                this.step=0;
                this.frames_left=0;
                this.playmode = GameScreen.PLAYMODE_DEMO;
                this.playbackspeed = 1;
                this.slowmotion_counter = 0;
                this.adjustScrolling(true);
            }            
            break;
        }       
        case PauseMenu.MENUACTION_NEXTLEVEL:
        {   this.game.removeScreen();
            var top = this.game.getTopScreen();
            if (top!=null)
            {   top.startSubsequentLevel();
            }
            break;
        }
        case PauseMenu.MENUACTION_STOREWALK:
        {   this.level.setDemo(this.walk);
            this.game.removeScreen();
            break;
        }
        case PauseMenu.MENUACTION_UNDO:
        {   this.playmode = GameScreen.PLAYMODE_UNDO;
            this.diduse_undo = true;
            break;
        }                   
        case PauseMenu.MENUACTION_SINGLESTEP_ON:
        {   this.singlestep = true;
            this.diduse_singlestep = true;
            this.createMenuScreen(true);
            break;      
        }        
        case PauseMenu.MENUACTION_SINGLESTEP_OFF:
        {   this.singlestep = false;
            this.createMenuScreen(true);
            break;      
        }        
        case PauseMenu.MENUACTION_FORWARD:
        {   this.playbackspeed = 1;
            break;
        }
        case PauseMenu.MENUACTION_BACKWARD:
        {   this.playbackspeed = -1;
            break;              
        }
        case PauseMenu.MENUACTION_FASTFORWARD:
        {   this.playbackspeed = 16;
            break;              
        }
        case PauseMenu.MENUACTION_FASTBACKWARD:
        {   this.playbackspeed = -16;
            break;              
        }
        case PauseMenu.MENUACTION_SLOWMOTION:
        {   this.playbackspeed = 0;      // value 0 has special meaning  
            break;
        }    
        case PauseMenu.MENUACTION_MUSIC_OFF:
        {   this.game.setMusicActive(false);
            this.game.stopMusic();
            this.createMenuScreen(false);
            break;                      
        }
        case PauseMenu.MENUACTION_MUSIC_OFF_POPUP:
        {   this.game.setMusicActive(false);
            this.game.stopMusic();
            break;       
        }
        case PauseMenu.MENUACTION_MUSIC_ON:
        {   this.game.setMusicActive(true);
            this.game.startCategoryMusic(this.level.getCategory());
            this.createMenuScreen(false);
            break;
        }
        case PauseMenu.MENUACTION_MUSIC_ON_POPUP:
        {   this.game.setMusicActive(true);
            this.game.startCategoryMusic(this.level.getCategory());
            break;                  
        }
    }
};

GameScreen.prototype.onResize = function()
{   
    this.adjustScrolling(true);      
};
    
GameScreen.prototype.onBackNavigation = function()
{
    // when in the game screen, back navigation just calls up the ingame menu
    this.createMenuScreen(true);    
};

GameScreen.prototype.onKeyDown = function(code)
{        
    // in record mode use up- and down-events               
    if (this.playmode==GameScreen.PLAYMODE_RECORD)
    {   if (code==KeyEvent.FORWARD && this.logic.getNumberOfPlayers()>1)   
        {   this.keyboardTranslator.switchControls(!this.keyboardTranslator.hasSwitchedControls());
            this.inputmodeswitchtime = 60;
            this.adjustScrolling(true);              
        }
        else
        { 
			this.keyboardTranslator.keyDown(code);           
        }
    }
    // outside record mode, any down-event calls up the menu
    else      
    {   this.createMenuScreen(true);     
    }
};
    
GameScreen.prototype.onKeyUp = function(code)
{
    if (this.playmode==GameScreen.PLAYMODE_RECORD)
    {   this.keyboardTranslator.keyUp(code);
    }
};
    
    
GameScreen.prototype.onPointerDown = function(x,y)
{   
    if (this.isMenuButtonHit(x,y))
    {   this.menuButtonIsPressed = true;        
    }
    if (this.playmode==GameScreen.PLAYMODE_RECORD)
    {   
        for (var i=0; i<this.inputGrid.length; i++)
        {   if (this.inputGrid[i].onPointerDown(x,y, true))
            {   return;
            }
        }
        for (var i=0; i<this.inputGrid.length; i++)
        {   if (this.inputGrid[i].onPointerDown(x,y, false))
            {   return;
            }
        }           
    }
             
    Screen.prototype.onPointerDown.call(this,x,y);
};
    
GameScreen.prototype.onPointerUp = function()
{
    if (this.menuButtonIsPressed)
    {   this.createMenuScreen(true); 
        return;
    }
    
    // in record mode, all pointer up events call up the menu
    if (this.playmode!=GameScreen.PLAYMODE_RECORD)
    {   this.createMenuScreen(true);
        return;
    }       

    if (this.playmode==GameScreen.PLAYMODE_RECORD)
    {   for (var i=0; i<this.inputGrid.length; i++)
        {   this.inputGrid[i].onPointerUp();
        }               
    }
        
    Screen.prototype.onPointerUp.call(this);
};
    
GameScreen.prototype.onPointerMove = function(x, y)
{
    if (!this.isMenuButtonHit(x,y))
    {   this.menuButtonIsPressed = false;        
    }

    if (this.playmode==GameScreen.PLAYMODE_RECORD)
    {   for (var i=0; i<this.inputGrid.length; i++)
        {   this.inputGrid[i].onPointerMove(x,y);
        }               
    }
                
    Screen.prototype.onPointerMove.call(this,x,y);
};
    
/*
    // methods to extract data to make it persistent
    public String getCurrentLevelTitle()
    {
        return level.getTitle();  
    }
    public String getCurrentWalkSerialized()
    {
        return walk.toJSON(); 
    }
*/    


"use strict";
var PauseMenu = function()
{   Screen.call(this);
    
    this.listener = null;
    this.level = null;
    this.navigateBackAction = 0;

    this.numactions = 0;
    this.numpriorityactions = 0;
    this.actions = null;
    this.defaultaction = 0;
    this.message = null;
    this.none_action_label = null;
    
    this.selected = 0;

    // data for layout (computed before first rendering)
    this.title = null;
    this.info = null;
    this.menux = 0.0;
    this.menuy = 0.0;
    this.menuwidth = 0.0;
    this.menuheight = 0.0;
    
    this.iconwidth = 0.0;
    this.iconheight = 0.0;
    this.action0x = 0.0;
    this.action0y = 0.0;
    this.actiondx = 0.0;
    this.lowactionwidth = 0.0;
    this.lowactionheight = 0.0;
    this.lowaction0x = 0.0;
    this.lowaction0y = 0.0;
    this.lowactiondy = 0.0;
};
PauseMenu.prototype = Object.create(Screen.prototype);
    
PauseMenu.MENUACTION_NONEACTION = 0;
PauseMenu.MENUACTION_START = 1;
PauseMenu.MENUACTION_RESTART = 2;
PauseMenu.MENUACTION_REPLAY = 3;
PauseMenu.MENUACTION_SHOWDEMO = 4;
PauseMenu.MENUACTION_NEXTLEVEL = 5;
PauseMenu.MENUACTION_STOREWALK = 6;
PauseMenu.MENUACTION_UNDO = 7;
PauseMenu.MENUACTION_EXIT = 8;
PauseMenu.MENUACTION_LEAVEDEMO = 9;
PauseMenu.MENUACTION_CONTINUERECORDING = 10;
PauseMenu.MENUACTION_LEAVEREPLAY = 11;
PauseMenu.MENUACTION_SINGLESTEP_ON = 12;
PauseMenu.MENUACTION_SINGLESTEP_OFF = 13;
PauseMenu.MENUACTION_FORWARD = 14;
PauseMenu.MENUACTION_BACKWARD = 15;
PauseMenu.MENUACTION_FASTFORWARD = 16;
PauseMenu.MENUACTION_FASTBACKWARD = 17;
PauseMenu.MENUACTION_SLOWMOTION = 18;
PauseMenu.MENUACTION_SHOWDEMO2 = 19;
PauseMenu.MENUACTION_SHOWDEMO3 = 20;
PauseMenu.MENUACTION_TESTLEVEL = 21;
PauseMenu.MENUACTION_EXITEDITOR = 23;
PauseMenu.MENUACTION_EXITTOEDITOR = 24;
PauseMenu.MENUACTION_EDITLEVEL = 25;
PauseMenu.MENUACTION_CONTINUEEDIT = 26;
PauseMenu.MENUACTION_EDITSETTINGS = 27;
PauseMenu.MENUACTION_SHRINKMAP = 28;
PauseMenu.MENUACTION_EDITYAMYAM = 29;
PauseMenu.MENUACTION_EDITNAME = 30;
PauseMenu.MENUACTION_EDITAUTHOR = 31;
PauseMenu.MENUACTION_EDITINFO = 32;
PauseMenu.MENUACTION_MUSIC_ON = 33;
PauseMenu.MENUACTION_MUSIC_OFF = 34;
PauseMenu.MENUACTION_MUSIC_ON_POPUP = 35;
PauseMenu.MENUACTION_MUSIC_OFF_POPUP = 36;
PauseMenu.MENUACTION_LOAD = 37;
PauseMenu.MENUACTION_SAVE = 38;

PauseMenu.actionlabels =  [
        "", "Start", "Restart", "Replay solution", "Show demo", "Next",
        "Use as demo", "Undo", "Exit", "To Game", "Continue", "To Game", 
        "Single step: OFF", "Single step: ON", 
        "Forward", "Backward", "Fast", "Fast Backward", "Slow Motion",
        "Show demo 2", "Show demo 3", "Test", "", "Exit", "To Editor",
        "Level Editor", "Edit Map", "Settings", "Shrink to size", "Edit YamYam",
        "Title", "Author", "Info", 
        "Music: OFF", "Music: ON", "Music: OFF", "Music: ON", 
        "Load", "Save"
    ];
    

PauseMenu.prototype.$ = function(game, listener, level, navigateBackAction)
{   Screen.prototype.$.call(this,game); 

    this.listener = listener;
    this.level = level;
    this.navigateBackAction = navigateBackAction;
        
    this.actions = [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0];
    this.numactions = 0;
    this.numpriorityactions = 0;
    this.defaultaction = 0;
    this.message = null;
    this.selected = -1;      
    
    this.layout();
    return this;
};


PauseMenu.prototype.isOverlay = function()
{   return true;
};
    
PauseMenu.prototype.addDefaultAction = function(action)
{
    this.addPriorityAction(action);
    this.defaultaction = this.numpriorityactions-1;
    
    if (this.selected<0 && this.game.usingKeyboardInput)
    {   this.selected = this.defaultaction;
    }           
};
    
PauseMenu.prototype.addPriorityAction = function(action)
{
    Game.arraycopy (this.actions,this.numpriorityactions,this.actions,
         this.numpriorityactions+1,this.numactions-this.numpriorityactions);               
    this.actions[this.numpriorityactions] = action;
    this.numpriorityactions++;
    this.numactions++;
};

PauseMenu.prototype.addAction = function(action)
{
    this.actions[this.numactions] = action;
    this.numactions++;
};
    
PauseMenu.prototype.addNonAction = function(label)
{
    this.actions[this.numactions] = PauseMenu.MENUACTION_NONEACTION;
    this.numactions++;
    this.none_action_label = label;
};
    
PauseMenu.prototype.setMessage = function(message)
{
    this.message = message;
};
            
PauseMenu.prototype.draw = function()
{
    this.drawOrLayout(true);
};

PauseMenu.prototype.layout = function()
{
    this.drawOrLayout(false);
};
    
PauseMenu.prototype.drawOrLayout = function(draw)
{
    var scaling = 1;       
    var th = 20;
    var th2 = 35
    var vr = this.game.vectorRenderer;                
    var tr = this.game.textRenderer;                

    // layout depends on menu width which depends on the screen size                
    this.menuwidth = Math.min(370, this.game.screenwidth);                 
    this.menux = 10; // (this.game.screenwidth-this.menuwidth)/2;
    var bgcolor = 0xcc000000; // darken(Game.getColorForDifficulty(level.getDifficulty()));
    var col = Game.getColorForDifficulty(this.level.getDifficulty());
                
    // at first call or after size change, create word wrapped string
    if (!draw)      
    {   this.title = tr.wordWrap(this.level.getTitle(), th2, this.menuwidth-100);
        if (this.message!=null)
        {   this.info = tr.wordWrap(this.message, th, this.menuwidth-60);
        }
        else 
        {   this.info = (this.level.getHint()==null) 
                 ? []
                 : tr.wordWrap(this.level.getHint(), th, this.menuwidth-60);
        }      
    }
    // when in drawing mode, initialize renderers and create background
    else
    {   vr.startDrawing ();
        tr.startDrawing ();        
//        vr.addRectangle(this.menux,0,this.menuwidth,this.game.screenheight, bgcolor);           
        vr.addRoundedRect(this.menux,this.menuy,this.menuwidth,this.menuheight, 3,4, bgcolor);
    }
    
    // add category/difficulty icon
    if (draw)
    {   var centerx = this.menux + this.menuwidth - 60;
        var centery = this.menuy + 25;
        var ico = Game.getIconForCategory(this.level.getCategory());
        tr.addIconGlyph(ico, centerx,centery, 45, col);
    }

    var y = this.menuy + 20;  // inner border
    var x = this.menux + 20;  // inner border          
        
    // level title
    for (var i=0; this.title && i<this.title.length; i++)
    {   if (draw)
        {   tr.addString(this.title[i], x,y, th2, false, 0xffaaaaaa, TextRenderer.WEIGHT_PLAIN);
        }
        y += th2*0.8;        
    }
    y += 12;
    
    // author
    var t = this.level.getAuthor();
    if (t!=null && t.length>0)
    {   if (draw)
        {   // var x2 = tr.addString("by ", x,y, th, false, 0xffaaaaaa, TextRenderer.WEIGHT_PLAIN);
            tr.addString("by "+t, x,y, th, false, 0xffffffff, TextRenderer.WEIGHT_BOLD);
        }
        y += th;        
    }
    // info         
    y += 2*th;
    if (this.info && this.info.length>0)
    {   for (var i=0; i<this.info.length; i++)
        {   if (draw)
            {   if (this.message!=null)  // info comes from an important message: display it centered
                {   tr.addString(this.info[i], this.menux+this.menuwidth/2-tr.determineStringWidth(this.info[i],th)/2
                        ,y, th, false, 0xffaaaaaa, TextRenderer.WEIGHT_BOLD);
                }
                else    
                {   tr.addString(this.info[i], x,y, th, false, 0xffaaaaaa, TextRenderer.WEIGHT_BOLD);
                }
            }       
            y += th;                
        }
        y+=th;
    }

    var hicol = Game.getColorForDifficulty(this.level.getDifficulty());
    var locol = 0xff393939;         
    var cornerradius = 4.0;
    // the action icons
    // memorize this layout info for touch input handling
    this.iconwidth = 70;
    this.iconheight = 70;
    this.actiondx = this.iconwidth+10; 
    this.action0x = 30; // (this.menuwidth - ((this.numpriorityactions-1)*this.actiondx+this.iconwidth) )/ 2;
    this.action0y = y-this.menuy;
    // really draw
    if (draw)
    {   for (var i=0; i<this.numpriorityactions; i++)
        {   var action = this.actions[i];
            var s = PauseMenu.actionlabels[action];
            var fc = hicol;
            var bc = locol;
            if (this.selected==i)
            {
                fc = locol;
                bc = hicol;
            }
            vr.addRoundedRect(this.menux+this.action0x+this.actiondx*i, 
                this.menuy+this.action0y, this.iconwidth,this.iconheight, 
                cornerradius, cornerradius+1, bc);   
            this.drawActionIcon (tr, action, 
                this.menux+this.action0x+this.actiondx*i+this.iconwidth/6, 
                this.menuy+this.action0y+this.iconwidth/6,  
                2*this.iconwidth/3,
                2*this.iconwidth/3, 
                fc);
            if (i==this.selected)
            {   tr.addString 
                (   s,  
                    this.menux+this.action0x+this.actiondx*i+(this.iconwidth-tr.determineStringWidth(s,th))/2, 
                    this.menuy+this.action0y+this.iconheight+8, 
                    th, false, 
                    hicol,
                    TextRenderer.WEIGHT_PLAIN
                );            
            }
        }
    }       
    y+= this.iconheight + 50;
        
    // non-priority actions (in bottom part of menu)
    this.lowactionwidth = this.menuwidth - 60;
    this.lowactionheight = 30;
    this.lowaction0x = this.menuwidth/2 - this.lowactionwidth/2;
    this.lowaction0y = y-this.menuy;
    this.lowactiondy = this.lowactionheight+4;
        
    for (var i=this.numpriorityactions; i<this.numactions; i++)
    {   var action = this.actions[i];
        if (draw)
        {   // vr.addRectangle(menux,y-1,menuwidth,1, 0x66000000);
            var fc = hicol;
            var bc = locol;
            if (this.selected==i)
            {
                fc = locol;
                bc = hicol;
            }
            vr.addRoundedRect(this.menux+this.lowaction0x, y, this.lowactionwidth,
                this.lowactionheight, cornerradius, cornerradius+1, bc);                 
            var s = (action!=PauseMenu.MENUACTION_NONEACTION) 
            ? PauseMenu.actionlabels[action] 
            : this.none_action_label;
            
//            var colonidx = s.indexOf(':');
//            if (colonidx>0)  
//            {   var tail = s.substring(colonidx+1);
//                s = s.substring(0,colonidx);
//                tr.addString
//                (   tail,  
//                    this.menux+this.lowaction0x+this.lowactionwidth-10,
//                    y+this.lowactiondy/2-th/2, 
//                    th, 
//                    true, 
//                    i==this.selected ? bgcolor : fc, 
//                    TextRenderer.WEIGHT_PLAIN
//                );            
//            }             
        
            tr.addString
            (   s,  
                this.menux+this.lowaction0x+10,
                y+this.lowactiondy/2-th/2, 
                th, 
                false, 
                i==this.selected ? bgcolor : fc, 
                TextRenderer.WEIGHT_PLAIN
            );            
        }
        y+= this.lowactiondy;
    }
    y += 6;
        
    // memorize menu size
    this.menuheight = y - this.menuy;
    this.menuy = this.game.screenheight - 10 - this.menuheight;

    if (draw)
    {   vr.flush();
        tr.flush();
    }
};    
    
PauseMenu.prototype.drawActionIcon = function(tr, action, x, y, width, height, argb)
{
    switch (action)
    {   case PauseMenu.MENUACTION_START:
        case PauseMenu.MENUACTION_CONTINUERECORDING:
            tr.addIconGlyph(313, x,y,height, argb);
            break;
        case PauseMenu.MENUACTION_RESTART:
            tr.addIconGlyph(315, x,y,height, argb);
            break;
        case PauseMenu.MENUACTION_UNDO:
            tr.addIconGlyph(300, x,y,height, argb);
            break;
        case PauseMenu.MENUACTION_FORWARD:
            tr.addIconGlyph(313, x,y,height, argb);
            break;
        case PauseMenu.MENUACTION_BACKWARD:
            tr.addMirrorIconGlyph(313, x,y,height, argb);
            break;          
            
        case PauseMenu.MENUACTION_FASTFORWARD:
            tr.addIconGlyph(311, x,y,height, argb);
            break;

        case PauseMenu.MENUACTION_FASTBACKWARD:
            tr.addMirrorIconGlyph(311, x,y,height, argb);
            break;

        case PauseMenu.MENUACTION_EXIT:
        case PauseMenu.MENUACTION_EXITEDITOR:
            tr.addMirrorIconGlyph(301, x,y,height, argb);
            break;              

        case PauseMenu.MENUACTION_LEAVEDEMO:
        case PauseMenu.MENUACTION_LEAVEREPLAY:
            tr.addIconGlyph(300, x,y,height, argb);
            break;

        case PauseMenu.MENUACTION_NEXTLEVEL:
            tr.addMirrorIconGlyph(300, x,y,height, argb);
            break;

        case PauseMenu.MENUACTION_TESTLEVEL:
            tr.addIconGlyph(313, x,y,height, argb);
            break;              
                
        case PauseMenu.MENUACTION_LOAD:
            tr.addIconGlyph(302, x,y,height, argb);
            break;
        case PauseMenu.MENUACTION_SAVE:
            tr.addIconGlyph(302, x,y,height, argb);
            break;
            
        case PauseMenu.MENUACTION_EDITSETTINGS:
            tr.addIconGlyph(308, x,y,height, argb);
            break;
                                
        case PauseMenu.MENUACTION_EXITTOEDITOR:
        case PauseMenu.MENUACTION_CONTINUEEDIT:
            tr.addIconGlyph(305, x,y,height, argb);
            break;              
    }   
};
    
PauseMenu.prototype.drawCategoryIcon = function(vr, x, y, width, height, category, argb)
{
    vr.addRoundedRect(x,y,width,height, width/2,width/2+1, argb);       
};
    
PauseMenu.prototype.findAction = function(x, y)
{
    for (var i=0; i<this.numpriorityactions; i++)
    {   var ax = this.menux + this.action0x + i*this.actiondx;
        var ay = this.menuy + this.action0y;
        if (x>=ax && x<ax+this.iconwidth && y>=ay && y<ay+this.iconheight)
        {   return i;
        } 
    }   
    for (var i=this.numpriorityactions; i<this.numactions; i++)
    {   var ax = this.menux + this.lowaction0x;
        var ay = this.menuy + this.lowaction0y + (i-this.numpriorityactions) * this.lowactiondy;
        if (x>=ax && x<ax+this.lowactionwidth && y>=ay && y<ay+this.lowactionheight)
        {   return i;
        } 
    }   
    return -1;
};
        
PauseMenu.prototype.contrastcolor = function(argb)
{
    var r = (argb>>16)&0xff;
    var g = (argb>>8)&0xff;
    var b = (argb>>0)&0xff;
    if ((r+g+b)/3 < 0)
    {   return 0xffffffff;
    }
    else
    {   return 0xff000000;
    }   
}; 
    
    // ------ key handler ------
PauseMenu.prototype.onResize = function()
{   
    this.layout();
};
    
PauseMenu.prototype.onBackNavigation = function()
{
    if (this.navigateBackAction>=0)
    {   this.game.removeScreen();
        this.listener.menuAction(this.navigateBackAction);            
    }
};
        
PauseMenu.prototype.onKeyDown = function(code)
{   
    switch (code)
    {   case KeyEvent.UP:
        {   if (this.selected<0)
            {   this.selected=this.defaultaction;
            }
            else if (this.selected>this.numpriorityactions) 
            {   this.selected--;
            }
            else if (this.selected==this.numpriorityactions)
            {   this.selected=this.defaultaction;
            }
            break;                  
        }
        case KeyEvent.DOWN:
        {   if (this.selected<0)
            {   this.selected=this.defaultaction;
            }
            else if (this.selected<this.numpriorityactions && this.numactions>this.numpriorityactions)
            {   this.selected = this.numpriorityactions;
            }
            else if (this.selected+1<this.numactions) 
            {   this.selected++;
            }
            break;
        }
        case KeyEvent.LEFT:
        {   if (this.selected<0)
            {   this.selected=this.defaultaction;
            }
            else if (this.selected<this.numpriorityactions && this.selected>0)
            {   this.selected--;
            }
            break;
        }
        case KeyEvent.RIGHT:
        {   if (this.selected<0)
            {   this.selected=this.defaultaction;
            }
            else if (this.selected+1<this.numpriorityactions)
            {   this.selected++;
            }
            break;
        }
        case KeyEvent.A:
        case KeyEvent.B:
        case KeyEvent.FORWARD:
        {   if (this.selected<0)
            {   this.selected=this.defaultaction;
            }
            else if (this.actions[this.selected]!=PauseMenu.MENUACTION_NONEACTION)
            {   this.game.removeScreen();
                this.listener.menuAction(this.actions[this.selected]); 
                return;
            }
            break;
        }           
    }
    this.setDirty();
};
    
PauseMenu.prototype.onPointerDown = function(x, y)
{
    var sel = this.findAction(x,y);
    if (sel!==this.selected)
    {   this.selected = sel;
        this.setDirty();
    }
};
    
PauseMenu.prototype.onPointerUp = function()
{
    if (this.selected>=0)
    {   if (this.actions[this.selected]!=PauseMenu.MENUACTION_NONEACTION)
        {   this.game.removeScreen();
            this.listener.menuAction(this.actions[this.selected]);
        }
        else
        {   this.selected=-1;
            this.setDirty();
        }
    }
};
    
PauseMenu.prototype.onPointerMove = function(x, y)
{
    var s = this.findAction(x,y);
    if (this.selected!=s)
    {   this.selected=-1;
    }
};

"use strict";
var GamePadInputBuffer = function()
{
    this.numdirections = 0
    this.directiondevice = null;
    this.directionstack = null;
    this.numaction1buttons = 0;
    this.action1device = null;
    this.numaction2buttons = 0;
    this.action2device = null;

    this.nummoves = 0;
    this.movebuffer = null;

    this.actionmode = 0;
    this.actionmode_was_used = false;
};

GamePadInputBuffer.DIRECTION_NONE = -1;
GamePadInputBuffer.DIRECTION_UP = 0;
GamePadInputBuffer.DIRECTION_DOWN = 1;
GamePadInputBuffer.DIRECTION_LEFT = 2;
GamePadInputBuffer.DIRECTION_RIGHT = 3;

GamePadInputBuffer.MODE_NORMAL = 0;
GamePadInputBuffer.MODE_GRAB = 1;
GamePadInputBuffer.MODE_BOMB = 2;

GamePadInputBuffer.inArray = function(a, len, value)
{
    for (var i=0; i<len; i++)
    {   if (a[i]===value)
        {   return true;
        }
    }
    return false;       
};
GamePadInputBuffer.removeFromArray = function(a, len, value)
{
    var writecursor=0;
    for (var i=0; i<len; i++)
    {   // copy everything that does not need to be removed
        if (a[i]!=value)
        {   a[writecursor] = a[i];
            a[writecursor] = a[i];
            writecursor++;
        }  
    }
    return writecursor;
};
    
    
GamePadInputBuffer.prototype.$=function()
{   
    this.numdirections = 0;
    this.directiondevice = [0,0,0,0,0,0,0,0,0,0];
    this.directionstack = [0,0,0,0,0,0,0,0,0,0];
    this.numaction1buttons = 0;
    this.action1device = [0,0,0,0,0,0,0,0,0,0];
    this.numaction2buttons = 0;
    this.action2device = [0,0,0,0,0,0,0,0,0,0];
    this.nummoves = 0;
    this.movebuffer = [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0];
    this.actionmode = GamePadInputBuffer.MODE_NORMAL;
    this.actionmode_was_used = false;
    
    return this;
};

    // forget any stored state and reset to start values 
GamePadInputBuffer.prototype.reset = function()
{
    this.numdirections = 0;  
    this.numaction1buttons = 0;  
    this.numaction2buttons = 0;
    this.nummoves = 0;   
    this.actionmode = GamePadInputBuffer.MODE_NORMAL;
};
        
    // ---------------- input from game pad devices ---------------
    
    /**
     * A press/release of the action1 button  (the "grab" action)
     */
GamePadInputBuffer.prototype.setAction1Button = function(device,pressed)
{
    // memorize previous state of the action key
    var prev = this.numaction1buttons>0; 
    
    // insert press-info for device into array if not already present
    if (pressed)
    {   if (!GamePadInputBuffer.inArray(this.action1device,this.numaction1buttons,device))
        {   this.action1device[this.numaction1buttons++] = device;
        }
    }
    // remove occurrences of device from array if present 
    else            
    {   this.numaction1buttons = GamePadInputBuffer.removeFromArray(this.action1device,this.numaction1buttons,device);
    }
        
    // check if state of buttons has changed - must adjust action mode
    var now = this.numaction1buttons>0;
    if (now && !prev)
    {   this.actionmode = GamePadInputBuffer.MODE_GRAB; 
        this.actionmode_was_used = false;
    }
    else if (prev&&!now)
    {   if (this.actionmode==GamePadInputBuffer.MODE_GRAB && this.actionmode_was_used)
        {   this.actionmode = GamePadInputBuffer.MODE_NORMAL;
        }
    }   
};

    /**
     * A press/release of the action2 button  (the "bomb" action)
     */
GamePadInputBuffer.prototype.setAction2Button = function(device,pressed)
{
    // memorize previous state of the action key
    var prev = this.numaction2buttons>0; 
    
    // insert press-info for device into array if not already present
    if (pressed)
    {   if (!GamePadInputBuffer.inArray(this.action2device,this.numaction2buttons,device))
        {   this.action2device[this.numaction2buttons++] = device;
        }
    }
    // remove occurrences of device from array if present 
    else            
    {   this.numaction2buttons = GamePadInputBuffer.removeFromArray(this.action2device,this.numaction2buttons,device);
    }
        
    // check if state of buttons has changed - must adjust action mode
    var now = this.numaction2buttons>0;
    if (now && !prev)
    {   this.actionmode = GamePadInputBuffer.MODE_BOMB; 
        this.actionmode_was_used = false;
    }
    else if (prev&&!now)
    {   if (this.actionmode==GamePadInputBuffer.MODE_BOMB && this.actionmode_was_used)
        {   this.actionmode = GamePadInputBuffer.MODE_NORMAL;
        }
    }   
};
        
    /**
     * Change of the directional pad  (only 4 directions and the idle state are supported) 
     */
GamePadInputBuffer.prototype.setDirection = function(device, dir)
{
    // memorize previous direction state
    var prev = this.currentDirection();
    
    // add a direction info to the stack or just update an existing one 
    updatestack: 
    if (dir>=0)
    {   // check for presence
        for (var i=0; i<this.numdirections; i++)
        {   if (this.directiondevice[i]==device)
            {   // only update
                this.directionstack[i]=dir;
                break updatestack;
            }
        }
        // not found - insert now
        if (this.numdirections<this.directiondevice.length)
        {   this.directiondevice[this.numdirections] = device;
            this.directionstack[this.numdirections]=dir;
            this.numdirections++;
        }
    }   
    // need to remove a direction info from the stack
    else
    {   var writecursor=0;
        for (var i=0; i<this.numdirections; i++)
        {   // copy everything that does not need to be removed
            if (this.directiondevice[i]!=device)
            {   this.directiondevice[writecursor] = this.directiondevice[i];
                this.directionstack[writecursor] = this.directionstack[i];
                writecursor++;
            } 
        }
        this.numdirections=writecursor;
    }
        
    // if direction state was changed, do post-processing
    var curr = this.currentDirection(); 
    if (curr!=prev)     
    {   // enqueue command for new direction (but not the none-direction)
        if (curr!=GamePadInputBuffer.DIRECTION_NONE && this.nummoves<this.movebuffer.length)
        {   this.movebuffer[this.nummoves] = this.generateMovement();
            this.nummoves++;
        }
//          // after releasing a direction pad and no action button is pressed, the game reverts from grab mode 
//          if (prev!=DIRECTION_NONE && actionmode==MODE_GRAB && numaction1buttons==0)
//          {   actionmode = MODE_NORMAL;
//          }
    } 
};           
    
    /**
     * Determine to which direction the pad (or the recently used one) is currently pointing
     */
GamePadInputBuffer.prototype.currentDirection = function()
{
    if (this.numdirections>0)
    {   return this.directionstack[this.numdirections-1];
    }
    else
    {   return GamePadInputBuffer.DIRECTION_NONE;
    }   
};
    
    /**
     * Determine the movement to do right now. This depends on the current direction and the action mode
     */
GamePadInputBuffer.prototype.generateMovement = function()
{
    var dir = this.currentDirection();
        
    if (dir>=0 && dir<=3)
    {   if (this.actionmode==GamePadInputBuffer.MODE_NORMAL)
        {   return Walk.MOVE_UP + dir;
        }
        else if (this.actionmode==GamePadInputBuffer.MODE_GRAB)
        {   this.actionmode_was_used = true;
            if (this.numaction1buttons==0)       // when action button 1 is not pressed, revert to normal mode
            {   this.actionmode = GamePadInputBuffer.MODE_NORMAL;
            }
            return Walk.GRAB_UP + dir;
        }
        else if (this.actionmode==GamePadInputBuffer.MODE_BOMB)
        {   this.actionmode_was_used = true;
            if (this.numaction2buttons==0)       // when action button 2 is not pressed, revert to normal mode
            {   this.actionmode = GamePadInputBuffer.MODE_NORMAL;
            }
            return Walk.BOMB_UP + dir;
        }
    }
    return Walk.MOVE_REST;  
};
    

    // ----------------let game retrieve movement commands  --------------
     
    /**
     * Retrieve the next command to be used for a player.
     */
GamePadInputBuffer.prototype.nextMovement = function()
{
    if (this.nummoves>0)
    {   var m = this.movebuffer[0];
        this.nummoves--;
        if (this.nummoves>0)
        {   for (var i=0; i<this.nummoves; i++)
            {   this.movebuffer[i] = this.movebuffer[i+1];
            }
        }
        return m;
    }
    else
    {   return this.generateMovement();
    }
};

GamePadInputBuffer.prototype.hasNextMovement = function()
{
    return this.nummoves>0 || this.currentDirection()>=0;
};

    /**
     * Get current action mode  (normal, grab, bomb) 
     */
GamePadInputBuffer.prototype.getActionMode = function()
{
    return this.actionmode;
};

"use strict";
var KeyboardToGamepadTranslator = function()
{
    this.listener1 = null;
    this.listener2 = null;
    
    this.numpressed = 0;
    this.pressedkeys = null;
    this.switchedcontrols = false;
};

KeyboardToGamepadTranslator.prototype.$ = function(listener1,listener2)
{
    this.listener1 = listener1;
    this.listener2 = listener2;
        
    this.numpressed = 0;
    this.pressedkeys = new Array(100);
    for (var i=0; i<this.pressedkeys.length; i++) this.pressedkeys[i] = 0;
    this.switchedcontrols = false;
    
    return this;
};

    // forget any stored state and reset to start values 
KeyboardToGamepadTranslator.prototype.reset = function()
{
    this.numpressed = 0; 
};

    // key input from the computer keyboard 
KeyboardToGamepadTranslator.prototype.keyDown = function(keycode)
{
    // avoid array overflow
    if (this.numpressed>=this.pressedkeys.length)
    {   return;
    }       
    // check if key is already in list - do nothing if already pressed
    for (var i=0; i<this.numpressed; i++)
    {   if (this.pressedkeys[i]==keycode)
        {   return;
        }
    }
    // append key into list
    this.pressedkeys[this.numpressed] = keycode;
    this.numpressed++;
    
    // send change info to listeners    
    this.sendGamePadStates();
};
    
KeyboardToGamepadTranslator.prototype.keyUp = function(keycode)
{
    // remove the keycode from the list if present (otherwise no action)
    var writecursor=0;
    for (var i=0; i<this.numpressed; i++)
    {   // copy everything that does not need to be removed
        if (this.pressedkeys[i]!=keycode)
        {   this.pressedkeys[writecursor] = this.pressedkeys[i];
            writecursor++;
        } 
    }
    this.numpressed=writecursor;
        
    // send change info to listeners    
    this.sendGamePadStates();
};   
    
KeyboardToGamepadTranslator.prototype.switchControls = function(isswitched)
{
    this.switchedcontrols = isswitched;
    this.sendGamePadStates();
};
    
KeyboardToGamepadTranslator.prototype.hasSwitchedControls = function()
{
    return this.switchedcontrols;    
};
    
    
    /** Send current state of the game pads to the listeners. 
     *  Probably nothing has changed, but the listeners will check this.
     */ 
KeyboardToGamepadTranslator.prototype.sendGamePadStates = function()
{
    // check all currently pressed keys (in order of time of press) and determine
    // which game pad should do which things.
    // By overwriting the direction it makes sure that the latest direction key
    // for a device is used.
    var dir0 = GamePadInputBuffer.DIRECTION_NONE;
    var dir1 = GamePadInputBuffer.DIRECTION_NONE;
    var action1_0 = false;
    var action1_1 = false;      
    var action2_0 = false;
    var action2_1 = false;      
    for (var i=0; i<this.numpressed; i++)
    {   switch (this.pressedkeys[i])
        {   case KeyEvent.UP:
                dir0 = GamePadInputBuffer.DIRECTION_UP;
                break;
            case KeyEvent.DOWN:    
                dir0 = GamePadInputBuffer.DIRECTION_DOWN;
                break;
            case KeyEvent.LEFT:    
                dir0 = GamePadInputBuffer.DIRECTION_LEFT;
                break;
            case KeyEvent.RIGHT:   
                dir0 = GamePadInputBuffer.DIRECTION_RIGHT;
                break;
            case KeyEvent.UP2:    
                dir1 = GamePadInputBuffer.DIRECTION_UP;
                break;
            case KeyEvent.DOWN2:    
                dir1 = GamePadInputBuffer.DIRECTION_DOWN;
                break;
            case KeyEvent.LEFT2:    
                dir1 = GamePadInputBuffer.DIRECTION_LEFT;
                break;
            case KeyEvent.RIGHT2:    
                dir1 = GamePadInputBuffer.DIRECTION_RIGHT;
                break;
            case KeyEvent.A:
                action1_0 = true;
                break;
            case KeyEvent.B:
                action2_0 = true;
                break;
            case KeyEvent.A2:
                action2_1 = true;
                break;
            case KeyEvent.B2:
                action1_1 = true;
                break;
        }
    }   

    // switch listeners if needed       
    var l1 = this.listener1;
    var l2 = this.listener2;
    if (this.switchedcontrols)
    {   l1 = this.listener2;
        l2 = this.listener1;
    }       
        
    // send collected state to both listeners (or to the same if only one player is present)
    l1.setAction1Button(0, action1_0);
    l1.setAction2Button(0, action2_0);
    l1.setDirection(0, dir0);
    l2.setAction1Button(1, action1_1);
    l2.setAction2Button(1, action2_1);
    l2.setDirection(1, dir1);
};   

"use strict";
var TouchInputGrid = function()
{
    this.game = null;
    this.color = 0;
    
    this.screenscrollx = 0;
    this.screenscrolly = 0;
    this.screentilesize = 0;

    this.isDragging = false;
    this.dragpointx = 0;
    this.dragpointy = 0;
    this.current_drag_caused_grab = false;
    this.current_drag_did_move = false;

    this.playerx = 0;
    this.playery = 0;
    this.playerdropsbomb = false;
    this.positionscount = 0;        // number of positions in buffer
    this.positionx = null;
    this.positiony = null;
    this.positiontype = null;
    this.generatingmovements = false;
};
    
TouchInputGrid.TYPE_GRABAT            = 1;
TouchInputGrid.TYPE_MOVETO            = 2;
TouchInputGrid.TYPE_MOVETO_LEAVEBOMB  = 3;

TouchInputGrid.shape_grabmarker = [ -50,-50, 50,-50, -50,50, 50,50 ];
TouchInputGrid.shape_bombmarker = [ -50,0, 0,-50, 0,50, 50,0 ];


    
TouchInputGrid.prototype.$ = function(game,color)
{
    this.game = game;
    this.color = color;
    this.isDragging = false;
    this.playerx = 0;
    this.playery = 0;
    this.playerdropsbomb = false;
    this.positionscount = 0;
    this.positionx = new Array(200); for (var i=0; i<200; i++) this.positionx[i] = 0;
    this.positiony = new Array(200); for (var i=0; i<200; i++) this.positiony[i] = 0;
    this.positiontype = new Array(200); for (var i=0; i<200; i++) this.positiontype[i] = 0;
    
    return this;
};

// forget any stored state and reset to start values 
TouchInputGrid.prototype.reset = function()
{
    this.isDragging = false;
    this.playerdropsbomb = false;
    this.positionscount = 0; 
};

    //-------------------- let input handler know sufficient things about game ------------------- 
TouchInputGrid.prototype.synchronizeWithGame = function(screenscrollx, screenscrolly, screentilesize, playerposx, playerposy) 
{
    this.screenscrollx = screenscrollx;
    this.screenscrolly = screenscrolly;
    this.screentilesize = screentilesize;
                
    // force begin of trail to player position (possibly resetting the trail)
    while (this.playerx!=playerposx || this.playery!=playerposy)
    {   if (this.positionscount<1)
        {   this.playerx = playerposx;
            this.playery = playerposy;
            this.playerdropsbomb = false;
            return; 
        }
        else
        {   this.removeFirstPosition();
            this.playerdropsbomb = false;
        }               
    }       
};

TouchInputGrid.prototype.draw = function(screenwidth, screenheight) 
{   
    // quick short-cut if nothing needs to be drawn
    if (this.positionscount<1 && !this.playerdropsbomb)
    {   return;
    }               
            
    var vr = this.game.vectorRenderer;
    vr.startDrawing(screenwidth,screenheight);
        
    var color = this.color;
    var ts = this.screentilesize;
    var tsh = Math.floor(ts/2);
    var thickh = Math.floor(ts/6);
        
    // draw the path of movements as an arrow 
    // count how many movement actions are there
    var countmoves=0;
    for (var i=0; i<this.positionscount; i++)
    {   if (this.positiontype[i]!=TouchInputGrid.TYPE_GRABAT)
        {   countmoves++;
        }
    }
    // when there are indeed moves, draw the arrow
    if (countmoves>0)
    {   vr.startStrip();

        // iterate over all movement actions (ignoring the grabs)
        var partsdrawn = 0;
        var prevx = this.playerx;
        var prevy = this.playery;
        for (var i=0; i<this.positionscount; i++)
        {   // ignore grab actions
            if (this.positiontype[i]==TouchInputGrid.TYPE_GRABAT)
            {   continue;
            }       
                        
            // draw the tail of the arrow
            if (partsdrawn==0)
            {   vr.setStripCornerTransformation (this.positionx[i]-prevx,this.positiony[i]-prevy, 
                        this.screenscrollx+tsh+prevx*ts, this.screenscrolly+tsh+prevy*ts);
                vr.addStripCorner(0,-thickh, color);
                vr.addStripCorner(0, thickh, color);
            }               
            // draw a middle part of the arrow
            if (partsdrawn<countmoves-1)                
            {   // look ahead to find next move position
                var j=i+1;
                while (this.positiontype[j]==TouchInputGrid.TYPE_GRABAT && j+1<this.positionscount)
                {   j++;
                }
                    
                var px = this.positionx[i];
                var py = this.positiony[i];
                var dx1 = px-prevx;
                var dy1 = py-prevy;
                var dx2 = this.positionx[j] - px;
                var dy2 = this.positiony[j] - py;
                // a straight part  
                if (dx1==dx2 && dy1==dy2)
                {   // no need to insert additional corners
                }
                // turning back  
                else if (dx1==-dx2 && dy1==-dy2)
                {   var wx = Math.floor(ts*3/8);
                    vr.setStripCornerTransformation(dx1,dy1, this.screenscrollx+tsh+px*ts, this.screenscrolly+tsh+py*ts);
                    vr.addStripCorner(wx,-thickh,color);
                    vr.addStripCorner(wx,thickh,color);
                    vr.addStripCorner(wx,thickh,color);                             
                    vr.addStripCorner(wx,-thickh,color);
                }
                // turning to the left
                else if (dy2==-dx1 && dx2==dy1) // 
                {   vr.setStripCornerTransformation(dx1,dy1, this.screenscrollx+tsh+px*ts, this.screenscrolly+tsh+py*ts);
                    vr.addStripCorner(-thickh,-thickh,color);
                    vr.addStripCorner(thickh,thickh,color);
                }
                // turning to the right
                else 
                {   vr.setStripCornerTransformation(dx1,dy1, this.screenscrollx+tsh+px*ts, this.screenscrolly+tsh+py*ts);
                    vr.addStripCorner(thickh, -thickh, color);
                    vr.addStripCorner(-thickh, thickh, color);
                }
            }
            // draw the point of the arrow
            else
            {           
                var px = this.positionx[i];
                var py = this.positiony[i];
                var headthickh = Math.floor(ts*4/10);
                var headpointx = Math.floor(ts*3/8);
                vr.setStripCornerTransformation(px-prevx,py-prevy, this.screenscrollx+tsh+px*ts,this.screenscrolly+tsh+py*ts);            
                vr.addStripCorner(headpointx-headthickh,-thickh,color);
                vr.addStripCorner(headpointx-headthickh,+thickh,color);
                vr.addStripCorner(headpointx,0,color);
                vr.addStripCorner(headpointx-headthickh,headthickh,color);
                vr.addStripCorner(headpointx-headthickh,headthickh,color);
                vr.addStripCorner(headpointx-headthickh,-headthickh,color);
                vr.addStripCorner(headpointx-headthickh,-thickh,color);
                vr.addStripCorner(headpointx-headthickh,-headthickh,color);
                vr.addStripCorner(headpointx,0,color);
            }               
            // memorize drawn point to calculate the connection to the next
            partsdrawn++; 
            prevx = this.positionx[i];
            prevy = this.positiony[i];
        }
    }       
        
    // paint overlays for grab actions
    var prevx=this.playerx;
    var prevy=this.playery;
    for (var i=0; i<this.positionscount; i++)
    {   switch (this.positiontype[i])
        {   case TouchInputGrid.TYPE_GRABAT:
                vr.addShape(this.screenscrollx+tsh+this.positionx[i]*ts, this.screenscrolly+tsh+this.   positiony[i]*ts, TouchInputGrid.shape_grabmarker, ts, color);
            break;
            case TouchInputGrid.TYPE_MOVETO:
                prevx = this.positionx[i];
                prevy = this.positiony[i];
            break;
            case TouchInputGrid.TYPE_MOVETO_LEAVEBOMB:
                vr.addShape(this.screenscrollx+tsh+prevx*ts, this.screenscrolly+tsh+prevy*ts, 
                            TouchInputGrid.shape_bombmarker, ts, color);           
                prevx = this.positionx[i];
                prevy = this.positiony[i];   
                break;
        }
    }
    if (this.playerdropsbomb)
    {   vr.addShape(this.screenscrollx+tsh+prevx*ts, this.screenscrolly+tsh+prevy*ts, 
                TouchInputGrid.shape_bombmarker, ts, color);           
    }       
        
    // add shine below finger while dragging
    if (this.isDragging)
    {   var r = 50;
        vr.addRoundedRect(this.screenscrollx+this.dragpointx-r, 
                          this.screenscrolly+this.dragpointy-r, 2*r,2*r, r,r+1.0, 0x44ffffff);
    }
        
    vr.flush();
};
    
   
TouchInputGrid.prototype.isTouchInProgress = function()
{
    return this.isDragging;
};
        
TouchInputGrid.prototype.hasDestination = function()
{
    return (this.positionscount>1) || this.generatingmovements;
};
    
TouchInputGrid.prototype.getDestinationX = function()
{
    for (var i=this.positionscount-1; i>=0; i--)
    {   if (this.positiontype[i]!=TouchInputGrid.TYPE_GRABAT) 
        {   return this.positionx[i];
        }
    }
    return this.playerx; 
};

TouchInputGrid.prototype.getDestinationY = function()
{
    for (var i=this.positionscount-1; i>=0; i--)
    {   if (this.positiontype[i]!=TouchInputGrid.TYPE_GRABAT) 
        {   return this.positiony[i];
        }
    }
    return this.playery; 
};
    
    
    /**
     * Retrieve the next command to be used for a player.
     */
TouchInputGrid.prototype.nextMovement = function()
{   
    // do the move actions from the trail  
    if (this.hasNextMovement())
    {   // check if there are grab-actions at the begin of the trail - consume directly
        if (this.positiontype[0]==TouchInputGrid.TYPE_GRABAT)
        {   var dx = this.positionx[0]-this.playerx;
            var dy = this.positiony[0]-this.playery;
            this.removeFirstPosition();  
            if (dx==0 && dy==-1)
            {   return Walk.GRAB_UP;
            }
            else if (dx==0 && dy==1)
            {   return Walk.GRAB_DOWN;
            }
            else if (dx==-1 && dy==0)
            {   return Walk.GRAB_LEFT;
            }
            else if (dx==1 && dy==0)
            {   return Walk.GRAB_RIGHT;
            }               
        }
        else if (this.positionscount>0)
        {   var dx = this.positionx[0]-this.playerx;
            var dy = this.positiony[0]-this.playery;
            var dropbomb = this.positiontype[0]==TouchInputGrid.TYPE_MOVETO_LEAVEBOMB;          
            this.removeFirstPosition();                  
            if (dx==0 && dy==-1)
            {   return dropbomb ? Walk.BOMB_UP : Walk.MOVE_UP;
            }
            else if (dx==0 && dy==1)
            {   return dropbomb ? Walk.BOMB_DOWN : Walk.MOVE_DOWN;
            }
            else if (dx==-1 && dy==0)
            {   return dropbomb ? Walk.BOMB_LEFT : Walk.MOVE_LEFT;
            }
            else if (dx==1 && dy==0)
            {   return dropbomb ? Walk.BOMB_RIGHT : Walk.MOVE_RIGHT;
            }               
        }       
    }                
    return Walk.MOVE_REST;
};
    
TouchInputGrid.prototype.hasNextMovement = function()
{
    if (this.positionscount<=0)
    {   this.generatingmovements=false;
    }
    else if (this.positionscount>4)
    {   this.generatingmovements=true;
    }
    return this.generatingmovements;
};
        
TouchInputGrid.prototype.removeFirstPosition = function()
{
    if (this.positiontype[0]!=TouchInputGrid.TYPE_GRABAT)
    {   this.playerx = this.positionx[0];
        this.playery = this.positiony[0];
    }
    this.positionscount--;
    for (var i=0; i<this.positionscount; i++)
    {   this.positionx[i] = this.positionx[i+1];
        this.positiony[i] = this.positiony[i+1];
        this.positiontype[i] = this.positiontype[i+1];
    }
}
    
    // ------------------- handle touch input commands ------------
TouchInputGrid.prototype.onPointerDown = function(x, y, firstpass)
{
    if (this.isDragging)   // already have a pointer in possession       
    {   return false;
    }

    this.dragpointx = (x - this.screenscrollx);
    this.dragpointy = (y - this.screenscrolly);
    var targetx = Math.floor(this.dragpointx / this.screentilesize);
    var targety = Math.floor(this.dragpointy / this.screentilesize);

    // determine the end of the current position chain (ignoring the grabs)
    var endx = this.playerx;
    var endy = this.playery;
    for (var i=this.positionscount-1; i>=0; i--)
    {   if (this.positiontype[i]!=TouchInputGrid.TYPE_GRABAT)
        {   endx = this.positionx[i];
            endy = this.positiony[i];
            break;
        }
    }
        
    // 1. case: extend the existing path at the end (leaving everything else in place)
    if (targetx==endx && targety==endy)
    {   this.isDragging = true;
        this.current_drag_caused_grab = false;
        this.current_drag_did_move = false;
        return true;
    }
    // 1. case: extend the existing path from the middle
    for (var i=this.positionscount-1; i>=0; i--)
    {   if (targetx==this.positionx[i] && targety==this.positiony[i] && this.positiontype[i]!=TouchInputGrid.TYPE_GRABAT)
        {   this.positionscount = i+1;
            this.isDragging = true;
            this.current_drag_caused_grab = false;
            this.current_drag_did_move = false;
            return true;
        }
    }
    // 2. case: begin a new path at the player position
    if (targetx==this.playerx && targety==this.playery)
    {   this.positionscount = 0;
        this.isDragging = true;
        this.current_drag_caused_grab = false;
        this.current_drag_did_move = false;
        return true;
    }
                                    
    // 3. case: insert a grab action next to the end of the trail       
    if (Math.abs(targetx-endx)+Math.abs(targety-endy)==1 && this.positionscount<this.positionx.length)
    {   this.positiontype[this.positionscount] = TouchInputGrid.TYPE_GRABAT;
        this.positionx[this.positionscount] = targetx;
        this.positiony[this.positionscount] = targety;
        this.positionscount++;
        this.isDragging = true;
        this.current_drag_caused_grab = true;
        this.current_drag_did_move = true;
        return true;
    }
                        
    // when this was just the first call, do not consume the event yet - let the other player also get a chance     
    if (firstpass)
    {   return false;
    }
        
    return false;
};
    
TouchInputGrid.prototype.onPointerUp = function()
{
    if (this.isDragging)
    {   this.isDragging = false;
        this.generatingmovements = true;
                        
        if (!this.current_drag_did_move)
        {   this.playerdropsbomb = !this.playerdropsbomb;
        }       

        return;
    }
    return;
};
    
TouchInputGrid.prototype.onPointerMove = function(x,y)
{
    if ( (!this.isDragging))
    {   return;
    }
        
    this.dragpointx = (x - this.screenscrollx);
    this.dragpointy = (y - this.screenscrolly);
    var targetx = Math.floor(this.dragpointx / this.screentilesize);
    var targety = Math.floor(this.dragpointy / this.screentilesize);

    // suppress drawing the path if still touching the grab action 
    if (this.current_drag_caused_grab && this.positionscount>0 
        && this.positionx[this.positionscount-1]==targetx 
        && this.positiony[this.positionscount-1]==targety 
        && this.positiontype[this.positionscount-1]==TouchInputGrid.TYPE_GRABAT
    )
    {   return;
    }

    // determine the end of the current position chain (ignoring the grabs)
    var endx = this.playerx;
    var endy = this.playery;
    for (var i=this.positionscount-1; i>=0; i--)
    {   if (this.positiontype[i]!=TouchInputGrid.TYPE_GRABAT)
        {   endx = this.positionx[i];
            endy = this.positiony[i];
            break;
        }
    }
        
    // move through raster from last point to current target    
    while (targetx!=endx || targety!=endy)
    {   var dx = targetx-endx;
        var dy = targety-endy;
        if (Math.abs(dx) >= Math.abs(dy))
        {   endx += (dx>0) ? 1 : -1;
        }
        else 
        {   endy += (dy>0) ? 1 : -1;
        }
        // try to extend the line
        if (this.positionscount<this.positionx.length)
        {   this.positionx[this.positionscount] = endx;
            this.positiony[this.positionscount] = endy;
            this.positiontype[this.positionscount] = this.playerdropsbomb ? TouchInputGrid.TYPE_MOVETO_LEAVEBOMB : TouchInputGrid.TYPE_MOVETO;
            this.positionscount++;
            this.playerdropsbomb = false;
        }
        this.current_drag_did_move = true;
    }
    return;
};
"use strict";

var EditorScreen = function() 
{
    Screen.call(this);

    this.level = null;
    
    this.toolbary = 0;    
    this.mapareax = 0;
    this.mapareay = 0;

    this.selectedpiece = 0;
    this.mapcursorx = 0;
    this.mapcursory = 0;
    this.cursorinmap = false;
    
    this.pointerprevx = 0;
    this.pointerprevy = 0;

    this.menuButtonIsPressed = false;
    this.panningButtonIsPressed = false;
    this.isPanning = false;
    this.yamyammode = false;
}
EditorScreen.prototype = Object.create(Screen.prototype);


EditorScreen.MODE_MOVESCREEN = -1;
EditorScreen.MODE_ZOOMSCREEN = -2;

EditorScreen.pieces = [
    MAN1, AIR, EARTH, DOOR,
    EMERALD, SAPPHIRE, RUBY, CITRINE,
    ROCK, BAG, BOMB, TIMEBOMB,
    WALL, ROUNDWALL, STONEWALL, ROUNDSTONEWALL, 
    WALLEMERALD, SAND, SAND_FULL, GLASSWALL,     
    TIMEBOMB10, BOX, CUSHION, CONVERTER,
    KEYBLUE, KEYRED, KEYGREEN, KEYYELLOW,
    DOORBLUE, DOORRED, DOORGREEN, DOORYELLOW,   
    ONETIMEDOOR, ELEVATOR, CONVEYORLEFT, CONVEYORRIGHT, 
    LORRYLEFT, LORRYUP, LORRYRIGHT, LORRYDOWN,
    BUGLEFT, BUGUP, BUGRIGHT, BUGDOWN,
    YAMYAMLEFT, YAMYAMUP, YAMYAMRIGHT, YAMYAMDOWN,
    ROBOT, SWAMP, DROP, ACID, 
    GUN0, GUN1, GUN2, GUN3,
    AIR, AIR, AIR, MAN2,
    ];

    
EditorScreen.prototype.$ = function(game,level)
{       Screen.prototype.$.call(this,game);    
        
    this.level = level;
        
    this.toolbary = 0;
    this.selectedpiece = 2;
        
    this.pointerisdown = false;
    this.pointerprevx = 0;
    this.pointerprevy = 0;

    this.centerMap();

    return this;
}
    
EditorScreen.prototype.afterScreenCreation = function()
{
    this.createMenuScreen();
}

EditorScreen.prototype.centerMap = function()
{
    var g = this.game;
    var csstilesize = this.computeCSSTileSize();
    var w = this.yamyammode ? 3 : this.level.getWidth();
    var h = this.yamyammode ? 3 : this.level.getHeight();
    var mapspace = g.screenwidth - (4*csstilesize+6);
    this.mapareax = (mapspace- w*csstilesize)/2;
    this.mapareay = (g.screenheight - h*csstilesize)/2;
    
    this.mapcursorx = Math.floor(w/2);
    this.mapcursory = Math.floor(h/2);
    this.makeCursorsVisible();
}

EditorScreen.prototype.makeCursorsVisible = function()
{
    var sw = this.game.screenwidth;
    var sh = this.game.screenheight;
    var csstilesize = this.computeCSSTileSize();
    
    var y = this.toolbary + Math.floor(this.selectedpiece / 4) * csstilesize; 
    if (y<0) {   this.toolbary -= y; }
    else if (y+6+csstilesize>sh) { this.toolbary -= (y+6+csstilesize-sh); }
    
    if (this.cursorinmap)
    {   y = this.mapareay-3+csstilesize*this.mapcursory;
        if (y<0) { this.mapareay -= y; }
        else if (y+6+csstilesize>sh) { this.mapareay -= (y+6+csstilesize-sh); }
        var mw = sw - csstilesize*4 - 6;
        var x = this.mapareax-3+csstilesize*this.mapcursorx;
        if (x<0) { this.mapareax -= x; }
        else if (x+6+csstilesize>mw) { this.mapareax -= (x+6+csstilesize-mw); }
    }
}
    
// get tile size in css pixel (depending on current browser zoom level)    
EditorScreen.prototype.computeCSSTileSize = function()
{   
    var g = this.game;
    var ratio = g.screenwidth / g.pixelwidth;
    return ratio * g.pixeltilesize;
}

EditorScreen.prototype.getMapAreaLeftEdge = function()
{
    return this.computeCSSTileSize()*4+6 + this.mapareax;
}

EditorScreen.prototype.getMapAreaTopEdge = function()
{
    return this.mapareay;
}

EditorScreen.prototype.scrollMapAreaByTiles = function(dx,dy)
{
    var t = this.computeCSSTileSize();
    this.mapareax += dx*t;
    this.mapareay += dy*t;
    this.mapcursorx -= dx;
    this.mapcursory -= dy;    
}

EditorScreen.prototype.map2css = function(x)
{
    return x * this.computeCSSTileSize() / 60.0;
}

EditorScreen.prototype.css2map = function(x)
{
    return Math.round(x*60/this.computeCSSTileSize());
}
        
EditorScreen.prototype.tick = function()
{
    if (this.panningTime>0) 
    {   this.panningTime--;
        if (this.panningTime<=0) { this.setDirty(); }
    }            
}    
        
EditorScreen.prototype.draw = function()
{
    var screenwidth = this.game.screenwidth;
    var screenheight = this.game.screenheight;
    var col = Game.getColorForDifficulty(this.level.getDifficulty());
    
    var lr = this.game.levelRenderer;
    var vr = this.game.vectorRenderer;

    var w = this.level.getWidth();
    var h = this.level.getHeight();
    var csstilesize  = this.computeCSSTileSize();
    
    // fill background with color to show off-the-limits area 
    // and the space inside the level itself with black
    var le = this.getMapAreaLeftEdge();
    var te = this.getMapAreaTopEdge();

    vr.startDrawing (0,0,0,0);
    vr.addRectangle(0,0, screenwidth,screenheight, 0xff333333);

    // draw all tiles of the level or of the yamyam
    lr.startDrawing (0,0,0,0);
    if (this.yamyammode)
    {   vr.addRectangle(le,te, csstilesize*3, csstilesize*3, 0xff000000);
        for (var y=0; y<3; y++)
        {   for (var x=0; x<3; x++)
            {
                lr.addRestingPieceToBuffer
                (   this.css2map(le+x*csstilesize),
                    this.css2map(te+y*csstilesize), 
                    this.level.yamyamremainders[x+y*3]
                );
            }
        }
    }
    else
    {   vr.addRectangle(le,te, csstilesize*w, csstilesize*h, 0xff000000);
        for (var y=0; y<h; y++)
        {   for (var x=0; x<w; x++)
            {
                lr.addRestingPieceToBuffer
                (   this.css2map(le+x*csstilesize),
                    this.css2map(te+y*csstilesize), 
                    this.level.getPiece(x,y)
                );
            }
        }
    }       
    vr.flush();    
    lr.flush();
    if (this.cursorinmap)
    {   vr.startDrawing (0,0,0,0);
        vr.addFrame(le-3+csstilesize*this.mapcursorx, 
                    te-3+csstilesize*this.mapcursory,
                    csstilesize+6, csstilesize+6, 3.0, 0xffffff00);
        vr.flush();
    }    
    
    
    // -- draw the tool bar
    vr.startDrawing();
    vr.addRectangle(0,0, 4*csstilesize+6,screenheight, 0xff000000);
    
    // draw screen panning graphics over the map 
    if (this.isPanning)
    {   var mapwidth = screenwidth-(4*csstilesize+6);
        var s = Math.min(mapwidth/2,screenheight/2);
        vr.addCrossArrows(4*csstilesize+6+mapwidth/2-s/2,screenheight/2-s/2, 
            s,s, col & 0xccffffff);
    }
    vr.flush();
    
    lr.startDrawing (0,0,0,0);
    vr.startDrawing();
    for (var i=0; i<EditorScreen.pieces.length; i++)
    {   var x = i%4;
        var y = Math.floor(i/4);
        lr.addRestingPieceToBuffer(
            this.css2map(3+csstilesize*x),
            this.css2map(3+csstilesize*y+this.toolbary),
            EditorScreen.pieces[i]);        
        
        if (i==this.selectedpiece)
        {   vr.addFrame(csstilesize*x, csstilesize*y+this.toolbary, csstilesize+6, csstilesize+6, 3.0, 0xffffff00);
        }
    }
    
    // paint additional tools if not having menu open anyway
    if (this.game.getTopScreen()==this)
    {
        var statusbarheight = 50;
        var hspace = 5;    
        var mbuttonwidth = 50;
        var y1 = screenheight-statusbarheight-2*hspace;
        var x1 = 2*hspace;
        var ycenter = y1+statusbarheight/2;
        var x = x1;
        
        // space for pause-button
        x += mbuttonwidth;
        
        // background area
        x += hspace;
        var radius = statusbarheight/10;
        vr.addRoundedRect(x1, y1, x-x1,statusbarheight, radius, radius+1.0, 0xbb000000);
        
        // menu button
        vr.addRoundedRect(x1,y1, mbuttonwidth,statusbarheight, radius, radius+1.0, 
               this.menuButtonIsPressed ? 0xff666666 : 0xff333333);
            
        x = x1+mbuttonwidth/2-8;
        var y = ycenter - statusbarheight/4;        
        vr.addRectangle(x,y, 5,statusbarheight/2, col);
        vr.addRectangle(x+10,y, 5,statusbarheight/2, col);
        
        // panning button        
        x1 += hspace + mbuttonwidth;
        vr.addRoundedRect(x1,y1, mbuttonwidth,statusbarheight, radius, radius+1.0, 
               this.panningButtonIsPressed ? 0xff666666 : 0xff333333);
        var col = Game.getColorForDifficulty(this.level.getDifficulty());
            
//        x = x1+mbuttonwidth/2-8;
//        var y = ycenter - statusbarheight/4;   
        vr.addCrossArrows(x1,y1,mbuttonwidth,statusbarheight,col); 
//        vr.addRectangle(x,y, 5,statusbarheight/2, col);
//        vr.addRectangle(x+10,y, 5,statusbarheight/2, col);
    }
    lr.flush();
    vr.flush();  
};


EditorScreen.prototype.isMenuButtonHit = function(x,y)
{
    var statusbarheight = 50;
    var mbuttonwidth = 50;
    var hspace = 5;    
    var y1 = this.game.screenheight-statusbarheight-2*hspace;
    var x1 = 2*hspace;
    
    var hit = x>=x1 && x<x1+mbuttonwidth && y>=y1 && y<y1+statusbarheight;
    return hit;
};
EditorScreen.prototype.isPanningButtonHit = function(x,y)
{
    var statusbarheight = 50;
    var mbuttonwidth = 50;
    var hspace = 5;    
    var y1 = this.game.screenheight-statusbarheight-2*hspace;
    var x1 = 2*hspace + mbuttonwidth + hspace;
    
    var hit = x>=x1 && x<x1+mbuttonwidth && y>=y1 && y<y1+statusbarheight;
    return hit;
};

EditorScreen.prototype.onBackNavigation = function()
{
    this.createMenuScreen();    
};

EditorScreen.prototype.onResize = function()
{
    this.toolbary = 0;
    this.centerMap();
};

EditorScreen.prototype.onPointerDown = function(x,y)
{
    if (this.cursorinmap)
    {   this.cursorinmap = false;
        this.setDirty();
    }
    
    if (this.isMenuButtonHit(x,y))
    {   this.menuButtonIsPressed = true; 
        this.setDirty();
        return;
    }
    if (this.isPanningButtonHit(x,y))
    {   this.panningButtonIsPressed = true;
        this.setDirty();
        return;
    }
    
    var csstilesize  = this.computeCSSTileSize();
    
    // check if selected a piece
    tryhandle: {
        var tx = Math.floor((x-3) / csstilesize);
        var ty = Math.floor((y-this.toolbary-3) / csstilesize);
        if (tx>=0 && tx<4 && ty>=0 && ty<15)
        {   var s = ty*4 + tx;
            if (s>=0 && s<EditorScreen.pieces.length)
            {   this.selectedpiece = s;
                this.isPanning = false;
                this.setDirty();                
                break tryhandle;
            }        
        }
    
        // check if piece was placed in map
        if (x>6+4*csstilesize)
        {   if (!this.isPanning) { this.tryPlacePiece(x,y); }
        }
    }
    
    this.pointerprevx = x;
    this.pointerprevy = y;
};
    
EditorScreen.prototype.onPointerUp = function()
{
    if (this.menuButtonIsPressed)
    {   this.menuButtonIsPressed = false;
        this.createMenuScreen(true);         
        return;
    }
    if (this.panningButtonIsPressed)
    {   this.panningButtonIsPressed = false;
        this.isPanning = !this.isPanning;
        this.setDirty();
        return;
    }
    
    this.pointerisdown = false;
};
    
EditorScreen.prototype.onPointerMove = function(x,y) 
{   
    if (this.menuButtonIsPressed)
    {   if (!this.isMenuButtonHit(x,y))
        {   this.menuButtonIsPressed = false;  
            this.setDirty();
        }
        this.pointerprevx = x;
        this.pointerprevy = y;
        return;
    }
    if (this.panningButtonIsPressed)
    {   if (!this.isPanningButtonHit(x,y))
        {   this.panningButtonIsPressed = false;  
            this.setDirty();
        }
        this.pointerprevx = x;
        this.pointerprevy = y;
        return;
    }        

    var csstilesize  = this.computeCSSTileSize();

    tryhandle: {
        if (x<3+4*csstilesize) 
        {   if (y!=this.pointerprevy) 
            {   var barheight = 15*csstilesize;
                this.toolbary = Math.min
                (   0, Math.max
                    (   this.toolbary + (y-this.pointerprevy),
                        this.game.screenheight - (barheight+6) 
                    )
                );
                this.isPanning = false;
                this.setDirty();
                break tryhandle;
            }            
        }
        
        if (x>6+4*csstilesize)
        {   if (!this.isPanning && x>6+4*csstilesize) { this.tryPlacePiece(x,y); }
            else
            {   this.mapareax += (x - this.pointerprevx);
                this.mapareay += (y - this.pointerprevy);
                this.setDirty();
            }
        }
    }
    
    this.pointerprevx = x;
    this.pointerprevy = y;
};

EditorScreen.prototype.tryPlacePiece = function(x,y)
{    
    var px = Math.floor(this.css2map(x-this.getMapAreaLeftEdge()) / 60);
    var py = Math.floor(this.css2map(y-this.getMapAreaTopEdge()) / 60);
    this.tryPlacePieceInMap(px,py,EditorScreen.pieces[this.selectedpiece]);
}

EditorScreen.prototype.tryPlacePieceInMap = function(px,py,piece)
{
    var l = this.level;
    
    if (this.yamyammode)
    {
        if (px>=0 && py>=0 && px<3 && py<3)
        {   l.yamyamremainders[px+py*3] = piece;
            this.setDirty();
        }
    }
    else
    {   // extend map to the right
        while (px>=l.getWidth() && l.getWidth()<MAPWIDTH)
        {   l.insertMapColumn(l.getWidth());
            this.setDirty();
        }
        // extend map to the left
        while (px<0 && l.getWidth()<MAPWIDTH)
        {   px++;
            l.insertMapColumn(0);
            this.scrollMapAreaByTiles(-1,0);
            this.setDirty();
        }
        // extend map to the bottom
        while (py>=l.getHeight() && l.getHeight()<MAPHEIGHT)
        {   l.insertMapRow(l.getHeight());
            this.setDirty();
        }
        // extend map to the top
        while (py<0 && l.getHeight()<MAPHEIGHT)
        {   py++;
            l.insertMapRow(0);
            this.scrollMapAreaByTiles(0,-1);
            this.setDirty();
        }
    
        if (px>=0 && py>=0 && px<l.getWidth() && py<l.getHeight())
        {   l.setPiece(px,py,piece);
            this.setDirty();
        }
    }
};    
    
EditorScreen.prototype.onKeyDown = function(keycode)
{       
    if (this.isPanning)
    {   this.isPanning = false;
        this.setDirty();
    }

        var yy = this.yamyammode;
        switch (keycode)
        {   
            case KeyEvent.A:
            {   if (!this.cursorinmap) 
                {   this.cursorinmap = true;
                    this.setDirty();
                }
                else
                {   this.tryPlacePieceInMap 
                    ( this.mapcursorx, this.mapcursory, EditorScreen.pieces[this.selectedpiece]); 
                }
                this.makeCursorsVisible();                
                break;
            }
            case KeyEvent.B:
            {   if (this.cursorinmap) 
                {   this.tryPlacePieceInMap (this.mapcursorx, this.mapcursory, AIR);                    
                }
                this.makeCursorsVisible();                
                break;
            }
        
            case KeyEvent.FORWARD:
            {
                this.cursorinmap = !this.cursorinmap;
                this.setDirty();
                this.makeCursorsVisible();                
                break;
            }
        
            case KeyEvent.UP:
            {   if (!this.cursorinmap) 
                {   if (this.selectedpiece>=4)
                    {   this.selectedpiece-=4;
                        this.setDirty();
                    }
                } 
                else
                {   if (this.mapcursory >= (yy?1:0))
                    {   this.mapcursory--;
                        this.setDirty();
                    }
                }
                this.makeCursorsVisible();                
                break;                    
            }
            case KeyEvent.DOWN:
            {   if (!this.cursorinmap) 
                {   if (this.selectedpiece+4<EditorScreen.pieces.length)
                    {   this.selectedpiece+=4;
                        this.setDirty();
                    }
                } 
                else
                {   if (this.mapcursory < (yy?2:this.level.getHeight()))
                    {   this.mapcursory++;
                        this.setDirty();
                    }
                }
                this.makeCursorsVisible();                
                break;  
            }                
            case KeyEvent.LEFT:
            {   if (!this.cursorinmap) 
                {   if (this.selectedpiece>0)
                    {   this.selectedpiece--;
                        this.setDirty();
                    }
                } 
                else
                {   if (this.mapcursorx >= (yy?1:0))
                    {   this.mapcursorx--;
                        this.setDirty();
                    }                    
                }
                this.makeCursorsVisible();                
                break;                    
            }
            case KeyEvent.RIGHT:
            {   if (!this.cursorinmap) 
                {   if (this.selectedpiece+1<EditorScreen.pieces.length)
                    {   this.selectedpiece++;
                        this.setDirty();
                    }
                } 
                else
                {   if (this.mapcursorx < (yy?2:this.level.getWidth()))
                    {   this.mapcursorx++;
                        this.setDirty();
                    }          
                }
                this.makeCursorsVisible();                
                break;                    
            }
            default:
            {   Screen.prototype.onKeyDown.call(this,keycode);
            }
        }                   
};
    
EditorScreen.prototype.createMenuScreen = function()
{
    // do not open menu twice
    if (this.game.getTopScreen() != this)
    {   return;
    }

    // turn off panning just in case
    this.isPanning = false;
               
    // create the menu screen
    var m = new PauseMenu().$(this.game,this, this.level, PauseMenu.MENUACTION_CONTINUEEDIT);
    m.addDefaultAction(PauseMenu.MENUACTION_CONTINUEEDIT);
    m.addPriorityAction(PauseMenu.MENUACTION_TESTLEVEL);
    m.addPriorityAction(PauseMenu.MENUACTION_EDITSETTINGS);
    if 
    (   this.level.isMapRowOnlyAir(0) 
        || this.level.isMapRowOnlyAir(this.level.getHeight()-1)
        || this.level.isMapColumnOnlyAir(0)
        || this.level.isMapColumnOnlyAir(this.level.getWidth()-1) 
    )
    { m.addAction(PauseMenu.MENUACTION_SHRINKMAP); }    
    m.addAction(PauseMenu.MENUACTION_EDITYAMYAM);
    m.addAction(PauseMenu.MENUACTION_EDITNAME);
    m.addAction(PauseMenu.MENUACTION_EDITAUTHOR);
    m.addAction(PauseMenu.MENUACTION_EDITINFO);
    m.addAction(PauseMenu.MENUACTION_LOAD);
    m.addAction(PauseMenu.MENUACTION_SAVE);
    m.layout();
    
    this.game.addScreen(m);
};
    
EditorScreen.prototype.menuAction = function(id)
{   
    var game = this.game;
    var that = this;
    
        switch (id)
        {   
            case PauseMenu.MENUACTION_CONTINUEEDIT:
                if (this.yamyammode)
                {   this.yamyammode = false;
                    this.cursorinmap = false;
                    this.centerMap();
                }
                break;
                
            case PauseMenu.MENUACTION_EDITYAMYAM:
                if (!this.yamyammode) 
                {   this.yamyammode = true;
                    this.cursorinmap = false;
                    this.mapcursorx = 1;
                    this.mapcursory = 1;
                    this.centerMap();
                }
                break;

            case PauseMenu.MENUACTION_EXITEDITOR:
                game.removeScreen();
                break;
                
            case PauseMenu.MENUACTION_TESTLEVEL:
                var gs = new GameScreen().$(game, this.level,this.level.demos[0], true);
                game.addScreen(gs);
                gs.afterScreenCreation();                           
                break;
                                
            case PauseMenu.MENUACTION_SHRINKMAP:
                this.level.shrink();
                this.centerMap();
                this.createMenuScreen();
                break;
                
            
            case PauseMenu.MENUACTION_EDITSETTINGS:
//                this.createMenuScreen();
                game.addScreen(new LevelSettingsDialog().$(game,this.level));
                break;

            case PauseMenu.MENUACTION_EDITNAME:
                this.game.openTextInputDialog("Title", this.level.getTitle(), function(res)
                {   that.level.setTitle(res);
                    that.createMenuScreen();
                });
                break;

            case PauseMenu.MENUACTION_EDITAUTHOR:
                this.game.openTextInputDialog("Author", this.level.getAuthor(), function(res)
                {   that.level.setAuthor(res);
                    that.createMenuScreen();
                });
                break;

            case PauseMenu.MENUACTION_EDITINFO:
                this.game.openTextInputDialog("Info", this.level.getHint(), function(res)
                {   that.level.setHint(res);
                    that.createMenuScreen();
                });
                break;
                
            case PauseMenu.MENUACTION_SAVE:
                this.game.writeLevelToLocalSystem(this.level);
                break;
                
            case PauseMenu.MENUACTION_LOAD:
                this.game.loadLevelFromLocalSystem
                (   function(level) 
                    {   
//                        console.log("level load callback received");
                        // check if still in situation where want to receive
                        // the file
//                        console.log(that.game.getTopScreen());
                        if (that.game.getTopScreen()===that)
                        {   
//                     console.log("i am the chosen one!");
                            that.$(that.game, level);   // re-initialize the editor
                            that.setDirty();
                        }
                    }
                );
                break;
                
            default:
                break;
        }
};
   



"use strict";
var LevelSettingsDialog = function()
{   Screen.call(this);
    
    this.level = null;  
    this.selected = 0;
    this.pointerx = 0;
    this.pointery = 0;
};
LevelSettingsDialog.prototype = Object.create(Screen.prototype);
    
    
LevelSettingsDialog.prototype.$ = function(game, level)
{   Screen.prototype.$.call(this,game); 

    this.level = level;
    this.selected = 0;
    return this;
};

LevelSettingsDialog.prototype.isOverlay = function()
{   return true;
};

LevelSettingsDialog.prototype.draw = function()
{
    var vr = this.game.vectorRenderer;                
    var tr = this.game.textRenderer;                
    vr.startDrawing ();
    tr.startDrawing ();    
    
    var w = Math.min(370, this.game.screenwidth-20);
    var h = 435;
    var x = 10;
    var y = this.game.screenheight-h-10;
    var spacing = 70;
    
    vr.addRoundedRect (x,y,w,h, 4,6, 0xcc000000);
    
    this.renderSetting(x+20,y+10, 
        "Difficulty", Game.getNameForDifficulty(this.level.difficulty),
        this.selected==0 );    
    this.renderSetting(x+20,y+10+spacing, 
        "Category", Game.getNameForCategory(this.level.category),
        this.selected==1 );
    this.renderSetting(x+20,y+10+spacing*2, 
        "Gems points needed", ""+this.level.loot,
        this.selected==2 );
    this.renderSetting(x+20,y+10+spacing*3, 
        "Swamp spreading speed", this.level.swamprate ? ""+this.level.swamprate : "Off",
        this.selected==3 );
    this.renderSetting(x+20,y+10+spacing*4, 
        "Robot speed", this.level.robotspeed ? ""+this.level.robotspeed : "Off",
        this.selected==4 );
            
    this.renderSetting(x+20,y+10+spacing*5, "", "Done", this.selected==5 );
            
    vr.flush();
    tr.flush();    
};

LevelSettingsDialog.prototype.renderSetting = function(x,y,label,value,highlight)
{
    this.game.textRenderer.addString(label, x,y, 20, false, 0xff888888, TextRenderer.WEIGHT_PLAIN);
    
    var fcol = 0xffdddddd;
    var bcol = 0xff393939;
    if (highlight)
    {   var fcol = 0xff393939;
        var bcol = 0xffdddddd;
    }
    this.game.vectorRenderer.addRoundedRect(x,y+25,330,40, 4,6, bcol);   
    this.game.textRenderer.addString(value, x+20,y+35, 20, false, fcol, TextRenderer.WEIGHT_BOLD);        
    if (label.length>0)
    {   this.game.textRenderer.addString("-", x+240,y+30, 30, false, fcol, TextRenderer.WEIGHT_BOLD);    
        this.game.textRenderer.addString("+", x+280,y+33, 30, false, fcol, TextRenderer.WEIGHT_BOLD);    
        
    }
};

LevelSettingsDialog.prototype.findAction = function(px, py)
{    
    var h = 435;
    var spacing = 70;
    for (var i=0; i<6; i++)
    {   var x = 10+20;
        var y = this.game.screenheight-h-10+10+spacing*i+25;
        if (px>=x && px<x+330 && py>=y && py<y+40) { return i; }        
    }
    return -1;
};

LevelSettingsDialog.prototype.onBackNavigation = function()
{
    this.game.removeScreen();
    this.game.getTopScreen().afterScreenCreation();
};
        
LevelSettingsDialog.prototype.onKeyDown = function(code)
{   
    var l = this.level;
    switch (code)
    {   case KeyEvent.UP:
        {   if (this.selected>0)
            {   this.selected--;
                this.setDirty();
            }
            break;                  
        }
        case KeyEvent.DOWN:
        {   if (this.selected<5)
            {   this.selected++;
                this.setDirty();
            }
			break;
        }
		case KeyEvent.A:
		{   if (this.selected==5) 
            {   this.onBackNavigation();
				break;
            }
        }
		// fall-through
        case KeyEvent.LEFT:
        {   switch(this.selected)
            {   case 0: // difficulty
                {   if (l.difficulty>2) { l.difficulty--; }
                    this.setDirty();
                    break;
                }            
                case 1: // category
                {   if (l.category>0) { l.category--; }
                    this.setDirty();
                    break;
                }                        
                case 2: // loot
                {   if (l.loot>0) { l.loot--; }
                    this.setDirty();
                    break;
                }                        
                case 3: // swamp speed
                {   if (l.swamprate>0) { l.swamprate--; }
                    this.setDirty();
                    break;
                }                        
                case 4: // robot speed
                {   if (l.robotspeed>0) { l.robotspeed--; }
                    this.setDirty();
                    break;
                }                        
            }
            break;
        }
		case KeyEvent.B:
        case KeyEvent.RIGHT:
        {   switch(this.selected)
            {   case 0: // difficulty
                {   if (l.difficulty<9) { l.difficulty++; }
                    this.setDirty();
                    break;
                }            
                case 1: // category
                {   if (l.category<7) { l.category++; }
                    this.setDirty();
                    break;
                }                        
                case 2: // loot
                {   l.loot++;
                    this.setDirty();
                    break;
                }                        
                case 3: // swamp speed
                {   l.swamprate++;
                    this.setDirty();
                    break;
                }                        
                case 4: // robot speed
                {   l.robotspeed++;
                    this.setDirty();
                    break;
                }                        
            }
            break;
        }
    }
};


LevelSettingsDialog.prototype.onPointerDown = function(x, y)
{
    this.pointerx = x;
    this.pointery = y;
    
    var sel = this.findAction(x,y);
    if (sel!=this.selected)
    {   this.selected = sel;
        this.setDirty();
    }
};
    
LevelSettingsDialog.prototype.onPointerUp = function()
{
    if (this.selected>=0 && this.findAction(this.pointerx,this.pointery)==this.selected)
    {           
        if (this.selected<=4)
        {   this.onKeyDown(this.pointerx < 295 ? KeyEvent.LEFT : KeyEvent.RIGHT);
        } 
        else
        {   this.onKeyDown(KeyEvent.A);
        }
    }       
};
    
LevelSettingsDialog.prototype.onPointerMove = function(x, y)
{
    this.pointerx = x;
    this.pointery = y;
};


