var initLog = "Activating 'PageReact'";
console.log(initLog);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    var currentHref = window.location.href;
    fetchData(currentHref);
  }
});

async function fetchData(currentHref) {
  var matchOne = currentHref.match(
    /(?:https?:\/\/(?:www|m|mbasic|business)\.(?:facebook|fb)\.com\/)(?:photo(?:\.php|s)|permalink\.php|video\.php|media|watch\/|questions|notes|[^\/]+\/(?:activity|posts|videos|photos))[\/?](?:fbid=|story_fbid=|id=|b=|v=|)(?|([0-9]+)|[^\/]+\/(\d+))/gm
  );
  if (matchOne) {
    const res = await fetch(currentHref);
    const record = await res.json();
    const likes = record.data[0].data;
    for (var i = 0; i < likes.length; i++) {
      var no = document.createElement("td");
      var no_text = document.createTextNode(i);
      no.appendChild(no_text);
      var uid = document.createElement("td");
      var uid_text = document.createTextNode(parseInt(likes[i].id));
      uid.appendChild(uid_text);
      var element = document.getElementsById("list_of_uid");
      element.appendChild(no);
      element.appendChild(uid);
    }
  }
}
