chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isRecording: false });
});

async function setupOffscreenDocument(path) {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [chrome.runtime.getURL(path)]
  });

  if (existingContexts.length > 0) {
    return;
  }

  await chrome.offscreen.createDocument({
    url: path,
    reasons: ['DISPLAY_MEDIA'],
    justification: 'Screen recording for Bridgebox Voice captures'
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start_recording') {
    (async () => {
      try {
        await setupOffscreenDocument('offscreen.html');
        // Forward message and streamId to offscreen doc
        chrome.runtime.sendMessage(
          { action: 'start_offscreen_recording', streamId: message.streamId }, 
          (res) => {
            if (chrome.runtime.lastError) {
              sendResponse({ success: false, error: chrome.runtime.lastError.message });
            } else {
              sendResponse({ success: true });
            }
          }
        );
      } catch (e) {
        sendResponse({ success: false, error: e.toString() });
      }
    })();
    return true; // Keep channel open
  }

  if (message.action === 'stop_recording') {
    chrome.runtime.sendMessage({ action: 'stop_offscreen_recording' }, (res) => {
      chrome.storage.local.set({ isRecording: false });
      sendResponse({ success: true });
    });
    return true;
  }
});

// Listen for self-termination (e.g. user clicks "Stop Sharing" on the native Chrome UI)
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'recording_stopped_natively') {
    chrome.storage.local.set({ isRecording: false });
    chrome.offscreen.closeDocument().catch(console.error);
  }
});
