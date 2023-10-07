// https://github.com/dapi-labs/react-nice-avatar/blob/730bbb33fb7f89199b92c3ffb5dd5aef317f81c8/demo/src/App/AvatarEditor/index.tsx

import Avatar, {
  AvatarConfig,
  EarSize,
  EyeStyle,
  GlassesStyle,
  HairStyle,
  HatStyle,
  MouthStyle,
  NoseStyle,
  Sex,
  ShirtStyle,
} from "react-nice-avatar";

/**
 *
 * @param {AvatarConfig} config
 * @returns {(field: ) => AvatarConfig}
 */
function useConfigChanger(config) {
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
    const newConfig = { ...config };

    switch (field) {
      case "earSize":
        {
          /** @type {EarSize[]} */
          const values = ["big", "small"];
          newConfig[field] = toggleValue(newConfig[field], values);
        }
        break;
      case "sex":
        {
          /** @type {Sex[]} */
          const values = ["man", "woman"];
          newConfig[field] = toggleValue(newConfig[field], values);
        }
        break;
      case "eyeStyle":
        {
          /** @type {EyeStyle[]} */
          const values = ["circle", "oval", "smile"];
          newConfig[field] = toggleValue(newConfig[field], values);
        }
        break;
      case "hairStyle":
        {
          /** @type {HairStyle[]} */
          const values = ["mohawk", "normal", "thick", "womanLong", "womanShort"];
          newConfig[field] = toggleValue(newConfig[field], values);
        }
        break;
      case "mouthStyle":
        {
          /** @type {MouthStyle[]} */
          const values = ["laugh", "peace", "smile"];
          newConfig[field] = toggleValue(newConfig[field], values);
        }
        break;
      case "noseStyle":
        {
          /** @type {NoseStyle[]} */
          const values = ["long", "round", "short"];
          newConfig[field] = toggleValue(newConfig[field], values);
        }
        break;
      case "hatStyle":
        {
          /** @type {HatStyle[]} */
          const values = ["beanie", "none", "turban"];
          newConfig[field] = toggleValue(newConfig[field], values);
        }
        break;
      case "shirtStyle":
        {
          /** @type {ShirtStyle[]} */
          const values = ["hoody", "polo", "short"];
          newConfig[field] = toggleValue(newConfig[field], values);
        }
        break;
      case "glassesStyle":
        {
          /** @type {GlassesStyle[]} */
          const values = ["none", "round", "square"];
          newConfig[field] = toggleValue(newConfig[field], values);
        }
        break;
    }

    return newConfig;
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
    sex: "Sex",
    earSize: "Ear",
    hairStyle: "Hair",
    hatStyle: "hat",
    mouthStyle: "Mouth",
    noseStyle: "Nose",
    shirtStyle: "Shirt",
    glassesStyle: "Glasses",
  };

  return (
    <div className="flex">
      <div>
        <div className="avatar placeholder">
          <Avatar className="text-neutral-content rounded-full w-36" {...config} />
        </div>
      </div>
      <div className="rounded-full px-3 py-2 flex items-center">
        <div className="pb-2">
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
