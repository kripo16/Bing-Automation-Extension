function getRandomWord() {
    const words = ["apple", "banana", "cherry", "date", "elderberry"];
    return words[Math.floor(Math.random() * words.length)];
}
  
function modifyBingSearchURL(times, delay) {
    let count = 0;
  
    function performSearch() {
      if (count >= times) return;
  
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        const currentURL = new URL(currentTab.url);
  
        if (currentURL.hostname === "www.bing.com" && currentURL.pathname === "/search") {
          let searchParams = new URLSearchParams(currentURL.search);
          const randomWord = getRandomWord();
          searchParams.set("q", randomWord);
          const newURL = `${currentURL.origin}${currentURL.pathname}?${searchParams.toString()}`;
  
          chrome.tabs.update(currentTab.id, { url: newURL });
          count++;
          chrome.storage.local.set({ times: times - count });
          chrome.runtime.sendMessage({ action: 'updateSearchCount' });
          setTimeout(performSearch, delay);
        }
      });
    }
  
    performSearch();
}
  
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'startSearch') {
      chrome.storage.local.get(['times', 'delay'], function(result) {
        const { times, delay } = result;
        modifyBingSearchURL(times, delay);
      });
    }
});
