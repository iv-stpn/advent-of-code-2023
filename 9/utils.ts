export function getFinalSequenceNumber(
  sequence: number[],
  previousSequences: number[][] = [],
  nextMode = true,
): number {
  const first = sequence[0];
  if (sequence.every((num) => num === first)) {
    if (nextMode) return previousSequences.reduce((sum, sequence) => sum + sequence[sequence.length - 1], first);
    return previousSequences.reduce((sum, sequence) => sequence[0] - sum, first);
  }

  const differences = sequence.slice(0, -1).map((num, idx) => sequence[idx + 1] - num);
  return getFinalSequenceNumber(differences, [sequence, ...previousSequences], nextMode);
}
