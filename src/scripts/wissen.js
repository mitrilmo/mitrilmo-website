// Ablauf der Wissensseiten: Schritt für Schritt (Start, Lektionen, Mo-Szenen, Urkunde), Quiz mit Rückmeldung, Punkte.
// Alles bleibt im Arbeitsspeicher der Seite: nichts wird im Browser abgelegt, keine Anfrage nach außen (Test in tests/wissen.test.mjs).
// Wer neu lädt, fängt neu an.
// Ohne dieses Skript zeigt die Seite alle Schritte untereinander (Lösungen klappbar).
const root = document.querySelector('[data-wissen]');

if (root) {
  root.classList.add('js');
  const schritte = [...root.querySelectorAll('[data-schritt]')];
  const gesamt = Number(root.dataset.gesamt) || 1;
  const stufen = JSON.parse(root.dataset.stufen || '[]');
  const leiste = root.querySelector('[data-leiste]');
  const balken = leiste.querySelector('progress');
  const info = leiste.querySelector('[data-info]');
  const ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const richtigSprueche = ['Richtig. Mo ist beeindruckt.', 'Richtig. Mo nickt.', 'Sitzt.', 'Richtig. Das hat man gemerkt.', 'Richtig. Weiter so.'];
  const falschSprueche = ['Knapp daneben. Mo hilft dir.', 'Leider nein. Nicht schlimm.', 'Das war es nicht. Mo schweigt höflich.', 'Daneben, aber jetzt weißt du es.'];
  let aktuell = 0;
  let punkte = 0;
  let beantwortet = 0;

  function aktualisiere() {
    balken.value = beantwortet;
    const art = schritte[aktuell].dataset.schritt;
    info.textContent = art === 'urkunde' ? `Fertig: ${punkte} von ${gesamt} richtig` : `${beantwortet} von ${gesamt} Fragen beantwortet · ${punkte} richtig`;
  }

  function zeige(n, scrollen = true) {
    aktuell = n;
    schritte.forEach((s, k) => { s.hidden = k !== n; });
    const s = schritte[n];
    leiste.hidden = false; // auch am Start sichtbar: Der Knopf „Bewegung anhalten“ muss zur ersten Szene erreichbar sein (WCAG 2.2.2)
    if (s.dataset.schritt === 'urkunde') urkunde();
    aktualisiere();
    if (!scrollen) return;
    root.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth', block: 'start' });
    const ziel = s.querySelector('[data-fokus]');
    if (ziel) ziel.focus({ preventScroll: true });
  }

  function urkunde() {
    let treffer = stufen[0];
    for (const u of stufen) if (punkte >= u.ab) treffer = u;
    root.querySelector('[data-u-emoji]').textContent = treffer.emoji;
    root.querySelector('[data-u-titel]').textContent = treffer.titel;
    root.querySelector('[data-u-punkte]').textContent = `${punkte} von ${gesamt} richtig`;
    root.querySelector('[data-u-spruch]').textContent = treffer.spruch;
  }

  schritte.forEach((s, k) => {
    s.hidden = k !== 0;
    s.querySelectorAll('[data-weiter]').forEach((b) => b.addEventListener('click', () => zeige(k + 1)));
    if (s.dataset.schritt !== 'lektion') return;

    const feld = s.querySelector('.quiz');
    const optionen = [...s.querySelectorAll('.opt')];
    const rueck = s.querySelector('.rueck');
    const stat = s.querySelector('[data-stat]');
    const weiter = s.querySelector('[data-weiter]');
    const richtig = Number(feld.dataset.richtig);

    optionen.forEach((b) => b.addEventListener('click', () => {
      if (s.dataset.fertig) return;
      s.dataset.fertig = '1';
      const gewaehlt = Number(b.dataset.i);
      const ok = gewaehlt === richtig;
      if (ok) punkte += 1;
      beantwortet += 1;
      optionen.forEach((o, i) => {
        o.setAttribute('aria-disabled', 'true');
        if (i === richtig || i === gewaehlt) {
          const hinweis = document.createElement('span');
          hinweis.className = 'sr-only';
          hinweis.textContent = i === richtig ? ' (richtig)' : ' (falsch)';
          o.append(hinweis);
        }
        if (i === richtig) o.classList.add('richtig');
        else if (i === gewaehlt) o.classList.add('falsch');
      });
      const liste = ok ? richtigSprueche : falschSprueche;
      stat.textContent = liste[beantwortet % liste.length];
      rueck.hidden = false;
      weiter.hidden = false;
      aktualisiere();
      weiter.focus({ preventScroll: true }); // der Fokus bleibt nicht auf einem gesperrten Knopf hängen
      rueck.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth', block: 'nearest' });
    }));
  });

  root.querySelector('[data-nochmal]').addEventListener('click', () => {
    punkte = 0;
    beantwortet = 0;
    schritte.forEach((s) => {
      delete s.dataset.fertig;
      s.querySelectorAll('.opt').forEach((o) => {
        o.removeAttribute('aria-disabled');
        o.classList.remove('richtig', 'falsch');
        o.querySelector('.sr-only')?.remove();
      });
      s.querySelectorAll('.rueck').forEach((r) => { r.hidden = true; });
      if (s.dataset.schritt === 'lektion') s.querySelector('[data-weiter]').hidden = true;
      s.querySelectorAll('input[type=checkbox]').forEach((c) => { c.checked = false; });
    });
    zeige(0);
  });

  // Bewegung anhalten (WCAG 2.2.2): schaltet alle Animationen der Seite ab, zusätzlich zu prefers-reduced-motion
  const ruheKnopf = root.querySelector('[data-ruhe]');
  ruheKnopf.addEventListener('click', () => {
    const an = root.classList.toggle('ruhe');
    ruheKnopf.setAttribute('aria-pressed', String(an));
    ruheKnopf.textContent = an ? 'Bewegung starten' : 'Bewegung anhalten';
    window.dispatchEvent(new Event('wissen-bewegung')); // die Szenen (mo-szene.js) starten oder stoppen
  });

  zeige(0, false);
}
