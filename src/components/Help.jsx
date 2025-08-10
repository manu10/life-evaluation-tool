import React from 'react';

export default function Help() {
  return (
    <div className="prose prose-sm max-w-none">
      <h2>Help & Guide</h2>
      <p>This app implements a simple daily system to reduce overthinking and increase action.</p>
      <h3>Tabs</h3>
      <ul>
        <li><strong>Morning</strong>: set focus, routines, gratitude; see ABC highlights and Environment checklist.</li>
        <li><strong>Evening</strong>: plan tomorrow (goals, first hour) and reflect in Day Thoughts.</li>
        <li><strong>Distractions</strong>: log distractions with emotional triggers; get prompts to breathe, do a replacement, or apply an environment tweak.</li>
        <li><strong>Settings</strong>: edit routines, mindfulness prompts, replacement actions, and environment presets.</li>
      </ul>
      <h3>5‑Step Protocol</h3>
      <ol>
        <li><strong>Identify triggers (ABC)</strong>: quickly capture setting, antecedent, behavior, consequence, effect.</li>
        <li><strong>Break the chain</strong>: 3 breaths, change posture, 30s anchor, 90s pause.</li>
        <li><strong>Replace behavior</strong>: choose an easy action and reward after.</li>
        <li><strong>Engineer environment</strong>: remove cues, add anchors.</li>
        <li><strong>Track & adjust</strong>: rate anxiety (1–10), note what worked/didn’t.</li>
      </ol>
      <h3>Why this helps</h3>
      <ul>
        <li><strong>ABC</strong> clarifies the blueprint of anxiety/distraction.</li>
        <li><strong>Interrupts</strong> reduce spirals and make space.</li>
        <li><strong>Replacements</strong> give your brain an easier, healthier option.</li>
        <li><strong>Environment</strong> lowers friction so willpower matters less.</li>
        <li><strong>Tracking</strong> reveals patterns: keep what works, drop what doesn’t.</li>
      </ul>
      <h3>Tips</h3>
      <ul>
        <li>Use the 🧘 button for quick interrupts; use 5️⃣ for the guided protocol.</li>
        <li>Keep replacements truly easy; add a small reward you’ll actually take.</li>
        <li>Apply 1–2 environment tweaks in the morning for all‑day benefits.</li>
      </ul>
    </div>
  );
}


