(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{197:function(e,n,a){},200:function(e,n,a){"use strict";a.r(n);var t=a(0),r=a.n(t),c=a(78),o=a.n(c),l=(a(90),a(81)),i=a(12),m=a(84),u=(a(91),a(79)),s=a.n(u),d=[{name:"Richard Hendricks",url:"./img/richard.jpg"},{name:"Erlich Bachman",url:"./img/erlich.jpg"},{name:"Monica Hall",url:"./img/monica.jpg"},{name:"Jared Dunn",url:"./img/jared.jpg"},{name:"Dinesh Chugtai",url:"./img/dinesh.jpg"}];var E=function(){var e=d,n=Object(t.useState)(),a=Object(m.a)(n,2),c=a[0],o=a[1];return r.a.createElement("div",null,r.a.createElement("h1",null,"React Tinder Card"),r.a.createElement("div",{className:"cardContainer"},e.map((function(e){return r.a.createElement(s.a,{className:"swipe",key:e.name,onSwipe:function(n){return a=n,t=e.name,console.log("removing: "+t),void o(a);var a,t},onCardLeftScreen:function(){return n=e.name,void console.log(n+" left the screen!");var n},preventSwipe:["up","down"]},r.a.createElement("div",{style:{backgroundImage:"url("+e.url+")"},className:"card"},r.a.createElement("h3",null,e.name)))}))),c?r.a.createElement("h2",{className:"infoText"},"You swiped ",c):r.a.createElement("h2",{className:"infoText"},"No direction swiped"))},h=a(49),p=a.n(h);var v=function(){return r.a.createElement("div",null,r.a.createElement("div",{className:"main-button"},r.a.createElement(p.a,{color:"blue",animationDuration:300},"CREATE ROOM")),r.a.createElement("div",{className:"main-button"},r.a.createElement(p.a,{color:"blue",animationDuration:300},"JOIN ROOM")))};function g(){return r.a.createElement("div",null,r.a.createElement("h1",null,"Page Not Found"),r.a.createElement("a",{href:"/"},"Go back"))}function f(){return r.a.createElement("div",null,r.a.createElement("h1",null,"Room Not Found"),r.a.createElement("p",null,"Please make sure you've entered a valid room ID in the URL   "),r.a.createElement("a",{href:"/"},"Go back"))}a(197);var w=function(){return r.a.createElement(l.a,null,r.a.createElement("div",null,r.a.createElement(i.c,null,r.a.createElement(i.a,{exact:!0,path:"/rooms/:id",component:E}),r.a.createElement(i.a,{exact:!0,path:"/",component:v}),r.a.createElement(i.a,{exact:!0,path:"/rooms",component:f}),r.a.createElement(i.a,{component:g}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(w,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},85:function(e,n,a){e.exports=a(200)},90:function(e,n,a){},91:function(e,n,a){}},[[85,1,2]]]);
//# sourceMappingURL=main.4d233c7d.chunk.js.map