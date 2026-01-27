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

// Fetches a media file and stores it in Anki
async function fetchAndStoreMediaFile(url) {
  const response = await fetch(url);

  console.log("fetchAndStoreMediaFile")
  console.log(url)
  console.log(response)

  if (!response.ok) {;
    throw new Error(`Failed to fetch media file: ${url}`);
  }

  const buffer = await response.arrayBuffer();
  const base64 = arrayBufferToBase64(buffer);

  // Extract filename from URL
  filename = url.split("/").pop().split("?")[0];
  await ankiRequest("storeMediaFile", {
    filename,
    data: base64,
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
      if (!note) {
        throw new Error("Invalid note payload");
      }

      console.log(0)

      const soundField = note.fields?.Sound;
      if (soundField) {
        filename = await fetchAndStoreMediaFile(soundField);
        note.fields.Sound = `[sound:${filename}]`;
      }

      console.log(1)

      const imageField = note.fields?.IMG;
      if (imageField) {
        filename = await fetchAndStoreMediaFile(imageField);
        note.fields.IMG = `<img src="${filename}">`
      }

      console.log(2)

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
