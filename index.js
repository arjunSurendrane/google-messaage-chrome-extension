let allMessageBoxes;
//this function fetch the data from the chrome storage
const fetchBookmarks = (id = "message") => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["message"], (obj) => {
      resolve(obj["message"] ? JSON.parse(obj["message"]) : []);
    });
  });
};
// add new name tag for the user chat
const addNewNameTag = (rootElement, chatUser) => {
  const bookmarkTitleElement = document.createElement("div");
  const controlsElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");
  const title = document.createElement("h3");
  const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");
    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.className = "chatUser-control";
    controlElement.addEventListener("click", eventListener);
    controlParentElement.appendChild(controlElement);
  };
  title.innerText = chatUser[1];
  bookmarkTitleElement.appendChild(title);
  bookmarkTitleElement.className = "chatUser-title";
  controlsElement.className = "chatUser-controls";
  //   setBookmarkAttributes("edit", onEdit, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);
  newBookmarkElement.id = "chatUser-" + chatUser[0];
  newBookmarkElement.className = "chatUser";
  newBookmarkElement.setAttribute("timestamp", chatUser[0]);
  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlsElement);
  rootElement.appendChild(newBookmarkElement);
  bookmarkTitleElement.addEventListener("click", () => {
    chrome.tabs.create({
      url: `https://messages.google.com/web/conversations/${chatUser[0]}`,
    });
  });
};
// delte user name tag in popup
async function onDelete(e) {
  const chatid = e.target.parentNode.parentNode.getAttribute("timestamp");
  const bookmarkElementToDelete = document.getElementById("chatUser-" + chatid);
  bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);
  const message = allMessageBoxes[0];
  delete message[chatid];
  chrome.runtime.sendMessage({
    type: "SETDATA",
    chatid,
    allMessageBoxes,
  });
}
// create chat boxes with name tag
function viewNameBox(currentMessageList = []) {
  const rootElement = document.getElementById("root");
  rootElement.innerHTML = "";
  if (currentMessageList.length > 0) {
    const messageList = Object.entries(currentMessageList[0]);
    for (let i = 0; i < messageList.length; i++) {
      const messageBox = messageList[i];
      addNewNameTag(rootElement, messageBox); // messageBos = ["id","name"]
    }
  } else {
    bookmarksElement.innerHTML = '<i class="row">No Chat list to show</i>';
  }
  return;
}
// create event listener for dom content load
document.addEventListener("DOMContentLoaded", async () => {
  chrome.storage.sync.get(["message"], (obj) => {
    allMessageBoxes = obj["message"] ? JSON.parse(obj["message"]) : [];
    viewNameBox(allMessageBoxes);
  });
});
