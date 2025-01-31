const API_BASE_URL = 'https://api.metamob.fr';

export async function fetchMonsters() {
    try {
        const pseudo = process.env.NEXT_PUBLIC_METAMOB_PSEUDO;
        const url = `${API_BASE_URL}/utilisateurs/${pseudo}/monstres`;

        console.log(`🔍 Récupération des monstres pour ${pseudo}...`);

        const response = await fetch(url, {
            headers: {
                'HTTP-X-APIKEY': process.env.NEXT_PUBLIC_METAMOB_API_KEY,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erreur API :', response.status, errorText);
            throw new Error(`Erreur API ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Monstres récupérés :', data);
        return data;
    } catch (error) {
        console.error('❌ Erreur lors de la récupération :', error);
        return [];
    }
}

export async function updateMonsterCount(monsterId, quantity, state = null) {
  try {
    const body = [{ id: monsterId, quantite: quantity }];
    if (state) {
      body[0].etat = state;
    }

    const response = await fetch("/api/updateMonsters", {
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
