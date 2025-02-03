import { useState, useEffect } from "react";
import "../styles/apiForm.css";

export default function ApiForm({ onSubmit }) {
  const [apiKey, setApiKey] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [secretKey, setSecretKey] = useState("");

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedApiKey = localStorage.getItem("apiKey");
    const savedPseudo = localStorage.getItem("pseudo");
    const savedSecretKey = localStorage.getItem("secretKey");

    if (savedApiKey) setApiKey(savedApiKey);
    if (savedPseudo) setPseudo(savedPseudo);
    if (savedSecretKey) setSecretKey(savedSecretKey);
  }, []);

  // Sauvegarder les données dans localStorage lorsqu'elles changent
  useEffect(() => {
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("pseudo", pseudo);
    localStorage.setItem("secretKey", secretKey);
  }, [apiKey, pseudo, secretKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ apiKey, pseudo, secretKey });
  };

  return (
    <div className="api-key-container">
      <h1>Connexion à Metamob</h1>

      {/* ✅ Ajout du tutoriel */}
      <div className="api-tutorial">
        <h2>📖 Comment récupérer vos clés API Metamob ?</h2>
        <ol>
          <li>Connectez-vous à votre compte sur <a href="https://www.metamob.fr" target="_blank" rel="noopener noreferrer">Metamob.fr</a>.</li>
          <li>Allez dans l’onglet <strong>"Mon Compte"</strong>.</li>
          <li>Dans la section <strong>"API"</strong>, vous trouverez :</li>
          <ul>
            <li><strong>Clé API :</strong> Utilisée pour accéder aux données publiques de votre compte.</li>
            <li><strong>Clé secrète :</strong> Requise pour modifier vos monstres.</li>
          </ul>
          <li>Copiez ces clés et collez-les ci-dessous.</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Pseudo Metamob (optionnel) :</label>
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Entrez votre pseudo"
            className="api-key-input"
          />
        </div>
        
        <div className="form-group">
          <label>Clé API Metamob (obligatoire) :</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Clé API"
            className="api-key-input"
          />
        </div>

        <div className="form-group">
          <label>Clé secrète Metamob (optionnel) :</label>
          <input
            type="text"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Entrez votre clé secrète"
            className="api-key-input"
          />
        </div>

        <button type="submit" className="submit-button">Soumettre</button>
      </form>
    </div>
  );
}
