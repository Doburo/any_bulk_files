//load script from ulr
function loadJS(FILE_URL, async = true) {
  let scriptEle = document.createElement("script");

  scriptEle.setAttribute("src", FILE_URL);
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("async", async);

  document.body.appendChild(scriptEle);

  // success event 
  scriptEle.addEventListener("load", () => {
    console.log("File loaded")
  });
   // error event
  scriptEle.addEventListener("error", (ev) => {
    console.log("Error on loading file", ev);
  });
}
loadJS("https://html2canvas.hertzen.com/dist/html2canvas.js", true);

//script for initiate 
function download(canvas, filename) {
  const data = canvas.toDataURL("image/png;base64");
  let a = document.createElement("a")
    a.innerHTML = "download"
    a.setAttribute(`id`,`download`);
    a.download = filename;
    a.href = data;
    document.body.insertBefore(a, document.body.children[0])
}

//async image download of DOM element
//https://codepen.io/koseare/pen/NWpMjeP example
html2canvas(document.querySelector(".historyPage_historyList___iObH")).then((canvas) => {
  // document.body.appendChild(canvas);
  download(canvas, "asd");
});