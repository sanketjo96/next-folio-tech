import * as React from "react";

interface EmailTemplateProps {
  name: string;
  message: string;
}

export const EmailTemplate = ({ name, message }: EmailTemplateProps) => (
  <div className="flex">
    <h1 className="text-orange-600">
      Hey there!! There is new message from {name}!
    </h1>
    <p className="text-sm">{message}</p>
  </div>
);
