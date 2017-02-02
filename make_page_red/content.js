
var title = document.getElementsByTagName('title')[0].innerText;
var titleArray = [title, 10];
//var titleCount = 0;

chrome.runtime.sendMessage(titleArray);
console.log("Message sent!");
//titleCount++;
