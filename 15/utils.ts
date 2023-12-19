// Utils of part 15

export function hash(string: string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash += string.charCodeAt(i);
    hash *= 17;
    hash %= 256;
  }
  return hash;
}
