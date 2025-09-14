# eslint-plugin-multiline-spacing

Custom ESLint rule for enforcing consistent blank lines between JSX elements.

## 📖 Rule: `multiline-jsx-padding`

This rule enforces blank line padding around **custom** or **multiline** JSX elements, while preventing unnecessary blank lines between **single-line native elements**.

---

### ✅ Correct

```jsx
// Single custom
<div>
  <CustomComponent />
</div>

// Single multiline native
<div>
  <p>
    multi
    line
  </p>
</div>

// Multiple custom
<div>
  <CustomOne />

  <CustomTwo />
</div>

// Multiple single-line natives (no blank lines between)
<div>
  <span></span>
  <span></span>
</div>

// Mixed: custom with single-line native
<div>
  <span></span>

  <CustomOne />

  <span></span>
</div>

// Mixed: multiline with single-line
<div>
  <p>
    text
    inside
  </p>

  <span></span>
</div>

// Mixed: multiline with custom
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
// Extra blank lines around single custom
<div>

  <CustomComponent />

</div>

// Missing blank line between customs
<div>
  <CustomOne />
  <CustomTwo />
</div>

// Wrong blank line between natives
<div>
  <span></span>

  <span></span>
</div>

// Missing blank line before custom
<div>
  <span></span>
  <CustomOne />
</div>

// Missing blank line before multiline
<div>
  <span></span>
  <p>
    multi
    line
  </p>
</div>
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
    "multiline-spacing/multiline-jsx-padding": "error"
  }
}
```

## 📝 Rule details

- **Custom JSX elements** (`<Custom />`, `<MyComponent />`)
  Must be surrounded by blank lines unless they are the only/first/last child.

- **Multiline JSX elements**

```html
<p>text</p>
```

Must be surrounded by blank lines unless they are the only/first/last child.

- **Single-line native JSX elements**

```html
<span>text</span>
<div>one more text</div>
```

No blank lines allowed between consecutive native single-line elements.

May sit directly next to each other.

- **Mixed content**

If a custom or multiline element appears next to natives, it must be separated with blank lines.
