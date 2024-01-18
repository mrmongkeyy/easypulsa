// anim section
/*
 2017 Julian Garnier
 Released under the MIT license
*/
var $jscomp$this=this;
(function(v,p){"function"===typeof define&&define.amd?define([],p):"object"===typeof module&&module.exports?module.exports=p():v.anime=p()})(this,function(){function v(a){if(!g.col(a))try{return document.querySelectorAll(a)}catch(b){}}function p(a){return a.reduce(function(a,d){return a.concat(g.arr(d)?p(d):d)},[])}function w(a){if(g.arr(a))return a;g.str(a)&&(a=v(a)||a);return a instanceof NodeList||a instanceof HTMLCollection?[].slice.call(a):[a]}function F(a,b){return a.some(function(a){return a===b})}
function A(a){var b={},d;for(d in a)b[d]=a[d];return b}function G(a,b){var d=A(a),c;for(c in a)d[c]=b.hasOwnProperty(c)?b[c]:a[c];return d}function B(a,b){var d=A(a),c;for(c in b)d[c]=g.und(a[c])?b[c]:a[c];return d}function S(a){a=a.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,function(a,b,d,h){return b+b+d+d+h+h});var b=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);a=parseInt(b[1],16);var d=parseInt(b[2],16),b=parseInt(b[3],16);return"rgb("+a+","+d+","+b+")"}function T(a){function b(a,b,c){0>
c&&(c+=1);1<c&&--c;return c<1/6?a+6*(b-a)*c:.5>c?b:c<2/3?a+(b-a)*(2/3-c)*6:a}var d=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(a);a=parseInt(d[1])/360;var c=parseInt(d[2])/100,d=parseInt(d[3])/100;if(0==c)c=d=a=d;else{var e=.5>d?d*(1+c):d+c-d*c,l=2*d-e,c=b(l,e,a+1/3),d=b(l,e,a);a=b(l,e,a-1/3)}return"rgb("+255*c+","+255*d+","+255*a+")"}function x(a){if(a=/([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|pc|vw|vh|deg|rad|turn)?/.exec(a))return a[2]}function U(a){if(-1<a.indexOf("translate"))return"px";
if(-1<a.indexOf("rotate")||-1<a.indexOf("skew"))return"deg"}function H(a,b){return g.fnc(a)?a(b.target,b.id,b.total):a}function C(a,b){if(b in a.style)return getComputedStyle(a).getPropertyValue(b.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase())||"0"}function I(a,b){if(g.dom(a)&&F(V,b))return"transform";if(g.dom(a)&&(a.getAttribute(b)||g.svg(a)&&a[b]))return"attribute";if(g.dom(a)&&"transform"!==b&&C(a,b))return"css";if(null!=a[b])return"object"}function W(a,b){var d=U(b),d=-1<b.indexOf("scale")?
1:0+d;a=a.style.transform;if(!a)return d;for(var c=[],e=[],l=[],h=/(\w+)\((.+?)\)/g;c=h.exec(a);)e.push(c[1]),l.push(c[2]);a=l.filter(function(a,c){return e[c]===b});return a.length?a[0]:d}function J(a,b){switch(I(a,b)){case "transform":return W(a,b);case "css":return C(a,b);case "attribute":return a.getAttribute(b)}return a[b]||0}function K(a,b){var d=/^(\*=|\+=|-=)/.exec(a);if(!d)return a;b=parseFloat(b);a=parseFloat(a.replace(d[0],""));switch(d[0][0]){case "+":return b+a;case "-":return b-a;case "*":return b*
a}}function D(a){return g.obj(a)&&a.hasOwnProperty("totalLength")}function X(a,b){function d(c){c=void 0===c?0:c;return a.el.getPointAtLength(1<=b+c?b+c:0)}var c=d(),e=d(-1),l=d(1);switch(a.property){case "x":return c.x;case "y":return c.y;case "angle":return 180*Math.atan2(l.y-e.y,l.x-e.x)/Math.PI}}function L(a,b){var d=/-?\d*\.?\d+/g;a=D(a)?a.totalLength:a;if(g.col(a))b=g.rgb(a)?a:g.hex(a)?S(a):g.hsl(a)?T(a):void 0;else{var c=x(a);a=c?a.substr(0,a.length-c.length):a;b=b?a+b:a}b+="";return{original:b,
numbers:b.match(d)?b.match(d).map(Number):[0],strings:b.split(d)}}function Y(a,b){return b.reduce(function(b,c,e){return b+a[e-1]+c})}function M(a){return(a?p(g.arr(a)?a.map(w):w(a)):[]).filter(function(a,d,c){return c.indexOf(a)===d})}function Z(a){var b=M(a);return b.map(function(a,c){return{target:a,id:c,total:b.length}})}function aa(a,b){var d=A(b);if(g.arr(a)){var c=a.length;2!==c||g.obj(a[0])?g.fnc(b.duration)||(d.duration=b.duration/c):a={value:a}}return w(a).map(function(a,c){c=c?0:b.delay;
a=g.obj(a)&&!D(a)?a:{value:a};g.und(a.delay)&&(a.delay=c);return a}).map(function(a){return B(a,d)})}function ba(a,b){var d={},c;for(c in a){var e=H(a[c],b);g.arr(e)&&(e=e.map(function(a){return H(a,b)}),1===e.length&&(e=e[0]));d[c]=e}d.duration=parseFloat(d.duration);d.delay=parseFloat(d.delay);return d}function ca(a){return g.arr(a)?y.apply(this,a):N[a]}function da(a,b){var d;return a.tweens.map(function(c){c=ba(c,b);var e=c.value,l=J(b.target,a.name),h=d?d.to.original:l,h=g.arr(e)?e[0]:h,m=K(g.arr(e)?
e[1]:e,h),l=x(m)||x(h)||x(l);c.isPath=D(e);c.from=L(h,l);c.to=L(m,l);c.start=d?d.end:a.offset;c.end=c.start+c.delay+c.duration;c.easing=ca(c.easing);c.elasticity=(1E3-Math.min(Math.max(c.elasticity,1),999))/1E3;g.col(c.from.original)&&(c.round=1);return d=c})}function ea(a,b){return p(a.map(function(a){return b.map(function(b){var c=I(a.target,b.name);if(c){var d=da(b,a);b={type:c,property:b.name,animatable:a,tweens:d,duration:d[d.length-1].end,delay:d[0].delay}}else b=void 0;return b})})).filter(function(a){return!g.und(a)})}
function O(a,b,d){var c="delay"===a?Math.min:Math.max;return b.length?c.apply(Math,b.map(function(b){return b[a]})):d[a]}function fa(a){var b=G(ga,a),d=G(ha,a),c=Z(a.targets),e=[],g=B(b,d),h;for(h in a)g.hasOwnProperty(h)||"targets"===h||e.push({name:h,offset:g.offset,tweens:aa(a[h],d)});a=ea(c,e);return B(b,{children:[],animatables:c,animations:a,duration:O("duration",a,d),delay:O("delay",a,d)})}function n(a){function b(){return window.Promise&&new Promise(function(a){return Q=a})}function d(a){return f.reversed?
f.duration-a:a}function c(a){for(var b=0,c={},d=f.animations,e={};b<d.length;){var g=d[b],h=g.animatable,m=g.tweens;e.tween=m.filter(function(b){return a<b.end})[0]||m[m.length-1];e.isPath$1=e.tween.isPath;e.round=e.tween.round;e.eased=e.tween.easing(Math.min(Math.max(a-e.tween.start-e.tween.delay,0),e.tween.duration)/e.tween.duration,e.tween.elasticity);m=Y(e.tween.to.numbers.map(function(a){return function(b,c){c=a.isPath$1?0:a.tween.from.numbers[c];b=c+a.eased*(b-c);a.isPath$1&&(b=X(a.tween.value,
b));a.round&&(b=Math.round(b*a.round)/a.round);return b}}(e)),e.tween.to.strings);ia[g.type](h.target,g.property,m,c,h.id);g.currentValue=m;b++;e={isPath$1:e.isPath$1,tween:e.tween,eased:e.eased,round:e.round}}if(c)for(var k in c)E||(E=C(document.body,"transform")?"transform":"-webkit-transform"),f.animatables[k].target.style[E]=c[k].join(" ");f.currentTime=a;f.progress=a/f.duration*100}function e(a){if(f[a])f[a](f)}function g(){f.remaining&&!0!==f.remaining&&f.remaining--}function h(a){var h=f.duration,
l=f.offset,n=f.delay,P=f.currentTime,q=f.reversed,r=d(a),r=Math.min(Math.max(r,0),h);if(f.children){var p=f.children;if(r>=f.currentTime)for(var u=0;u<p.length;u++)p[u].seek(r);else for(u=p.length;u--;)p[u].seek(r)}r>l&&r<h?(c(r),!f.began&&r>=n&&(f.began=!0,e("begin")),e("run")):(r<=l&&0!==P&&(c(0),q&&g()),r>=h&&P!==h&&(c(h),q||g()));a>=h&&(f.remaining?(t=m,"alternate"===f.direction&&(f.reversed=!f.reversed)):(f.pause(),"Promise"in window&&(Q(),R=b()),f.completed||(f.completed=!0,e("complete"))),
k=0);e("update")}a=void 0===a?{}:a;var m,t,k=0,Q=null,R=b(),f=fa(a);f.reset=function(){var a=f.direction,b=f.loop;f.currentTime=0;f.progress=0;f.paused=!0;f.began=!1;f.completed=!1;f.reversed="reverse"===a;f.remaining="alternate"===a&&1===b?2:b;for(a=f.children.length;a--;)b=f.children[a],b.seek(b.offset),b.reset()};f.tick=function(a){m=a;t||(t=m);h((k+m-t)*n.speed)};f.seek=function(a){h(d(a))};f.pause=function(){var a=q.indexOf(f);-1<a&&q.splice(a,1);f.paused=!0};f.play=function(){f.paused&&(f.paused=
!1,t=0,k=d(f.currentTime),q.push(f),z||ja())};f.reverse=function(){f.reversed=!f.reversed;t=0;k=d(f.currentTime)};f.restart=function(){f.pause();f.reset();f.play()};f.finished=R;f.reset();f.autoplay&&f.play();return f}var ga={update:void 0,begin:void 0,run:void 0,complete:void 0,loop:1,direction:"normal",autoplay:!0,offset:0},ha={duration:1E3,delay:0,easing:"easeOutElastic",elasticity:500,round:0},V="translateX translateY translateZ rotate rotateX rotateY rotateZ scale scaleX scaleY scaleZ skewX skewY".split(" "),
E,g={arr:function(a){return Array.isArray(a)},obj:function(a){return-1<Object.prototype.toString.call(a).indexOf("Object")},svg:function(a){return a instanceof SVGElement},dom:function(a){return a.nodeType||g.svg(a)},str:function(a){return"string"===typeof a},fnc:function(a){return"function"===typeof a},und:function(a){return"undefined"===typeof a},hex:function(a){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a)},rgb:function(a){return/^rgb/.test(a)},hsl:function(a){return/^hsl/.test(a)},col:function(a){return g.hex(a)||
g.rgb(a)||g.hsl(a)}},y=function(){function a(a,d,c){return(((1-3*c+3*d)*a+(3*c-6*d))*a+3*d)*a}return function(b,d,c,e){if(0<=b&&1>=b&&0<=c&&1>=c){var g=new Float32Array(11);if(b!==d||c!==e)for(var h=0;11>h;++h)g[h]=a(.1*h,b,c);return function(h){if(b===d&&c===e)return h;if(0===h)return 0;if(1===h)return 1;for(var m=0,k=1;10!==k&&g[k]<=h;++k)m+=.1;--k;var k=m+(h-g[k])/(g[k+1]-g[k])*.1,l=3*(1-3*c+3*b)*k*k+2*(3*c-6*b)*k+3*b;if(.001<=l){for(m=0;4>m;++m){l=3*(1-3*c+3*b)*k*k+2*(3*c-6*b)*k+3*b;if(0===l)break;
var n=a(k,b,c)-h,k=k-n/l}h=k}else if(0===l)h=k;else{var k=m,m=m+.1,f=0;do n=k+(m-k)/2,l=a(n,b,c)-h,0<l?m=n:k=n;while(1e-7<Math.abs(l)&&10>++f);h=n}return a(h,d,e)}}}}(),N=function(){function a(a,b){return 0===a||1===a?a:-Math.pow(2,10*(a-1))*Math.sin(2*(a-1-b/(2*Math.PI)*Math.asin(1))*Math.PI/b)}var b="Quad Cubic Quart Quint Sine Expo Circ Back Elastic".split(" "),d={In:[[.55,.085,.68,.53],[.55,.055,.675,.19],[.895,.03,.685,.22],[.755,.05,.855,.06],[.47,0,.745,.715],[.95,.05,.795,.035],[.6,.04,.98,
.335],[.6,-.28,.735,.045],a],Out:[[.25,.46,.45,.94],[.215,.61,.355,1],[.165,.84,.44,1],[.23,1,.32,1],[.39,.575,.565,1],[.19,1,.22,1],[.075,.82,.165,1],[.175,.885,.32,1.275],function(b,c){return 1-a(1-b,c)}],InOut:[[.455,.03,.515,.955],[.645,.045,.355,1],[.77,0,.175,1],[.86,0,.07,1],[.445,.05,.55,.95],[1,0,0,1],[.785,.135,.15,.86],[.68,-.55,.265,1.55],function(b,c){return.5>b?a(2*b,c)/2:1-a(-2*b+2,c)/2}]},c={linear:y(.25,.25,.75,.75)},e={},l;for(l in d)e.type=l,d[e.type].forEach(function(a){return function(d,
e){c["ease"+a.type+b[e]]=g.fnc(d)?d:y.apply($jscomp$this,d)}}(e)),e={type:e.type};return c}(),ia={css:function(a,b,d){return a.style[b]=d},attribute:function(a,b,d){return a.setAttribute(b,d)},object:function(a,b,d){return a[b]=d},transform:function(a,b,d,c,e){c[e]||(c[e]=[]);c[e].push(b+"("+d+")")}},q=[],z=0,ja=function(){function a(){z=requestAnimationFrame(b)}function b(b){var c=q.length;if(c){for(var d=0;d<c;)q[d]&&q[d].tick(b),d++;a()}else cancelAnimationFrame(z),z=0}return a}();n.version="2.0.2";
n.speed=1;n.running=q;n.remove=function(a){a=M(a);for(var b=q.length;b--;)for(var d=q[b],c=d.animations,e=c.length;e--;)F(a,c[e].animatable.target)&&(c.splice(e,1),c.length||d.pause())};n.getValue=J;n.path=function(a,b){var d=g.str(a)?v(a)[0]:a,c=b||100;return function(a){return{el:d,property:a,totalLength:d.getTotalLength()*(c/100)}}};n.setDashoffset=function(a){var b=a.getTotalLength();a.setAttribute("stroke-dasharray",b);return b};n.bezier=y;n.easings=N;n.timeline=function(a){var b=n(a);b.pause();
b.duration=0;b.add=function(a){b.children.forEach(function(a){a.began=!0;a.completed=!0});w(a).forEach(function(a){var c=b.duration,d=a.offset;a.autoplay=!1;a.offset=g.und(d)?c:K(d,c);b.seek(a.offset);a=n(a);a.duration>c&&(b.duration=a.duration);a.began=!0;b.children.push(a)});b.reset();b.seek(0);b.autoplay&&b.restart();return b};return b};n.random=function(a,b){return Math.floor(Math.random()*(b-a+1))+a};return n});

