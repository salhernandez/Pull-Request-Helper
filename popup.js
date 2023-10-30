var storage = chrome.storage.local;

const SAMPLE_OBJ = {
    "<URL>": {
        "id": "<id>",
        "data": "<data>"
    }
}

// When Chrome Extension popup fully loads
window.addEventListener('load', () => {
//   checkInstallType();
//   updateUI();
//   let emojiButton = document.getElementById('checkbox');
//   if (emojiButton) {
//     emojiButton.addEventListener('change', onSwitchChange);
//   }
});

// When a tab is finished loading
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status == 'complete') {
    // storage.get('options', (items) => {
    //   if (items.options.userOptions.replaceWithEmojis) {
    //     chrome.tabs.executeScript(tabId, {
    //       file: "replaceText.js"
    //     }, () => {
    //       // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    //       if (chrome.runtime.lastError) {
    //         // message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    //         console.log('There was an error injecting script : \n' + chrome.runtime.lastError.message);
    //       }
    //     });
    //   }
    // });

    
  storage.get(window.location.origin + window.location.pathname, (items) => {
    console.log("reading contents of tratch", items[window.location.origin + window.location.pathname]);
  });

    // SEND MESSAGE - 3
    chrome.runtime.onMessage.addListener(function(request, sender) {
        if (request.type == "PRH_MESSAGE"){
            console.log("tehee", request.options.details);
            chrome.storage.local.set({
                [request.options.details.url]: {
                    "id": request.options.details.id,
                    "data": request.options.details.dataToSave
                }
            });
        }   
    });

    console.log("executing script");
    chrome.tabs.executeScript(tabId, {
        file: "replaceText.js"
      }, () => {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
          // message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
          console.log('There was an error injecting script : \n' + chrome.runtime.lastError.message);
        }
      });
  }
})

onSwitchChange = (event) => {
  let emojiButton = document.getElementById('checkbox');
  let value = event.target.checked;
  if (emojiButton) {
    updateData("replaceWithEmojis", value)
    emojiButton.checked = value;
    document.getElementById("popup-message").innerText = "refresh page to see changes";
  }
}

checkInstallType = () => {
  storage.get("freshInstall", (items) => {
    //not a fresh install
    if (items.freshInstall === false) {

    } else { //fresh install
      chrome.storage.local.set({
        "freshInstall": false
      }, function () {
        let anObject = {
          userOptions: {
            replaceWithEmojis: true
          }
        }

        //set value
        storage.set({
          'options': anObject
        });
      });
    }
  });
}

updateUI = () => {
  storage.get('options', (items) => {
    if (items.options) {
      let emojiButton = document.getElementById('checkbox');
      if (emojiButton) {
        if (items.options.userOptions.replaceWithEmojis) {
          emojiButton.checked = true;
        } else {
          emojiButton.checked = false;
        }
      }
    }
  });
}

updateData = (uType, uValue) => {
  let tempOptions = {};

  storage.get('options', (items) => {
    //if the object has been created before
    if (items.options) {
      //store options object
      tempOptions = items.options;
      //update value
      tempOptions.userOptions[uType] = uValue;
      //set value
      storage.set({
        'options': tempOptions
      });
    }

    //if the object has not been created before
    else {
      tempOptions = {
        userOptions: {
          replaceWithEmojis: true
        }
      }
      //update the object
      tempOptions.userOptions[uType] = uValue;

      //set value
      storage.set({
        'options': tempOptions
      });
    }
  });
}