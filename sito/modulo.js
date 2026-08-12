/* Invio del modulo di richiesta.
 *
 * ────────────────────────────────────────────────────────────────────────
 *  L'UNICO PUNTO DA CAMBIARE PER ATTIVARE IL MODULO È LA RIGA QUI SOTTO.
 *
 *  1. Aprire formspree.io e creare un modulo nuovo, indicando come
 *     destinatario info@autotrasportibizzotto.it
 *  2. Formspree assegna un indirizzo del tipo  https://formspree.io/f/abcdwxyz
 *  3. Incollarlo qui al posto del segnaposto, salvare, pubblicare.
 *
 *  Finché resta il segnaposto, il modulo non spedisce: avvisa chi scrive e
 *  gli offre l'indirizzo di posta, invece di far finta di aver inviato.
 * ──────────────────────────────────────────────────────────────────────── */
var ENDPOINT = "INSERIRE-QUI-L-INDIRIZZO-FORMSPREE";

var EMAIL = "info@autotrasportibizzotto.it";

(function () {
  "use strict";

  var attivo = ENDPOINT.indexOf("formspree.io") === 0 ||
               ENDPOINT.indexOf("https://") === 0;

  function esitoBox(form) {
    var p = form.querySelector(".form-esito");
    if (!p) {
      p = document.createElement("p");
      p.className = "form-esito";
      p.setAttribute("role", "status");
      p.setAttribute("aria-live", "polite");
      p.setAttribute("tabindex", "-1");
      form.appendChild(p);
    }
    return p;
  }

  function mostra(form, testo, tipo) {
    var p = esitoBox(form);
    p.textContent = testo;
    p.setAttribute("data-tipo", tipo);
    p.focus();
  }

  function invia(form, ev) {
    ev.preventDefault();

    if (!attivo) {
      mostra(form,
        "Il modulo non è ancora collegato. Nel frattempo scriveteci a " + EMAIL +
        ": bastano il prodotto, il luogo di ritiro e quello di consegna.", "attesa");
      return;
    }

    // campo trappola: se è pieno, ha scritto un robot
    var trappola = form.querySelector('[name="_gotcha"]');
    if (trappola && trappola.value) { return; }

    var bottone = form.querySelector('[type="submit"]');
    var etichetta = bottone ? bottone.textContent : "";
    if (bottone) { bottone.disabled = true; bottone.textContent = "Invio in corso…"; }
    mostra(form, "Invio in corso…", "attesa");

    fetch(ENDPOINT, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    }).then(function (r) {
      if (r.ok) {
        form.reset();
        mostra(form,
          "Richiesta inviata. Vi rispondiamo entro la giornata lavorativa all'indirizzo " +
          "che avete scritto. Se non vedete arrivare nulla, controllate la posta " +
          "indesiderata e scriveteci a " + EMAIL + ".", "ok");
      } else {
        // la risposta di errore non è sempre in JSON: se non lo è, non
        // rovesciamo addosso a chi scrive un messaggio tecnico
        return r.text().then(function (testo) {
          var m = "";
          try {
            var d = JSON.parse(testo);
            if (d && d.errors && d.errors.length) {
              m = d.errors.map(function (e) { return e.message; }).join(" ");
            }
          } catch (ignora) { m = ""; }
          throw new Error(m);
        });
      }
    }).catch(function (e) {
      mostra(form,
        "Non siamo riusciti a inviare la richiesta" + (e && e.message ? " (" + e.message + ")" : "") +
        ". Riprovate fra poco, oppure scriveteci direttamente a " + EMAIL + ".", "errore");
    }).then(function () {
      if (bottone) { bottone.disabled = false; bottone.textContent = etichetta; }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var moduli = document.querySelectorAll("form[data-modulo]");
    for (var i = 0; i < moduli.length; i++) {
      (function (form) {
        if (attivo) {
          form.setAttribute("action", ENDPOINT);
          form.setAttribute("method", "POST");
        }
        form.addEventListener("submit", function (ev) { invia(form, ev); });
      })(moduli[i]);
    }
  });
})();
