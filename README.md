# Autotrasporti Bizzotto — materiali di lavoro

Bozze del sito di **Autotrasporti Bizzotto Srl** (Cassola, VI): trasporto di carburanti in cisterna, conto terzi.

Pubblicate qui solo per poterle guardare da qualsiasi dispositivo e mostrarle. **Non è il sito dell'azienda** e non è indicizzato (`robots.txt` + `noindex`).

## Cosa c'è

- `mockup_sito/` — otto direzioni di homepage a confronto
- `logo_prove/` — tre wordmark in tracciati, da confrontare col logo attuale

## Stato

- I moduli non inviano niente: mostrano quali dati si chiedono a chi richiede un trasporto.
- Nessun numero di telefono, per scelta: il canale è il modulo verso `info@autotrasportibizzotto.it`.
- Le fotografie definitive non ci sono ancora: al loro posto ci sono segnaposto che descrivono lo scatto necessario.
- «Dal 1988» è da confermare con visura camerale prima della pubblicazione.

## Quando si va online per davvero

Il dominio `autotrasportibizzotto.it` è registrato ma solo parcheggiato. Per puntarlo qui servono, nel DNS Aruba, quattro record A verso GitHub Pages (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) e un CNAME `www`, più un file `CNAME` in questo repository.

GitHub Pages non processa i moduli: servirà un servizio esterno tipo Formspree o Web3Forms perché le richieste arrivino via email.
