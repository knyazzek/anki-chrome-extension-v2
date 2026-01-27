(async function () {
  card = new Card();
  
  popup = await Popup.create(htmlFilePath="src/ui/popup.html", card=card)
  popup.inject()

  dictionaryHandler = new CambrdgeDictionaryHandler(card);
  dictionaryHandler.injectButtons();
})();
