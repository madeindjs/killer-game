import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import AvatarEditor from "@/components/organisms/AvatarEditor";

const defaultConfig = {
  sex: "man",
  faceColor: "#F9C9B6",
  earSize: "small",
  hairColor: "#000",
  hairStyle: "normal",
  hatColor: "#000",
  hatStyle: "none",
  eyeBrowWoman: "up",
  eyeStyle: "circle",
  glassesStyle: "none",
  noseStyle: "short",
  mouthStyle: "smile",
  shirtStyle: "short",
  shirtColor: "#9287FF",
  bgColor: "#9287FF",
};

describe("AvatarEditor", () => {
  it("disables upload when there is no player and no deferred handler", () => {
    render(<AvatarEditor config={defaultConfig} onUpdate={vi.fn()} />);

    const uploadButton = screen.getByRole("button", {
      name: /AvatarEditor\.uploadPicture/i,
    });
    expect(uploadButton).toBeDisabled();
  });

  it("enables upload in deferred mode even without a player id", async () => {
    const onFileSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <AvatarEditor
        config={defaultConfig}
        onUpdate={vi.fn()}
        onFileSelect={onFileSelect}
      />,
    );

    const uploadButton = screen.getByRole("button", {
      name: /AvatarEditor\.uploadPicture/i,
    });
    expect(uploadButton).not.toBeDisabled();

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(["hello"], "avatar.png", { type: "image/png" });

    await user.click(uploadButton);
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(onFileSelect).toHaveBeenCalledWith(file);
  });
});
