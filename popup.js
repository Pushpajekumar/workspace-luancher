const closeButton = document.getElementById("close");
closeButton.addEventListener("click", () => {
  window.close();
});

const myValue = [];

// chrome.storage.local.clear();

// Function to render a message when there are no workspaces
const renderNoWorkspaceMessage = (container) => {
  container.innerHTML =
    "<p class='no_workspaces_message'>No workspaces available.</p>";
};

// Function to render workspaces in the specified container as a list
const renderWorkspaces = (workspaces, container) => {
  container.innerHTML = ""; // Clear previous content

  const workspaceList = document.createElement("ul");
  workspaceList.classList.add("workspace_list"); // Add a class for styling

  workspaces.forEach((workspace, index) => {
    const workspaceItem = document.createElement("li");
    workspaceItem.classList.add("workspace_item"); // Add a class for styling

    // Create a container for the workspace content
    const contentContainer = document.createElement("div");
    contentContainer.classList.add("workspace_content");

    // Display workspace name
    const workspaceName = document.createElement("span");
    workspaceName.textContent = ` ${workspace.myName} `;
    contentContainer.appendChild(workspaceName);

    // Add input field for editing URLs (hidden by default)
    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.placeholder = "Add URL";
    urlInput.classList.add("url_input");
    urlInput.style.display = "none"; // Hide the input box initially
    contentContainer.appendChild(urlInput);

    // Add button to add URL (hidden by default)
    const addButton = document.createElement("button");
    addButton.textContent = "Add URL";
    addButton.classList.add("add_button");
    addButton.style.display = "none"; // Hide the button initially
    addButton.addEventListener("click", () => {
      // Handle adding URL to the workspace logic here
      const newURL = urlInput.value.trim();
      if (newURL) {
        chrome.storage.local.get(["name"], (res) => {
          const myAllWorkspaces = res.name;
          myAllWorkspaces[index].urls.push(newURL);
          chrome.storage.local.set({ name: myAllWorkspaces });
          // chrome.storage.local.get(["name"], (res) => {
          //   console.log("🟢🟢🟢🟢🟢🟢🟢🟢", res.name);
          // });
          alert(`URL ${newURL} added to ${workspace.myName}`);
          console.log(`Added URL ${newURL} to ${workspace.myName}`);
          urlInput.style.display = "none";
          addButton.style.display = "none";
        });
      }
    });
    contentContainer.appendChild(addButton);

    // Add icon for editing URLs (on the right side)
    const editIcon = document.createElement("span");
    editIcon.innerHTML = "&#9998;"; // You can use any icon here
    editIcon.classList.add("edit_icon");
    editIcon.addEventListener("click", () => {
      // Toggle visibility of the URL input box and the "Add URL" button
      urlInput.style.display =
        urlInput.style.display === "none" ? "inline-block" : "none";
      addButton.style.display =
        addButton.style.display === "none" ? "inline-block" : "none";
    });
    contentContainer.appendChild(editIcon);

    // Add click event listener to the workspace item
    workspaceName.addEventListener("click", () => {
      console.log(`Workspace ${workspace.myName} clicked`);
      chrome.storage.local.get(["name"], (res) => {
        const workspaces = res.name;
        const toLaunchWorkspace = workspaces[index];
        const launchingUrls = toLaunchWorkspace.urls;
        console.log("❤️❤️❤️❤️❤️❤️", launchingUrls);
        launchingUrls.forEach((url) => {
          chrome.tabs.create({ url });
        });
      });
    });

    // Apply custom styling to list items based on the index (for demonstration)
    if (index % 2 === 0) {
      workspaceItem.classList.add("even_item");
    } else {
      workspaceItem.classList.add("odd_item");
    }

    workspaceItem.appendChild(contentContainer);
    workspaceList.appendChild(workspaceItem);
  });

  container.appendChild(workspaceList);
};

// It checks if the workspace exists or not; if not, it creates a blank workspace
chrome.storage.local.get(["name"], (res) => {
  const myWorkspaces = res.name;
  console.log("🟢🟡🔴", myWorkspaces);
  if (!myWorkspaces) {
    chrome.storage.local.set({ name: myValue });
  }

  // Note: Use `res.name` instead of `myWorkspaces` to avoid shadowing the outer variable
  chrome.storage.local.get(["name"], (res) => {
    const workspaceContainer = document.getElementById("my_Workspaces");
    if (!res.name || res.name.length === 0) {
      renderNoWorkspaceMessage(workspaceContainer);
    } else {
      renderWorkspaces(res.name, workspaceContainer);
    }
  });
});

// Create Workspace
const createWorkspace = (workspaceName) => {
  console.log(workspaceName);
  chrome.storage.local.get(["name"], (res) => {
    const currentWorkspace = res.name;
    const workspace = {
      myName: workspaceName,
      urls: [],
      createdAt: Date.now(),
    };
    currentWorkspace.push(workspace);
    chrome.storage.local.set({ name: currentWorkspace }, () => {
      const workspaceContainer = document.getElementById("my_Workspaces");
      chrome.storage.local.get(["name"], (res) => {
        renderWorkspaces(res.name, workspaceContainer);
      });
    });
  });
};

const addWorkspaceButton = document.getElementById("create_Workspace");

addWorkspaceButton.addEventListener("click", () => {
  const getWorkspaceName = document
    .getElementById("workspace_Name")
    .value.trim()
    .toLowerCase();
  createWorkspace(getWorkspaceName);
});
