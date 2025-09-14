module.exports = {
  rules: {
    "multiline-jsx-padding": require("./lib/rules/multiline-jsx-padding"),
  },
  configs: {
    recommended: {
      plugins: ["multiline-spacing"],
      rules: {
        "multiline-spacing/multiline-jsx-padding": "warn",
      },
    },
  },
};
