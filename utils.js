// === UTILITY FUNCTIONS ===

function getVideoIdFromUrl(url) {
  try {
    const u = new URL(url, window.location.origin);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

function createVideoUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function createButton(text, onClick) {
  const buttonContainer = document.createElement("div");
  buttonContainer.style.position = "relative";
  buttonContainer.style.display = "inline-block";
  buttonContainer.style.marginLeft = "8px";
  buttonContainer.style.zIndex = "9999";

  const btn = document.createElement("button");
  btn.className = "fetch-transcript-btn";
  btn.innerText = text;
  btn.style.fontSize = "12px";
  btn.style.padding = "2px 6px";
  btn.style.cursor = "pointer";
  btn.style.backgroundColor = "#1976d2";
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.borderRadius = "4px";
  btn.style.position = "relative";
  btn.style.zIndex = "10000";

  btn.onclick = onClick;
  buttonContainer.appendChild(btn);
  return { container: buttonContainer, button: btn };
}
