// Fetch Russian translations from Cambridge Dictionary
async function fetchRussianTranslationsFromCambridge(word) {
  const url = `https://dictionary.cambridge.org/us/dictionary/english-russian/${encodeURIComponent(word)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error: " + res.status);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    // Select all translation spans
    const transSpans = doc.querySelectorAll('span.trans.dtrans[lang="ru"], span.trans.dtrans-se[lang="ru"]');
    const translations = [];
    transSpans.forEach(span => {
      span.textContent.trim().split(/\s*,\s*/).forEach(part => {
        if (part && !translations.includes(part)) translations.push(part);
      });
    });
    return translations.slice(0, 5);
  } catch (e) {
    console.log("Cambridge fetch error:", e);
    return [];
  }
}

// Render suggestions as clickable buttons
function injectSuggestionButtons(card, suggestions, container) {
  let activeButton;

  container.innerHTML = suggestions.length
    ? ""
    : '<span style="color:#888;font-size:13px;">No suggestions</span>';
  suggestions.forEach(suggestion => {
    let btn = getEmptyButton()
    btn.textContent = suggestion;
    btn.style.marginRight = "6px";
    btn.onclick = () => {
      card.translation = suggestion;
      card.on_update_callback();
    };
    container.appendChild(btn);
  });
}

// Update suggestions in the panel
async function addRussianSuggestionsToPanel(panel, card) {
  const suggestionsDiv = panel.querySelector('#anki-russian-suggestions');
  if (!card.word) {
    suggestionsDiv.innerHTML = "";
    return;
  }
  suggestionsDiv.innerHTML = "Loading...";
  const suggestions = await fetchRussianTranslationsFromCambridge(card.word);
  injectSuggestionButtons(card, suggestions,  suggestionsDiv);
}
