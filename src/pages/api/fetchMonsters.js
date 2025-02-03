export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Méthode non autorisée" });
    }
  
    const { pseudo, apiKey } = req.body;
  
    if (!pseudo || !apiKey) {
      return res.status(400).json({ message: "Pseudo et Clé API requis." });
    }
  
    const API_BASE_URL = "https://api.metamob.fr";
    const url = `${API_BASE_URL}/utilisateurs/${pseudo}/monstres`;
  
    try {
      const response = await fetch(url, {
        headers: {
          "HTTP-X-APIKEY": apiKey,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erreur API :", response.status, errorText);
        return res.status(response.status).json({ message: errorText });
      }
  
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération :", error);
      return res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
  