export async function fetchMonsters(pseudo, apiKey) {
  try {
    const response = await fetch("/api/fetchMonsters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pseudo, apiKey }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur API interne :", response.status, errorText);
      throw new Error(`Erreur API interne ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Monstres récupérés :", data);
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération :", error);
    return [];
  }
}

export async function updateMonsterCount(monsterId, quantity, state = null) {
  try {
    // Récupération des identifiants depuis localStorage
    const pseudo = localStorage.getItem("pseudo");
    const apiKey = localStorage.getItem("apiKey");
    const secretKey = localStorage.getItem("secretKey");

    if (!pseudo || !apiKey || !secretKey) {
      throw new Error("Pseudo, Clé API et Clé secrète sont requis.");
    }

    const body = {
      pseudo,
      apiKey,
      secretKey,
      monsters: [{ id: monsterId, quantite: quantity }],
    };
    if (state) {
      body.monsters[0].etat = state;
    }

    const response = await fetch("/api/updateMonster", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erreur API interne :", data.message);
      throw new Error(`Erreur API interne ${response.status}: ${data.message}`);
    }

    console.log("✅ Mise à jour réussie :", data.data.reussite);
    return data.data.reussite;
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour :", error);
    return false;
  }
}
