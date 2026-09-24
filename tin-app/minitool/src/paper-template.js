export const ticketDefaults = {event:'ONE GOOD NIGHT', date:'SEP 24 · 2026', seat:'B 12', tone:'cream'};
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function makeTicketSVG(values={}) {
  const v={...ticketDefaults,...values};
  const event=escape(v.event.trim().slice(0,24)||ticketDefaults.event);
  const date=escape(v.date.trim().slice(0,16)||ticketDefaults.date);
  const seat=escape(v.seat.trim().slice(0,8)||ticketDefaults.seat);
  const eventSize=Math.min(37,Math.floor(556/Math.max(1,[...(v.event.trim().slice(0,24)||ticketDefaults.event)].length)));
  const seatSize=Math.min(22,Math.floor(140/Math.max(1,[...(v.seat.trim().slice(0,8)||ticketDefaults.seat)].length)));
  const venue=escape((v.details?.venue??'TIN CINEMA').slice(0,22)),footer=escape((v.details?.footer??'KEEP THIS LITTLE MOMENT.').slice(0,32));
  const paper=v.tone==='blue'?'#d7e4ed':'#f0eee6';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="396" viewBox="0 0 840 396">
    <defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".075"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter><clipPath id="edge"><path d="M10 8H826L832 19L828 35L834 50L829 68L833 88L829 105L833 124L828 143L832 162L829 181L833 202L830 223L834 241L828 260L832 281L829 300L833 320L829 338L833 357L827 387H11L7 375L10 355L6 333L10 313L6 294L9 275L5 254L9 235L6 214L10 194L7 174L11 153L6 132L10 112L7 92L10 73L6 54L10 34Z"/></clipPath></defs>
    <g clip-path="url(#edge)"><rect width="840" height="396" fill="${paper}"/><rect width="840" height="396" fill="${paper}" filter="url(#grain)"/>
    <path d="M37 41H800V350H37Z" fill="none" stroke="#777b73" stroke-width="1.3"/><path d="M655 8V388" stroke="#9b9d93" stroke-dasharray="5 8"/>
    <path d="M24 190Q330 198 818 183" fill="none" stroke="#bbbdb2" opacity=".18" stroke-width="3"/>
    <g font-family="Arial,Helvetica,sans-serif" fill="#313934"><text x="61" y="82" font-size="17" letter-spacing="5">${venue}</text><text x="61" y="123" font-size="10" letter-spacing="2">AN ORDINARY NIGHT WORTH KEEPING</text>
    <text x="61" y="189" font-size="${eventSize}" font-weight="700">${event}</text><path d="M61 216H625" stroke="#73796f" stroke-width="1"/>
    <text x="61" y="256" font-size="12" letter-spacing="2">DATE</text><text x="61" y="286" font-size="22">${date}</text><text x="485" y="256" font-size="12" letter-spacing="2">SEAT</text><text x="485" y="286" font-size="${seatSize}">${seat}</text>
    <text x="61" y="333" font-size="10" letter-spacing="2">${footer}</text><text x="729" y="82" font-size="12" text-anchor="middle" letter-spacing="2">ADMIT</text><text x="729" y="156" text-anchor="middle" font-family="Georgia,serif" font-size="60">1</text><text x="729" y="307" text-anchor="middle" font-size="12">NO. 0024</text></g>
    <g fill="#424c42">${Array.from({length:30},(_,i)=>`<rect x="${685+i*3}" y="205" width="${i%3===0?2:1}" height="62"/>`).join('')}</g></g></svg>`;
}
