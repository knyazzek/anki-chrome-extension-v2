// Fetch media file and convert to base64
async function fetchMediaAsBase64(url) {
  if (!url) return null;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    const base64 = btoa(binary);
    const filename = url.split("/").pop().split("?")[0];
    return { base64, filename };
  } catch (error) {
    console.error("Error fetching media:", error);
    return null;
  }
}

async function saveCardToAnki(card) {
  // Fetch media files before sending to background
  let soundData = null;
  let imageData = null;
  
  if (card.audioUrl) {
    soundData = await fetchMediaAsBase64(card.audioUrl);
  }
  
  if (card.image) {
    imageData = await fetchMediaAsBase64(card.image);
  }
  
  const note = {
    deckName: ANKI_DECK_NAME,
    modelName: ANKI_MODEL_NAME,
    fields: {
      Keyword: card.word,
      IMG: imageData ? imageData.filename : "",
      Definition: card.definition,
      Example: (function() {
        const raw = (card.examples || "").trim();
        if (!raw) return "";
        return raw.replace(/\n/g, '<br>').replace(/(?:<br>)+$/,'');
      })(),
      Transcription: card.transcription,
      Sound: soundData ? soundData.filename : "",
      Russian: card.translation
    },
    options: {
      allowDuplicate: false
    },
    tags: []
  };

  console.log(note)

  return await new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: "addAnkiCard",
        body: {
          action: "addNote",
          version: 6,
          params: { note },
          mediaData: {
            sound: soundData,
            image: imageData
          }
        }
      },
      (resp) => resolve(resp)
    );
  });
}
