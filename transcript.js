// Transcript Functions

async function fetchTranscriptText(videoId, apiKey) {
  const url = `https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}`;
  const response = await fetch(url, {
    headers: { "x-api-key": apiKey },
  });
  if (!response.ok) throw new Error("Transcript not available");
  const data = await response.json();
  const transcriptText = data.content.map((item) => item.text).join(" ");

  const words = transcriptText.split(" ");
  const cappedTranscript = words.slice(0, 150).join(" ");

  return cappedTranscript;
}
