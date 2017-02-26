if (confirm('Open dialog for testing?'))
    chrome.runtime.sendMessage({type:'request_password'});	// Send message to background script