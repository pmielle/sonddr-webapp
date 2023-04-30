# SonddrWebapp

## Development guidelines

### FAB management (FabService class)

- everytime a new route is added, its corresponding FabMode must be defined in `_chooseFabOfRoute`
- to temporarily use another FabMode, use `setModeStack` and `popModeStack` (n.b. these are lost upon navigation)
