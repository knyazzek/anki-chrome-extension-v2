## Anki Chrome Extension v2

This extension lets you quickly add cards to Anki from the browser, with optional image generation via the Unsplash API.

## 1. Loading the extension in Chrome

- Open `chrome://extensions` in Chrome.
- Enable **Developer mode** (top-right toggle).
- Click **Load unpacked**.
- Select the project folder that contains `manifest.json` (this repository root).

## 2. Adding the Note type to Anki using `Note_template.apkg`

This project includes a preconfigured Anki note type (model) in `assets/anki/Note_template.apkg`.

1. Open **Anki** on your computer.
2. Go to **File → Import**.
3. Select the `Note_template.apkg` file from this repository.
4. Choose the target deck (or let Anki create it if prompted).
5. Click **Import**.

After import, you will have a note type (i.e. `English word`) configured to work with this extension.

## 3. Installing and configuring AnkiConnect

The extension communicates with Anki through the **AnkiConnect** add-on.

1. **Install AnkiConnect**
   - In Anki, go to **Tools → Add-ons → Get Add-ons…**
   - Paste the AnkiConnect code from the official page:  
     [AnkiConnect on AnkiWeb](https://ankiweb.net/shared/info/2055492159)
   - Click **OK** to download and install, then **restart Anki**.
2. **Requirements for AnkiConnect to work**
   - Anki must be **running** while you use the Chrome extension.
   - The AnkiConnect add-on must be **enabled** in **Tools → Add-ons**.
   - By default, AnkiConnect listens on `http://127.0.0.1:8765`, which matches this project’s default configuration.

If you change AnkiConnect’s port or host, update the `ANKI_CONNECT_URL` setting in `src/config.js` (see next section).

## 4. Configuring Unsplash API key for image suggestions.

The file `src/config.js` controls the Unsplash API key and Anki-related settings:

```javascript
// Unsplash API
const UNSPLASH_ACCESS_KEY = "YOUR_UNSPLASH_ACCESS_KEY_HERE";
```

### 4.1. Getting an Unsplash API key

1. Go to the Unsplash site: `https://unsplash.com`.
2. Sign in (or create an account)
3. Then go there `https://unsplash.com/oauth/applications`
4. Create new demo application
4. Replace the `UNSPLASH_ACCESS_KEY` value in `src/config.js` with your Access Key string.

This key enables the extension to request images from Unsplash for your Anki cards.

### 4.2. Customizing deck name, note type, and AnkiConnect URL

You can customize the Anki integration by editing `src/config.js`:

- **Deck name**: change `ANKI_DECK_NAME` to the name of the deck where new cards should be added.
- **Note type (model)**: change `ANKI_MODEL_NAME` to match the Anki note type you imported (for example, from `Note_template.apkg`).
- **AnkiConnect URL**: if AnkiConnect is configured to listen on a different host/port, update `ANKI_CONNECT_URL` accordingly (for example, `http://127.0.0.1:8766`).

Make sure that:

- The deck name exists in Anki, or Anki is allowed to create it automatically.
- The note type name in `ANKI_MODEL_NAME` exactly matches the model name in Anki.

## 5. Check this out

Go [here](https://dictionary.cambridge.org/us/dictionary/english/sexy). You should see plus buttons added to the page.

### `Mode: Card`

Default mode. Click on the `Anki` button on the right side. Try to add definition, exemples, sound ... and then click `Add to Anki`. Once it's done you should see `Card added to Anki` messege.

### `Mode: Copy`

When you click on the buttoms they copy value to the clipboard.

