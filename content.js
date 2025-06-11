// === MAIN CONTENT SCRIPT ===

// Main processing function
async function processVideo(videoId, titleElem, btn) {
  const originalTitle = titleElem.innerText;

  try {
    btn.innerText = "Loading...";
    btn.style.backgroundColor = "#ff9800"; // Orange for loading

    // Call backend API
    const result = await generateAITitle(videoId);

    // Update UI with AI title
    titleElem.innerText = result.title;
    titleElem.title = `Original: ${originalTitle}`;

    // Show success state
    btn.innerText = result.cached ? "✓ Cached" : "✓ Generated";
    btn.style.backgroundColor = result.cached ? "#2196f3" : "#4caf50"; // Blue for cached, Green for new

    console.log("🎯 Title replaced:", {
      original: originalTitle,
      aiGenerated: result.title,
      fromCache: result.cached,
    });
  } catch (err) {
    console.error("💥 Processing error:", err);

    // Show error state
    btn.innerText = "Transcript Unavailable";
    btn.style.backgroundColor = "#f44336"; // Red for error

    // Reset after 3 seconds
    setTimeout(() => {
      btn.innerText = "AI Title";
      btn.style.backgroundColor = "#1976d2";
    }, 3000);
  }
}

// Inject button to video item
function injectButtonToVideoItem(item) {
  if (item.querySelector(".fetch-transcript-btn")) return;

  const titleElem = item.querySelector("#video-title");
  const linkElem = item.querySelector("a#thumbnail");
  if (!titleElem || !linkElem) return;

  const videoId = getVideoIdFromUrl(linkElem.href);
  if (!videoId) return;

  const { container, button } = createButton("AI Title", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    await processVideo(videoId, titleElem, button);
    return false;
  });

  // Insert button in metadata area
  const metadataArea = item.querySelector("#metadata, #meta, .metadata");
  if (metadataArea) {
    const titleContainer =
      titleElem.closest("h3, .title-container") || titleElem.parentNode;
    titleContainer.appendChild(container);
  } else {
    titleElem.parentNode.insertBefore(container, titleElem.nextSibling);
  }
}

// Observer setup (unchanged)
function observeYouTube() {
  const videoSelectors = [
    "ytd-rich-grid-media",
    "ytd-video-renderer",
    "ytd-compact-video-renderer",
  ];

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;

        videoSelectors.forEach((selector) => {
          if (node.matches && node.matches(selector)) {
            injectButtonToVideoItem(node);
          }
        });

        videoSelectors.forEach((selector) => {
          node.querySelectorAll &&
            node.querySelectorAll(selector).forEach((item) => {
              injectButtonToVideoItem(item);
            });
        });
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial injection
  videoSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((item) => {
      injectButtonToVideoItem(item);
    });
  });
}

// Initialize
console.log("🎬 YouTube AI Title Replacer v0.2 loaded");
observeYouTube();
