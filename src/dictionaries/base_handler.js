const MODE = Object.freeze({
    CARD: "card",
    COPY: "copy",
});

class DictionaryHandler {
    constructor(card) {
        this.card = card;
        this.card.word = this.getWord();
        this.mode = MODE.CARD;
        this.buttons = [];
    }

    // abstract methods
    getWord() { throw new Error("Method 'getWord()' must be implemented."); }
    addAudioButton() { throw new Error("Method 'addAudioButton()' must be implemented."); }
    addDefinitionButton() { throw new Error("Method 'addDefinitionButton()' must be implemented."); }
    addExampleButton() { throw new Error("Method 'addExampleButton()' must be implemented."); }
    injectButtons() { throw new Error("Method 'injectButtons()' must be implemented."); }

    injectModeToggleButton() {
        const btn = document.createElement("button");
        btn.id = "anki-mode-toggle-btn";
        btn.textContent = "Mode: Card";
        btn.addEventListener("click", () => {
            // Toggle the mode first
            this.mode = this.mode === MODE.CARD ? MODE.COPY : MODE.CARD;

            // Update toggle button label
            btn.textContent = this.mode === MODE.CARD ? "Mode: Card" : "Mode: Copy";

            this.buttons.forEach(btn => {
                const isCopyMode = this.mode === MODE.COPY;
                btn.textContent = isCopyMode ? "❏" : "+";
                btn.title = isCopyMode ? "Copy to clipboard" : "Add to side Panel";
            });
        });
        document.body.appendChild(btn);
    }

    getTextWithoutTags(element) {
        return element ? element.textContent.trim() : '';
    }

    writeToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            console.log('Text copied to clipboard');
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    }

    getNewButton({ updateCardHandler, copyValue }) {
        let btn = getEmptyButton()
        
        let isCopyMode = this.mode === MODE.COPY;
        btn.textContent = isCopyMode ? "❏" : "+";
        btn.title = isCopyMode ? "Copy to clipboard" : "Add to side Panel";

        // Decide action at click time based on CURRENT mode
        btn.addEventListener("click", () => {
            if (this.mode === MODE.COPY) {
                this.writeToClipboard(copyValue);
            } else {
                updateCardHandler();
                this.card.on_update_callback();
            }
        });

        this.buttons.push(btn);
        return btn;
    }
}