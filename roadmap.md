### CORTEX 6.0 - Utviklingsplan for GitHub-integrasjon
Introduksjon
Målet med CORTEX versjon 6.0 er å integrere systemet med GitHub for å muliggjøre persistent datalagring, versjonskontroll av databaser og logger, og fremtidig samarbeid. Dette flytter datahåndteringen fra midlertidige, lokale filer til en robust, skybasert løsning.

Fase 1: Autentisering og autorisering (Uke 27: 30. juni - 6. juli 2025)
Mål: Etablere en sikker tilkobling mellom CORTEX-applikasjonen og en brukers GitHub-konto.

Oppgaver:

Implementere OAuth 2.0: Sette opp en OAuth 2.0-flyt for å la brukere logge inn med sin GitHub-konto.

Lage UI for innlogging: Utvikle et nytt UI-element, sannsynligvis en modal eller en egen side, der brukeren kan initiere GitHub-innloggingen.

Sikker Token-håndtering: Lagre det mottatte OAuth-tokenet på en sikker måte i klientsesjonen. Unngå usikre metoder som localStorage.

Håndtere utløpte tokens: Implementere logikk for å håndtere utløpte tokens, enten ved å be brukeren logge inn på nytt eller ved å bruke et refresh-token hvis GitHub API-et støtter det.

Milepæl: En bruker kan logge inn med GitHub, og applikasjonen har et gyldig token for å gjøre autentiserte API-kall.

Fase 2: Repository og datastruktur (Uke 28: 7. juli - 13. juli 2025)
Mål: Definere og håndtere datastrukturen i et dedikert GitHub-repository.

Oppgaver:

UI for repository-valg: Utvikle funksjonalitet som lar brukeren velge et eksisterende repository eller opprette et nytt, for eksempel cortex-database, direkte fra CORTEX-grensesnittet.

Definere filstruktur: Etablere en klar og konsistent mappestruktur i repositoryet. Eksempel:

/data/known_faces.json

/data/unknown_faces_cache.json

/settings/config.json (for f.eks. toleranseverdi)

/logs/YYYY-MM-DD.log (for daglige logger)

Implementere leselogikk: Sørge for at applikasjonen ved oppstart, etter vellykket autentisering, leser data fra de definerte filene i det valgte repositoryet og bruker disse til å populere sin interne tilstand (kjente fjes, innstillinger etc.).

Milepæl: CORTEX kan lese og tolke data fra et spesifisert GitHub-repository for å gjenopprette sin forrige tilstand.

Fase 3: Datalagring (Committing) (Uke 29: 14. juli - 20. juli 2025)
Mål: Gjøre det mulig å lagre all applikasjonsdata tilbake til GitHub-repositoryet.

Oppgaver:

Erstatte "Eksporter"-knapper: Fjerne de lokale eksport-knappene og erstatte dem med en enkelt "Synkroniser til GitHub"-knapp.

Implementere GitHub API for skriving: Bruke GitHub API-et for å opprette, oppdatere og slette filer. Dette innebærer å lage "commits".

Automatiske Commit-meldinger: Generere informative commit-meldinger automatisk for å skape en lesbar versjonshistorikk. Eksempler:

CORTEX: Registrerte nytt individ 'John Doe'

CORTEX: Synkroniserte systemlogg for 2025-07-15

CORTEX: Oppdaterte toleranseinnstilling til 0.55

Konflikthåndtering (forenklet): Implementere en enkel strategi for å unngå datatap, for eksempel ved alltid å hente siste versjon av en fil (pull) før man skriver nye endringer (push). I første omgang kan en "siste skriving vinner"-strategi være tilstrekkelig.

Milepæl: Alle endringer gjort i CORTEX (nye fjes, logghendelser) blir pålitelig lagret som commits i brukerens GitHub-repository.

Fase 4: UI/UX-integrasjon og testing (Uke 30: 21. juli - 27. juli 2025)
Mål: Sikre at hele GitHub-integrasjonen er intuitiv og feilfri for brukeren.

Oppgaver:

Visuell feedback: Gi brukeren tydelig visuell status på synkronisering (f.eks. ikoner eller tekst som viser "Synkroniserer...", "Oppdatert", "Synkronisering feilet").

Statusvisning: Vise navnet på det tilkoblede repositoryet og den innloggede GitHub-brukeren et sted i grensesnittet.

Logg ut-funksjon: Implementere en "Logg ut fra GitHub"-knapp som sletter tokenet fra sesjonen og tilbakestiller applikasjonen til en ikke-autentisert tilstand.

Ende-til-ende-testing: Gjennomføre grundig testing av hele arbeidsflyten: innlogging, valg av repo, gjøre endringer, synkronisere, restarte appen og verifisere at dataene er lastet korrekt.

Milepæl: CORTEX 6.0 er funksjonelt komplett med en robust og brukervennlig GitHub-integrasjon.
