import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MarkdownList, { MarkdownListProps } from "./MarkDownList";
import { useTranslation } from "next-i18next";

const MarkDownListWithFilter = (props: MarkdownListProps) => {
  const { t } = useTranslation("common");
  const { metaList, redirectBase } = props;
  const [query, setQuery] = useState("");

  const filteredProjectsMeta = metaList.filter((projectMeta) => {
    return projectMeta.title.toLowerCase().includes(query);
  });

  return (
    <>
      <div className="flex gap-6">
        <Input
          className=""
          placeholder={`Search ${redirectBase}`}
          onChange={(e) => setQuery(e.target.value)}
        ></Input>
        <Button disabled={!query} onClick={() => setQuery("")}>
          {t("reset")}
        </Button>
      </div>
      <MarkdownList
        redirectBase={redirectBase}
        metaList={filteredProjectsMeta}
      ></MarkdownList>
    </>
  );
};

export default MarkDownListWithFilter;
