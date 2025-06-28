import React from "react";

// Språkvelger for å bytte mellom norsk og engelsk
export default function LanguageSwitcher({ currentLanguage, onChange }) {
  return (
    <div className="language-switcher mb-4">
      <label htmlFor="lang" className="mr-2 font-semibold text-gray-300">
        Språk:
      </label>
      <select
        id="lang"
        value={currentLanguage}
        onChange={e => onChange(e.target.value)}
        className="p-1 rounded bg-gray-800 text-teal-200 border border-gray-600"
      >
        <option value="no">Norsk</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
