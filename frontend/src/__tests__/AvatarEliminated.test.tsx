import { render, screen } from "@testing-library/react";
import AvatarEliminated from "@/components/molecules/AvatarEliminated";
import type { PlayerRecord } from "@killer-game/types";

const player: PlayerRecord = {
  game_id: "",
  id: "1",
  name: "Bob",
  action: "action-a",
  kill_token: 1,
  killed_at: null,
  killed_by: null,
  order: 1,
  private_token: "",
};

describe("AvatarEliminated", () => {
  it("renders the player name", () => {
    render(<AvatarEliminated player={player} killed={false} />);

    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("hides the cross when the player is alive", () => {
    render(<AvatarEliminated player={player} killed={false} />);

    expect(screen.getByTestId("eliminated-cross")).toHaveClass("opacity-0");
  });

  it("shows the cross when the player is eliminated", () => {
    render(<AvatarEliminated player={player} killed={true} />);

    expect(screen.getByTestId("eliminated-cross")).toHaveClass("opacity-100");
  });

  it("dims the name of an eliminated player", () => {
    render(<AvatarEliminated player={player} killed={true} />);

    expect(screen.getByText("Bob")).toHaveClass("text-neutral");
  });
});
