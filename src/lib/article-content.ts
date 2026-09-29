export type TocItem = { id: string; text: string; level: 2 | 3 };

function plainText(value: string) {
  return value.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}

function headingId(value: string, index: number) {
  const slug = plainText(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || `section-${index + 1}`;
}

export function addHeadingIds(html: string) {
  const items: TocItem[] = [];
  const content = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, rawLevel: string, attributes: string, inner: string) => {
    const level = Number(rawLevel) as 2 | 3;
    const existing = attributes.match(/\sid=["']([^"']+)["']/i)?.[1];
    const id = existing || headingId(inner, items.length);
    items.push({ id, text: plainText(inner), level });
    return existing ? match : `<h${level}${attributes} id="${id}">${inner}</h${level}>`;
  });
  return { content, items };
}
