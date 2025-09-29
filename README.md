# eslint-plugin-multiline-spacing

Custom ESLint rule for enforcing consistent blank lines between elements.

## 📖 Rule: `multiline-padding`

This rule enforces blank line padding around **custom** or **multiline** JSX elements and JS/TS blocks.

---

### ✅ Correct

```jsx
<div>
  <CustomComponent />
</div>

<div>
  <p>
    multi
    line
  </p>
</div>

<div>
  <CustomOne />

  <CustomTwo />
</div>

<div>
  <span></span>
  <span></span>
</div>

<div>
  <span></span>

  <CustomOne />

  <span></span>
</div>

<div>
  <p>
    text
    inside
  </p>

  <span></span>
</div>

<div>
  <p>
    text
    inside
  </p>

  <CustomComponent />
</div>
```

### ❌ Incorrect

```jsx
<div>

  <CustomComponent />

</div>

<div>
  <CustomOne />
  <CustomTwo />
</div>

<div>
  <span></span>

  <span></span>
</div>

<div>
  <span></span>
  <CustomOne />
</div>

<div>
  <span></span>
  <p>
    multi
    line
  </p>
</div>
```

### ✅ Correct

```js
function example() {
  const a = { x: 1 };

  const b = {
    x: 1,
    y: 2,
  };

  const c = { x: 3 };
}

test: () => {
  const first = {
    a: 1,
  };

  const middle = 2;

  const last = {
    b: 3,
  };
};

doSomething();

longCall(arg1, arg2);

anotherCall();
```

### ❌ Incorrect

```js
const a = { x: 1 };
const b = {
  x: 1,
  y: 2,
};
const c = { x: 3 };

function test() {
  const first = {
    a: 1,
  };
  const middle = 2;
  const last = {
    b: 3,
  };
}
```

## 📦 Installation

```bash
npm install eslint-plugin-multiline-spacing --save-dev
```

## 🔧 Usage

Add `multiline-spacing` to the plugins section of your `.eslintrc` configuration file.

In your .eslintrc.json (or .eslintrc.js):

```json
{
  "plugins": ["multiline-spacing"],
  "rules": {
    "multiline-spacing/multiline-padding": "error"
  }
}
```
