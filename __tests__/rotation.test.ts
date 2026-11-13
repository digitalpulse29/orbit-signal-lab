import { E, N, S, W, minRotationsTo, popcount, rotateMask } from '../src/game/ports';

describe('node rotation', () => {
  it('turns every port 90 degrees clockwise', () => {
    expect(rotateMask(N, 1)).toBe(E);
    expect(rotateMask(E, 1)).toBe(S);
    expect(rotateMask(S, 1)).toBe(W);
    expect(rotateMask(W, 1)).toBe(N);
  });

  it('returns to the original orientation after four taps', () => {
    for (let mask = 0; mask < 16; mask++) {
      expect(rotateMask(mask, 4)).toBe(mask);
    }
  });

  it('keeps the number of ports', () => {
    const tee = N | E | S;
    expect(popcount(rotateMask(tee, 3))).toBe(popcount(tee));
  });

  it('knows the shortest way back to the solution', () => {
    const straight = N | S;
    expect(minRotationsTo(straight, 1, 0)).toBe(1);
    expect(minRotationsTo(straight, 2, 0)).toBe(0);
    const elbow = N | E;
    expect(minRotationsTo(elbow, 3, 0)).toBe(1);
    expect(minRotationsTo(elbow, 0, 0)).toBe(0);
  });
});
