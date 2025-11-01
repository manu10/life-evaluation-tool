export function openNativeTimer(plannedMin, settings = {}) {
  const minutes = Math.max(0, Number(plannedMin) || 0);
  const seconds = Math.floor(minutes * 60);
  const helper = settings.nativeTimerHelper || 'off';

  function open(url) {
    try {
      // Use _self so mobile platforms switch apps immediately
      window.location.href = url;
    } catch {}
  }

  if (helper === 'iosShortcut') {
    const name = encodeURIComponent(settings.iosShortcutName || 'Start Focus Timer');
    // Pass minutes as input (Shortcuts can map the input easily)
    const url = `shortcuts://run-shortcut?name=${name}&input=${encodeURIComponent(String(minutes))}`;
    open(url);
    return true;
  }
  if (helper === 'androidClock') {
    // Android Clock intent: length in seconds, label optional
    const label = encodeURIComponent('Focus Session');
    const url = `intent:#Intent;action=android.intent.action.SET_TIMER;S.message=${label};S.length=${seconds};end`;
    open(url);
    return true;
  }
  if (helper === 'thirdParty') {
    const tpl = settings.thirdPartyUrlTemplate || '';
    if (!tpl) return false;
    const url = tpl.replaceAll('{minutes}', String(minutes)).replaceAll('{seconds}', String(seconds));
    open(url);
    return true;
  }
  return false;
}


