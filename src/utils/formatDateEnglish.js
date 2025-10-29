export function formatDateEnglish(iso) {
  const d = new Date(iso);
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  return {
    full: `${weekdays[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
    short: `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
    display: `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
  };
}


