# RPG Tracker for SillyTavern

A small, editable roleplay dashboard for tracking a character's scene, money, stats, belongings, and clothing. It uses a parchment-and-night-sky inspired visual style and saves its data through SillyTavern's extension settings.

## Features

- Character and scene fields for location, in-world date, time, and weather.
- Money balance and a customizable currency label.
- Add, edit, and remove any number of character stats, assets/inventory entries, and clothing entries.
- Quantity and freeform notes for assets and clothing.
- Automatic saving to SillyTavern settings.
- JSON export and import for backup or moving the tracker data.
- Responsive, immersive HTML/CSS dashboard. User-entered text is rendered as text rather than HTML.

## Installation

1. In SillyTavern, open **Extensions** and choose **Install extension**.
2. Enter this repository's Git URL and install it.
3. Refresh SillyTavern. The RPG Tracker dashboard appears in the Extensions settings area.

For a manual install, place this repository's files in `SillyTavern/public/scripts/extensions/third-party/rpg-tracker/`, then refresh the page.

## Use

Edit the scene and purse fields directly. Use **Add stat**, **Add item**, and **Add clothing** to customize the lists; every field is editable, and the × button removes an entry. Use **Export** to save a JSON backup and **Import** to restore one.

The extension is a manual tracker: it does not read roleplay messages or automatically infer changes, so the user remains in control of the recorded state. Tracker data is stored in SillyTavern's extension settings and is separate from chat messages.

## Compatibility

Built for SillyTavern's third-party extension loader and settings API. The extension uses the standard `extension_settings` and `saveSettingsDebounced` APIs.
