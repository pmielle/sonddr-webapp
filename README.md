# SonddrWebapp

## Development guidelines

### FAB (`FabService`)

- everytime a new route is added, its corresponding FabMode must be defined in `_chooseFabOfRoute`
- to temporarily use another FabMode, use `setModeStack` and `popModeStack` (n.b. these are lost upon navigation)

### Top bar (`<app-top-bar>`)

- by default, header is sticky and its background is an opaque `var(--background-color)``
- for it to be transparent when pinned to top, pass the `HTMLElement` of its scroll container to `[scroll-container]`