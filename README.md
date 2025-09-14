\# eslint-plugin-multiline-spacing

Enforce blank lines before and after multiline JSX elements,

and always for components with uppercase names.

\## Installation

\```bash

npm install --save-dev eslint-plugin-multiline-spacing

\```

Usage

Add the plugin to your ESLint config:

// .eslintrc.js

module.exports = {

plugins: ["multiline-spacing"],

rules: {

"multiline-spacing/multiline-jsx-padding": "warn"

}

};

Run ESLint:

npx eslint "src/\\*\_/\_.{js,jsx,ts,tsx}" --fix

✅ Correct

<div>

<p>single line</p>

<p>

multiline

content

</p>

<p>another single line</p>

</div>

<div>

<CustomComponent />

<CustomComponent>

<span>Always requires padding</span>

</CustomComponent>

</div>

❌ Incorrect

<div>

<p>single line</p>

<p>

multiline

content

</p>

<p>another single line</p>

</div>

<div>

<CustomComponent />

<CustomComponent>

<span>Missing required spacing</span>

</CustomComponent>

</div>

Auto-fix

This rule supports ESLint’s --fix option.

When run with --fix, ESLint will automatically insert or remove the necessary empty lines.

npx eslint "src/\\*\_/\_.{js,jsx,ts,tsx}" --fix
