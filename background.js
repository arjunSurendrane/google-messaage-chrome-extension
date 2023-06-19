// addListener
chrome.runtime.onMessage.addListener((obj, sender, response) => {
  const { type, value, chatid, allMessageBoxes } = obj;
  if (type === "SETDATA") {
    chrome.storage.sync.set({
      ["message"]: JSON.stringify(allMessageBoxes),
    });
  }
});
