import { useState } from "react";
import { CredentialsForm } from "./components/CredentialsForm";
import { ChatWindow } from "./components/ChatWindow";
import type { GreenApiCredentials } from "./types/greenApi";

function App() {
  const [credentials, setCredentials] =
    useState<GreenApiCredentials | null>(null);

  return (
    <>
      {!credentials ? (
        <CredentialsForm
          onSubmit={setCredentials}
        />
      ) : (
        <ChatWindow
          credentials={credentials}
        />
      )}
    </>
  );
}

export default App;