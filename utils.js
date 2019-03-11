import React from "react";

export const parseBrowsePathToNextJs = path => {
  const nextRegex = /\/(?<category>[^?]+)\??(?<args>[^\/]*)/;
  const groups = nextRegex.exec(path).groups;

  return {
    href: `/browse?category=${groups.category}&${groups.args}`,
    as: path
  }
};