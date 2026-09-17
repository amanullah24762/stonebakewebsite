import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="loading-state">
      <span className="eyebrow">404 · A SLICE IS MISSING</span>
      <h1>This one’s off the menu.</h1>
      <p>Let’s get you back to the good stuff.</p>
      <Link className="button" href="/menu">
        Explore our menu
      </Link>
    </main>
  );
}
