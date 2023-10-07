// https://github.com/dapi-labs/react-nice-avatar/blob/730bbb33fb7f89199b92c3ffb5dd5aef317f81c8/demo/src/App/AvatarEditor/index.tsx
import Ear from "react-nice-avatar/ear/index";
import Eyes from "react-nice-avatar/eyes/index";
import Face from "react-nice-avatar/face/index";
import Glasses from "react-nice-avatar/glasses/index";
import Hair from "react-nice-avatar/hair/index";
import Hat from "react-nice-avatar/hat/index";
import Mouth from "react-nice-avatar/mouth/index";
import Nose from "react-nice-avatar/nose/index";
import Shirt from "react-nice-avatar/shirt/index";

import { AvatarConfig } from "react-nice-avatar";

/**
 * @param {{ className?: string, children: JSX.Element, switchConfig: () => void, tip: string }} props
 */
export default function sectionWrapper(props ) { const { className = "", children, switchConfig, tip } = props
  return (
    <div
      className={"SectionWrapper " + className}
      data-tip={tip}
      onClick={switchConfig}>
      <div className="relative w-full h-full">
        <div className="childrenWrapper absolute top-0 left-0 w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 *
 * @param {{config: AvatarConfig}} param0
 */
export default function AvatarEditor({ config }) {
  return (
    <div className="AvatarEditor rounded-full px-3 py-2 flex items-center">
      {/* Face */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Face"
        switchConfig={this.switchConfig.bind(this, "faceColor", config.faceColor)}
      >
        <Face color={config.faceColor} />
      </SectionWrapper>
      {/* Hair style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Hair"
        switchConfig={this.switchConfig.bind(this, "hairStyle", config.hairStyle)}
      >
        <Hair style={config.hairStyle} color="#fff" colorRandom />
      </SectionWrapper>
      {/* Hat style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Hat"
        switchConfig={this.switchConfig.bind(this, "hatStyle", config.hatStyle)}
      >
        <Hat style={config.hatStyle} color="#fff" />
      </SectionWrapper>
      {/* Eyes style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Eyes"
        switchConfig={this.switchConfig.bind(this, "eyeStyle", config.eyeStyle)}
      >
        <Eyes style={config.eyeStyle} color="#fff" />
      </SectionWrapper>
      {/* Glasses style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Glasses"
        switchConfig={this.switchConfig.bind(this, "glassesStyle", config.glassesStyle)}
      >
        <Glasses style={config.glassesStyle} color="#fff" />
      </SectionWrapper>
      {/* Ear style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Ear"
        switchConfig={this.switchConfig.bind(this, "earSize", config.earSize)}
      >
        <Ear size={config.earSize} color="#fff" />
      </SectionWrapper>
      {/* Nose style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Nose"
        switchConfig={this.switchConfig.bind(this, "noseStyle", config.noseStyle)}
      >
        <Nose style={config.noseStyle} color="#fff" />
      </SectionWrapper>
      {/* Mouth style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Mouth"
        switchConfig={this.switchConfig.bind(this, "mouthStyle", config.mouthStyle)}
      >
        <Mouth style={config.mouthStyle} color="#fff" />
      </SectionWrapper>
      {/* Shirt style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Shirt"
        switchConfig={this.switchConfig.bind(this, "shirtStyle", config.shirtStyle)}
      >
        <Shirt style={config.shirtStyle} color="#fff" />
      </SectionWrapper>

      {/* Shape style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Shape"
        switchConfig={this.switchShape.bind(this, shape)}
      >
        <div
          className={classnames("w-3 h-3 bg-white", {
            "rounded-full": shape === "circle",
            rounded: shape === "rounded",
          })}
        />
      </SectionWrapper>

      <div className="divider w-0.5 h-5 rounded mx-2" />
      <div className="mx-2 relative flex justify-center">
        <i
          className={classnames(
            "iconfont icon-code text-xl  cursor-pointer transition duration-300 hover:text-green-100",
            {
              banTip: isCodeShow,
            }
          )}
          data-tip="Config"
          onClick={this.toggleCodeShow.bind(this)}
        />
        <div
          className={classnames("rounded-lg bg-white p-5 absolute bottom-full codeBlock mb-4", {
            active: isCodeShow,
          })}
        >
          <pre className="text-xs highres:text-sm">{this.genCodeString(config)}</pre>
        </div>
      </div>

      <div className="divider w-0.5 h-5 rounded mx-2" />
      <i
        className="iconfont icon-download text-xl mx-2 cursor-pointer transition duration-300 hover:text-green-100"
        data-tip="Download"
        onClick={download}
      />
    </div>
  );
}
