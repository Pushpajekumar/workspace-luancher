const my_Workspace_Name = document.getElementById("workspace_Name");

chrome.storage.local.set(
  {
    name: [
      {
        name: "social",
        url: [
          "https://www.google.com",
          "https://www.facebook.com",
          "https://www.pushpaje.com",
        ],
      },
      {
        name: "work",
        url: [
          "https://www.localhost.com",
          "https://www.abnlab.com",
          "https://www.nothing.com",
        ],
      },
      {
        name: "randome",
        url: [
          "https://www.1c.com",
          "https://www.nothingishere.com",
          "https://www.hey.com",
        ],
      },
    ],
  },
  () => {
    console.log("Value is set");
  }
);

chrome.storage.local.get(["name"], (result) => {
  const myUrls = result.name[0].url;
  console.log(myUrls);

  myUrls.forEach((element) => {
    chrome.tabs.create({
      url: element,
    });
  });
});
