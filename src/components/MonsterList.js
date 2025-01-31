import { useState, useEffect, useRef } from "react";
import MonsterCard from "./MonsterCard";
import "../styles/monster.css";

export default function MonsterList({ monsters }) {
  const defaultFilters = {
    searchTerm: "",
    selectedStep: "all",
    possessionFilter: "all",
    monsterTypes: { monstre: true, archimonstre: true, boss: true },
    sortBy: "step" // Tri par étape par défaut
  };

  const loadSavedFilters = () => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("monsterFilters")) || defaultFilters;
    }
    return defaultFilters;
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const [visibleMonsters, setVisibleMonsters] = useState(monsters.slice(0, 30));
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const allMonstersLoaded = useRef(false);

  useEffect(() => {
    const savedFilters = loadSavedFilters();
    setFilters(savedFilters);
    setFiltersLoaded(true);
  }, []);

  useEffect(() => {
    if (filtersLoaded && typeof window !== "undefined") {
      localStorage.setItem("monsterFilters", JSON.stringify(filters));
    }
  }, [filters, filtersLoaded]);

  useEffect(() => {
    if (!allMonstersLoaded.current) {
      setTimeout(() => {
        setVisibleMonsters(monsters);
        setIsLoadingMore(false);
        allMonstersLoaded.current = true;
      }, 100);
    }
  }, [monsters]);

  const filteredMonsters = visibleMonsters.filter((monster) => {
    if (filters.searchTerm && !monster.nom.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    if (filters.selectedStep !== "all" && monster.etape !== filters.selectedStep) return false;
    if (filters.possessionFilter === "possessed" && monster.quantite < 1) return false;
    if (filters.possessionFilter === "not-possessed" && monster.quantite > 0) return false;
    if (filters.possessionFilter === "duplicates" && monster.quantite < 2) return false;
    if (!filters.monsterTypes[monster.type]) return false;
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "name": return a.nom.localeCompare(b.nom);
      case "step": return a.etape - b.etape;
      case "quantity": return b.quantite - a.quantite;
      default: return 0;
    }
  });

  const resetFilters = () => {
    setFilters(defaultFilters);
    localStorage.setItem("monsterFilters", JSON.stringify(defaultFilters));
  };

  const renderMonstersWithSeparators = () => {
    const monstersWithSeparators = [];
    let previousStep = null;

    // Si trié par "step", afficher les séparateurs
    const shouldShowStepSeparator = filters.sortBy === "step" || filters.sortBy === "step_name";

    filteredMonsters.forEach((monster, index) => {
      if (shouldShowStepSeparator && previousStep !== monster.etape) {
        monstersWithSeparators.push(
          <div key={`separator-${monster.etape}`} className="step-separator">
            <span>Étape {monster.etape}</span>
          </div>
        );
      }
      monstersWithSeparators.push(
        <MonsterCard key={monster.id} monster={monster} />
      );
      previousStep = monster.etape;
    });

    return monstersWithSeparators;
  };

  return (
    <div className="monster-list-container">
      {/* Barre de recherche */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="🔍 Rechercher un monstre..."
          value={filters.searchTerm}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
          className="search-bar"
        />
      </div>

      {/* Filtres */}
      <div className="filters-container">
        <div className="filter-group">
          <label>Étape :</label>
          <select value={filters.selectedStep} onChange={(e) => setFilters({ ...filters, selectedStep: e.target.value })}>
            <option value="all">Toutes</option>
            {[...new Set(monsters.map((monster) => monster.etape))].map((step) => (
              <option key={step} value={step}>{step}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Possession :</label>
          <select value={filters.possessionFilter} onChange={(e) => setFilters({ ...filters, possessionFilter: e.target.value })}>
            <option value="all">Tous</option>
            <option value="possessed">Possédés</option>
            <option value="not-possessed">Non possédés</option>
            <option value="duplicates">Doublons</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Trier par :</label>
          <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
            <option value="step">Étape</option>
            <option value="name">Nom</option>
            <option value="quantity">Nombre d'exemplaires</option>
          </select>
        </div>

        <div className="filter-group type-filters">
          <button
            className={`filter-btn ${filters.monsterTypes.monstre ? "active" : ""}`}
            onClick={() => setFilters({ ...filters, monsterTypes: { ...filters.monsterTypes, monstre: !filters.monsterTypes.monstre } })}
          >
            Monstres
          </button>
          <button
            className={`filter-btn ${filters.monsterTypes.archimonstre ? "active" : ""}`}
            onClick={() => setFilters({ ...filters, monsterTypes: { ...filters.monsterTypes, archimonstre: !filters.monsterTypes.archimonstre } })}
          >
            Archimonstres
          </button>
          <button
            className={`filter-btn ${filters.monsterTypes.boss ? "active" : ""}`}
            onClick={() => setFilters({ ...filters, monsterTypes: { ...filters.monsterTypes, boss: !filters.monsterTypes.boss } })}
          >
            Boss
          </button>
        </div>

        {/* Bouton de réinitialisation */}
        <button onClick={resetFilters} className="reset-button">
          Réinitialiser
        </button>
      </div>

      {/* Liste des monstres triés avec séparateurs */}
      <div className="monster-list">
        {renderMonstersWithSeparators()}
      </div>

      {isLoadingMore && <p className="loading-text">Chargement des autres monstres...</p>}
    </div>
  );
}
