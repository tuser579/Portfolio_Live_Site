/**
 * Safely copies text to clipboard with legacy textarea fallback
 * Prevents "NotAllowedError: Write permission denied" crashes.
 */
export async function safeCopyToClipboard(text) {
  if (!text) return false;

  // Attempt 1: Modern navigator.clipboard API
  if (typeof window !== "undefined" && navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (clipboardErr) {
      // Browsers often reject if document is not focused or permissions are restricted
      console.warn("navigator.clipboard.writeText blocked or unfocused:", clipboardErr?.message);
    }
  }

  // Attempt 2: Document execCommand fallback
  try {
    if (typeof document !== "undefined") {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.left = "-9999px";
      textarea.style.top = "-9999px";
      textarea.setAttribute("readonly", "");
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    }
  } catch (execErr) {
    console.warn("execCommand copy fallback failed:", execErr?.message);
  }

  return false;
}