Array.prototype.getRandom = function(){
	return this[Math.floor(Math.random()*this.length)];
}
Array.prototype.split = function(len){
	const newArray = [];

	let loop = this.length;
	//find a loop.
	if(loop%2!==0){
		loop+=1;
	}
	loop = loop/2;
	for(let i=0;i<loop;i++){
		newArray.push([]);
	}

	let i = 0;
	this.forEach((item)=>{
		if(newArray[i].length===2){
			i += 1;
		}
		newArray[i].push(item);
	})

	return newArray;
}
//Object.prototype.forEach = function(callback){
//	let i = 0;
//	for(let key in this){
//		callback(this[key],i);
//		i++;
//	}
//}
JSON.toEncoded = function(obj){
	let string = '';
	for(let i in obj){
		string += `${i}=${obj[i]}&&`;
	}
	return string;
}
const jsonstr = function(obj){
	return JSON.stringify(obj);
}
const filterString = function(string,char,newchar){
	while(string.indexOf(char)!=-1){
		string = string.replace(char,newchar);
	}
	return string;
}
const emptycheck = function(jsondata){
	let valid = true;
	for(let i in jsondata){
		if(!jsondata[i] || jsondata[i].length===0){
			valid = false;
			break;
		}
	}
	return valid;
}
const recheckvalue = function(el,time=1000){
	const borderColorBefore = el.style.borderColor;
	el.style.borderColor = 'red';
	setTimeout(()=>{el.style.borderColor = borderColorBefore},time);
}
const getTimestamp = function(){
	let time = new Date().toLocaleTimeString();
	let date = new Date().toLocaleDateString();
	while(time.indexOf('.')!=-1){
		time = time.replace('.','');
	}
	
	const metadate = date.split('/');
	date = '';
	metadate.reverse();
	metadate.forEach(d=>{
		if(d.length===1){
			d = 0+d;
		}
		date += d;
	})
	return(date+time);
}
const vector2 = function(x=0,y=0){
	return {x,y};
}
const forIn = function(n,f){
	for(let i=0;i<n;i++)if(f)f(i);
}
const getRad = function(n){return n*Math.PI/180}
const vector2Dir = function(v1,v2){
	return Math.atan2(v2.x-v1.x,v2.y-v1.y);
}
const transformV = function(v1,v2){
	return vector2(v2.x-v1.x,v2.y-v1.y);
}
const getMagnitude = function(vector){
	return Math.hypot(vector.x,vector.y);
}
const random = function(len,min=0){
	return Math.floor(Math.random()*len)+min;
}
const find = function(p){
	return Object.assign(document.querySelector(p),toInject);
}
const findall = function(p){
	const els = document.querySelectorAll(p);
	for(let i=0;i<els.length;i++){
		Object.assign(els[i],toInject);
	}
	return els;
}
const flex = {
	components:[]	
}

