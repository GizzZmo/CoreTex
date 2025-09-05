import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";

// Språkvelger for å bytte mellom norsk og engelsk
const LanguageSwitcher = memo(function LanguageSwitcher({ currentLanguage, onChange }) {
  const handleLanguageChange = useCallback((event) => {
    const newLanguage = event.target.value;
    if (newLanguage !== currentLanguage) {
      onChange(newLanguage);
    }
  }, [currentLanguage, onChange]);

  return (
    <div className="language-switcher mb-4">
      <label htmlFor="lang" className="mr-2 font-semibold text-gray-300">
        Språk:
      </label>
      <select
        id="lang"
        value={currentLanguage}
        onChange={handleLanguageChange}
        className="p-1 rounded bg-gray-800 text-teal-200 border border-gray-600 focus:border-teal-400 focus:outline-none transition-colors"
        aria-label="Velg språk"
      >
        <option value="no">Norsk</option>
        <option value="en">English</option>
      </select>
    </div>
  );
});

LanguageSwitcher.propTypes = {
  currentLanguage: PropTypes.oneOf(['no', 'en']).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default LanguageSwitcher;
