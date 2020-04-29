export function jsonLoader(file) {
  var json = undefined;
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      json = JSON.parse(this.responseText);
    }
  };
  xmlhttp.open("GET", file, true);
  xmlhttp.send();

  function returnJson() {
    if (json == undefined) {
      setTimeout(setCv, 5);
    } else {
      return json;
    }
  }
  returnJson();
}