const objlen = function(obj){
	let i = 0;
	for(let x in obj){
		i += 1;
	}
	return i;
}

const toInject = {
		anim:anime,
		find(p){
			const el = this.querySelector(p);
			if(!el)return null;
			el.parent = this;
			return Object.assign(el,this);
		},
		findall(p){
			const els = this.querySelectorAll(p);
			for(let i=0;i<els.length;i++){
				els[i].parent = this;
				Object.assign(els[i],toInject);
			}
			return els;
		},
		addChild(child){
			child.parent = this;
			this.appendChild(child);
			flex.components.push(child);
			if(child.onadded)child.onadded();
			return child;
		},
		addBefore(child,oldChild){
			child.parent = this;
			this.insertBefore(child,oldChild);
			if(child.onadded)child.onadded();
		},
		show(setting='block'){
			if(this.style.display === 'none' || this.style.display === ''){
				this.style.display = setting; 
			}
		},
		hide(){
			if(this.style.display !== 'none' || this.style.display !== ''){
				this.style.display = 'none';
			}
		},
		replaceChild(child){
			this.clear();
			this.addChild(child);
		},
		changeTo(el,typeDisplay='block'){
			this.hide();
			el.style.display = typeDisplay;
		},
		saveRemove(p){
			const el =	this.querySelector(p);
			if(el)el.remove();
		},
		clear(){
			this.innerHTML = '';
		},
		update(someupdate){
			Object.assign(this,someupdate);
		},
		setHTML(string){
			this.innerHTML = string;
		},
		showUp(before,after,timeout=2000){
			before(this);
			setTimeout(()=>{
				after(this);
			},timeout)
		}
	}

