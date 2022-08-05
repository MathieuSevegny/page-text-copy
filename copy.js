chrome.storage.sync.get(['data'], function(result) {
  Copy(result.data)
});

function Copy(sites){
  const url = window.location.href;
  for (const site of sites) {
    if (!url.includes(site.url)) continue;

    let content = ""

    for (let i = 0; i < site.paths.length; i++) {
      if (i !== 0){content += site.separator}
	  
      let element = getElementByXpath(site.paths[i].path);
      if (element === null){
        continue;
      }

      let nodeType = element.nodeName
      let propertyName = "textContent"
      if (nodeType === "INPUT"){
        propertyName = "value"
      }
      let text = element[propertyName]
	    
      content += text.trim()
    }
    //Adds the content to clipboard
    navigator.clipboard.writeText(content)

    break;
  }
}


function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

//*[@id="__bolt-textfield-input-1"]