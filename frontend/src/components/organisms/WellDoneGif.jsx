export default function WellDoneGif() {
  const url = `https://gifer.com/embed/${getRandomGifId()}`;

  return (
    <div style={{ paddingTop: "56.250%", position: "relative" }}>
      <iframe
        src={url}
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
}

function getRandomGifId() {
  return getRandomItemInArray([
    "4MR8",
    "VzWJ",
    "ICI",
    "1PHC",
    "5SM",
    "5W",
    "1w0",
    "1x7",
    "Bjq",
    "Pim",
    "Fgu",
    "aMw",
    "365",
    "wuK",
    "1O1k",
    "JbPh",
    "H8EN",
    "K1mm",
    "8H0Y",
    "MHGH",
    "fy22",
    "VoKr",
    "3YMK",
    "5Uw",
    "1UFi",
    "gVP",
    "vOS",
    "2lYS",
    "vUc",
  ]);
}

/**
 * @template T
 * @param {T[]} items
 * @returns {T | undefined}
 */
function getRandomItemInArray(items) {
  if (items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}
