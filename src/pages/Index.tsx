import { useState } from "react";
import LandingPage from "./LandingPage";
import Workspace from "./Workspace";

export default function Index() {
  const [view, setView] = useState<"landing" | "workspace">("landing");

  return view === "landing" 
    ? <LandingPage onStart={() => setView("workspace")} />
    : <Workspace onBack={() => setView("landing")} />;
}
