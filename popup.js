const get_uid = document.getElementById("get_uid");
const loader = document.getElementById("load");

get_uid.addEventListener("click", async () => {
  loader.style.display = "block";
  chrome.runtime.sendMessage(
    { message: "extension_cliked" },
    function (response) {
      console.log("extension_cliked");
    }
  );
});

chrome.runtime.onMessage.addListener((response, callback) => {
  if (response.message === "profile_href_loaded") {
    const profiles_href = response.profiles_href;
    const profiles_hrefs = {};
    var profiles_href_length = Object.keys(profiles_href).length;
    for (const i in profiles_href) {
      if (profiles_href[i].search("http") != -1) {
        const myRequest = new Request(profiles_href[i]);
        fetch(myRequest)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error, status = ${response.status}`);
            }
            return response.text();
          })
          .then((data) => {
            let uid = /"userID":"([^"]+)"/.exec(data);
            if (uid != null) {
              profiles_hrefs[i] = uid[1];
            } else {
              profiles_hrefs[i] = "";
              // profiles_href_length -= 1
            }
          })
          .catch((error) => {
            var h5 = document.createElement("h5");
            h5.appendChild(document.createTextNode(`Error: ${error.message}`));
            document.body.children[0].insertBefore(
              h5,
              document.body.children[0].children[5]
            );
          });
      } else {
        profiles_hrefs[i] = profiles_href[i];
      }
    }
    var time = setInterval(() => {
      if (profiles_href_length == Object.keys(profiles_hrefs).length) {
        clearInterval(time);
        var allEntries = ""      
        for (const i in profiles_hrefs) {
          allEntries = allEntries.concat(i + ' : ' + profiles_hrefs[i] + '\n');
          var no = document.createElement("td");
          var no_text = document.createTextNode(i);
          no.appendChild(no_text);
          var uid = document.createElement("td");
          var uid_text = document.createTextNode(profiles_hrefs[i]);
          uid.appendChild(uid_text);
          var tr = document.createElement("tr");
          tr.appendChild(no);
          tr.appendChild(uid);
          var element = document.getElementById("list_of_uid");
          element.appendChild(tr);
        }
        loader.style.display = "none";
        const blob = new Blob([allEntries], {
          type: 'text/plain',
        });
        var url = URL.createObjectURL(blob);
        chrome.runtime.sendMessage(
          { message: "txt_file_ready", url_blob: url },
          function (response) {
            console.log("txt_file_ready");
          }
        );
        /* Create worksheet from HTML DOM TABLE */
        var wb = XLSX.utils.table_to_book(document.getElementById("uid_table"));
        /* Export to file (start a download) */
        XLSX.writeFile(wb, "PageReact/SheetJSTable.xlsx");
      }
    });
  }
});
