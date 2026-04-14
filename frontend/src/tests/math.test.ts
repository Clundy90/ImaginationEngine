import { expect, test } from "vitest";

/**
 * A simple "Proof of Life" test.
 * This confirms Vitest can read .ts files and run basic assertions.
 */
const add = (a: number, b: number): number => {
  return a + b;
};

test("adds 2 + 2 to equal 4", () => {
  expect(add(2, 2)).toBe(4);
});

test("math still works in 2026", () => {
  expect(10 * 10).toBe(100);
});
