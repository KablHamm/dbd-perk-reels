/*
  Emblems for the challenges, drawn in the same white-on-diamond look as perk icons.
  Each entry is the inside of a 48 x 48 SVG. Lines are white unless a shape says otherwise.
  A challenge names one of these in data/challenges.js.
*/
(function () {
  const W = 'fill="#fff" stroke="none"';
  window.DBD_CHALLENGE_ICONS = {
    hook: `<path d="M25 8h8M29 8v16a8 8 0 1 1-14-5l-2-4"/>`,
    generator: `<rect x="10" y="19" width="28" height="15" rx="2"/><path d="M16 19v-6M24 19v-9M32 19v-6M13 13h6M21 10h6M29 13h6M14 27h20M14 34v4M34 34v4"/>`,
    medkit: `<rect x="9" y="15" width="30" height="22" rx="3"/><path d="M19 15v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3M24 21v10M19 26h10"/>`,
    heal: `<path ${W} d="M20 10h8v10h10v8H28v10h-8V28H10v-8h10z"/>`,
    gate: `<path d="M10 38V15l14-6 14 6v23M17 38V18M24 38V15M31 38V18M7 38h34"/>`,
    totem: `<circle cx="24" cy="15" r="6"/><circle ${W} cx="21.8" cy="14.5" r="1.4"/><circle ${W} cx="26.2" cy="14.5" r="1.4"/><path d="M24 21v17M14 38l10-10 10 10M16 27h16"/>`,
    pallet: `<rect x="15" y="10" width="18" height="28" rx="1"/><path d="M15 17h18M15 24h18M15 31h18M20 10v28M28 10v28"/>`,
    brokenpallet: `<path d="M10 11h11l-3 8 4 6-4 13h-8zM38 11h-10l3 9-4 5 3 13h8zM10 20h8M10 29h9M38 20h-7M38 29h-9"/>`,
    flashlight: `<rect x="8" y="20" width="15" height="8" rx="1.5"/><path d="M23 19l8-4v18l-8-4zM35 18l4-3M36 24h5M35 30l4 3"/>`,
    hatch: `<rect x="9" y="28" width="30" height="9" rx="1.5"/><path d="M11 28L29 11l5 4-13 13M15 32.500h18"/>`,
    skillcheck: `<circle cx="24" cy="24" r="13"/><path stroke-width="6" stroke-linecap="butt" d="M26 11.200a13 13 0 0 1 9.500 6.300"/><path d="M24 24l8-8"/><circle ${W} cx="24" cy="24" r="2.400"/>`,
    chest: `<rect x="9" y="22" width="30" height="15" rx="1.500"/><path d="M9 22v-4a7 7 0 0 1 7-7h16a7 7 0 0 1 7 7v4"/><rect ${W} x="21.500" y="19" width="5" height="7" rx="1"/>`,
    shield: `<path d="M24 8l13 5v9c0 9-6 14-13 18c-7-4-13-9-13-18v-9zM24 16v14M18 22h12"/>`,
    crouch: `<circle ${W} cx="30" cy="15" r="4"/><path d="M27 20l-9 4 7 7-6 7M18 24l2 8M25 31l9 6M27 20l7 6"/>`,
    run: `<circle ${W} cx="30" cy="11" r="3.800"/><path d="M27 16l-5 10M27 17l-8 2-3 5M27 17l6 5 5-2M22 26l7 4-1 9M22 26l-4 6-8 2"/>`,
    injured: `<path ${W} d="M24 8c6 9 10 14 10 20a10 10 0 0 1-20 0c0-6 4-11 10-20z"/>`,
    timer: `<circle cx="24" cy="26" r="12"/><path d="M21 9h6M24 9v5M24 26v-7M24 26l5 3M34 15l2-2"/>`,
    window: `<rect x="10" y="10" width="28" height="28"/><path d="M24 10v28M10 24h28M7 38h34"/>`,
    toolbox: `<rect x="8" y="20" width="32" height="17" rx="2"/><path d="M17 20v-5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5M8 27h32"/><rect ${W} x="22" y="24.500" width="4" height="5" rx="0.800"/>`,
    locker: `<rect x="13" y="8" width="22" height="32" rx="1.500"/><path d="M24 8v32M16.500 13h4M16.500 16.500h4M27.500 13h4M27.500 16.500h4M21.500 25v3M26.500 25v3"/>`,
    stairs: `<path d="M9 11h8v7h7v7h7v7h8v7H9z"/>`,
    duo: `<circle cx="17" cy="15" r="4.500"/><circle cx="31" cy="15" r="4.500"/><path d="M9 37v-6a8 8 0 0 1 15-3.500a8 8 0 0 1 15 3.500v6M24 27.500V37"/>`,
    building: `<path d="M8 22l16-13 16 13M12 19v19h24V19"/><rect x="21" y="28" width="6" height="10"/>`,
    eye: `<path d="M7 24c5-8 11-11 17-11s12 3 17 11c-5 8-11 11-17 11S12 32 7 24z"/><circle ${W} cx="24" cy="24" r="5"/>`,
    perks: `<path d="M24 6l7 7-7 7-7-7zM35 17l7 7-7 7-7-7zM24 28l7 7-7 7-7-7zM13 17l7 7-7 7-7-7z"/>`,
    hand: `<path d="M15 39V28l-4-7a2.200 2.200 0 0 1 4-2l3 4V12a2 2 0 0 1 4 0v9V10a2 2 0 0 1 4 0v11V12a2 2 0 0 1 4 0v10V16a2 2 0 0 1 4 0v13c0 4-2 7-4 10z"/>`,
    heart: `<path d="M24 38C12 29 9 23 9 17a7.500 7.500 0 0 1 15-2a7.500 7.500 0 0 1 15 2c0 6-3 12-15 21z"/><path d="M12 23h7l3-5 4 9 3-4h7"/>`,
    skull: `<path d="M24 8c-8 0-13 5-13 12c0 4 2 7 4 9v7h18v-7c2-2 4-5 4-9c0-7-5-12-13-12z"/><circle ${W} cx="19" cy="21" r="3.200"/><circle ${W} cx="29" cy="21" r="3.200"/><path d="M21 36v-4M24 36v-4M27 36v-4M24 26v2"/>`,
    power: `<path ${W} d="M27 7L12 27h9l-3 14 16-21h-9z"/>`,
    knife: `<path d="M37 8c0 10-6 18-16 24l-4-4C22 18 28 12 37 8zM14 25l9 9M17 30l-7 7 1 1 7-7"/>`,
    down: `<circle ${W} cx="12" cy="29" r="3.800"/><path d="M17 31h13l9 3M22 31l6-7M7 38h34"/>`,
    target: `<circle cx="24" cy="24" r="11"/><circle ${W} cx="24" cy="24" r="3"/><path d="M24 7v8M24 33v8M7 24h8M33 24h8"/>`,
    wall: `<rect x="10" y="15" width="28" height="18"/><path d="M10 21h28M10 27h28M19 15v6M29 15v6M14 21v6M24 21v6M34 21v6M19 27v6M29 27v6"/>`,
    map: `<circle cx="24" cy="24" r="14"/><path ${W} d="M24 10a14 14 0 0 1 0 28z"/>`,
  };
})();
