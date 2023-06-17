const fetchBookmarks = (id = "message") => {
  console.log("hello");
  return new Promise((resolve) => {
    chrome.storage.sync.get(["message"], (obj) => {
      console.log({ obj });
      resolve(obj["message"] ? JSON.parse(obj["message"]) : []);
    });
  });
};

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

  newBookmarkElement.addEventListener("click", () => {
    console.log("clicked" + chatUser[0]);

    chrome.tabs.create({
      url: `https://messages.google.com/web/conversations/${chatUser[0]}`,
    });
  });
};

async function onDelete() {
  const chatid = e.target.parentNode.parentNode.getAttribute("timestamp");
  const bookmarkElementToDelete = document.getElementById("chatUser-" + chatid);

  bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);
  console.log("clicked");
}

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
