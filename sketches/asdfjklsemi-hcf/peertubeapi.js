//jschannel (compressed)
!function(e,t){"object"==typeof exports?module.exports=t():"function"==typeof define&&define.amd?define([],function(){return e.Channel=t()}):e.Channel=t()}(this,function(){"use strict";return function(){var f=Math.floor(1000001*Math.random()),u={};function S(e){return Array.isArray?Array.isArray(e):-1!=e.constructor.toString().indexOf("Array")}var M={},e=function(e){try{var t=JSON.parse(e.data);if("object"!=typeof t||null===t)throw"malformed"}catch(e){return}var n,o,r,i=e.source,a=e.origin;if("string"==typeof t.method){var s=t.method.split("::");r=2==s.length?(n=s[0],s[1]):t.method}if(void 0!==t.id&&(o=t.id),"string"==typeof r){var c=!1;if(u[a]&&u[a][n])for(var d=0;d<u[a][n].length;d++)if(u[a][n][d].win===i){u[a][n][d].handler(a,r,t),c=!0;break}if(!c&&u["*"]&&u["*"][n])for(d=0;d<u["*"][n].length;d++)if(u["*"][n][d].win===i){u["*"][n][d].handler(a,r,t);break}}else void 0!==o&&M[o]&&M[o](a,r,t)};return window.addEventListener?window.addEventListener("message",e,!1):window.attachEvent&&window.attachEvent("onmessage",e),{build:function(b){var y=function(e){if(b.debugOutput&&window.console&&window.console.log){try{"string"!=typeof e&&(e=JSON.stringify(e))}catch(e){}window.console.log("["+o+"] "+e)}};if(!window.postMessage)throw"jschannel cannot run this browser, no postMessage";if(!window.JSON||!window.JSON.stringify||!window.JSON.parse)throw"jschannel cannot run this browser, no JSON parsing/serialization";if("object"!=typeof b)throw"Channel build invoked without a proper object argument";if(!b.window||!b.window.postMessage)throw"Channel.build() called without a valid window argument";window===b.window&&y("target window is same as present window -- use at your own risk");var e,t=!1;"string"==typeof b.origin&&("*"===b.origin?t=!0:null!==(e=b.origin.match(/^https?:\/\/(?:[-a-zA-Z0-9_\.])+(?::\d+)?/))&&(b.origin=e[0].toLowerCase(),t=!0));if(!t)throw"Channel.build() called with an invalid origin";if(void 0!==b.scope){if("string"!=typeof b.scope)throw"scope, when specified, must be a string";if(1<b.scope.split("::").length)throw"scope may not contain double colons: '::'"}else b.scope="__default";var o=function(){for(var e="",t="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",n=0;n<5;n++)e+=t.charAt(Math.floor(Math.random()*t.length));return e}(),v={},k={},_={},r=!1,i=[],a=[],d=function(e,t,n){if("function"==typeof b.gotMessageObserver)try{b.gotMessageObserver(e,n)}catch(e){y("gotMessageObserver() raised an exception: "+e.toString())}if(n.id&&t){_[n.id]={};var o=(h=n.id,p=e,m=n.callbacks?n.callbacks:[],w=g=!1,{origin:p,invoke:function(e,t){if(!_[h])throw"attempting to invoke a callback of a nonexistent transaction: "+h;for(var n=!1,o=0;o<m.length;o++)if(e===m[o]){n=!0;break}if(!n)throw"request supports no such callback '"+e+"'";O({id:h,callback:e,params:t})},error:function(e,t){if(w=!0,!_[h])throw"error called for nonexistent message: "+h;delete _[h],O({id:h,error:e,message:t})},complete:function(e){if(w=!0,!_[h])throw"complete called for nonexistent message: "+h;delete _[h],O({id:h,result:e})},delayReturn:function(e){return"boolean"==typeof e&&(g=!0===e),g},completed:function(){return w}});if(v[t])try{if(n.callbacks&&S(n.callbacks)&&0<n.callbacks.length)for(var r=0;r<n.callbacks.length;r++){for(var i=n.callbacks[r],a=n.params,s=i.split("/"),c=0;c<s.length-1;c++){var d=s[c];"object"!=typeof a[d]&&(a[d]={}),a=a[d]}a[s[s.length-1]]=function(){var t=i;return function(e){return o.invoke(t,e)}}()}var l=v[t](o,n.params);o.delayReturn()||o.completed()||o.complete(l)}catch(t){var f="runtime_error",u=null;if("string"==typeof t?u=t:"object"==typeof t&&(t instanceof Error?(f=t.constructor.name,u=t.message):t&&S(t)&&2==t.length?(f=t[0],u=t[1]):"string"==typeof t.error&&(f=t.error,t.message?"string"==typeof t.message?u=t.message:t=t.message:u="")),null===u)try{void 0===(u=JSON.stringify(t))&&(u=t.toString())}catch(e){u=t.toString()}o.error(f,u)}else o.error("method_not_found","No method '"+t+"' was (yet) bound by the provider")}else n.id&&n.callback?k[n.id]&&k[n.id].callbacks&&k[n.id].callbacks[n.callback]?k[n.id].callbacks[n.callback](n.params):y("ignoring invalid callback, id:"+n.id+" ("+n.callback+")"):n.id?k[n.id]?(n.error?k[n.id].error&&k[n.id].error(n.error,n.message):void 0!==n.result?k[n.id].success(n.result):k[n.id].success(),delete k[n.id],delete M[n.id]):y("ignoring invalid response: "+n.id):t&&v[t]&&v[t]({origin:e},n.params);var h,p,m,g,w};!function(n,e,t,o){function r(e){for(var t=0;t<e.length;t++)if(e[t].win===n)return!0;return!1}var i=!1;if("*"===e){for(var a in u)if(u.hasOwnProperty(a)&&"*"!==a&&"object"==typeof u[a][t]&&(i=r(u[a][t])))break}else u["*"]&&u["*"][t]&&(i=r(u["*"][t])),!i&&u[e]&&u[e][t]&&(i=r(u[e][t]));if(i)throw"A channel is already bound to the same window which overlaps with origin '"+e+"' and has scope '"+t+"'";"object"!=typeof u[e]&&(u[e]={}),"object"!=typeof u[e][t]&&(u[e][t]=[]),u[e][t].push({win:n,handler:o})}(b.window,b.origin,b.scope,d);var l=function(e){return[b.scope,e].join("::")},O=function(e,t){if(!e)throw"postMessage called with null message";if(t||r){if("function"==typeof b.postMessageObserver)try{b.postMessageObserver(b.origin,e)}catch(e){y("postMessageObserver() raised an exception: "+e.toString())}y("post message: "+JSON.stringify(e)+" with origin "+b.origin),b.window.postMessage(JSON.stringify(e),b.origin)}else y("queue message: "+JSON.stringify(e)),i.push(e)},s=function(e,t){var n;e=[].concat(e);for(var o=0;o<e.length;o++)t[n=e[o].toString()]=function(o){return function(e,t,n){t?c.call({method:o,params:e,success:t,error:n}):c.notify({method:o,params:e})}}(n)},c={remote:{},unbind:function(e,t){if(v[e]){if(!delete v[e])throw"can't delete method: "+e;return b.publish&&!t&&(r?c.notify({method:"__unbind",params:e}):a.push({action:"unbind",method:e})),!0}return!1},bind:function(e,t,n){if(!e||"string"!=typeof e)throw"'method' argument to bind must be string";if(!t||"function"!=typeof t)throw"callback missing from bind params";if(v[e])throw"method '"+e+"' is already bound!";return v[e]=t,b.publish&&!n&&(r?c.notify({method:"__bind",params:e}):a.push({action:"bind",method:e})),this},call:function(e){if(!e)throw"missing arguments to call function";if(!e.method||"string"!=typeof e.method)throw"'method' argument to call must be string";if(!e.success||"function"!=typeof e.success)throw"'success' callback missing from call";var r={},i=[],a=[],s=function(e,t){if(0<=a.indexOf(t))throw"params cannot be a recursive data structure";if(t&&a.push(t),"object"==typeof t)for(var n in t)if(t.hasOwnProperty(n)){var o=e+(e.length?"/":"")+n;"function"==typeof t[n]?(r[o]=t[n],i.push(o),delete t[n]):"object"==typeof t[n]&&s(o,t[n])}};s("",e.params);var t,n,o,c={id:f,method:l(e.method),params:e.params};i.length&&(c.callbacks=i),e.timeout&&(t=f,n=e.timeout,o=l(e.method),window.setTimeout(function(){if(k[t]){var e="timeout ("+n+"ms) exceeded on method '"+o+"'";k[t].error&&k[t].error("timeout_error",e),delete k[t],delete M[t]}},n)),k[f]={callbacks:r,error:e.error,success:e.success},M[f]=d,f++,O(c)},notify:function(e){if(!e)throw"missing arguments to notify function";if(!e.method||"string"!=typeof e.method)throw"'method' argument to notify must be string";O({method:l(e.method),params:e.params})},destroy:function(){!function(e,t,n){for(var o=u[t][n],r=0;r<o.length;r++)o[r].win===e&&o.splice(r,1);0===u[t][n].length&&delete u[t][n]}(b.window,b.origin,b.scope),window.removeEventListener?window.removeEventListener("message",d,!1):window.detachEvent&&window.detachEvent("onmessage",d),r=!1,v={},_={},k={},b.origin=null,i=[],y("channel destroyed"),o=""}};return c.bind("__ready",function(e,t){if(y("ready msg received"),r&&!b.reconnect)throw"received ready message while in ready state.";r=!0,o.length<6&&("publish-request"===t.type?o+="-R":o+="-L"),y("ready msg accepted."),"publish-request"===t.type&&c.notify({method:"__ready",params:{type:"publish-reply",publish:a}});for(var n=0;n<t.publish.length;n++)"bind"===t.publish[n].action?s([t.publish[n].method],c.remote):delete c.remote[t.publish[n].method];for(b.reconnect||c.unbind("__ready",!0);i.length;)O(i.splice(0,1)[0]);a=[],"function"==typeof b.onReady&&b.onReady(c)},!0),c.bind("__bind",function(e,t){s([t],c.remote)},!0),c.bind("__unbind",function(e,t){c.remote[t]&&delete c.remote[t]},!0),b.remote&&s(b.remote,c.remote),setTimeout(function(){0<o.length&&O({method:l("__ready"),params:{type:"publish-request",publish:a}},!0)},0),c}}}()});

