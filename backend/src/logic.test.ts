import { describe, it, expect } from "vitest";

// Simple representation of your world logic
const rollDice = (sides: number) => Math.floor(Math.random() * sides) + 1;

describe("World Generation Logic", () => {
  it("should roll a value between 1 and 6", () => {
    const roll = rollDice(6);
    expect(roll).toBeGreaterThanOrEqual(1);
    expect(roll).toBeLessThanOrEqual(6);
  });
});
