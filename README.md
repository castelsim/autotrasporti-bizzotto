# Autotrasporti Bizzotto — sito

Sorgente di **https://autotrasportibizzotto.it**, il sito di Autotrasporti Bizzotto Srl (Cassola, VI): trasporto di carburanti in cisterna, conto terzi, in ADR.

Sito statico pubblicato con GitHub Pages dal ramo `main`: ogni modifica unita su `main` è online in un paio di minuti.

## Pagine

| File | Pagina |
|------|--------|
| `index.html` | Home |
| `trasporti.html` | Cosa si trasporta e come funziona una consegna |
| `trasporto-adr.html` | Gli obblighi di legge di chi trasporta carburante |
| `azienda.html` | L'azienda, i mezzi, una giornata di lavoro |
| `contatti.html` | Modulo di richiesta |
| `privacy.html`, `cookie.html` | Informative |

Lo stile comune sta in `stile.css`, caricato dopo lo stile in testa a ogni pagina. I caratteri sono in `font/`, serviti dal dominio stesso. Le fotografie sono in `img/`, in WebP e JPG a più larghezze.

## Il modulo

Il sito non pubblica telefono né email: le richieste passano solo dal modulo. Per attivarlo si incolla l'indirizzo Formspree nella riga indicata in cima a `modulo.js`. Finché resta il segnaposto il modulo non spedisce e lo dice a chi lo compila.

## Motori di ricerca

- `sitemap.xml` elenca le pagine da indicizzare: va aggiornata la data `lastmod` quando una pagina cambia.
- Le pagine nuove si segnalano a Bing e agli altri motori IndexNow con la chiave in radice (file `.txt` di 32 caratteri).
- `archivio/` contiene i materiali di lavoro (proposte grafiche, prove del marchio): è escluso dai motori con `robots.txt` e `noindex`.
