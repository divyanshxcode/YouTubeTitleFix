// === API COMMUNICATION ===

const API_BASE_URL =
  "https://youtubetitlefix-backend-production.up.railway.app";

async function generateAITitle(videoId) {
  const videoUrl = createVideoUrl(videoId);

  try {
    console.log("🚀 Calling backend API for video:", videoId);

    const response = await fetch(`${API_BASE_URL}/api/video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoLink: videoUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Backend response:", data);

    return {
      title: data.data,
      cached: data.message.includes("already generated"),
    };
  } catch (error) {
    console.error("❌ API Error:", error);
    throw error;
  }
}
