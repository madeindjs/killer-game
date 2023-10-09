"use client";
import { useState } from "react";

/**
 *
 * @param {{tabs: string[], content: JSX.Element}} param0
 * @returns
 */
export default function Tabs({ tabs, contents }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={"tab tab-lg tab-bordered" + (activeIndex === index ? " tab-active" : "")}
            onClick={() => setActiveIndex(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      {contents[activeIndex]}
    </div>
  );
}
