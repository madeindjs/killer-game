/**
 *
 * @param {number} rank
 */
function getRankText(rank) {
  let text = `#${rank}`;

  if (rank === 1) {
    return `${text} 🥇`;
  } else if (rank === 2) {
    return `${text} 🥈`;
  } else if (rank === 3) {
    return `${text} 🥉`;
  } else {
    return text;
  }
}

/**
 * @param {{rank: number}} param0
 */
export default function Rank({ rank }) {
  return <span className="text-2xl">{getRankText(rank)}</span>;
}
