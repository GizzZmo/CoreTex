import { translations } from "../src/i18n";

describe("translations", () => {
  it("har norsk og engelsk tekst", () => {
    expect(translations.no.title).toMatch(/CORTEX/);
    expect(translations.en.title).toMatch(/CORTEX/);
  });
  it("returnerer ulike språk", () => {
    expect(translations.no.title).not.toBe(translations.en.title);
  });
});
