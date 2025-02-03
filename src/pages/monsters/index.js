import { useState, useEffect } from "react";
import MonsterList from "@/components/MonsterList";
import { fetchMonsters } from "@/utils/metamobApi";

export default function MonstersPage() {
  const [monsters, setMonsters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pseudo = localStorage.getItem("pseudo");
    const apiKey = localStorage.getItem("apiKey");

    if (!pseudo || !apiKey) {
      console.error("Pseudo et Clé API requis.");
      setLoading(false);
      return;
    }

    fetchMonsters(pseudo, apiKey)
      .then((data) => {
        const optimizedMonsters = data.map((monster) => ({
          id: monster.id,
          nom: monster.nom,
          image_url: monster.image_url,
          etape: monster.etape,
          quantite: monster.quantite || 0,
          type: monster.type,
        }));
        setMonsters(optimizedMonsters);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des monstres :", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="monsters-container">
      {loading ? <p>Chargement...</p> : monsters.length > 0 ? <MonsterList monsters={monsters} /> : <p>Aucun monstre trouvé.</p>}
    </div>
  );
}
