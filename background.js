// addListener
chrome.runtime.onMessage.addListener((obj, sender, response) => {
  const { type, value, chatid, allMessageBoxes } = obj;

  console.log({ obj });

  if (type === "SETDATA") {
    console.log({ allMessageBoxes });
    chrome.storage.sync.set({
      ["message"]: JSON.stringify(allMessageBoxes),
    });
  }
});