const makeElement = function(name,optional={}){
	Object.assign(optional,toInject);
	return Object.assign(document.createElement(name),optional);
}
document.body.addChild = function(child){
	this.appendChild(child);
	if(child.onadded)child.onadded();
}

window.onresize = function(){
	flex.components.forEach(component=>{
		if(component.onScreenChange)component.onScreenChange(innerWidth,innerHeight);
	})
}

const form = function(data){
	const form = new FormData();
	for(let key in data){
		form.append(key,data[key]);
	}
	return form;
}

const cOn = {
	x:new XMLHttpRequest(),
	init(){
		this.x.someSettings = [];
		this.x.getJSONResponse = ()=>{
		  return JSON.parse(this.x.responseText);
		}
	},
	post(config){
		this.init();
		Object.assign(this.x,config);
		this.x.open('POST',config.url);
		if(this.x.someSettings.length>0){
			this.x.someSettings.forEach(x=>{
				this.x[x[0]](x[1],[x[2]]);
			});
		}
		this.x.send(config.data);
	},
	get(config){
		this.init();
		Object.assign(this.x,config);
		this.x.open('GET',config.url);
		this.x.send();
	}
}
const uploadFile = function(type='readAsArrayBuffer',file,transferRate=1000,progress,callback,dataoptional={}){
	const fs = new FileReader();
	fs.onload = function(){
		const data = this.result;
		let uploaded = 0;
		let uploadedf = false;
		const send = function(){
			let start = uploaded;
			let end = start+transferRate;
			if(end>data.byteLength){
				end = end-(end-data.byteLength);
				uploadedf = true;
			}
			let chunk = data.slice(start,end);
			cOn.post({
				url:'/upload',
				someSettings:[['setRequestHeader','content-type','application/octet-stream'],
					['setRequestHeader','filedata',JSON.stringify(Object.assign({
						fname:file.name
					},dataoptional))],
				],
				data:chunk,
				onload(response){
					uploaded += chunk.byteLength;
					progress(uploaded);
					if(uploadedf){
						callback(response);
					}else send();
				}
			})
		}
		send();
		
	}
	fs[type](file);
}
const readFile = function(src,readMode,callback){
	const fr = new FileReader();
	fr[readMode](src);
	fr.onloadend = function(){
		callback(this.result);
	}
}

