// === CONFIG ===
const SUPADATA_API_KEY = CONFIG.SUPADATA_API_KEY;
const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY;

// === HELPERS ===

function getVideoIdFromUrl(url) {
  try {
    const u = new URL(url, window.location.origin);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

// Fetch transcript and return as plain text (capped at 100 words)
async function fetchTranscriptText(videoId, apiKey) {
  const url = `https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}`;
  const response = await fetch(url, {
    headers: { "x-api-key": apiKey },
  });
  if (!response.ok) throw new Error("Transcript not available");
  const data = await response.json();
  const transcriptText = data.content.map((item) => item.text).join(" ");

  // Cap to 100 words max
  const words = transcriptText.split(" ");
  const cappedTranscript = words.slice(0, 150).join(" ");

  return cappedTranscript;
}

// Generate AI title using Gemini with better error handling
async function generateAiTitle(transcript) {
  const prompt = `This is a video transcript, make a clear, short (max 6-7 words) accurate title that tells viewers exactly what the video is about. Avoid clickbait & sensationalism. Example: "How I Made $10k from a Side Project" → VAGUE
Good Title: "Building an AI Chrome Extension Helped Me Earn $10k". This is just one example.

Transcript: ${transcript}

Title:`;

  console.log("Sending request to Gemini API...");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            candidateCount: 1,
          },
        }),
      }
    );

    console.log("Gemini API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error response:", errorText);
      throw new Error(`AI request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Gemini API response data:", data);

    const aiTitle =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "AI Title Error";

    // Clean up the title (remove quotes, extra whitespace, etc.)
    return aiTitle.replace(/^["']|["']$/g, "").trim();
  } catch (error) {
    console.error("Error in generateAiTitle:", error);
    throw error;
  }
}

// Inject button to a single video item
function injectButtonToVideoItem(item) {
  // Avoid duplicates
  if (item.querySelector(".fetch-transcript-btn")) return;

  const titleElem = item.querySelector("#video-title");
  const linkElem = item.querySelector("a#thumbnail");
  if (!titleElem || !linkElem) return;

  const videoId = getVideoIdFromUrl(linkElem.href);
  if (!videoId) return;

  // Store original title for potential restoration
  const originalTitle = titleElem.innerText;

  const btn = document.createElement("button");
  btn.className = "fetch-transcript-btn";
  btn.innerText = "AI Title";
  btn.style.marginLeft = "8px";
  btn.style.fontSize = "12px";
  btn.style.padding = "2px 6px";
  btn.style.cursor = "pointer";
  btn.style.backgroundColor = "#1976d2";
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.borderRadius = "4px";

  btn.onclick = async (e) => {
    e.stopPropagation();
    btn.innerText = "Loading...";

    try {
      // Step 1: Get transcript (capped at 100 words)
      const transcript = await fetchTranscriptText(videoId, SUPADATA_API_KEY);
      console.log("Transcript (100 words max):", transcript);

      // Step 2: Generate AI title
      const aiTitle = await generateAiTitle(transcript);
      console.log("AI Generated Title:", aiTitle);

      // Step 3: Replace the title in the DOM
      titleElem.innerText = aiTitle;
      titleElem.title = `Original: ${originalTitle}`; // Show original on hover

      btn.innerText = "✓ Done";
      btn.style.backgroundColor = "#4caf50"; // Green for success
    } catch (err) {
      console.error("Full error details:", err);
      btn.innerText = "Error";
      btn.style.backgroundColor = "#f44336"; // Red for error
      setTimeout(() => {
        btn.innerText = "AI Title";
        btn.style.backgroundColor = "#1976d2";
      }, 2000);
    }
  };

  titleElem.parentNode.appendChild(btn);
}

// Set up efficient observation using MutationObserver
function observeYouTube() {
  const videoSelectors = [
    "ytd-rich-grid-media", // homepage/feed
    "ytd-video-renderer", // search results
    "ytd-compact-video-renderer", // sidebar/related
  ];

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;

        // Check if the node itself is a video item
        videoSelectors.forEach((selector) => {
          if (node.matches && node.matches(selector)) {
            injectButtonToVideoItem(node);
          }
        });

        // Check descendants for video items
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

  // Initial injection for existing items on page load
  videoSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((item) => {
      injectButtonToVideoItem(item);
    });
  });
}

// Start observing when the script loads
console.log("Content script loaded - AI Title Generator ready");
observeYouTube();
