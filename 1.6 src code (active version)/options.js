// Saves options to chrome.storage.sync.
function save_options() {
  var difficulty = document.getElementById('difficulty').value;
  var closeAll = document.getElementById('closeTabCheckbox').checked;
  var profaneMsgStatus = document.getElementById('profanityCheckbox').checked;


  chrome.storage.sync.set({
    difficulty: difficulty,
    closeAll: closeAll,
    profaneMsgStatus: profaneMsgStatus

  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value difficulty='medium' and closeAll = true and profaneMsgStatus=false
  chrome.storage.sync.get({
    difficulty: 'medium',	// This string is value="" 
    closeAll: false,
    profaneMsgStatus: false

  }, function(items) {
    document.getElementById('difficulty').value = items.difficulty;
    document.getElementById('closeTabCheckbox').checked = items.closeAll;
    document.getElementById('profanityCheckbox').checked = items.profaneMsgStatus;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);