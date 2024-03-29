import { useAuthStore } from "@/stores/auth.store";
import { Button, Input } from "@nextui-org/react";
import { FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const isDemo = useMemo(() => import.meta.env.VITE_IS_DEMO !== undefined && import.meta.env.VITE_IS_DEMO === "true", [])

  const authLogin = useAuthStore((state) => state.login);

  async function login(e: FormEvent) {
    e.preventDefault();

    const response = await authLogin(username, password);

    if (response) {
      toast.success("Basarili");
      navigate("/");
      return;
    } else {
      toast.error("Kullanıcı adı veya şifre hatalı");
    }
  }

  function demoLoginBtn() {
    setUsername("demo")
    setPassword("admin123")
  }

  return (
    <form onSubmit={login}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <Input
          placeholder="Användarnamn"
          animated
          onChange={(e) => setUsername(e.currentTarget.value)}
          value={username}
        />
        <Input
          placeholder="Lösenord"
          animated
          type="password"
          onChange={(e) => setPassword(e.currentTarget.value)}
          value={password}
        />
        <div style={{ display:"flex", flexDirection:"row", gap: 10 }}>
        {isDemo  && <Button bordered color="gradient" onClick={demoLoginBtn}> Demo credentials </Button>}
        <Button type="submit">Logga in</Button>
        </div>

      </div>
    </form>
  );
}
