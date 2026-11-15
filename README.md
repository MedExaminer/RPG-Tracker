# RPG Tracker for SillyTavern

An editable roleplay dashboard with a draggable floating launcher. Track character details, money, stats, belongings, clothing, and the current scene's date, time, location, and weather.

## Features

- **Floating launcher:** Click the **RPG** button to open or close the tracker. Drag it to move it; its position is saved in SillyTavern settings.
- **Scene details:** Edit character name, location, in-world date and time, and weather.
- **Purse:** Track a money amount and name the currency.
- **Custom lists:** Add, edit, and remove any number of stats, assets/inventory entries, and clothing items.
- **Item details:** Assets and clothing have editable quantity and notes fields.
- **Automatic saving:** Changes are saved through SillyTavern's extension settings.
- **Backup:** Export tracker data to JSON and import it later.
- **Immersive presentation:** Dark, parchment-inspired styling designed to sit over the SillyTavern interface.

## Installation

1. In SillyTavern, open **Extensions** and choose **Install extension**.
2. Enter the repository URL: `https://github.com/MedExaminer/RPG-Tracker`.
3. Confirm installation, then refresh SillyTavern if requested.
4. Look for the floating **RPG** button. Click it to open the tracker; drag it to reposition it.

For a manual installation, place the extension folder in SillyTavern's third-party extensions directory so that `manifest.json`, `index.js`, and `style.css` are together in the `rpg-tracker` folder. Then reload SillyTavern.

## Using the tracker

- Edit the character and scene fields directly; changes save automatically.
- Select **＋ Add stat**, **＋ Add item**, or **＋ Add clothing** to add rows. Edit row fields in place and use **×** to remove a row.
- Use **Export** to download a JSON backup, or **Import** to restore one.
- The extension records only what you enter. It does not infer changes from roleplay messages or automatically advance in-world time or weather.

## Data and privacy

Tracker data is saved in SillyTavern's extension settings for the current SillyTavern installation. It is not inserted into chat messages. The floating button position is saved alongside the tracker data.

## Troubleshooting

If the button does not appear:

1. Check **Extensions** to confirm RPG Tracker is installed and enabled.
2. Refresh the SillyTavern page after installation or updating.
3. Check the browser developer console for an extension loading error.
4. Verify that `manifest.json`, `index.js`, and `style.css` are present together in the extension folder.

## Compatibility

This extension uses SillyTavern's third-party extension manifest fields (`js` and `css`) and its `extension_settings` persistence API. Compatibility may depend on the SillyTavern version in use.
