import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import React from "react";

const components = {
  h2: (props: any) => (
    <h2 {...props} className="text-orange-700">
      {props.children}
    </h2>
  ),
};

function MdxContent(props: MDXRemoteProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}

export default MdxContent;
