import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { usePersistentState } from '../../hooks/usePersistentState';

// Combined trainer: Tap & Hold + Urge Surf + Dopamine Bank
export default function NoGoTrainer({
  dailyTarget = 25,
  onLog = () => {},
}) {
  const todayKey = React.useMemo(() => {
    const d = new Date(); d.setHours(0,0,0,0);
    return d.toISOString().slice(0,10);
  }, []);
  const [byDate, setByDate] = usePersistentState('noGo.byDate', {});
  const today = byDate?.[todayKey] || {};
  const count = today.count || 0;
  const [balance, setBalance] = usePersistentState('noGo.bank.balance', 0);
  const [reward, setReward] = usePersistentState('noGo.bank.reward', '');

  function addCount(delta = 1, meta = {}) {
    setByDate(prev => {
      const base = prev?.[todayKey] || {};
      const next = { ...base, count: Math.max(0, (base.count || 0) + delta) };
      return { ...(prev||{}), [todayKey]: next };
    });
    try { onLog(true, { ...meta }); } catch {}
    try { setBalance((b) => b + 1); } catch {}
  }

  return (
    <Card className="border-purple-200 dark:border-purple-700" padding="p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200">No‑Go Trainer</h3>
          <div className="text-xs text-purple-900 dark:text-purple-300">Press‑and‑hold or surf 30s; bank your wins</div>
        </div>
        <GoalRing count={count} target={dailyTarget} />
      </div>
      <TapHold count={count} onSuccess={(meta) => addCount(1, { source: 'tapHold', ...meta })} />
      <div className="mt-3">
        <UrgeSurf
          onSuccess={() => addCount(1, { source: 'urgeSurf', result: 'passed' })}
          onLog={(ok) => onLog(ok, { source: 'urgeSurf', result: ok ? 'passed' : 'strong' })}
        />
      </div>
      <div className="mt-3">
        <BankDisplay
          balance={balance}
          reward={reward}
          onChangeReward={(v) => setReward(v)}
          onRedeem={() => {
            if (balance < 10) return;
            setBalance((b) => Math.max(0, b - 10));
          }}
        />
      </div>
    </Card>
  );
}

function GoalRing({ count, target }) {
  const pct = Math.min(100, Math.round((count / Math.max(1, target)) * 100));
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-2 bg-purple-100 dark:bg-purple-900/30 rounded overflow-hidden">
        <div className="h-2 bg-purple-600 dark:bg-purple-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-purple-900 dark:text-purple-300">{count}/{target}</div>
    </div>
  );
}

function TapHold({ count, onSuccess }) {
  const [holding, setHolding] = React.useState(false);
  const [heldMs, setHeldMs] = React.useState(0);
  const [urge, setUrge] = React.useState('');
  const holdRef = React.useRef(null);
  const start = () => {
    if (holding) return;
    setHolding(true);
    setHeldMs(0);
    const t0 = Date.now();
    holdRef.current = window.setInterval(() => setHeldMs(Date.now() - t0), 50);
  };
  const stop = () => {
    if (!holding) return;
    setHolding(false);
    window.clearInterval(holdRef.current);
    holdRef.current = null;
    if (heldMs >= 1500) {
      onSuccess({ urge: urge.trim() || undefined, heldMs });
      setUrge('');
    }
  };
  return (
    <div>
      <div className="flex items-center gap-2">
        <Button
          intent={holding ? 'info' : 'primary'}
          onMouseDown={start}
          onMouseUp={stop}
          onMouseLeave={stop}
          onTouchStart={(e) => { e.preventDefault(); start(); }}
          onTouchEnd={(e) => { e.preventDefault(); stop(); }}
        >
          {holding ? `Holding… ${Math.floor(heldMs/1000)}s` : 'Press & hold to log'}
        </Button>
        <Input
          className="w-full"
          placeholder='Optional: what was the urge?'
          value={urge}
          onChange={(e) => setUrge(e.target.value)}
        />
      </div>
      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">Hold ≥1.5s to count. Today: {count}</div>
    </div>
  );
}

function UrgeSurf({ onSuccess, onLog }) {
  const [running, setRunning] = React.useState(false);
  const [sec, setSec] = React.useState(30);
  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSec((s) => {
        if (s <= 1) { window.clearInterval(id); setRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);
  return (
    <div>
      {!running ? (
        <div className="flex items-center gap-2">
          <Button intent="primary" onClick={() => { setSec(30); setRunning(true); }}>Start 30s surf</Button>
          <div className="text-xs text-gray-600 dark:text-gray-400">Breathe and watch the wave crest and fall.</div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold text-purple-800 dark:text-purple-200">{sec}s</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Stay with the sensation. Don’t act.</div>
        </div>
      )}
      {!running && sec === 0 && (
        <div className="mt-2 flex items-center gap-2">
          <Button intent="success" size="sm" onClick={() => { onSuccess(); setSec(30); }}>Urge passed</Button>
          <Button intent="neutral" size="sm" onClick={() => { onLog(false); setSec(30); }}>Still strong</Button>
        </div>
      )}
    </div>
  );
}

function BankDisplay({ balance, reward, onChangeReward, onRedeem }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-sm text-purple-900 dark:text-purple-300">Balance: <span className="font-semibold">{balance}</span> coins</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">1 no‑go = 1 coin (auto‑banked)</div>
      </div>
      <div className="flex items-center gap-2">
        <Input className="w-full" placeholder="Reward (e.g., walk, coffee)" value={reward} onChange={(e) => onChangeReward(e.target.value)} />
        <Button intent="neutral" disabled={balance < 10} onClick={onRedeem}>Redeem 10</Button>
      </div>
    </div>
  );
}


