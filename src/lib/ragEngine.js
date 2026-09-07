import { portfolioKnowledgeChunks } from "../../data/ragKnowledge.js";

/**
 * Standard English stop words to filter out noise in keyword matching
 */
const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
  "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
  "below", "between", "both", "but", "by", "can", "can't", "cannot", "could",
  "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down",
  "during", "each", "few", "for", "from", "further", "had", "hadn't", "has",
  "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her",
  "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's",
  "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it",
  "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my",
  "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other",
  "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't",
  "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
  "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then",
  "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've",
  "this", "those", "through", "to", "too", "under", "until", "up", "very", "was",
  "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what",
  "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's",
  "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd",
  "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "tell",
  "show", "give", "know", "tuser", "muttakiul"
]);

/**
 * Tokenize text into normalized alphanumeric keywords
 */
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
}

/**
 * Hybrid Semantic / TF-IDF Retrieval for portfolio chunks
 */
export function retrieveRelevantChunks(query, topK = 3) {
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    // Return bio and project overview by default
    return [
      portfolioKnowledgeChunks.find((c) => c.id === "bio-overview"),
      portfolioKnowledgeChunks.find((c) => c.id === "hiring-why-tuser"),
    ].filter(Boolean);
  }

  const scored = portfolioKnowledgeChunks.map((chunk) => {
    let score = 0;
    const chunkKeywords = new Set(chunk.keywords.map((k) => k.toLowerCase()));
    const titleTokens = tokenize(chunk.title);
    const contentTokens = tokenize(chunk.content);

    // Exact phrase match bonus
    const lowerQuery = query.toLowerCase();
    const lowerContent = chunk.content.toLowerCase();
    const lowerTitle = chunk.title.toLowerCase();

    if (lowerTitle.includes(lowerQuery)) score += 8.0;
    if (lowerContent.includes(lowerQuery)) score += 4.0;

    // Check query tokens against keyword tags (high weight)
    queryTokens.forEach((token) => {
      chunkKeywords.forEach((kw) => {
        if (kw === token) score += 5.0;
        else if (kw.includes(token) || token.includes(kw)) score += 2.5;
      });

      // Match against title
      titleTokens.forEach((tt) => {
        if (tt === token) score += 4.0;
      });

      // Match against content frequency
      const occurrences = contentTokens.filter((ct) => ct === token).length;
      if (occurrences > 0) {
        score += Math.min(occurrences * 0.8, 3.5);
      }
    });

    return {
      chunk,
      score,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Return topK chunks with positive scores, fallback to top 2 if no match
  const filtered = scored.filter((item) => item.score > 0);
  if (filtered.length === 0) {
    return [
      portfolioKnowledgeChunks.find((c) => c.id === "bio-overview"),
      portfolioKnowledgeChunks.find((c) => c.id === "skills-technical"),
    ].filter(Boolean);
  }

  return filtered.slice(0, topK).map((item) => item.chunk);
}

/**
 * Format RAG Context into clean Markdown for LLM prompt injection
 */
export function formatRagContext(chunks) {
  return chunks
    .map(
      (chunk, index) =>
        `### [Source ${index + 1}: ${chunk.title}] (${chunk.category})\n${chunk.content}`
    )
    .join("\n\n");
}

/**
 * High-quality fallback response generator when no Gemini API key is configured
 * Ensures zero-cost out-of-the-box operation with 0% downtime.
 */
export function generateLocalFallbackResponse(query, chunks) {
  const lower = query.toLowerCase();

  // Targeted response for social and connection link queries
  if (
    lower.includes("facebook") ||
    lower.includes("linkedin") ||
    lower.includes("link") ||
    lower.includes("social") ||
    lower.includes("connection") ||
    lower.includes("github") ||
    lower.includes("twitter") ||
    lower.includes("whatsapp")
  ) {
    return `Here are MD. Muttakiul Islam Tuser's official connection and profile links:

• **LinkedIn**: [md-muttakiul-islam-tuser](https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388)
• **Facebook**: [Mohammad Osman (Tuser)](https://www.facebook.com/mohammad.osman.98622)
• **GitHub**: [github.com/tuser579](https://github.com/tuser579)
• **Twitter / X**: [@md_57990667](https://x.com/md_57990667)
• **WhatsApp**: [+8801760049326](https://wa.me/8801760049326)
• **Email**: [tusermon720@gmail.com](mailto:tusermon720@gmail.com)

Feel free to connect or reach out directly on any of these platforms!`;
  }

  const topChunk = chunks[0] || portfolioKnowledgeChunks[0];

  return `Here is what I found in Tuser's portfolio regarding your question:

${topChunk.content}

💡 *Note: Running in high-speed local RAG mode. You can ask me about his projects (CityFix, Volt Store, RentWheels, SkillSwap), technical skills (React, Next.js, Node.js, MongoDB), contest achievements, or social links!*`;
}
