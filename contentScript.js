(() => {
  let currentParam;
  let currentChatBoxs = [];

  const fetchBookmarks = (id = "message") => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["message"], (obj) => {
        console.log({ obj });
        resolve(obj["message"] ? JSON.parse(obj["message"]) : []);
      });
    });
  };
  const createModal = () => {
    // Create modal container
    const modalContainer = document.createElement("div");
    modalContainer.className = "modal-container";
    modalContainer.style.height = "50vh";
    modalContainer.style.width = "50vw";
    modalContainer.style.backgroundColor = "white";

    const closeButton = document.createElement("button");
    closeButton.className = "close-btn";
    closeButton.innerText = "X";

    const submitButton = document.createElement("button");
    submitButton.className = "submit-btn";
    submitButton.type = "submit";
    submitButton.innerText = "Create";

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    const nickNameBox = document.createElement("input");
    nickNameBox.id = "nickname-ext";
    nickNameBox.type = "text";
    nickNameBox.placeholder = "Enter the nickname";

    // Append modal content to modal container
    modalContainer.appendChild(closeButton);
    modalContainer.appendChild(modalContent);
    modalContainer.appendChild(nickNameBox);
    modalContainer.appendChild(submitButton);

    // Append modal container to the body
    document.body.appendChild(modalContainer);

    // Close the modal when clicking outside the content
    closeButton.addEventListener("click", function (event) {
      modalContainer.style.display = "none";
    });

    submitButton.addEventListener("click", setDateWhenSubmit);
  };

  async function setDateWhenSubmit() {
    currentParam = window.location.href.split("/").slice(-1).join("");
    let name = document.getElementById("nickname-ext").value;
    console.log(name, currentParam);
    currentChatBoxs = await fetchBookmarks();
    if (!currentChatBoxs.length) currentChatBoxs = [{}];
    const chatData = currentChatBoxs[0];
    chatData[currentParam] = name;
    // chrome.storage.sync.set({
    //   ["message"]: JSON.stringify(currentChatBoxs),
    // });
    chrome.runtime.sendMessage({
      type: "SETDATA",
      chatid: currentParam,
      allMessageBoxes: currentChatBoxs,
    });
    console.log({ currentChatBoxs });
    const modalContainer =
      document.getElementsByClassName("modal-container")[0];
    modalContainer.remove();
  }

  // display + button in chat
  const displayButton = () => {
    const addButton = document.createElement("img");
    addButton.src = chrome.runtime.getURL("assets/bookmark.png");
    addButton.className = "ext-add-to-list";
    addButton.style.height = "3rem";
    addButton.style.cursor = "pointer";
    addButton.title = "Click to add user in messenger extension";

    const observeParentDiv = () => {
      const parentDiv = document.querySelector(".right-content");
      if (parentDiv) {
        parentDiv.appendChild(addButton);
      } else {
        setTimeout(observeParentDiv, 100);
      }
    };

    addButton.addEventListener("click", createModal);

    const url = window.location.href.includes(
      "messages.google.com/web/conversations"
    );

    if (url) {
      observeParentDiv();
    }
  };

  displayButton();
})();
