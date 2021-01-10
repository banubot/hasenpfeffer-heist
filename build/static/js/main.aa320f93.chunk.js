(this["webpackJsonphasenpfeffer-heist"]=this["webpackJsonphasenpfeffer-heist"]||[]).push([[0],{37:function(e,t,a){e.exports=a(87)},42:function(e,t,a){},43:function(e,t,a){},76:function(e,t){},81:function(e){e.exports=JSON.parse('[{"name":"a bok choy","vegImg":"bokchoy.png","points":1},{"name":"a cabbage","vegImg":"cabbage.png","points":2},{"name":"some carrots","vegImg":"carrots.png","points":3},{"name":"some celery","vegImg":"celery.png","points":1},{"name":"some lettuce","vegImg":"lettuce.png","points":2},{"name":"some mushrooms","vegImg":"mushrooms.png","points":3},{"name":"an onion","vegImg":"onion.png","points":1},{"name":"a potato","vegImg":"potato.png","points":2},{"name":"some radishes","vegImg":"radishes.png","points":3},{"name":"a tomato","vegImg":"tomato.png","points":1},{"name":"a cucumber","vegImg":"cucumber.png","points":2},{"name":"some broccoli","vegImg":"broccoli.png","points":3},{"name":"a cauliflower","vegImg":"cauliflower.png","points":1},{"name":"a corn","vegImg":"corn.png","points":2},{"name":"a bell pepper","vegImg":"bellpepper.png","points":3}]')},87:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),c=a(6),o=a.n(c),r=(a(42),a(43),a(36)),m=a(15),s=a.n(m);function i(){var e,t,c,o=a(81),m=s()("http://localhost:3000");m.on("playerNum",(function(e){e})),m.on("newPlayer",(function(e){console.log(e+" joined the game")})),m.on("gameState",(function(e){console.log(e),u(JSON.parse(e))}));var i=Object(n.useState)({room:"",isPlaying:!1,strikes:0,players:{}}),g=Object(r.a)(i,2),d=g[0],u=g[1];return Object(n.useEffect)((function(){document.getElementById("roomSelect").style.display="none",document.getElementById("charSelect").style.display="none",document.getElementById("vegSelect").style.display="none",d.isPlaying?(document.getElementById("gameMain").style.display="block",document.getElementById("intro").style.display="none",document.getElementById("title").classList.add("playingTitle")):(document.getElementById("gameMain").style.display="none",document.getElementById("intro").style.display="block")}),[d]),l.a.createElement("center",null,l.a.createElement("h1",{className:"startTitle",id:"title"},"Hasenpfeffer HEIST!"),l.a.createElement(E,null),l.a.createElement("div",{id:"gameSelect"},l.a.createElement(y,null),l.a.createElement(I,null),l.a.createElement(N,null)),l.a.createElement(p,null));function p(){return l.a.createElement("div",{id:"gameMain"},l.a.createElement("img",{id:"garden",src:"../land2.png",alt:"garden"}),l.a.createElement("p",{id:"roomCode"},l.a.createElement("b",null,"Room Code:")," Brown Chestnut of Lorraine"+d.room),l.a.createElement("div",{id:"players"},Object.values(d.players).map((function(e){return l.a.createElement("div",null,l.a.createElement("img",{className:"playersPicMain",id:"playerRabbitImg",src:"../rabbits/"+e.rabbitImg+".png",alt:"rabbit"}),l.a.createElement("p",{className:"playerName"},e.name))}))),l.a.createElement("div",{id:"inventory"},l.a.createElement("div",{id:"actions"},l.a.createElement("b",{className:"inventoryHeader"},"Actions"),l.a.createElement("p",{className:"action"},"Swipe"),l.a.createElement("p",{className:"action"},"Stash"),l.a.createElement("p",{className:"action"},"Dig"),l.a.createElement("p",{className:"action"},"Block"),l.a.createElement("p",{className:"action"},"End Turn")),l.a.createElement("div",{id:"paws"},l.a.createElement("b",{className:"inventoryHeader"},"Paws"),l.a.createElement("br",null),l.a.createElement("img",{className:"stashItem",src:"../vegetables/tomato.png"}),l.a.createElement("img",{className:"stashItem",src:"../vegetables/tomato.png"})),l.a.createElement("div",{id:"burrow"},l.a.createElement("b",{className:"inventoryHeader"},"Burrow"),l.a.createElement("br",null),l.a.createElement("img",{className:"stashItem",src:"../vegetables/tomato.png"}),l.a.createElement("img",{className:"stashItem",src:"../vegetables/tomato.png"}),l.a.createElement("img",{className:"stashItem",src:"../vegetables/tomato.png"}),l.a.createElement("img",{className:"stashItem",src:"../vegetables/tomato.png"}))))}function E(){return l.a.createElement("center",{id:"intro"},l.a.createElement("p",{id:"gameDes"},"Become the chubbiest bunny in the meadow when you face off against the other buns to steal the most from the garden - but don't get caught!"),l.a.createElement("input",{type:"select",id:"nameInput",placeholder:"Your name"}),l.a.createElement("button",{onClick:v},"Start"))}function y(){return l.a.createElement("div",{id:"roomSelect",style:{display:"none"}},l.a.createElement("button",{id:"newGameButton",onClick:h},"New Game"),l.a.createElement("br",null),l.a.createElement("input",{type:"select",id:"codeInput",placeholder:"Enter game code"}),l.a.createElement("button",{id:"joinGameButton",onClick:f},"Join Game"))}function v(){c=document.getElementById("nameInput").value,document.getElementById("intro").style.display="none",document.getElementById("charSelect").style.display="block"}function h(){m.emit("newGame",c,t,e),b()}function b(){document.getElementById("roomSelect").style.display="none",document.getElementById("gameMain").style.display="block"}function f(){var a=document.getElementById("codeInput").value;m.emit("joinGame",a,c,t,e),b()}function I(){var e,t=[];for(e=0;e<15;e++)t.push(l.a.createElement("div",{className:"charDiv"},l.a.createElement("img",{onClick:B,className:"charPic",id:"rabbit"+e,src:"../rabbits/rabbit"+e+".png",alt:"rabbit"})));return l.a.createElement("div",{className:"startSelect",id:"charSelect",style:{display:"none"}},l.a.createElement("h2",{className:"selectTag"},"Choose your character..."),t)}function N(){var e,t=[];for(e=0;e<15;e++)t.push(l.a.createElement("div",{className:"charDiv"},l.a.createElement("img",{onClick:w,className:"charPic",id:o[e].name,src:"../vegetables/"+o[e].vegImg,alt:o[e].name})));return l.a.createElement("div",{className:"startSelect",id:"vegSelect",style:{display:"none"}},l.a.createElement("h2",{className:"selectTag"},"Choose your favourite vegetable..."),t)}function w(e){t=e.target.id,document.getElementById("vegSelect").style.display="none",document.getElementById("roomSelect").style.display="block"}function B(t){e=t.target.id,document.getElementById("charSelect").style.display="none",document.getElementById("vegSelect").style.display="block"}}var g=a(17);var d=function(){return l.a.createElement("div",{className:"App"},l.a.createElement(i,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var u=a(2),p=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"ADD":return e+t.payload;case"REDUCE":return e-t.payload;default:return e}},E=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"TOGGLE":return!e;default:return e}},y=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"INCREMENT":return e+1;case"DECREMENT":return e-1;default:return e}},v=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"NEWLOG":return e+" "+t.payload;default:return e}},h=Object(u.b)({strike:y,playing:E,score:p,log:v}),b=Object(u.c)(h);o.a.render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(g.a,{store:b},l.a.createElement(d,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[37,1,2]]]);
//# sourceMappingURL=main.aa320f93.chunk.js.map