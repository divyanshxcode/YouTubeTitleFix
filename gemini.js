async function generateAiTitle(transcript) {
  const prompt = `Based on this video transcript, generate a clear, simple, and accurate title that tells viewers exactly what the video is about. Avoid clickbait, sensationalism, or vague language. Keep it under 60 characters and make it descriptive:

Transcript: ${transcript}

Title:`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            candidateCount: 1,
            maxOutputTokens: 50,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiTitle =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "AI Title Error";

    return aiTitle.replace(/^["']|["']$/g, "").trim();
  } catch (error) {
    console.error("Error in generateAiTitle:", error);
    throw error;
  }
}
