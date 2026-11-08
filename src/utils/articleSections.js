export function createSectionId(
  title,
  index,
  usedIds,
) {
  const normalizedTitle = String(title || "")
    .trim()
    .toLocaleLowerCase("de-DE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const baseId =
    normalizedTitle ||
    `abschnitt-${index + 1}`;

  let sectionId = baseId;
  let duplicateNumber = 2;

  while (usedIds.has(sectionId)) {
    sectionId =
      `${baseId}-${duplicateNumber}`;

    duplicateNumber += 1;
  }

  usedIds.add(sectionId);

  return sectionId;
}

