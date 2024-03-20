import React from "react";
import { InlineWidget } from "react-calendly";

const schedule = () => {
  return (
    <div className="App">
      <InlineWidget url="https://calendly.com/pallavi-arora" />
    </div>
  );
};

export default schedule;