export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  // Récupération des données envoyées par le client
  const { pseudo, apiKey, secretKey, monsters } = req.body;

  if (!pseudo || !apiKey || !secretKey) {
    return res.status(400).json({ message: "Pseudo, Clé API et Clé secrète requis." });
  }

  const API_BASE_URL = "https://api.metamob.fr";
  const url = `${API_BASE_URL}/utilisateurs/${pseudo}/monstres`;

  try {
    console.log("🔄 Envoi des données à Metamob :", monsters);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "HTTP-X-APIKEY": apiKey,
        "HTTP-X-USERKEY": secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(monsters),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erreur API Metamob :", data.erreurs);
      return res.status(response.status).json({ message: data.erreurs });
    }

    console.log("✅ Mise à jour réussie :", data.reussite);
    return res.status(200).json({ message: "Mise à jour réussie", data });
  } catch (error) {
    console.error("❌ Erreur lors de la requête serveur :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
}
