// Kalenderschlüssel "MM-TT" für den Spruch am Wegesrand (Browserzeit des Besuchers).
// Diese Datei wird als Text in die Startseite eingebettet und in tests/sprueche.test.mjs geprueft.
function spruchSchluessel(date) {
  var m = date.getMonth() + 1;
  var d = date.getDate();
  return (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
}
