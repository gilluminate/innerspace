# InnerSpace

A small Raycast extension that tells you how much disk space you've used, with a percent-used readout in the menu bar.

## Commands

- **Disk Space** – shows used, available and total space for the volume, with a progress bar.
- **Disk Usage in Menu Bar** – puts `42%`-style text in the macOS menu bar and refreshes it every 5 minutes. The dropdown shows the numbers and has shortcuts to refresh, open the Disk Space view, open System Settings → Storage, and open preferences.

## Install (personal use)

```sh
npm install
npm run dev
```

Raycast picks the extension up under **Development**. Run **Disk Usage in Menu Bar** once to activate the menu bar item and allow background refresh. You can stop `npm run dev` afterwards; the extension stays imported.

## Preferences

- **Volume** – directory to measure. Defaults to `/` (the boot volume). Point it at `/Volumes/<name>` to track an external drive instead.

## A note on the numbers

The extension reads the filesystem directly (`statfs`), so its numbers match `df -h /` and Disk Utility. Finder and System Settings add _purgeable_ space (caches macOS could delete under pressure) to "Available", so they can show more free space than this extension does.
