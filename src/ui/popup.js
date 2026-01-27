class Popup {
  constructor(panel) {
    this.panel = panel;
  }

  static async create(htmlFilePath, card) {
    const panelHTML = await fetch(chrome.runtime.getURL(htmlFilePath)).then(r => r.text());
    const temp = document.createElement('div');
    temp.innerHTML = panelHTML;
    const panel = temp.querySelector('#anki-extension-root');

    // After a short delay, enable transition for later toggles
    setTimeout(() => {
      panel.classList.remove('anki-panel-no-transition');
    }, 50);

    // Get all form elements
    const elements = {
      word: panel.querySelector('#anki-keyword'),
      audioUrl: panel.querySelector('#anki-sound'),
      transcription: panel.querySelector('#anki-transcription'),
      definition: panel.querySelector('#anki-definition'),
      examples: panel.querySelector('#anki-examples'),
      translation: panel.querySelector('#anki-russian'),
      image: panel.querySelector('#anki-img')
    };

    // Setup two-way binding: Form → Card
    for (const [key, element] of Object.entries(elements)) {
      console.log("Setup two-way binding: Form → Card")
      element.addEventListener('input', (e) => {
        card[key] = e.target.value;
        console.log("Card")
        console.log(card)
      });
    }
 
    card.on_update_callback = () => {
      for (const [key, element] of Object.entries(elements)) {
        element.value = card[key]
      }
    }
    
    // Button for opening/closing the form 
    let form_has_been_opened = false;
    const open_close_form_button = panel.querySelector('#anki-extension-tab')
    open_close_form_button.addEventListener('click', async (e) => {
      e.stopPropagation();
      const isHidden = panel.classList.contains('anki-panel-hidden');
      panel.classList.toggle('anki-panel-hidden', !isHidden);
      panel.classList.toggle('anki-panel-visible', isHidden);
      if (!form_has_been_opened) {
        await addRussianSuggestionsToPanel(panel, card);
        await addImageSuggestionsToPanel(panel, card);
        form_has_been_opened = true;
      }
    });

    // Button to save a card
    const submitBtn = panel.querySelector('#submit-anki');
    submitBtn.addEventListener('click', async() => {
      const response = await card.save();
      if (response.error) {
          alert("AnkiConnect error: " + response.error);
      } else {
          alert("Card added to Anki!");
      }  
    });

    
    return new Popup(panel);
  }

  inject() {
    // Load CSS and only then add panel to DOM
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('src/ui/styles.css');
    link.onload = () => {
      document.body.appendChild(this.panel);

      // After a short delay, enable transition for later toggles
      setTimeout(() => {
        this.panel.classList.remove('anki-panel-no-transition');
      }, 50);
    };
    document.head.appendChild(link);
  }
}