//EventHandler
function EventRegistrar(){
	    
	this.eventRegistrations={};
		
	this.bindToChannel = function(channel){
		for (let name of Object.keys(this.eventRegistrations)) {
			channel.bind(name, (txn, params) => this.fire(name, params));
		}
	}

	this.registerTypes = function(names){
		for (let name of names) {
			this.eventRegistrations[ name ] = { registrations: [] };
		}
	}

	this.fire = function(name,event){
		this.eventRegistrations[ name ].registrations.forEach(x => x(event));
	}
	
	this.addListener = function(name,handler){
		if (!this.eventRegistrations[ name ]) {
			console.warn("PeerTube: addEventListener(): The event '"+name+"' is not supported");
			return false;
		}

		this.eventRegistrations[ name ].registrations.push(handler);
		return true
	}
	
	this.removeListener = function(name,handler){
		if (!this.eventRegistrations[ name ]) return false;
		this.eventRegistrations[ name ].registrations = this.eventRegistrations[ name ].registrations.filter(x => x === handler);
		return true;
	}
};

//Peertube Api
const PASSTHROUGH_EVENTS = [
  'pause',
  'play',
  'playbackStatusUpdate',
  'playbackStatusChange',
  'resolutionUpdate'
]

function PeerTubePlayer(embedElementPar,scopePar){
	this.eventRegistrar = new EventRegistrar();
	this.channel;
	this.readyPromise;
	this.embedElement = embedElementPar;
	this.scope = scopePar;
    	
	this.destroy = function(){
		this.embedElement.remove();
	}
	
	this.addEventListener = function(event,handler){
		return this.eventRegistrar.addListener(event, handler);
	}
	
	this.removeEventListener = function(event,handler){
		return this.eventRegistrar.removeListener(event, handler);
	}
	
	this.ready = function(){
		return this.readyPromise;
	}
	
	this.play = async function(){await this.sendMessage('play');}
	this.pause = async function(){await this.sendMessage('pause');}
	this.setVolume = async function(value){await this.sendMessage('setVolume',value);}
	this.getVolume = async function(){return this.sendMessage('setVolume');}
	this.seek = async function(seconds){await this.sendMessage('seek',seconds);}
	this.setResolution = async function(resolutionId){await this.sendMessage('setResolution',resolutionId);}
	this.getResolutions = async function(){return this.sendMessage('getResolutions');}
	this.getPlaybackRates = async function(){return this.sendMessage('getPlaybackRates');}
	this.getPlaybackRate = async function(){return this.sendMessage('getPlaybackRate');}
	this.setPlaybackRate = async function(rate){await this.sendMessage('setPlaybackRate',rate);}
	
	this.constructChannel = function(){
		this.channel = Channel.build({
		window: this.embedElement.contentWindow,
		origin: '*',
		scope: this.scope || 'peertube'
		});
		this.eventRegistrar.bindToChannel(this.channel);
	}

	this.prepareToBeReady = function(){
		let readyResolve;
		let readyReject;
		
		this.readyPromise = new Promise((res, rej) => {
			readyResolve = res;
			readyReject = rej;
		});
		
		this.channel.bind('ready', success => success ? readyResolve() : readyReject());
		this.channel.call({
			method: 'isReady',
			success: isReady => isReady ? readyResolve() : null
		});
	}

	this.sendMessage = function(method,params){
		return new Promise((resolve, reject) => {
			this.channel.call({
				method, params,
				success: result => resolve(result),
				error: error => reject(error)
			});
		});
	}
	
	this.eventRegistrar.registerTypes(PASSTHROUGH_EVENTS);
	this.constructChannel();
	this.prepareToBeReady();
	
};