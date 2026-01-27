class Card {
    _word;
    _audioUrl;
    _transcription;
    _definition;
    _examples;
    _translation;
    _image;
    
    // Used to trigger actions when the state of object is updated
    on_update_callback;
    
    set word(value) {
        this._word = value
    }

    set audioUrl(value) {
        this._audioUrl = (value !== this.audioUrl) ? value : ""
    }

    set transcription(value) {
        this._transcription = (this.transcription === value && !this.audioUrl) ? "" : value
    }

    set definition(value) {
        let fullDefinitionFormatted = this._clozeWord(value, this.word)
        this._definition = (fullDefinitionFormatted !== this.definition) ? fullDefinitionFormatted : ""
    }

    set examples(value) {
        let currentValue = this.examples
        let newValue = "-" + this._clozeWord(value, this.word) + "\n"
        
        if (!currentValue.includes(newValue)) {
            this._examples = currentValue + newValue
            
        } else {
            this._examples = currentValue.replace(newValue, "");
        }
    }

    set translation(value) {
        let currentValue = this.translation
        
        if (currentValue.includes(value)) {
            this._translation = this._translation.replace(value + ", ", "");
            this._translation = this._translation.replace(", " + value, "");
            this._translation = this._translation.replace(value, "");
        } else if (currentValue) {
            this._translation = currentValue + ", " + value
        } else {
            this._translation = value
        }
    }   

    set image(value) {
        this._image = value;
    }

    get word() {return this._word || ""};
    get audioUrl() {return this._audioUrl || ""};
    get transcription() {return this._transcription || ""};
    get definition() {return this._definition || ""};
    get examples() {return this._examples || ""};
    get translation() {return this._translation || ""};
    get image() {return this._image || ""};

    _clozeWord(text, word) {
        if (!word) return text;
        const wordRegex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
        return text.replace(wordRegex, `{{c1::${word}}}`)
    }
    
    //save here with to link to ank.js  
    async save() {
        return await saveCardToAnki(this)
    }
}