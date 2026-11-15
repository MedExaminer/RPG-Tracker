import { extension_settings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

const extensionName = "rpg-tracker";
const defaults = {
    character: "Adventurer",
    location: "Unknown location",
    date: "",
    time: "",
    weather: "",
    money: 0,
    currency: "gold",
    stats: [
        { name: "Health", value: "100 / 100" },
        { name: "Energy", value: "100 / 100" },
        { name: "Level", value: "1" },
    ],
    assets: [],
    clothing: [],
};

let state;
let root;

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function loadState() {
    const saved = extension_settings[extensionName] ?? {};
    state = { ...clone(defaults), ...saved };
    for (const key of ["stats", "assets", "clothing"]) {
        if (!Array.isArray(state[key])) state[key] = clone(defaults[key]);
    }
}

function persist() {
    extension_settings[extensionName] = state;
    saveSettingsDebounced();
}

function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function field(labelText, key, value, type = "text", placeholder = "") {
    const label = element("label", "rpt-field");
    label.append(element("span", "rpt-label", labelText));
    const input = document.createElement("input");
    input.type = type;
    input.dataset.field = key;
    input.value = value ?? "";
    input.placeholder = placeholder;
    label.append(input);
    return label;
}

function makeRow(collection, item, index) {
    const row = element("div", "rpt-item");
    const name = document.createElement("input");
    name.type = "text";
    name.value = item.name ?? "";
    name.placeholder = collection === "stats" ? "Stat name" : "Item name";
    name.dataset.collection = collection;
    name.dataset.index = index;
    name.dataset.property = "name";
    name.setAttribute("aria-label", `${collection} item name`);
    row.append(name);

    if (collection === "stats") {
        const value = document.createElement("input");
        value.type = "text";
        value.value = item.value ?? "";
        value.placeholder = "Value";
        value.dataset.collection = collection;
        value.dataset.index = index;
        value.dataset.property = "value";
        value.setAttribute("aria-label", `${item.name || "Stat"} value`);
        row.append(value);
    } else {
        const quantity = document.createElement("input");
        quantity.type = "text";
        quantity.value = item.quantity ?? "1";
        quantity.placeholder = "Qty";
        quantity.dataset.collection = collection;
        quantity.dataset.index = index;
        quantity.dataset.property = "quantity";
        quantity.setAttribute("aria-label", `${item.name || "Item"} quantity`);
        row.append(quantity);

        const notes = document.createElement("input");
        notes.type = "text";
        notes.value = item.notes ?? "";
        notes.placeholder = collection === "assets" ? "Notes / condition" : "How it's worn / condition";
        notes.dataset.collection = collection;
        notes.dataset.index = index;
        notes.dataset.property = "notes";
        notes.setAttribute("aria-label", `${item.name || "Item"} notes`);
        row.append(notes);
    }

    const remove = element("button", "rpt-remove", "×");
    remove.type = "button";
    remove.dataset.remove = collection;
    remove.dataset.index = index;
    remove.title = "Remove item";
    remove.setAttribute("aria-label", "Remove item");
    row.append(remove);
    return row;
}

function renderCollection(collection, containerId) {
    const container = root.querySelector(`#${containerId}`);
    container.replaceChildren();
    state[collection].forEach((item, index) => container.append(makeRow(collection, item, index)));
}

function render() {
    root.querySelector('[data-field="character"]').value = state.character;
    root.querySelector('[data-field="location"]').value = state.location;
    root.querySelector('[data-field="date"]').value = state.date;
    root.querySelector('[data-field="time"]').value = state.time;
    root.querySelector('[data-field="weather"]').value = state.weather;
    root.querySelector('[data-field="money"]').value = state.money;
    root.querySelector('[data-field="currency"]').value = state.currency;
    root.querySelector("#rpt-character-display").textContent = state.character || "Unnamed character";
    root.querySelector("#rpt-location-display").textContent = state.location || "Location unrecorded";
    root.querySelector("#rpt-clock-display").textContent = [state.date, state.time].filter(Boolean).join(" · ") || "Set the scene's date and time";
    root.querySelector("#rpt-weather-display").textContent = state.weather || "Weather unrecorded";
    root.querySelector("#rpt-money-display").textContent = `${state.money || 0} ${state.currency || ""}`.trim();
    renderCollection("stats", "rpt-stats-list");
    renderCollection("assets", "rpt-assets-list");
    renderCollection("clothing", "rpt-clothing-list");
}

function addItem(collection) {
    const initial = collection === "stats" ? { name: "", value: "" } : { name: "", quantity: "1", notes: "" };
    state[collection].push(initial);
    persist();
    render();
    const inputs = root.querySelectorAll(`[data-collection="${collection}"]`);
    inputs[inputs.length - (collection === "stats" ? 2 : 3)]?.focus();
}

function downloadBackup() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rpg-tracker-backup.json";
    link.click();
    URL.revokeObjectURL(url);
}

