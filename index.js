const addNewBookmark = (rootElement, chatUser) => {
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
    console.log("clicked" + chatUser[0]);

    chrome.tabs.create({
      url: `https://messages.google.com/web/conversations/${chatUser[0]}`,
    });
  });
};

// async function onDelete(e) {
//   console.log(e.target.parentNode.parentNode.getAttribute("timestamp"));
//   const chatid = e.target.parentNode.parentNode.getAttribute("timestamp");
//   const bookmarkElementToDelete = document.getElementById("chatUser-" + chatid);
//   bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

//   //   chrome.storage.sync.get(["message"], (obj) => {
//   //     const currentChatBoxs = obj["message"] ? JSON.parse(obj["message"]) : [];
//   //     let messageList = currentChatBoxs[0];
//   //     delete messageList[chatid];
//   //     console.log(messageList);
//   //   });
// }

function viewBookmarks(currentMessageList = []) {
  const rootElement = document.getElementById("root");
  rootElement.innerHTML = "";

  if (currentMessageList.length > 0) {
    const messageList = Object.entries(currentMessageList[0]);
    for (let i = 0; i < messageList.length; i++) {
      const messageBox = messageList[i];
      addNewBookmark(rootElement, messageBox); // messageBos = ["id","name"]
    }
  } else {
    bookmarksElement.innerHTML = '<i class="row">No Chat list to show</i>';
  }

  return;
}

document.addEventListener("DOMContentLoaded", async () => {
  chrome.storage.sync.get(["message"], (obj) => {
    const currentMessageList = obj["message"] ? JSON.parse(obj["message"]) : [];

    viewBookmarks(currentMessageList);
  });
});
