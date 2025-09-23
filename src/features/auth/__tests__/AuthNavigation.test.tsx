// src/features/auth/__tests__/AuthNavigation.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SignIn from "../SignIn";
import SignUp from "../SignUp";

it("navigates to register from sign-in", async () => {
  render(
    <MemoryRouter initialEntries={["/signin"]}>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </MemoryRouter>
  );

  await userEvent.click(screen.getByRole("link", { name: /register now/i }));
  // Assert we’re on SignUp by checking a unique element/text on that page
  expect(await screen.findByRole("heading", { name: /create your account/i }))
    .toBeInTheDocument();
});
