const search = document.getElementById("search");
const searchResults = document.getElementById("searchResults");

document.querySelector("button").addEventListener("click", result);

function result(e) {
  if (search.value.length > 0) {
    var option = document.getElementById("providers");
    var selected = option.options[option.selectedIndex].value;
    const result = search.value.replace(/ /g, "%20");
    var requestURL = `https://api.linkstore.eu.org/api/${selected}/${result}`;
    var request = new XMLHttpRequest();
    request.open("GET", requestURL, true);
    request.setRequestHeader('Content-Type', 'multipart/form-test');
    request.responseType = "json";

    if (request.readyState != 4) {
      document.querySelector(".spinner").style.display = "inline-block";
      document.querySelector(".searchText").style.display = "none";
      searchResults.innerHTML = '';
    }

    request.onload = function () {
      document.querySelector(".spinner").style.display = "none";
      document.querySelector(".searchText").style.display = "inline-block";
      var Response = this.response;
      if (Response.error != null) {
        console.error(Response.error);
        let error = Response.error;
        var div = document.createElement("div");
        div.innerHTML = `</br><i class="error">${error}</i>`;
        searchResults.appendChild(div);
      } else {
        let results = Response;
        for (let i in results) {
          var div = document.createElement("div");
          let rawresult = `<b>Name:</b> <a href='${results[i].Url}'>${results[i].Name}</a> </br>`;
          if (results[i].Files != null) {
            for (let j in results[i].Files) {
              rawresult += `</br><b>Quality:</b> ${results[i].Files[j].Quality} ${results[i].Files[j].Type} | <b>Size:</b> ${results[i].Files[j].Size}`;
              rawresult += `<div class='btns'>`;
              try {
                rawresult += `</br><button class="torrent" onclick="CopyToClipboard(\'${results[i].Files[j].Magnet}\')""><i class="fas fa-copy"></i> Copy Magnet link</a></button>`;
                rawresult += `<button class="torrent"><a href="http://t.me/share/url?url=${encodeURI(results[i].Files[j].Magnet)}"><i class="fab fa-telegram"></i> Send to Telegram</a></button>`;
              }
              catch {
                rawresult += `<div class='btns'>`;
                rawresult += `</br><button class="torrent" onclick="CopyToClipboard(\'${results[i].Files[j].Torrent}\')""><i class="fas fa-copy"></i> Copy link</a></button>`;
                rawresult += `<button class="torrent"><a href="http://t.me/share/url?url=${encodeURI(results[i].Files[j].Torrent)}"><i class="fab fa-telegram"></i> Send to Telegram</a></button>`;
              }
              rawresult += `</div>`;
            }
          } else {
            rawresult += `</br><b>Size:</b> ${results[i].Size} | `
            if (results[i].Leechers != null) {
              rawresult += `<b>Leechers:</b> ${results[i].Leechers} | `
            }
            rawresult += `<b>Seeders:</b> ${results[i].Seeders} </br>`
            rawresult += `<div class='btns'>`;
            try {
              rawresult += `<button class="torrent" onclick="CopyToClipboard(\'${results[i].Magnet}\')""><i class="fas fa-copy"></i> Copy Magnet link</a></button>
            <button class="torrent"><a href="http://t.me/share/url?url=${encodeURI(results[i].Magnet)}"><i class="fab fa-telegram"></i> Send to Telegram</a></button>`;
          }
          catch {
            rawresult += `<div class='btns'>`;
            rawresult += `<button class="torrent"><a href="${results[i].Torrent}"><i class="fas fa-download"></i> Download Torrent</a></button>`
            rawresult += `</div>`;
          };
          rawresult += `</div>`;
          }
          if (i == 200) {
            rawresult += `</br><i class="error">There is ${results.length} results we can show ${i} Only,</br>Please refine your search</i>`;
            div.innerHTML = rawresult;
            searchResults.appendChild(div);
            break;
          }
          div.innerHTML = `<div class='card'>` + rawresult + `</div></br>`;
          searchResults.appendChild(div);
        }
      }
    };
    request.send();
    e.preventDefault();
  } else {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "error",
      title: "Please enter a search term!",
      background: "black",
    });
    e.preventDefault();
  }
}


//Copy to clipboard

function CopyToClipboard(link) {
  var input = document.createElement("input");
  input.value = link;
  document.body.appendChild(input);
  input.select();
  var data = document.execCommand("copy");
  document.body.removeChild(input);
  if (data) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "success",
      title: "Copied successfully",
      background: "black",
    });
  }
}
