export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderMarkdown(text = "") {
  let normalized = String(text)
    .replace(/<details>/gi, "@@DETAILS_START@@")
    .replace(/<\/details>/gi, "@@DETAILS_END@@")
    .replace(/<summary>/gi, "@@SUMMARY_START@@")
    .replace(/<\/summary>/gi, "@@SUMMARY_END@@")
    .replace(/<u>/gi, "@@UNDER_START@@")
    .replace(/<\/u>/gi, "@@UNDER_END@@");

  const safeText = escapeHtml(normalized)
    .replace(/@@DETAILS_START@@/g, "<details>")
    .replace(/@@DETAILS_END@@/g, "</details>")
    .replace(/@@SUMMARY_START@@/g, "<summary>")
    .replace(/@@SUMMARY_END@@/g, "</summary>")
    .replace(/@@UNDER_START@@/g, "<u>")
    .replace(/@@UNDER_END@@/g, "</u>");

  const lines = safeText.split(/\r?\n/);
  let html = "";
  let inList = false;
  let inDetails = false;

  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  const closeDetails = () => {
    if (inDetails) {
      html += "</details>";
      inDetails = false;
    }
  };

  lines.forEach((line) => {
    if (/^#{1,2}\s+/.test(line)) {
      closeList();
      closeDetails();
      const level = line.startsWith("##") ? 2 : 1;
      const content = line.replace(/^#{1,2}\s+/, "");
      html += `<h${level}>${formatInline(content)}</h${level}>`;
      return;
    }

    if (/^>\s+/.test(line)) {
      closeList();
      const content = line.replace(/^>\s+/, "");
      html += `<blockquote>${formatInline(content)}</blockquote>`;
      return;
    }

    if (/^<details>/.test(line)) {
      closeList();
      inDetails = true;
      html += "<details>";
      return;
    }

    if (/^<summary>/.test(line)) {
      const content = line.replace(/^<summary>|<\/summary>$/g, "");
      html += `<summary>${formatInline(content)}</summary>`;
      return;
    }

    if (/^<\/details>/.test(line)) {
      closeList();
      closeDetails();
      return;
    }

    if (/^-\s+/.test(line)) {
      if (!inList) {
        closeDetails();
        html += "<ul>";
        inList = true;
      }
      const content = line.replace(/^-\s+/, "");
      html += `<li>${formatInline(content)}</li>`;
      return;
    }

    closeList();

    if (line.trim() === "") {
      html += "<br />";
      return;
    }

    html += `<p>${formatInline(line)}</p>`;
  });

  closeList();
  closeDetails();

  return html;
}

export function formatInline(text) {
  return String(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/<u>(.+?)<\/u>/g, "<u>$1</u>");
}
