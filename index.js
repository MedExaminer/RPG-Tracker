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
    position: { x: 24, y: 120 },
};

let state;
let panel;
let launcher;

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function loadState() {
    const saved = extension_settings[extensionName] ?? {};
    state = { ...clone(defaults), ...saved };
    for (const key of ["stats", "assets", "clothing"]) {
        if (!Array.isArray(state[key])) state[key] = clone(defaults[key]);
    }
    if (!state.position || !Number.isFinite(state.position.x) || !Number.isFinite(state.position.y)) {
        state.position = clone(defaults.position);
    }
}

function persist() {
    extension_settings[extensionName] = state;
    saveSettingsDebounced();
}

function makeElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function renderCollection(collection) {
    const list = panel.querySelector(`#rpt-${collection}-list`);
    list.replaceChildren();

    state[collection].forEach((item, index) => {
        const row = makeElement("div", `rpt-item${collection === "stats" ? " rpt-stat-item" : ""}`);
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

        const remove = makeElement("button", "rpt-remove", "×");
        remove.type = "button";
        remove.dataset.remove = collection;
        remove.dataset.index = index;
        remove.title = "Remove item";
        remove.setAttribute("aria-label", "Remove item");
        row.append(remove);
        list.append(row);
    });
}

function render() {
    if (!panel) return;
    for (const key of ["character", "location", "date", "time", "weather", "money", "currency"]) {
        const input = panel.querySelector(`[data-field="${key}"]`);
        if (input) input.value = state[key] ?? "";
    }

    panel.querySelector("#rpt-character-display").textContent = state.character || "Unnamed character";
    panel.querySelector("#rpt-location-display").textContent = state.location || "Location unrecorded";
    panel.querySelector("#rpt-clock-display").textContent = [state.date, state.time].filter(Boolean).join(" · ") || "Set the scene's date and time";
    panel.querySelector("#rpt-weather-display").textContent = state.weather || "Weather unrecorded";
    panel.querySelector("#rpt-money-display").textContent = `${state.money || 0} ${state.currency || ""}`.trim();

    for (const collection of ["stats", "assets", "clothing"]) renderCollection(collection);
}

function addItem(collection) {
    state[collection].push(collection === "stats" ? { name: "", value: "" } : { name: "", quantity: "1", notes: "" });
    persist();
    render();
    const inputs = panel.querySelectorAll(`#rpt-${collection}-list input`);
    inputs[inputs.length - (collection === "stats" ? 2 : 3)]?.focus();
}

function exportBackup() {
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
            const imported = JSON.parse(String(reader.result));
            if (!imported || typeof imported !== "object" || Array.isArray(imported)) throw new Error("Invalid backup");
            state = { ...clone(defaults), ...imported };
            for (const key of ["stats", "assets", "clothing"]) {
                if (!Array.isArray(state[key])) state[key] = clone(defaults[key]);
            }
            // Keep the current launcher position; a backup should not move the button unexpectedly.
            state.position = { ...state.position, ...readPosition() };
            persist();
            render();
        } catch {
            window.alert("That file is not a valid RPG Tracker backup.");
        }
    };
    reader.readAsText(file);
}

