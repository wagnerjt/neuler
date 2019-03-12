import React, { Component } from 'react'
import stringifyObject from 'stringify-object';

export const renderParams = (parameters) => {
  return Object.keys(parameters).map(key =>
    <pre key={key}>:param {key} =>
      {parameters[key]
        ? (typeof parameters[key] === 'string'
          ? ` '${parameters[key]}'`
          : (typeof parameters[key] === "object" ? ` ${stringifyObject(parameters[key], {indent: "  "})}` : ` ${parameters[key]}`))
        : ' null'};
      </pre>
  )
}