const getPrice = function(value){
	value = String(value);
	let result = '';
	while(true){
		if(value.length>3){
			result = '.'+value.slice(value.length-3)+result;
			value = value.slice(0,value.length-3);
		}else{
			result = value+result;
			break
		}
	}
	return result;
}
const speedywords = function(words,el,speed=1000){
	//try to work on this.
	let wIndex = 0;
	let cIndex = 0;
	const display = ()=>{
		el.innerHTML += `<span>${words[wIndex][cIndex]}</span>`;
		cIndex++;
		if(cIndex===words[wIndex].length+1){
			wIndex++;
			if(wIndex===words.length){
				wIndex = 0;
			}
			cIndex = 0;
			el.clear();
		}
	}
	const interval = setInterval(()=>{
		display();
	},speed)
}
const showElement = function(el,displaymode='flex'){
	el.style.display = displaymode;
}
const hideElement = function(el){
	el.style.display = 'none';
}
const getTime = function(){
	return new Date().getTime();
}
const getUniqueID = function(len=10){
	const seed = 'aAbBcCdDEeFfJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
	let result = '';
	for(let i=0;i<len;i++){
		result += seed[Math.floor(Math.random()*seed.length)];
	}
	return result;
}
const objToArray = function(obj){
	const bucket = [];
	Object.keys(obj).forEach(key=>{
		bucket.push(obj[key]);
	})
	return bucket;
}
const OBJevaluate = function(obj){
  const newObj = {};
  for(let i in obj){
    if(obj[i]){
      newObj[i] = obj[i];
    }
  }
  return newObj;
}

