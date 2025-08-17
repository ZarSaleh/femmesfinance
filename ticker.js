// server.js — exemple proxy très simple
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Exemple avec Finnhub (remplace par ton provider)
// FINNHUB_TOKEN à mettre dans tes variables d'env
app.get("/api/quotes", async (req, res) => {
  try {
    const symbols = (req.query.symbols || "").split(",").filter(Boolean).slice(0, 40);
    if (!symbols.length) return res.json([]);

    const results = await Promise.all(symbols.map(async sym => {
      // Adapte la logique selon l’API choisie
      const q = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${process.env.FINNHUB_TOKEN}`).then(r=>r.json());
      // Structure de sortie unifiée côté front:
      return {
        symbol: sym,
        name: sym,                 // idéalement, mappe symbol -> nom lisible depuis ta DB
        price: q.c ?? null,        // current
        changePercent: q.dp ?? 0   // delta %
      };
    }));

    res.set("Cache-Control", "public, max-age=30"); // léger cache CDN
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: "quote_fetch_failed" });
  }
});

app.listen(PORT, () => console.log("Proxy quotes up on", PORT));