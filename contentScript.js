(() => {
  let currentParam;
  let currentChatBoxs = [];
  let tags = {};
  let currentParentDiv;

  // chrome.storage.local.clear();

  const fetchBookmarks = (id = "message") => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["message"], (obj) => {
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
    // submit button for set data in chrome storage
    submitButton.addEventListener("click", setDateWhenSubmit);
  };

  function displayTags(e) {
    chrome.storage.local.get("tags", function (data) {
      if (data.tags) tags = JSON.parse(data?.tags);

      // Access the specific data retrieved from localStorage

      let currentLink = e.target.id;
      const modalContainer = document.createElement("div");
      modalContainer.className = "modal-container";
      modalContainer.style.height = "50vh";
      modalContainer.style.width = "50vw";
      modalContainer.style.backgroundColor = "gray";
      modalContainer.innerHTML = "";
      const topDiv = document.createElement("div");
      const bodyDiv = document.createElement("div");
      bodyDiv.className = "bodyDiv";
      const closeButton = document.createElement("button");
      closeButton.className = "close-btn";
      closeButton.innerText = "X";
      topDiv.appendChild(closeButton);
      modalContainer.appendChild(topDiv);
      for (let tag in tags) {
        if (tags.hasOwnProperty(tag)) {
          const tagElement = document.createElement("div");
          tagElement.className = "tagElement";
          tagElement.textContent = tag;
          bodyDiv.appendChild(tagElement);
          e.target.role = tag;
          tagElement.addEventListener("click", () => {
            chrome.runtime.sendMessage({
              type: "ADDTOTAG",
              tag,
              currentLink,
            });
            displayTag();
          });
        }
      }
      modalContainer.appendChild(bodyDiv);
      document.body.appendChild(modalContainer);
      closeButton.addEventListener("click", function (event) {
        modalContainer.style.display = "none";
      });
    });
  }

  async function setDateWhenSubmit() {
    currentParam = window.location.href.split("/").slice(-1).join("");
    let name = document.getElementById("nickname-ext").value;
    currentChatBoxs = await fetchBookmarks();
    if (!currentChatBoxs.length) currentChatBoxs = [{}];
    const chatData = currentChatBoxs[0];
    chatData[currentParam] = name;
    chrome.runtime.sendMessage({
      type: "SETDATA",
      chatid: currentParam,
      allMessageBoxes: currentChatBoxs,
    });
    const modalContainer =
      document.getElementsByClassName("modal-container")[0];
    modalContainer.remove();
  }

  const displayTag = () => {
    chrome.storage.local.get("tags", function (data) {
      console.log({ data });
      if (data.tags) tags = JSON.parse(data?.tags);
      const parentDiv = document.querySelectorAll('div[role="gridcell"]')[0];
      if (parentDiv) {
        let previousSibling = parentDiv.querySelector("a");
        let currentLink = previousSibling.href;
        console.log(tags);
        for (let tag in tags) {
          if (tags.hasOwnProperty(tag)) {
            console.log(tag);
            console.log(currentLink, tags[tag]);
            if (tags[tag].includes(currentLink)) {
              console.log("exist");
              const tagElement = document.createElement("div");
              tagElement.className = "tagElement";
              tagElement.innerText = tag;
              parentDiv.appendChild(tagElement);
            }
          }
        }
      } else {
        setTimeout(displayTag, 100);
      }
    });
  };

  // display + button in chat
  const displayButton = () => {
    const observeParentDiv = () => {
      const parentDiv = document.querySelectorAll('div[role="gridcell"]')[0];
      if (parentDiv) {
        parentDiv.className = "gridcell";
        const addButton = document.createElement("img");
        addButton.src = chrome.runtime.getURL("assets/bookmark.png");
        addButton.className = "ext-add-to-list";
        addButton.style.height = "3rem";
        addButton.style.cursor = "pointer";
        addButton.title = "Click to add user in messenger extension";
        let previousSibling = parentDiv.querySelector("a");
        let currentLink = previousSibling.href;
        console.log({ previousSibling });
        addButton.id = currentLink;
        // parentDivs.forEach((parentDiv) => {
        //   const clonedButton = addButton.cloneNode(true);
        //   parentDiv.appendChild(clonedButton);
        // });
        parentDiv.appendChild(addButton);
        addButton.addEventListener("click", displayTags);
      } else {
        setTimeout(observeParentDiv, 100);
      }
    };

    const url = window.location.href.includes("https://www.messenger.com/");
    if (url) {
      observeParentDiv();
    }
  };
  displayButton();
  displayTag();
})();
