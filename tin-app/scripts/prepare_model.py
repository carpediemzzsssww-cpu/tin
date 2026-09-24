"""Promote the reviewed tin into a wide, correctly hinged reusable model."""
from pathlib import Path
root=Path(__file__).resolve().parents[2]
p=root/'research/samples/tin-model.js'
s=p.read_text()
s=s.replace('width:90, length:125','width:140, length:90')
s=s.replace('t.repeat.set(1/90,1/125)','t.repeat.set(1/140,1/90)')
for a,b in [('sheet(90,125','sheet(140,90'),('shell(90,125','shell(140,90'),('rim(89.5,124.5','rim(139.5,89.5'),('rim(89,124','rim(139,89'),('sheet(85,120','sheet(135,85'),('set(0,63,18.7)','set(0,46.4,19.8)'),('set(0,-63,0)','set(0,-46.4,0)'),('sheet(91.5,126.5','sheet(141.5,91.5'),('roundedPath(88.5,123.5','roundedPath(138.5,88.5'),('shell(91.5,126.5','shell(141.5,91.5'),('rim(91,126','rim(141,91'),('sheet(85.5,120.5','sheet(135.5,85.5'),('[-25,25]','[-43,43]'),('set(x,62.7,18.4)','set(x,46.4,19.8)'),('set(x,59.7,18.1)','set(x,43.7,18.6)'),('degToRad(173)','degToRad(-186)'),('degToRad(173*amount)','degToRad(-186*amount)')]:s=s.replace(a,b)
s=s.replace('// Open angle keeps the far lid edge above the tabletop and exposes the inner face.','// Negative rotation lifts the front edge above the tray. Hinge sits outside both shells.\n  // At -186 degrees the far edge rests above the desk; interior faces the viewer.')
p.write_text(s)
(root/'tin-app/src/tin-model.js').write_text(s.replace("'./vendor/three.module.js'","'three'"))
print('Wide 140 x 90 mm model and upward hinge rotation applied')
