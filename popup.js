document.getElementById('start').addEventListener('click', () => {
  const times = parseInt(document.getElementById('times').value);
  const delay = parseInt(document.getElementById('delay').value) * 1000; // Convert to milliseconds
  const status = document.getElementById('status');
  const searchLeftElem = document.getElementById('search-left');
  const searchTotalElem = document.getElementById('search-total');
  const searchInfoElem = document.getElementById('search-info');

  if (isNaN(times) || times <= 0 || isNaN(delay) || delay <= 0) {
    status.textContent = 'Please enter valid numbers for both fields.';
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentURL = new URL(tabs[0].url);
    if (currentURL.hostname === "www.bing.com" && currentURL.pathname === "/search") {
      chrome.storage.local.set({ times: times, delay: delay });
      searchTotalElem.textContent = times;
      searchLeftElem.textContent = times;
      searchInfoElem.style.display = 'block'; // Show the searches left info
      chrome.runtime.sendMessage({ action: 'startSearch' });
      status.textContent = '';  // Clear previous error messages
    } else {
      status.textContent = 'Error: Not a Bing search page.';
    }
  });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'updateSearchCount') {
    const searchLeftElem = document.getElementById('search-left');
    
    chrome.storage.local.get(['times'], function(result) {
      searchLeftElem.textContent = result.times;
    });
  }
});
