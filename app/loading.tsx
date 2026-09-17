import { Flame } from "lucide-react";
export default function Loading() {
  return (
    <main id="main" className="loading-state" role="status">
      <Flame className="loading-flame" size={46} />
      <p>Something good is coming…</p>
    </main>
  );
}
