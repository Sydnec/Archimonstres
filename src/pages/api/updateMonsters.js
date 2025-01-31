export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const pseudo = process.env.METAMOB_PSEUDO;
  const API_BASE_URL = "https://api.metamob.fr";
  const url = `${API_BASE_URL}/utilisateurs/${pseudo}/monstres`;

  try {
    console.log("🔄 Envoi des données à Metamob :", req.body);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "HTTP-X-APIKEY": process.env.METAMOB_API_KEY,
        "HTTP-X-USERKEY": process.env.METAMOB_USER_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
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
