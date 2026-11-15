#rpg-tracker-toggle {
    position: fixed;
    left: 24px;
    top: 120px;
    z-index: 99999;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(47, 44, 40, 0.96), rgba(23, 20, 19, 0.96));
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
    color: #f6e7be;
    cursor: grab;
    user-select: none;
    font-weight: 700;
    letter-spacing: 0.04em;
}

#rpg-tracker-toggle:active {
    cursor: grabbing;
}

.rpg-tracker-panel {
    position: fixed;
    left: 104px;
    top: 120px;
    width: min(520px, calc(100vw - 140px));
    max-height: 80vh;
    overflow: auto;
    z-index: 99998;
    border: 1px solid rgba(216, 197, 151, 0.25);
    border-radius: 18px;
    background: rgba(17, 18, 19, 0.97);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.42);
    color: #eee5d5;
    backdrop-filter: blur(6px);
}

.rpg-tracker-panel.hidden { display: none; }

.rpg-tracker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(216, 197, 151, 0.18);
    font-weight: 700;
    letter-spacing: 0.04em;
    color: #f1d9a8;
    background: linear-gradient(110deg, rgba(160, 120, 75, 0.18), rgba(255,255,255,0.02));
}

.rpg-tracker-close {
    border: none;
    background: transparent;
    color: white;
    font-size: 1.6rem;
    cursor: pointer;
}

.rpg-tracker-body {
    padding: 14px;
}

.rpt-hero {
    padding: 16px 16px 12px;
    border: 1px solid rgba(216, 197, 151, 0.18);
    border-radius: 12px;
    background: linear-gradient(110deg, rgba(255,255,255,0.02), rgba(214,183,122,0.08), rgba(255,255,255,0.02));
    text-align: center;
}

.rpt-eyebrow, .rpt-label {
    color: #d6b77a;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 700;
}

.rpt-hero h2 {
    margin: 8px 0;
    font-size: 2rem;
    color: #f0dfbd;
}

.rpt-scene-line {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px 16px;
    color: #cfccb8;
    font-size: 12px;
}

.rpt-atmosphere {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    color: #eadfc0;
    font-style: italic;
}

.rpt-weather-mark { color: #d6b77a; font-size: 1.2rem; }

.rpt-money-card {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin: 12px 0;
    padding: 12px 16px;
    border-left: 3px solid #d6b77a;
    background: rgba(214,183,122,0.08);
}

.rpt-money-card strong {
    color: #f4e4b8;
    font-size: 1.1rem;
}

.rpt-section {
    margin-top: 14px;
    padding: 14px;
    border: 1px solid rgba(216, 197, 151, 0.18);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.12);
}

.rpt-section h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #e8d5ab;
}

.rpt-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 10px;
    margin-top: 12px;
}

.rpt-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.rpt-field input,
.rpt-item input {
    width: 100%;
    padding: 8px 9px;
    border: 1px solid rgba(214,183,122,0.22);
    border-radius: 6px;
    background: rgba(8, 10, 10, 0.7);
    color: #f6f0e6;
    font: 13px/1.3 sans-serif;
}

.rpt-field input:focus,
.rpt-item input:focus {
    outline: none;
    border-color: rgba(214, 183, 122, 0.8);
    box-shadow: 0 0 0 2px rgba(214,183,122,0.12);
}

.rpt-heading-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.rpt-add, .rpt-quiet, .rpt-remove {
    border: 1px solid rgba(216,197,151,0.2);
    border-radius: 7px;
    background: rgba(214,183,122,0.08);
    color: #f3e3b4;
    cursor: pointer;
    font: 12px sans-serif;
}

.rpt-add, .rpt-quiet {
    padding: 6px 9px;
}

.rpt-remove {
    padding: 0 7px;
    font-size: 1.15rem;
    line-height: 1.2;
}

.rpt-list {
    display: grid;
    gap: 7px;
    margin-top: 10px;
}

.rpt-item {
    display: grid;
    grid-template-columns: minmax(120px, 1fr) minmax(90px, .6fr) minmax(120px, 1.2fr) 32px;
    gap: 7px;
    align-items: center;
}

.rpt-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 14px;
    color: #b9b0a2;
    font-size: 11px;
}

.rpt-actions {
    display: flex;
    gap: 6px;
}

@media (max-width: 540px) {
    #rpg-tracker-toggle {
        width: 56px;
        height: 56px;
        top: 90px;
    }
    .rpg-tracker-panel {
        left: 16px;
        right: 16px;
        width: auto;
        max-width: none;
    }
    .rpt-item {
        grid-template-columns: minmax(110px, 1fr) minmax(70px, .55fr) 32px;
    }
    .rpt-item input:nth-child(3) { grid-column: 1 / span 2; }
}
