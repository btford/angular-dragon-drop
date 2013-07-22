# angular-dragon-drop
"Drag and drop" directives for AngularJS. Work in progress.

## Install

```shell
bower install angular-dragon-drop
```

## Usage
1. Include the `dragon-drop.js` script provided by this component into your app.
2. Add `btford.dragon-drop` as a module dependency to your app.

Repeats a template inside the dragon over a list.
```html
<div btf-dragon="item in list">
  {{item.name}}
</div>
<div btf-dragon="item in otherList">
  {{item.name}}
</div>
```
You can drag from one dragon onto another, and the models will be updated accordingly.

It also works on objects:
```html
<div btf-dragon="(key, value) in list">
  {{key}}: {{value}}
</div>
<div btf-dragon="(key, value) in otherList">
  {{key}}: {{value}}
</div>
```


## Config
This is not a kitchen sink every-option-you-can-think-of module.
This is a starting point.
Configure by forking and editing the code according to your needs.
Send a PR if you think your additions are widely useful. :)

### btf-double-dragon
Instead of removing values from the array this dragon is bound to, the values are duplicated.
Add the `btf-double-dragon` attribute to an element with the `btf-dragon` attribute to get the behavior.

Example:
```html
<h2>These get copied</h2>
<div btf-dragon="item in list" btf-double-dragon>
  {{item.name}}
</div>
<h2>These get moved</h2>
<div btf-dragon="item in otherList">
  {{item.name}}
</div>
```

### btf-dragon-accepts
Makes the dragon only accepts items that pass the truth test function given by this argument.
Add the `btf-dragon-accepts` attribute to an element to get the behavior.

Example:
```html
<h2>You can only put shiny objects here</h2>h2>
<div btf-dragon="item in list" btf-dragon-accepts="shinyThings">
  {{item.name}}
</div>
<h2>This takes anything</h2>
<div btf-dragon="item in otherList">
  {{item.name}}
</div>
```

```javascript
// in a Ctrl...
$scope.shinyThings = function (item) {
  return !!item.shiny;
};
```

## Example
See [`example.html`](http://htmlpreview.github.io/?https://github.com/btford/angular-dragon-drop/blob/master/example.html).

## License
MIT
