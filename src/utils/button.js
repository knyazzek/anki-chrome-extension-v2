// returns base empty button
function getEmptyButton() {
    let btn = document.createElement("button");
    btn.className = "anki-plus-btn";
    
    let action_handler_mapping = {
        "mousedown": () => {btn.classList.add("anki-btn-active")},
        "mouseup": () => {btn.classList.remove("anki-btn-active")},
        "mouseleave": () => {btn.classList.remove("anki-btn-active")},
    }

    for (const [action, handler] of Object.entries(action_handler_mapping)) {
        btn.addEventListener(action, handler)
    }
    return btn
}