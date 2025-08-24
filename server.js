import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/quotes", async (req, res) => {
  const symbols = req.query.symbols || "^FCHI,^GSPC,^NDX,AAPL,TSLA";
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;

  try {
    const r = await fetch(url);
    const json = await r.json();
    const data = json.quoteResponse.result.map(item => ({
      symbol: item.symbol,
      name: item.longName || item.shortName || item.symbol,
      price: item.regularMarketPrice,
      changePercent: item.regularMarketChangePercent
    }));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy lancé sur http://localhost:${PORT}`);
});
