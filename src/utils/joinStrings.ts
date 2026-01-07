export function joinStrings(texts: string[]): string {
  if (!texts || texts.length === 0) {
    return "";
  }
  if (texts.length === 1) {
    return texts[0];
  } else if (texts.length === 2) {
    return `${texts[0]} y ${texts[1]}`;
  } else {
    return `${texts.slice(0, -1).join(", ")} y ${texts[texts.length - 1]}`;
  }
}
