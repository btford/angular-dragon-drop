# angular-dragon-drop
"Drag and drop" directives for AngularJS. Work in progress.

## [Try out an example](http://plunker.co/edit/CiXu0R?p=preview)

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

## Config
This is not a kitchen sink every-option-you-can-think-of module. This is a starting point. Configure by forking and editing the code according to your needs.

## Callbacks
It is possible to hook up your own callbacks into `dragstart` and `dragend` events.
```html
<div btf-dragon="item in list" dragstart="myCtrlFn()" dragend="changed = true">
  {{item.name}}
</div>
```

## Example
See `example.html`.

## License
MIT
