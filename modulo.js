/* Invio del modulo di richiesta.
 *
 * ────────────────────────────────────────────────────────────────────────
 *  L'UNICO PUNTO DA CAMBIARE PER ATTIVARE IL MODULO È LA RIGA QUI SOTTO.
 *
 *  1. Aprire formspree.io e creare un modulo nuovo, indicando come
 *     destinatario la casella dove volete ricevere le richieste
 *  2. Formspree assegna un indirizzo del tipo  https://formspree.io/f/abcdwxyz
 *  3. Incollarlo qui al posto del segnaposto, salvare, pubblicare.
 *
 *  Finché resta il segnaposto il modulo non spedisce e lo dice: non finge
 *  mai di aver inviato una richiesta.
 * ──────────────────────────────────────────────────────────────────────── */
var ENDPOINT = "INSERIRE-QUI-L-INDIRIZZO-FORMSPREE";

(function () {
  "use strict";

  var attivo = ENDPOINT.indexOf("formspree.io") === 0 ||
               ENDPOINT.indexOf("https://") === 0;

  /* Messaggi di errore scritti in italiano, uno per campo: «Compila questo
     campo» del browser non dice quale né perché. */
  var MESSAGGI = {
    prodotto: "Scegliete il prodotto da trasportare.",
    ritiro:   "Scriveteci da dove va ritirato il carico.",
    consegna: "Scriveteci dove va consegnato.",
    azienda:  "Scriveteci il nome dell'azienda.",
    email:    "Serve un indirizzo email: è lì che vi rispondiamo."
  };
  var EMAIL_STORTA = "Controllate l'indirizzo: sembra manchi la chiocciola o il dominio.";

  function contenitore(campo) {
    return campo.closest ? campo.closest(".campo") : null;
  }

  function segnala(campo, testo) {
    var box = contenitore(campo);
    if (!box) { return; }
    var err = box.querySelector(".err");
    if (err) { err.textContent = testo; }
    box.setAttribute("data-errore", "");
    campo.setAttribute("aria-invalid", "true");
  }

  function pulisci(campo) {
    var box = contenitore(campo);
    if (box) { box.removeAttribute("data-errore"); }
    campo.removeAttribute("aria-invalid");
  }

  function controlla(form) {
    var campi = form.querySelectorAll("[required]");
    var primo = null;
    for (var i = 0; i < campi.length; i++) {
      var c = campi[i];
      pulisci(c);
      var vuoto = !c.value || !c.value.trim();
      var storto = !vuoto && !c.checkValidity();
      if (vuoto || storto) {
        var testo = vuoto ? (MESSAGGI[c.name] || "Questo dato ci serve.")
                          : (c.type === "email" ? EMAIL_STORTA : "Controllate questo dato.");
        segnala(c, testo);
        if (!primo) { primo = c; }
      }
    }
    return primo;
  }

  function pannello(form, titolo, testo, tipo, sostituisci) {
    var p = form.parentNode.querySelector(".esito");
    if (!p) {
      p = document.createElement("div");
      p.className = "esito";
      p.setAttribute("role", "status");
      p.setAttribute("aria-live", "polite");
      p.setAttribute("tabindex", "-1");
      form.parentNode.insertBefore(p, form.nextSibling);
    }
    p.setAttribute("data-tipo", tipo);
    p.innerHTML = "<h3></h3><p></p>";
    p.querySelector("h3").textContent = titolo;
    p.querySelector("p").textContent = testo;
    if (sostituisci) { form.style.display = "none"; }
    p.focus();
  }

  function invia(form, ev) {
    ev.preventDefault();

    var primo = controlla(form);
    if (primo) {
      primo.focus();
      return;
    }

    if (!attivo) {
      pannello(form, "Il modulo non è ancora collegato",
        "Stiamo completando l'attivazione: fra poco la richiesta partirà da qui. " +
        "Riprovate più tardi, i dati che avete scritto restano nel modulo.", "attesa", false);
      return;
    }

    var trappola = form.querySelector('[name="_gotcha"]');
    if (trappola && trappola.value) { return; }

    var bottone = form.querySelector('[type="submit"]');
    var etichetta = bottone ? bottone.textContent : "";
    if (bottone) { bottone.disabled = true; bottone.textContent = "Invio in corso…"; }

    fetch(ENDPOINT, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    }).then(function (r) {
      if (r.ok) {
        pannello(form, "Richiesta ricevuta",
          "Vi rispondiamo entro la giornata lavorativa all'indirizzo che avete scritto, " +
          "con disponibilità, tempi e prezzo. Se non vedete arrivare nulla, " +
          "controllate la posta indesiderata.", "ok", true);
        form.reset();
        return;
      }
      return r.text().then(function (testo) {
        var m = "";
        try {
          var d = JSON.parse(testo);
          if (d && d.errors && d.errors.length) {
            m = d.errors.map(function (e) { return e.message; }).join(" ");
          }
        } catch (ignora) { m = ""; }
        var errore = new Error(m);
        // solo i messaggi che arrivano dal servizio sono mostrabili: quelli del
        // browser («Failed to fetch») non dicono niente a chi sta scrivendo
        errore.dalServizio = !!m;
        throw errore;
      });
    }).catch(function (e) {
      pannello(form, "Non siamo riusciti a inviare",
        (e && e.dalServizio ? e.message + " " : "") +
        "Riprovate fra qualche minuto: quello che avete scritto è ancora nel modulo.",
        "errore", false);
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
        form.setAttribute("novalidate", "");
        form.addEventListener("submit", function (ev) { invia(form, ev); });
        // l'errore sparisce appena si rimette mano al campo
        form.addEventListener("input", function (ev) {
          if (ev.target && ev.target.hasAttribute("required")) { pulisci(ev.target); }
        });
      })(moduli[i]);
    }
  });
})();
