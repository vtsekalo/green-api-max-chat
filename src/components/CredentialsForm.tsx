import { useState } from "react";
import type { FormEvent } from "react";
import type { GreenApiCredentials } from "../types/greenApi";
import { getStateInstance } from "../api/greenApi";

interface CredentialsFormProps {
  onSubmit: (credentials: GreenApiCredentials) => void;
}

export function CredentialsForm({
  onSubmit,
}: CredentialsFormProps) {
  const [apiUrl, setApiUrl] = useState("https://api.green-api.com");
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!apiUrl.trim()) {
      setError("Введите API URL.");
      return;
    }

    if (!idInstance.trim()) {
      setError("Введите idInstance.");
      return;
    }

    if (!apiTokenInstance.trim()) {
      setError("Введите apiTokenInstance.");
      return;
    }

    const credentials: GreenApiCredentials = {
      apiUrl: apiUrl.trim(),
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    };

    setError("");
    setIsLoading(true);

    try {
      const state = await getStateInstance(credentials);

      switch (state.stateInstance) {
        case "authorized":
          onSubmit(credentials);
          break;

        case "notAuthorized":
          setError(
            "Инстанс существует, но не авторизован.",
          );
          break;

        case "blocked":
          setError(
            "Аккаунт заблокирован.",
          );
          break;

        case "starting":
          setError(
            "Инстанс запускается. Попробуйте позже.",
          );
          break;

        default:
          setError(
            `Неизвестное состояние: ${state.stateInstance}`,
          );
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Не удалось подключиться к GREEN-API.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>GREEN-API MAX Chat</h1>

      <label>
        API URL
        <input
          type="url"
          value={apiUrl}
          onChange={(event) =>
            setApiUrl(event.target.value)
          }
          placeholder="https://api.green-api.com"
        />
      </label>

      <label>
        idInstance
        <input
          type="text"
          value={idInstance}
          onChange={(event) =>
            setIdInstance(event.target.value)
          }
          placeholder="Введите idInstance"
        />
      </label>

      <label>
        apiTokenInstance
        <input
          type="password"
          value={apiTokenInstance}
          onChange={(event) =>
            setApiTokenInstance(event.target.value)
          }
          placeholder="Введите apiTokenInstance"
        />
      </label>

      {error && <p>{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
      >
        {isLoading
          ? "Проверяем..."
          : "Подключиться"}
      </button>
    </form>
  );
}