function importBackup(file) {
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const parsed = JSON.parse(String(reader.result));
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid backup");
            state = { ...clone(defaults), ...parsed };
            for (const key of ["stats", "assets", "clothing"]) {
                if (!Array.isArray(state[key])) state[key] = clone(defaults[key]);
            }
            persist();
            render();
        } catch {
            window.alert("That file is not a valid RPG Tracker backup.");
        }
    };
    reader.readAsText(file);
}

function buildUI() {
    root = element("section", "rpt-root");
    root.innerHTML = `
      <header class="rpt-hero">
        <div class="rpt-eyebrow">YOUR STORY, AT A GLANCE</div>
        <h2 id="rpt-character-display"></h2>
        <div class="rpt-scene-line"><span id="rpt-location-display"></span><span id="rpt-clock-display"></span></div>
        <div class="rpt-atmosphere"><span class="rpt-weather-mark" aria-hidden="true">☁</span><span id="rpt-weather-display"></span></div>
      </header>
      <div class="rpt-money-card"><span class="rpt-label">PURSE</span><strong id="rpt-money-display"></strong></div>
      <section class="rpt-section">
        <h3>Character &amp; scene</h3>
        <div class="rpt-grid">
          <label class="rpt-field"><span class="rpt-label">Character</span><input data-field="character" type="text" placeholder="Character name"></label>
          <label class="rpt-field"><span class="rpt-label">Location</span><input data-field="location" type="text" placeholder="Where are they?"></label>
          <label class="rpt-field"><span class="rpt-label">Date</span><input data-field="date" type="text" placeholder="e.g. 14th of Frostfall"></label>
          <label class="rpt-field"><span class="rpt-label">Time</span><input data-field="time" type="text" placeholder="e.g. just after dawn"></label>
          <label class="rpt-field"><span class="rpt-label">Weather</span><input data-field="weather" type="text" placeholder="e.g. cold rain, low fog"></label>
          <label class="rpt-field"><span class="rpt-label">Money</span><input data-field="money" type="number" step="any" placeholder="0"></label>
          <label class="rpt-field"><span class="rpt-label">Currency</span><input data-field="currency" type="text" placeholder="gold"></label>
        </div>
      </section>
      <section class="rpt-section">
        <div class="rpt-heading-row"><h3>Stats</h3><button type="button" class="rpt-add" data-add="stats">＋ Add stat</button></div>
        <div class="rpt-list rpt-stat-list" id="rpt-stats-list"></div>
      </section>
      <section class="rpt-section">
        <div class="rpt-heading-row"><h3>Assets &amp; inventory</h3><button type="button" class="rpt-add" data-add="assets">＋ Add item</button></div>
        <div class="rpt-list" id="rpt-assets-list"></div>
      </section>
      <section class="rpt-section">
        <div class="rpt-heading-row"><h3>Clothing</h3><button type="button" class="rpt-add" data-add="clothing">＋ Add clothing</button></div>
        <div class="rpt-list" id="rpt-clothing-list"></div>
      </section>
      <footer class="rpt-footer"><span>Changes save automatically in SillyTavern.</span>
        <div class="rpt-actions"><button type="button" class="rpt-quiet" data-action="export">Export</button>
          <button type="button" class="rpt-quiet" data-action="import">Import</button>
          <input type="file" accept="application/json,.json" data-import-file hidden>
        </div>
      </footer>`;

    root.addEventListener("input", (event) => {
        const target = event.target;
        if (target.dataset.field) {
            const key = target.dataset.field;
            state[key] = key === "money" ? (target.value === "" ? "" : Number(target.value)) : target.value;
            persist();
            root.querySelector(`#rpt-${key === "character" ? "character" : key === "location" ? "location" : key === "date" || key === "time" ? "clock" : key === "weather" ? "weather" : key === "money" || key === "currency" ? "money" : ""}-display`)?.replaceChildren();
            render();
        } else if (target.dataset.collection) {
            const { collection, index, property } = target.dataset;
            state[collection][Number(index)][property] = target.value;
            persist();
            if (collection === "stats" && property === "name") {
                const valueInput = target.parentElement.querySelector('[data-property="value"]');
                valueInput?.setAttribute("aria-label", `${target.value || "Stat"} value`);
            }
        }
    });

    root.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        if (button.dataset.add) addItem(button.dataset.add);
        if (button.dataset.remove) {
            state[button.dataset.remove].splice(Number(button.dataset.index), 1);
            persist();
            render();
        }
        if (button.dataset.action === "export") downloadBackup();
        if (button.dataset.action === "import") root.querySelector("[data-import-file]").click();
    });

    root.addEventListener("change", (event) => {
        if (event.target.matches("[data-import-file]") && event.target.files?.[0]) importBackup(event.target.files[0]);
    });
    render();
    return root;
}

jQuery(() => {
    loadState();
    const host = document.getElementById("extensions_settings");
    if (host) host.append(buildUI());
});
