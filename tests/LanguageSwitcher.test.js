import React from "react";
import { render, fireEvent } from "@testing-library/react";
import LanguageSwitcher from "../src/components/LanguageSwitcher";

test("LanguageSwitcher endrer språk", () => {
  const handleChange = jest.fn();
  const { getByLabelText } = render(
    <LanguageSwitcher currentLanguage="no" onChange={handleChange} />
  );
  fireEvent.change(getByLabelText(/Språk/i), { target: { value: "en" } });
  expect(handleChange).toHaveBeenCalledWith("en");
});
