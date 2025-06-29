// Rask røyktest for å sjekke at alle hovedkomponenter kan importeres
import "../src/App";
import "../src/components/Dashboard";
import "../src/components/FaceRecognition";
import "../src/components/AnomalyLog";
import "../src/components/LanguageSwitcher";
import "../src/i18n";

test("Alle hovedfiler importeres uten feil", () => {
  expect(true).toBe(true);
});
