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
  const btn = document.createElement("button");
  btn.className = "fetch-transcript-btn";
  btn.innerText = text;
  btn.style.cssText = `
        margin-left: 8px;
        font-size: 12px;
        padding: 2px 6px;
        cursor: pointer;
        background-color: #1976d2;
        color: white;
        border: none;
        border-radius: 4px;
        display: inline-block;
        vertical-align: middle;
        position: relative;
        z-index: 1;
        max-width: 60px;
        overflow: hidden;
        white-space: nowrap;
    `;

  btn.onclick = onClick;

  return { container: btn, button: btn };
}
