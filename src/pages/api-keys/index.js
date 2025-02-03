// ApiKeyPage.js
import { useState } from "react";
import ApiForm from "@/components/ApiForm";

export default function ApiKeyPage() {
  const [error, setError] = useState("");

  const handleApiSubmit = ({ apiKey, pseudo, secretKey }) => {
    // Sauvegarder les informations dans le localStorage
    if (apiKey) localStorage.setItem("apiKey", apiKey);
    if (pseudo) localStorage.setItem("pseudo", pseudo);
    if (secretKey) localStorage.setItem("secretKey", secretKey);

    // Rediriger vers la page des monstres
    window.location.href = "/monsters";
  };

  return (
    <div className="api-key-page">
      <ApiForm onSubmit={handleApiSubmit} />
    </div>
  );
}
