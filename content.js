var initLog = "Activating 'PageReact'";
var like_btn_src =
  "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e";

chrome.runtime.onMessage.addListener((response, callback) => {
  if (response.message === "clicked_browser_action") {
    console.log(initLog);
    send_profiles_list();
  }
});

function getElementsByXPath(xpath, parent) {
  let results = [];
  let query = document.evaluate(
    xpath,
    parent || document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  for (let i = 0, length = query.snapshotLength; i < length; ++i) {
    results.push(query.snapshotItem(i));
  }
  return results;
}

function get_profiles_list() {
  var profiles_list = [];
  var reaction_popup_children_parent = getElementsByXPath(
    "/html/body/div[1]/div/div[1]/div/div[4]/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[1]"
  )[0] || getElementsByXPath(
    "/html/body/div[1]/div/div[1]/div/div[6]/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[1]"
  )[0];
  var reaction_popup_children = reaction_popup_children_parent.children;
  for (var i = 0; i < reaction_popup_children.length; i++) {
    profiles_list.push(reaction_popup_children[i]);
  }
  return profiles_list;
}

function check_reaction_popup_status() {
  var time = setInterval(function () {
    if (
      getElementsByXPath(
        "/html/body/div[1]/div/div[1]/div/div[4]/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div[2]/div[2]/div/div"
      )[0] || getElementsByXPath(
        "/html/body/div[1]/div/div[1]/div/div[6]/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div[2]/div[2]/div/div"
      )[0]
    ) {
      clearInterval(time);
      var profile_list_scroll = getElementsByXPath(
        "/html/body/div[1]/div/div[1]/div/div[4]/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div[2]/div[2]/div/div"
      )[0] || getElementsByXPath(
        "/html/body/div[1]/div/div[1]/div/div[6]/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div[2]/div[2]/div/div"
      )[0];
      scrollTillEnd(profile_list_scroll);
    }
  }, 500);
}

function get_profile_href() {
  var all_profiles_list = get_profiles_list();
  const profiles_href = {};
  for (var i = 0; i < all_profiles_list.length; i++) {
    var profiles_name =
      all_profiles_list[i].children[0].children[0].children[1].children[0]
        .innerText;
    profiles_href[profiles_name] =
      all_profiles_list[
        i
      ].children[0].children[0].children[0].children[0].children[0].getAttribute(
        "href"
      );
  }
  return profiles_href;
}

function scrollTillEnd(elmt) {
  var profile_list_count = elmt.children[0].children.length;
  elmt.scrollTo(0, elmt.scrollHeight);
  var time = setInterval(function () {
    if (elmt.children[0].children.length != profile_list_count) {
      elmt.scrollTo(0, elmt.scrollHeight);
      profile_list_count = elmt.children[0].children.length;
    } else {
      clearInterval(time);
      const profiles_href_list = {};
      const profiles_hrefs = get_profile_href();
      for (const i in profiles_hrefs) {
        if (profiles_hrefs[i].indexOf("profile.php?id") != -1) {
          var url = new URL(profiles_hrefs[i]);
          var uid = url.searchParams.get("id");
          profiles_href_list[i] = uid;
        } else {
          if (profiles_hrefs[i].indexOf("?__cft__") != -1) {
            profiles_href_list[i] = profiles_hrefs[i].slice(
              0,
              profiles_hrefs[i].indexOf("?__cft__")
            );
          } else {
            if (
              (profiles_hrefs[i],
              /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/.test(
                profiles_hrefs[i]
              ) == true)
            ) {
              console.log(
                profiles_hrefs[i],
                /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/.exec(
                  profiles_hrefs[i]
                )
              );
              profiles_href_list[i] =
                /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/.exec(
                  profiles_hrefs[i]
                )[0];
            }
          }
        }
      }
      chrome.runtime.sendMessage(
        { message: "profile_href_loaded", profiles_href: profiles_href_list },
        function (response) {
          console.log("profile_href_loaded");
        }
      );
    }
  }, 5000);
}

function send_profiles_list() {
  check_reaction_popup_status();
}