const imgErrHandler = function(){
	console.log(this);
}

const is_null = function(arr){
	return arr.length === 0;
}
const openLoading = function(loadingmsg,added,imgSrc){
	return makeElement('div',{
		id:'loadingDiv',
		style:`
			position:absolute;
			top:0;
			left:0;
			width:100%;
			height:100%;
			background:RGB(255,255,255,.7);
			display:flex;
			align-items:center;
			justify-content:center;
			index:1;
		`,
		innerHTML:`
			<div
			style="
				background:white;
				padding:20px;
				display:flex;
				flex-direction:column;
				align-items:center;
				border-radius:20px;
				box-shadow:0 1px 5px rgba(0,0,0,.2),0 2px 2px rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.12);
			"
			>
				<img src=${imgSrc||'/file?fn=loadingscreen.gif'}
				style="
					width:200px;
				"
				>
				<span>${loadingmsg}</span>
			</div>
		`,
		onadded(){
			if(added)added(this);
		}
	})
}
const compareSet = function(src,c1,c2){
	if(src===c1){
		src = c2;
	}else if(src===c2){
		src = c1;
	}
}
const forceRecheck = function(el,msg,inf=false){
	const allfrc = findall('#frcel');
	el.addChild(makeElement('div',{
		id:'frcel',
		style:`
			position:absolute;
			background:red;
			color:white;
			padding:15px;
			z-index:2;
			left:0;
			font-size:16px;
			margin-top: ${50*allfrc.length+1}px;
			bottom:0;
		`,
		innerHTML:msg,
		onadded(){
			if(!inf){
				setTimeout(()=>{
					this.remove()
				},2000);
			}
		}
	}))
}
const getTimePlus = function(number){
	return new Date().getTime()+number;
}
const nonull = function(obj){
	const nullkeys = [];
	for(let i in obj){
		if(!obj[i]){
			nullkeys.push(i);
		}
	}
	return {
		valid:nullkeys.length===0?true:false,
		nullkeys
	}
}
const getFullDate = function(){
	return new Date().toLocaleDateString();
}

