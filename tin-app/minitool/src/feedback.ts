let audio:AudioContext|undefined;let muted=false;
export function setMuted(value:boolean){muted=value;}
export function feedback(material='paper'){
 if(muted)return;
 try{audio ||=new AudioContext();if(audio.state==='suspended')void audio.resume();const at=audio.currentTime;const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.connect(gain);gain.connect(audio.destination);oscillator.type=material==='metal'?'sine':'triangle';const freq=material==='metal'?930:material==='plush'?120:material==='paper'?210:430;oscillator.frequency.setValueAtTime(freq,at);oscillator.frequency.exponentialRampToValueAtTime(freq*.45,at+.08);gain.gain.setValueAtTime(.018,at);gain.gain.exponentialRampToValueAtTime(.0001,at+.11);oscillator.start(at);oscillator.stop(at+.12);navigator.vibrate?.(material==='plush'?5:9);}catch{/* Audio/haptics are optional; visual feedback is always present. */}
}
