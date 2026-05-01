let mediaRecorder;
let recordedChunks = [];
let stream;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start_offscreen_recording') {
    startRecording(message.streamId)
      .then(() => sendResponse({ success: true }))
      .catch((e) => sendResponse({ success: false, error: e.toString() }));
    return true;
  }

  if (message.action === 'stop_offscreen_recording') {
    stopRecording();
    sendResponse({ success: true });
    return true;
  }
});

async function startRecording(streamId) {
  try {
    // Get the desktop media stream using the streamId
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: streamId
        }
      },
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: streamId
        }
      }
    });

    // If audio fails, fallback to video only
  } catch (err) {
    console.warn('Failed to get audio, falling back to video only.', err);
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: streamId
        }
      }
    });
  }

  // Handle native "Stop Sharing" button click
  stream.getVideoTracks()[0].onended = () => {
    stopRecording();
    chrome.runtime.sendMessage({ action: 'recording_stopped_natively' });
  };

  recordedChunks = [];
  mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    
    const filename = `bridgebox_recording_${Date.now()}.webm`;

    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: false
    });

    // Revoke URL after a delay to ensure download starts
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 10000);
  };

  mediaRecorder.start();
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}
