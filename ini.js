const file = require("./file.js");
const _ = require("lodash");

const readIniFileAsync = async function(fileName) {
  return await file.readFileAsync(fileName, {encoding: "utf8"});
}

const iniFile = async function(fileName) {
  const content = await readIniFileAsync(fileName);
  if (content.bytesRead === 0) {
    return {
      sections: {}
    };
  }

  const regex = /(^[^\n\r]+)$/m;
  const lines = content.data.split(regex);
  const l = _.filter(lines, v => v.trim().length !== 0);

  let sections = {};
  let currentSection = null;

  const entryRegex = /=/g;

  _.each(l, line => {
    if (_.startsWith(line, '[')) {
      if (!_.endsWith(line, ']')) return;

      const header = /\[([^\]]+)\]/g.exec(line)[1];
      sections[header] = {};
      currentSection = sections[header];
    } else {
      const pair = entryRegex[Symbol.split](line);
      currentSection[pair[0]] = pair[1];
    }
  });

  return sections;
};

const containsSection = function(ini, sectionName) {
  return _.has(ini, sectionName);
};

const containsKey = function(ini, sectionName, key) {
  return _.has(ini, [sectionName, key]);
};

const getSection = function(ini, sectionName) {
  return _.get(ini, sectionName) || {};
}

const getEntry = function(ini, sectionName, key) {
  return _.get(ini, [sectionName, key]) || null;
}

const addSection = function(ini, sectionName) {
  if (!containsSection(ini, sectionName)) {
    ini[sectionName] = {};
  }
}

const setEntry = function(ini, sectionName, key, value) {
  if (!containsSection(ini, sectionName)) {
    addSection(ini, sectionName);
  }

  const section = getSection(ini, sectionName);
  section[key] = value;
}

module.exports = {
  iniFile,
  containsSection,
  containsKey,
  getSection,
  getEntry,
  addSection,
  setEntry
};
