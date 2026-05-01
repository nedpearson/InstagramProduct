document.addEventListener('DOMContentLoaded', async () => {
  const btnScreenshot = document.getElementById('btn-screenshot');
  const btnStartRecord = document.getElementById('btn-start-record');
  const btnStopRecord = document.getElementById('btn-stop-record');
  const defaultView = document.getElementById('default-view');
  const recordingView = document.getElementById('recording-view');
  const statusEl = document.getElementById('status');

  // Check current recording state
  const { isRecording } = await chrome.storage.local.get('isRecording');
  if (isRecording) {
    defaultView.style.display = 'none';
    recordingView.style.display = 'block';
    statusEl.textContent = 'Recording in progress...';
    statusEl.classList.add('success-text');
  }

  // Handle Screenshot
  btnScreenshot.addEventListener('click', async () => {
    statusEl.textContent = 'Capturing...';
    statusEl.classList.remove('success-text');
    
    try {
      const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
      
      const filename = `bridgebox_capture_${Date.now()}.png`;
      await chrome.downloads.download({
        url: dataUrl,
        filename: filename,
        saveAs: false
      });
      
      statusEl.textContent = 'Screenshot saved!';
      statusEl.classList.add('success-text');
      
      setTimeout(() => {
        statusEl.textContent = 'Ready to capture.';
        statusEl.classList.remove('success-text');
      }, 3000);
    } catch (e) {
      statusEl.textContent = 'Failed to capture screenshot.';
      console.error(e);
    }
  });

  // Handle Start Recording
  btnStartRecord.addEventListener('click', () => {
    chrome.desktopCapture.chooseDesktopMedia(
      ['screen', 'window', 'tab'],
      (streamId) => {
        if (!streamId) {
          statusEl.textContent = 'Capture cancelled.';
          return;
        }

        statusEl.textContent = 'Starting recording...';
        
        // Send message to background to start
        chrome.runtime.sendMessage({ action: 'start_recording', streamId }, (response) => {
          if (response && response.success) {
            defaultView.style.display = 'none';
            recordingView.style.display = 'block';
            statusEl.textContent = 'Recording in progress...';
            statusEl.classList.add('success-text');
            chrome.storage.local.set({ isRecording: true });
          } else {
            statusEl.textContent = 'Failed to start recording.';
            console.error(response?.error);
          }
        });
      }
    );
  });

  // Handle Stop Recording
  btnStopRecord.addEventListener('click', () => {
    statusEl.textContent = 'Saving recording...';
    statusEl.classList.remove('success-text');
    
    chrome.runtime.sendMessage({ action: 'stop_recording' }, (response) => {
      defaultView.style.display = 'block';
      recordingView.style.display = 'none';
      chrome.storage.local.set({ isRecording: false });
      
      if (response && response.success) {
        statusEl.textContent = 'Recording saved!';
        statusEl.classList.add('success-text');
      } else {
        statusEl.textContent = 'Failed to save recording.';
        console.error(response?.error);
      }
      
      setTimeout(() => {
        statusEl.textContent = 'Ready to capture.';
        statusEl.classList.remove('success-text');
      }, 3000);
    });
  });
});
