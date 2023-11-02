"use client";
import { useState } from "react";

/**
 *
 * @param {{tabs: {title: JSX.Element, content: JSX.Element, disabled?: boolean }[]}} param0
 * @returns
 */
export default function Tabs({ tabs }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className="tabs mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={"tab tab-lg tab-bordered" + (activeIndex === index ? " tab-active" : "")}
            onClick={() => setActiveIndex(index)}
            disabled={tab.disabled}
          >
            {tab.title}
          </button>
        ))}
      </div>
      {tabs[activeIndex].content}
    </div>
  );
}
