class CambrdgeDictionaryHandler extends DictionaryHandler {
    cambridgeDictionaryUrl = "https://dictionary.cambridge.org"

    getWord() {
        let wordElem = document.querySelector('.headword');
        return wordElem ? this.getTextWithoutTags(wordElem) : '';
    }

    injectButtons() {
        this.injectModeToggleButton()

        let wordElements = document.getElementsByClassName('entry-body');
        console.log("CambridgeHandler: injecting buttons for ", wordElements.length, " words.");
        for (let wordElem of wordElements) {
            // Add definition button
            this.addDefinitionButton(wordElem);

            // Pronounciation and transcription
            for (let audioElem of wordElem.getElementsByTagName("audio")) {
                this.addAudioButton(audioElem)
            }

            // Examples
            for (let exampleElem of wordElem.getElementsByClassName("eg")) {
                this.addExampleButton(exampleElem)
            }
        }
    }

    addDefinitionButton(wordElem) {
        let wortTypeText = this.getTextWithoutTags(wordElem.querySelector('.pos.dpos'));
        let definitionBlocks = wordElem.getElementsByClassName('def-block');

        for (let defBlock of definitionBlocks) {
            let wordDefinitionElement = defBlock.querySelector('.def');
            if (!wordDefinitionElement) continue;
            let wordDefinitionText = this.getTextWithoutTags(wordDefinitionElement);

            let fullDefinition = `${this.card.word} - ${wordDefinitionText} ${wortTypeText}`;
            
            wordDefinitionElement.insertBefore(
                this.getNewButton({
                    updateCardHandler: () => {this.card.definition = fullDefinition},
                    copyValue: fullDefinition
                }),
                wordDefinitionElement.firstChild
            );
        }
    }

    addAudioButton(audioElem) {
        let mp3Url = this.cambridgeDictionaryUrl + audioElem.querySelector("source").getAttribute("src");
        let transcription = this.getTextWithoutTags(audioElem.parentElement.parentElement.querySelector('.ipa.dipa'));

        audioElem.parentElement.insertBefore(
            this.getNewButton({
                updateCardHandler: () => {
                    this.card.audioUrl = mp3Url
                    this.card.transcription = transcription
                },
                copyValue: mp3Url
            }),
            audioElem
        )
    }

    addExampleButton(exampleElem) {
        let exampleText = this.getTextWithoutTags(exampleElem);

        let insertTo = exampleElem.closest(".examp") || exampleElem;
        insertTo.insertBefore(
            this.getNewButton({
                updateCardHandler: () => {this.card.examples = exampleText},
                copyValue: exampleText
            }),
            insertTo.firstChild
        )   
    }
}
