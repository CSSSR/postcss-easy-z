# PostCSS Easy Z

[PostCSS] plugin to organize z-indices by declaring relations between them.

[PostCSS]: https://github.com/postcss/postcss

## `z-stack`

You can stack your CSS variables for z-indices with `z-stack`. Each new variable will be positioned over the previous:

```css
:root {
  --z-body: z-stack();
  --z-header: z-stack();
  --z-popup: z-stack();
}
```

```css
/* Output */
:root {
  --z-body: 1;
  --z-header: calc(var(--z-body) + 1);
  --z-popup: calc(var(--z-header) + 1);
}
```

You can provide starting value for the stack:
```css
:root {
  --z-body: z-stack(10);
  --z-header: z-stack();
}
```
```css
/* Output */
:root {
  --z-body: 10;
  --z-header: calc(var(--z-body) + 1);
}
```

Stack is isolated by selector:

```css
.a {
  --z-a1: z-stack();
  --z-a2: z-stack();
}

.b {
  --z-b1: z-stack();
  --z-b2: z-stack();
}
```
```css
/* Output */
.a {
  --z-a1: 1;
  --z-a2: calc(var(--z-a1) + 1);
}

.b {
  --z-b1: 1;
  --z-b2: calc(var(--z-b1) + 1);
}
```

## `z-over` and `z-under`

You can explicitly describe relations between z-indices with `z-over` and `z-under`:

```css
.overBody {
  z-index: z-over(var(--z-body));
}

.underHeader {
  z-index: z-under(var(--z-header));
}
```

```css
/* Output */
.overBody {
  z-index: calc(var(--z-body) + 1);
}

.underHeader {
  z-index: calc(var(--z-header) - 1);
}
```

## Installation

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-easy-z
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-easy-z'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage

## Linting

To enforce usage of variables for z-index property add [`stylelint-declaration-strict-value`](https://github.com/AndyOGo/stylelint-declaration-strict-value) to stylelint config:
```js
module.exports = {
  plugins: ['stylelint-declaration-strict-value'],
  rules: {
    'scale-unlimited/declaration-strict-value': [
      'z-index',
      {
        ignoreValues: ['initial', -1, 0, 1],
      },
    ],
  },
}
```
