async function saveCardToAnki(card) {
  const note = {
    deckName: ANKI_DECK_NAME,
    modelName: ANKI_MODEL_NAME,
    fields: {
      Keyword: card.word,
      IMG: card.image,
      Definition: card.definition,
      Example: card.examples,
      Transcription: card.transcription,
      Sound: card.audioUrl,
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
          params: { note }
        }
      },
      (resp) => resolve(resp)
    );
  });
}