const ddmmyy = function(){
	const date = new Date();
	let day = String(date.getUTCDate());
	day = day.length===1?`0${day}`:day;
	let month = String(date.getUTCMonth());
	month = month.length===1?`0${month}`:month;
	let year = String(date.getUTCFullYear());
	year = year.length===1?`0${year}`:year;
	return `${day}-${month}-${year}`;
}

const SmartTime = function(msInput){
	const now = new Date();
	const ms = now.getTime();
	const gap = ms-msInput;
	const stc = ['detik','menit','jam','hari','minggu','bulan','tahun'];
	//getting the secons first.
	const stringSecon = String(gap);
	let secons = Number(stringSecon.slice(0,(stringSecon.length-3)));
	//getting minutes.
	const seconModulo = secons%60;
	let minutes = (secons-(seconModulo))/60;
	secons=seconModulo;
	const minuteModulo = minutes%60;
	let hours = (minutes-(minuteModulo))/60;
	minutes = minuteModulo;
	const hoursModulo = hours%24;
	let day = (hours-hoursModulo)/24;
	hours = hoursModulo;
	const dayModulo = day%7;
	let week = (day-dayModulo)/7;
	day = dayModulo;
	const weekModulo = week%4;
	let month = (week-weekModulo)/4;
	week = weekModulo;
	const monthModulo = month%12;
	let year = (month-monthModulo)/12;
	month = monthModulo;
	const data = [secons,minutes,hours,day,week,month,year];
	let index = -1;
	for(let i=0;i<data.length;i++){
		if(data[i]){
			index = i;
		}
	}
	if(index == -1)return 'Baru saja';
	return `${data[index]} ${stc[index]} lalu`;
}

const arrayRemoveItem = function(item,arr){
	const newArray = [];
	arr.forEach(a=>{
		if(a!==item)
			newArray.push(a);
	})
	return newArray;
}