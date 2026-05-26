importScripts("/src/config.js");

// Generic AnkiConnect request helper
async function ankiRequest(action, params) {
  const response = await fetch(ANKI_CONNECT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action,
      version: 6,
      params,
    }),
  });

  console.log("ankiRequest")
  console.log(response)

  return response.json();
}

// Converts an ArrayBuffer to base64 safely
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

// Stores a media file (provided as base64) in Anki
async function storeMediaFile(filename, base64Data) {
  console.log("storeMediaFile");
  console.log(filename);
  
  if (!base64Data) return null;
  
  await ankiRequest("storeMediaFile", {
    filename,
    data: base64Data,
  });
  
  return filename;
}

// Chrome message handler
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "addAnkiCard") {
    return;
  }

  (async () => {
    try {
      const note = message.body?.params?.note;
      const mediaData = message.body?.mediaData;
      
      if (!note) {
        throw new Error("Invalid note payload");
      }

      console.log(0);

      // Store sound file if provided
      if (mediaData?.sound) {
        const filename = await storeMediaFile(mediaData.sound.filename, mediaData.sound.base64);
        note.fields.Sound = `[sound:${filename}]`;
      }

      console.log(1);

      // Store image file if provided
      if (mediaData?.image) {
        const filename = await storeMediaFile(mediaData.image.filename, mediaData.image.base64);
        note.fields.IMG = `<img src="${filename}">`;
      }

      console.log(2);

      const result = await ankiRequest("addNote", { note });
      sendResponse(result);
      return;

    } catch (error) {
      sendResponse({ error: error.message });
    }
  })();

  // Required to keep the message channel open for async response
  return true;
});
