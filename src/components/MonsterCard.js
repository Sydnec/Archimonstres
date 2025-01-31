import { useState, useEffect } from "react";
import Image from "next/image";
import { updateMonsterCount } from "@/utils/metamobApi";
import "../styles/monster.css";

export default function MonsterCard({ monster }) {
  const [count, setCount] = useState(parseInt(monster.quantite) || 0);
  const [tempCount, setTempCount] = useState(parseInt(monster.quantite) || 0);
  const [error, setError] = useState("");
  const [updateTimer, setUpdateTimer] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // ⏳ Déclenche l'animation au montage du composant
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Mise à jour locale immédiate + envoi asynchrone à l'API
  const handleUpdate = async (newCount) => {
    const previousCount = count; // Sauvegarde en cas d’échec API

    // ✅ Mise à jour immédiate en local
    setCount(newCount);
    setTempCount(newCount);
    setError("");

    // 🔄 Envoi en arrière-plan
    const success = await updateMonsterCount(monster.id, newCount);
    
    // ❌ En cas d’échec API, on remet l’ancienne valeur
    if (!success) {
      setCount(previousCount);
      setTempCount(previousCount);
      setError("Erreur de mise à jour.");
    }
  };

  // Gestion de la saisie utilisateur avec délai
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setTempCount(value);

      if (updateTimer) clearTimeout(updateTimer);
      setUpdateTimer(
        setTimeout(() => {
          if (value !== "" && !isNaN(value)) {
            handleUpdate(parseInt(value));
          }
        }, 400) // ⏳ Mise à jour après 400ms d'inactivité
      );
    }
  };

  // Sélection automatique du texte dans l'input
  const handleFocus = (e) => {
    setTimeout(() => {
      e.target.select();
    }, 0);
  };

  return (
    <div className={`monster-card ${isVisible ? "fade-in" : ""}`}>
      <div className="image-container">
        <Image
          src={monster.image_url}
          alt={monster.nom}
          width={120}
          height={120}
          priority={false}
          className="monster-image"
        />
      </div>
      <h2 className="monster-name">{monster.nom}</h2>

      <div className="counter">
        <button onClick={() => handleUpdate(count - 1)} disabled={count <= 0}>-</button>
        <input
          type="text"
          value={tempCount}
          onChange={handleInputChange}
          onFocus={handleFocus}
          className="counter-input"
        />
        <button onClick={() => handleUpdate(count + 1)}>+</button>
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
