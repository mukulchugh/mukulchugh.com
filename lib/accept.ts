const representations = ["text/html", "text/markdown"] as const;

/** RFC 9110: a specific range overrides a wildcard, including q=0. */
export function preferredRepresentation(header: string | null) {
  if (header === null) return representations[0];
  const entries = (
    header.match(/(?:[^,"\\]|\\.|"(?:[^"\\]|\\.)*")+/g) ?? []
  ).map((entry, position) => {
    const [type, ...parameters] = entry
      .toLowerCase()
      .split(";")
      .map((s) => s.trim());
    let quality = 1;
    let supported = true;
    let weighted = false;
    let mediaParameters = 0;
    for (const parameter of parameters) {
      const [name, raw = ""] = parameter.split("=").map((s) => s.trim());
      const value = raw.replace(/^"|"$/g, "");
      if (name === "q") {
        quality = /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(value)
          ? Number(value)
          : 0;
        weighted = true;
      } else if (!weighted && name === "charset" && value === "utf-8") {
        mediaParameters += 1;
      } else if (!weighted) {
        supported = false;
      }
    }
    return { mediaParameters, position, quality, supported, type };
  });
  const candidates = representations.map((type) => {
    const matching = entries
      .filter(
        (entry) =>
          entry.supported && [type, "text/*", "*/*"].includes(entry.type)
      )
      .map((entry) => ({
        ...entry,
        specificity: entry.type === type ? 2 : entry.type === "text/*" ? 1 : 0,
      }))
      .sort(
        (a, b) =>
          b.specificity - a.specificity ||
          b.mediaParameters - a.mediaParameters ||
          a.position - b.position
      );
    return { ...matching[0], type };
  });
  return (
    candidates
      .filter((candidate) => candidate.quality > 0)
      .sort(
        (a, b) =>
          b.quality - a.quality ||
          b.specificity - a.specificity ||
          a.position - b.position
      )[0]?.type ?? null
  );
}
