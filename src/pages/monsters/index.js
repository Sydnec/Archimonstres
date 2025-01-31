import MonsterList from "@/components/MonsterList";
import { fetchMonsters } from "@/utils/metamobApi";

export async function getServerSideProps() {
  try {
    const monsters = await fetchMonsters();

    // ⚡ Réduire les données envoyées au client
    const optimizedMonsters = monsters.map((monster) => ({
      id: monster.id,
      nom: monster.nom,
      image_url: monster.image_url,
      etape: monster.etape,
      quantite: monster.quantite || 0,
      type: monster.type,
    }));

    return { props: { monsters: optimizedMonsters } };
  } catch (error) {
    console.error("Erreur lors de la récupération des monstres :", error);
    return { props: { monsters: [] } };
  }
}

export default function MonstersPage({ monsters }) {
  return (
    <div className="monsters-container">
      {monsters.length > 0 ? <MonsterList monsters={monsters} /> : <p>Aucun monstre trouvé.</p>}
    </div>
  );
}
