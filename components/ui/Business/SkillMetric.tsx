import React from "react";
import { SkillMetricMap } from "@/content/skills/mock";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { useTranslation } from "next-i18next";

const SkillRating = (props: { level: number }) => {
  const { level } = props;
  return (
    <div className="flex justify-start items-center">
      {new Array(5).fill(0).map((item, index) => (
        <StarFilledIcon
          key={index}
          className={`${level >= index ? "text-orange-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

function SkillMetric() {
  const { t } = useTranslation("home");
  return (
    <section className="mt-10">
      <h1 className="title text-xl no-underline font-bold">
        {t("techAndSkills")}
      </h1>
      <div className="flex justify-between">
        <div>
          {SkillMetricMap.map((item) => (
            <div className="flex gap-10 mt-3" key={item.name}>
              <span className="text-sm text-bold w-20">{item.name}</span>
              <SkillRating level={item.level}></SkillRating>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillMetric;
