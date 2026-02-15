const globals = require("globals");
const pluginJs = require("@eslint/js");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    languageOptions: { 
      globals: globals.node 
    }
  },
  
  pluginJs.configs.recommended,

  {
    rules: {
      "no-unused-vars": "warn", 
      "no-undef": "error",      
      "no-console": "off"       
    }
  },
  
  {
    ignores: ["node_modules/", "dist/", "build/"]
  }
];