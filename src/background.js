// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SET_EMAIL_FOR_SIGN_IN") {
      chrome.storage.local.set({ emailForSignIn: message.email });
      chrome.storage.local.set({ tabext: sender.tab });
      console.log("SET_EMAIL_FOR_SIGN_IN", message.email);
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      const emailLink = changeInfo.url;
      const urlOrigin = new URL(emailLink).origin;
      const extensionOrigin = "http://localhost"; // Replace with your extension's origin

      console.log("urlOrigin", urlOrigin);

      if (urlOrigin === extensionOrigin) {
        // Get email from local storage
        chrome.storage.local.get("emailForSignIn", (data) => {
          const email = data.emailForSignIn;
          // Send a message to the content script with emailLink and email
          chrome.storage.local.get("tabext", (data1) => {
            chrome.tabs.sendMessage(data1.tabext.id, {
              type: "emailLink",
              emailLink,
              email,
            });
          });
        });
      }
    }
});
