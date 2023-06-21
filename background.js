// addListener
chrome.runtime.onMessage.addListener((obj, sender, response) => {
  console.log("Message recieved");
  const { type, value, chatid, allMessageBoxes, tags, currentLink, tag } = obj;
  if (type === "SETDATA") {
    chrome.storage.sync.set({
      ["message"]: JSON.stringify(allMessageBoxes),
    });
  } else if (type === "STORE") {
    console.log("here");
    chrome.storage.local.set({ tags: JSON.stringify(tags) }, function () {
      console.log("Data has been saved to localStorage");
    });
  } else if (type === "ADDTOTAG") {
    chrome.storage.local.get("tags", function (data) {
      let tags = JSON.parse(data.tags);
      tags[tag].push(currentLink);
      chrome.storage.local.set({ tags: JSON.stringify(tags) });
    });
  }
});
