import React from 'react'; 
import { render, screen } from "@testing-library/react";
import App from "../src/App";

describe("App component", () => {
  it("renders the button with the correct text", () => {
    render(<App />);

    // Check if the button with the 'count is' text exists
    expect(screen.getByText(/count is/i)).toBeInTheDocument();
  });
});
