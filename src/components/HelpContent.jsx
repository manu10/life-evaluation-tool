import React from 'react';

export default function HelpContent() {
  return (
    <div className="max-w-none text-gray-800 leading-7 space-y-6">
      <Header title="How to use this tool" subtitle="Short, simple steps to reduce overthinking and take action." />

      <Section title="Quick start" icon="⚡">
        <List>
          <Item>🗓️ <strong>Morning</strong>: set Today’s Goals, check routines, mark 1–2 environment tweaks.</Item>
          <Item>🧠 <strong>During the day</strong>: log Distractions; try 3 breaths → do a Replacement → apply one Environment tweak.</Item>
          <Item>🌙 <strong>Evening</strong>: plan tomorrow (3 goals + first hour), jot Day Thoughts.</Item>
        </List>
      </Section>

      <Divider />

      <Section title="5‑Step Protocol (why it helps)" icon="🧩">
        <List ordered>
          <Item><strong>Identify triggers (ABC)</strong>: map what leads to what so patterns become changeable.</Item>
          <Item><strong>Break the chain</strong>: tiny interrupts (breath, posture, anchor, pause) stop spirals early.</Item>
          <Item><strong>Replace behavior</strong>: make a healthier option the easiest path (add a tiny reward).</Item>
          <Item><strong>Engineer environment</strong>: remove cues, add anchors—less willpower, more default calm.</Item>
          <Item><strong>Track & adjust</strong>: keep what works, drop what doesn’t.</Item>
        </List>
      </Section>

      <Divider />

      <Section title="Where things live" icon="🗺️">
        <List>
          <Item>🧘 <strong>Toolkit</strong>: quick interrupts (3 breaths, posture, anchor, pause).</Item>
          <Item>5️⃣ <strong>Protocol</strong>: guided flow with confirmations across Steps 1–5.</Item>
          <Item>🎯 <strong>Distractions</strong>: log events with triggers; prompts and quick Replacement chips.</Item>
          <Item>⚙️ <strong>Settings</strong>: edit Replacement Actions and Environment presets; toggle prompts and durations.</Item>
        </List>
      </Section>

      <Divider />

      <Section title="Add to Home Screen (iPad/iPhone)" icon="📱">
        <List>
          <Item>Open the site in <strong>Safari</strong>.</Item>
          <Item>Tap <strong>Share</strong> (square with up‑arrow) → <strong>Add to Home Screen</strong> → <strong>Add</strong>.</Item>
          <Item>Launch from the new icon; it opens in <strong>standalone</strong> mode (separate from browser tabs).</Item>
        </List>
      </Section>

      <Divider />

      <Section title="Invest decisions" icon="📈">
        <List>
          <Item>🟢 <strong>Buy</strong>: You’re committing to a position. Save 2–3 reasons, top risk, and a premortem. Add triggers to revisit. Link to your Google Doc.</Item>
          <Item>🟡 <strong>Track</strong>: Not buying now. Define what you need to see (conditions) and a review date. Keep the doc link handy.</Item>
          <Item>🔴 <strong>Pass</strong>: You’re archiving the idea. Log a clear reason (kill‑criteria) so you learn from it later.</Item>
          <Item>🗒️ <strong>Decision Log</strong>: Each decision is stored with reasons/risks/premortem. Use “Copy” for one entry or “Export all” to paste into your Google Doc.</Item>
        </List>
      </Section>

      <Tips />
    </div>
  );
}

function Header({ title, subtitle }) {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-bold">{title} ✨</h2>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <section className="rounded-lg p-4 bg-gray-50 border border-gray-200 space-y-3">
      <h3 className="text-lg font-semibold">{icon} {title}</h3>
      {children}
    </section>
  );
}

function List({ ordered = false, children }) {
  return ordered ? (
    <ol className="list-decimal ml-5 space-y-2">{children}</ol>
  ) : (
    <ul className="list-none ml-0 space-y-2">{children}</ul>
  );
}

function Item({ children }) {
  return <li className="text-sm md:text-base">{children}</li>;
}

function Divider() {
  return <div className="border-t border-dashed border-gray-300" />;
}

function Tips() {
  return (
    <div className="rounded-lg p-4 bg-emerald-50 border border-emerald-200">
      <h3 className="text-lg font-semibold text-emerald-900">💡 Tips that compound</h3>
      <ul className="mt-2 space-y-2 text-emerald-900">
        <li>✅ Keep replacements <strong>easy</strong> and attach a tiny reward you actually take.</li>
        <li>🌿 Apply 1–2 environment tweaks in the morning; they pay off all day.</li>
        <li>📈 Check “What worked today” to repeat the actions with the biggest impact.</li>
      </ul>
    </div>
  );
}


