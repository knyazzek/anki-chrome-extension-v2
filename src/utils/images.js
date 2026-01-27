// Helper to fetch image suggestions using Unsplash API
async function fetchImageSuggestions(query) {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&client_id=${UNSPLASH_ACCESS_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        // Get small image URLs, limit to 10
        return (data.results || []).map(img => img.urls && img.urls.small).filter(Boolean).slice(0, 10);
    } catch (e) {
        console.log("Image fetch error:", e);
        return [];
    }
}

async function addImageSuggestionsToPanel(panel, card) {
    console.log("Adding image suggestions to panel");
    
    // Create the image suggestions container
    const imgSuggestionsDiv = document.createElement("div");
    imgSuggestionsDiv.id = "anki-img-suggestions";

    // Insert it above the IMG input
    const imgInput = panel.querySelector("#anki-img");
    imgInput.parentNode.insertBefore(imgSuggestionsDiv, imgInput);

    if (!card.word) {
        imgSuggestionsDiv.innerHTML = "";
        console.log("card.word is empty!");
        return;
    } else {
        imgSuggestionsDiv.innerHTML = "Loading images...";
        const imgUrls = await fetchImageSuggestions(card.word);
        imgSuggestionsDiv.innerHTML = "";
        imgUrls.forEach(url => {
            const img = document.createElement("img");
            img.src = url;
            img.title = url;
            img.addEventListener("click", () => {
                card.image = url;
                card.on_update_callback();
            });
            imgSuggestionsDiv.appendChild(img);
        });
    }
}