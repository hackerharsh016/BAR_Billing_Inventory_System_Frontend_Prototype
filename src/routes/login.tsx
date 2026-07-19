import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [u, setU] = useState("admin");
  const [p, setP] = useState("admin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          nav({ to: "/" });
        }}
        className="w-full max-w-sm admin-panel"
      >
        <div className="flex flex-col items-center pt-8 pb-4 border-b">
          <div className="w-12 h-12 rounded-sm bg-primary text-primary-foreground flex items-center justify-center font-bold">
            CB
          </div>
          <h1 className="mt-3 text-lg font-semibold">Copper Barrel Admin</h1>
          <p className="text-xs text-muted-foreground">Sign in to your account</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Username</label>
            <input
              value={u}
              onChange={(e) => setU(e.target.value)}
              className="w-full border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Password</label>
            <input
              type="password"
              value={p}
              onChange={(e) => setP(e.target.value)}
              className="w-full border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" defaultChecked /> Remember me
          </label>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-sm text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            <Lock size={14} /> Sign In
          </button>
          <p className="text-[11px] text-center text-muted-foreground">
            Prototype — any credentials accepted
          </p>
        </div>
      </form>
    </div>
  );
}