function buildPanel() {
    panel = makeElement("section", "rpg-tracker-panel hidden");
    panel.id = "rpg-tracker-panel";
    panel.setAttribute("aria-label", "RPG Tracker");
    panel.innerHTML = `
      <header class="rpg-tracker-header">
        <span>RPG Tracker</span>
        <button type="button" class="rpg-tracker-close" aria-label="Close tracker">×</button>
      </header>
      <div class="rpg-tracker-body">
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
        <footer class="rpt-footer">
          <span>Changes save automatically in SillyTavern.</span>
          <div class="rpt-actions">
            <button type="button" class="rpt-quiet" data-action="export">Export</button>
            <button type="button" class="rpt-quiet" data-action="import">Import</button>
            <input type="file" accept="application/json,.json" data-import-file hidden>
          </div>
        </footer>
      </div>`;

    panel.addEventListener("input", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) return;
        if (target.dataset.field) {
            const key = target.dataset.field;
            state[key] = key === "money" ? (target.value === "" ? 0 : Number(target.value)) : target.value;
            persist();
            panel.querySelector("#rpt-character-display").textContent = state.character || "Unnamed character";
            panel.querySelector("#rpt-location-display").textContent = state.location || "Location unrecorded";
            panel.querySelector("#rpt-clock-display").textContent = [state.date, state.time].filter(Boolean).join(" · ") || "Set the scene's date and time";
            panel.querySelector("#rpt-weather-display").textContent = state.weather || "Weather unrecorded";
            panel.querySelector("#rpt-money-display").textContent = `${state.money || 0} ${state.currency || ""}`.trim();
            return;
        }
        if (target.dataset.collection) {
            const { collection, index, property } = target.dataset;
            if (state[collection]?.[Number(index)]) {
                state[collection][Number(index)][property] = target.value;
                persist();
            }
        }
    });

    panel.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        if (button.classList.contains("rpg-tracker-close")) panel.classList.add("hidden");
        if (button.dataset.add) addItem(button.dataset.add);
        if (button.dataset.remove) {
            state[button.dataset.remove].splice(Number(button.dataset.index), 1);
            persist();
            render();
        }
        if (button.dataset.action === "export") exportBackup();
        if (button.dataset.action === "import") panel.querySelector("[data-import-file]").click();
    });

    panel.addEventListener("change", (event) => {
        const input = event.target;
        if (input.matches("[data-import-file]") && input.files?.[0]) importBackup(input.files[0]);
    });

    document.body.append(panel);
    render();
}

function clampPosition(x, y) {
    const width = launcher?.offsetWidth || 64;
    const height = launcher?.offsetHeight || 64;
    return {
        x: Math.max(8, Math.min(x, window.innerWidth - width - 8)),
        y: Math.max(8, Math.min(y, window.innerHeight - height - 8)),
    };
}

function savePosition() {
    const rect = launcher.getBoundingClientRect();
    state.position = clampPosition(rect.left, rect.top);
    launcher.style.left = `${state.position.x}px`;
    launcher.style.top = `${state.position.y}px`;
    persist();
}

function buildLauncher() {
    launcher = makeElement("button", "rpg-tracker-fab", "RPG");
    launcher.type = "button";
    launcher.id = "rpg-tracker-toggle";
    launcher.title = "Open RPG Tracker; drag to move";
    launcher.setAttribute("aria-label", "Open RPG Tracker; drag to move");

    state.position = clampPosition(state.position.x, state.position.y);
    launcher.style.left = `${state.position.x}px`;
    launcher.style.top = `${state.position.y}px`;

    let pointerStart = null;
    let moved = false;

    launcher.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        const rect = launcher.getBoundingClientRect();
        pointerStart = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
        moved = false;
        launcher.setPointerCapture(event.pointerId);
    });

    launcher.addEventListener("pointermove", (event) => {
        if (!pointerStart) return;
        const dx = event.clientX - pointerStart.x;
        const dy = event.clientY - pointerStart.y;
        if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
        if (!moved) return;
        const position = clampPosition(pointerStart.left + dx, pointerStart.top + dy);
        launcher.style.left = `${position.x}px`;
        launcher.style.top = `${position.y}px`;
    });

    launcher.addEventListener("pointerup", () => {
        if (moved) savePosition();
        pointerStart = null;
    });
    launcher.addEventListener("pointercancel", () => {
        pointerStart = null;
    });
    launcher.addEventListener("click", (event) => {
        if (moved) {
            event.preventDefault();
            event.stopPropagation();
            moved = false;
            return;
        }
        panel.classList.toggle("hidden");
    });

    document.body.append(launcher);
}

function init() {
    if (document.getElementById("rpg-tracker-panel")) return;
    loadState();
    buildPanel();
    buildLauncher();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
    init();
}
