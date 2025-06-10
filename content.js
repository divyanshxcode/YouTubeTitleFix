// MAIN CONTENT

// Main processing function
async function processVideo(videoId, titleElem, btn) {
  try {
    btn.innerText = "Loading...";

    const transcript = await fetchTranscriptText(
      videoId,
      CONFIG.SUPADATA_API_KEY
    );
    console.log("Transcript (150 words max):", transcript);

    const aiTitle = await generateAiTitle(transcript);
    console.log("AI Generated Title:", aiTitle);

    const originalTitle = titleElem.innerText;
    titleElem.innerText = aiTitle;
    titleElem.title = `Original: ${originalTitle}`;

    btn.innerText = "✓ Done";
    btn.style.backgroundColor = "#4caf50";
  } catch (err) {
    console.error("Error:", err);
    btn.innerText = "Error";
    btn.style.backgroundColor = "#f44336";
    setTimeout(() => {
      btn.innerText = "AI Title";
      btn.style.backgroundColor = "#1976d2";
    }, 2000);
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

  const metadataArea = item.querySelector("#metadata, #meta, .metadata");
  if (metadataArea) {
    const titleContainer =
      titleElem.closest("h3, .title-container") || titleElem.parentNode;
    titleContainer.appendChild(container);
  } else {
    titleElem.parentNode.insertBefore(container, titleElem.nextSibling);
  }
}

// Observer setup
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

  videoSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((item) => {
      injectButtonToVideoItem(item);
    });
  });
}

// Initialize
console.log("Content script loaded - AI Title Generator ready");
observeYouTube();
