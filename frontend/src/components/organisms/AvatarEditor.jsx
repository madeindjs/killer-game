// https://github.com/dapi-labs/react-nice-avatar/blob/730bbb33fb7f89199b92c3ffb5dd5aef317f81c8/demo/src/App/AvatarEditor/index.tsx

import { Suspense } from "react";
import Avatar, { AvatarConfig } from "react-nice-avatar";
import Loader from "../atoms/Loader";

/**
 *
 * @param {AvatarConfig} config
 * @returns {(field: ) => AvatarConfig}
 */
function useConfigChanger(config) {
  /**
   * Default value of avatar stolen [here](https://github.com/dapi-labs/react-nice-avatar/blob/730bbb33fb7f89199b92c3ffb5dd5aef317f81c8/src/utils.ts#L72C8-L98C3)
   * @type {Record<keyof AvatarConfig, string[]>}
   */
  const defaultOptions = {
    sex: ["man", "woman"],
    faceColor: ["#F9C9B6", "#AC6651"],
    earSize: ["small", "big"],
    hairColor: ["#000", "#fff", "#77311D", "#FC909F", "#D2EFF3", "#506AF4", "#F48150"],
    hairColor: ["#000", "#fff", "#77311D", "#FC909F", "#D2EFF3", "#506AF4", "#F48150"],
    hairStyle: ["normal", "thick", "mohawk", "womanLong", "womanShort"],
    hatColor: ["#000", "#fff", "#77311D", "#FC909F", "#D2EFF3", "#506AF4", "#F48150"],
    hatStyle: ["beanie", "turban", "none"],
    eyeBrowWoman: ["up", "upWoman"],
    eyeStyle: ["circle", "oval", "smile"],
    glassesStyle: ["round", "square", "none"],
    noseStyle: ["short", "long", "round"],
    mouthStyle: ["laugh", "smile", "peace"],
    shirtStyle: ["hoody", "short", "polo"],
    shirtColor: ["#9287FF", "#6BD9E9", "#FC909F", "#F4D150", "#77311D"],
    bgColor: [
      "#9287FF",
      "#6BD9E9",
      "#FC909F",
      "#F4D150",
      "#E0DDFF",
      "#D2EFF3",
      "#FFEDEF",
      "#FFEBA4",
      "#506AF4",
      "#F48150",
      "#74D153",
    ],
    // gradientBgColor: [
    //   "linear-gradient(45deg, #178bff 0%, #ff6868 100%)",
    //   "linear-gradient(45deg, #176fff 0%, #68ffef 100%)",
    //   "linear-gradient(45deg, #ff1717 0%, #ffd368 100%)",
    //   "linear-gradient(90deg, #36cd1c 0%, #68deff 100%)",
    //   "linear-gradient(45deg, #3e1ccd 0%, #ff6871 100%)",
    //   "linear-gradient(45deg, #1729ff 0%, #ff56f7 100%)",
    //   "linear-gradient(45deg, #56b5f0 0%, #45ccb5 100%)",
    // ],
  };

  /**
   * @param {string} current
   * @param {string[]} values
   * @returns {string}
   */
  function toggleValue(current, values) {
    const index = values.findIndex((v) => v === current);
    if (index === -1) return values[0];
    return values[(index + 1) % values.length];
  }

  /**
   * @param {keyof AvatarConfig} field
   * @returns {AvatarConfig}
   */
  function change(field) {
    if (defaultOptions[field] === undefined) throw Error(`default value for ${field} does not exist`);
    return { ...config, [field]: toggleValue(config[field], defaultOptions[field]) };
  }

  return change;
}

/**
 * @param {{config: AvatarConfig, onUpdate: (config: AvatarConfig) => void}} param0
 */
export default function AvatarEditor({ config, onUpdate }) {
  const changeConfig = useConfigChanger(config);

  /**
   * @param {keyof AvatarConfig} field
   */
  function onClick(field) {
    return () => onUpdate(changeConfig(field));
  }

  /** @type {Record<keyof AvatarConfig, string>} */
  const toggleButtons = {
    earSize: "Ear",
    hairStyle: "Hair",
    hairColor: "Hair color",
    faceColor: "Skin",
    bgColor: "color",
    hatStyle: "hat",
    mouthStyle: "Mouth",
    noseStyle: "Nose",
    shirtStyle: "Shirt",
    glassesStyle: "Glasses",
  };

  return (
    <div className="flex gap-4">
      <div>
        <div className="avatar placeholder">
          <Suspense fallback={<Loader />}>
            <Avatar className="text-neutral-content rounded-full w-36" key={config.sex} {...config} />
          </Suspense>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div>
          <p className="label">Change the avatar</p>
        </div>
        <div className="">
          {Object.entries(toggleButtons).map(([field, label]) => (
            <button className="btn btn-sm" type="button" onClick={onClick(field)} key={field}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
