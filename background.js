chrome.runtime.onMessage.addListener(async (response, callback) => {
  if (response.message === "extension_cliked") {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { message: "clicked_browser_action" });
  }
});

// chrome.runtime.onMessage.addListener((response, callback) => {
//     if (response.message === "profile_href_loaded") {
//         profiles_href = response.profiles_href
//         chrome.storage.sync.set({ profiles_href });
//         chrome.runtime.sendMessage(
//             { message: "profile_href_loaded_to_popup"},
//             function (response) {
//                 console.log("profile_href_loaded_to_popup");
//             }
//         );
//     }
// });

chrome.runtime.onMessage.addListener((response, callback) => {
  if (response.message === "txt_file_ready") {
    console.log("txt_file_ready");
    const url_blob = response.url_blob;
    download(url_blob, "UID's list of people who had reacted");
  }
});

function onStartedDownload(id) {
  console.log(`Started downloading: ${id}`);
}

function onFailed(error) {
  console.log(`Download failed: ${error}`);
}

function download(url, filename) {
  chrome.downloads
    .download({
      url: url,
      filename: "PageReact/" + filename + ".txt",
      conflictAction: "uniquify",
    })
    .then(onStartedDownload, onFailed);
}
