Ønsker du å legge til API-støtte i CORTEX-prosjektet ditt? Her er noen måter du kan gjøre dette på, avhengig av hvor omfattende og sikker du vil at løsningen skal være.

---

## 1. **Eksempel: Enkel API-integrasjon med fetch (kun frontend)**

Hvis du har eller vil koble til et eksternt API (f.eks. for å hente anomalier, brukere, etc.), kan du bruke `fetch` direkte i komponentene dine:

```js
// Eksempel: Hent anomalier fra et REST API
useEffect(() => {
  fetch("https://api.dittdomene.no/anomalies")
    .then(res => res.json())
    .then(data => setAnomalies(data))
    .catch(err => console.error(err));
}, []);
```
Du kan legge slike kall i egne hooks eller direkte i relevante komponenter.

---

## 2. **Eksempel: Lage en egen Node.js API-backend**

Vil du ha mer kontroll, kan du opprette en enkel Express-server i en egen mappe (`/api`):

```js
// api/server.js (Node.js + Express)
const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

// Eksempel-endepunkt:

            app.get('/api/anomalies', (req, res) => {
              res.json([
                { time: "2025-06-28 12:00", description: "Ugyldig tilgang", type: "Sikkerhet" }
              ]);
            });
            
            app.listen(PORT, () => console.log(`API kjører på http://localhost:${PORT}`));
```
**Kjør backend med:**  
```sh
cd api
npm install express
node server.js
```
I frontend bruker du `fetch("http://localhost:3001/api/anomalies")`.

---

## 3. **API-støtte for autentisering og rapportering**
Du kan utvide API-et til å støtte POST (for å rapportere anomalier) eller autentisering (JWT, OAuth, etc.):

```js
// Rapportere avvik (POST)
app.post('/api/anomalies', (req, res) => {
  // Lagre/analyser req.body
  res.status(201).json({ status: "OK" });
});
```

---

## 4. **Integrasjon i frontend (React)**
Lag gjerne egen fil for API-kall, f.eks. `src/api.js`:

```js
export async function getAnomalies() {
  const res = await fetch("/api/anomalies"); // Antar proxy i dev-server
  return res.json();
}
```

---

## 5. **Tips**
- For produksjon: Husk CORS, sikkerhet, logging, rate limiting.
- For utvikling: Sett opp proxy i `package.json` (React):
  ```json
  "proxy": "http://localhost:3001"
  ```

---

Ønsker du eksempel på komplett backend, autentisering, eller hvordan koble frontend og backend sammen?  
Eller vil du ha forslag på API-struktur eller OpenAPI-dokumentasjon?  
Gi beskjed om hvor avansert du ønsker det!
