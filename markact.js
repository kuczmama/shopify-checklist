// A better React and utils -- MarkAct.js

function h(nodeName, attributes, ...args) {
    let children = args.length ? [].concat(...args) : null;
    return {
        nodeName,
        attributes,
        children
    };
}

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function render(vnode) {
    if (vnode.split) return document.createTextNode(vnode);
    let n = document.createElement(vnode.nodeName);
    let as = vnode.attributes || {};
    for (let k in as){
          if(typeof as[k] === "function") {
            n[k] = as[k];
          } else {
            n.setAttribute(k, as[k]);
          }
        }
    (vnode.children || []).map(c => n.appendChild(render(c)));
    return n;
}

function get(url, success) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        if (request.status === 0 || request.status >= 200 && request.status < 400) {
          var resp = request.responseText;

          success(resp);
        }
    };
    request.send();
}

/**
* options:
*  - headers : true / false
*     - if true -> returns objects with headerName -> value
*     - else returns string[][]
*/
function readCSV(file, options={}) {
  return new Promise((resolve, reject) => {
    get(file, (rawData) => {
      let rows = rawData.split('\n');
      let result = [];
      let headers = [];
      let startIdx = 0;
      if(options.headers) {
        startIdx = 1;
        headers = rows[0].split(',');
      }

      for(let i = startIdx; i < rows.length; i++) {
        let splitted = rows[i].split(',');

        if(options.headers) {
          let row = {};
          headers.map((k, i) => row[k] = splitted[i]);
          result.push(row);
        } else {
          result.push(splitted);
        }
      }
      resolve(result.filter(r => r));
    })
  })
}
