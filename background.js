chrome.tabs.onUpdated.addListener((tabid, tab) => {
  if (
    tab.url &&
    tab.url.includes("*/messages.google.com/web/conversations/*")
  ) {
    chrome.tabs.sendMessage(tabid, {
      type: "NEW",
    });
  }
});
