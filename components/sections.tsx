"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChefHat,
  Flame,
  Heart,
  Leaf,
  MapPin,
  MessageCircle,
  Plus,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { deals, menu, MenuItem, money, whatsapp } from "@/lib/menu";
import { useCart } from "./site-shell";
// One observer for all sections; disconnect each target after its first reveal.
let revealObserver: IntersectionObserver | undefined;
export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (
      !node ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    revealObserver ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending");
            entry.target.classList.add("is-revealed");
            revealObserver?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 },
    );
    // Arm only offscreen content so the first paint and no-JS content stay visible.
    if (node.getBoundingClientRect().top > window.innerHeight) {
      node.classList.add("reveal-pending");
    }
    revealObserver.observe(node);
    return () => revealObserver?.unobserve(node);
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  );
}
export function FoodCard({ item }: { item: MenuItem }) {
  const { add } = useCart();
  return (
    <article className="food-card">
      <div className="food-image">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw"
        />
        {item.badge && (
          <span className="food-badge">
            {item.badge === "BESTSELLER" && <Flame size={11} />} {item.badge}
          </span>
        )}
        <button
          onClick={() => add(item)}
          aria-label={`Add ${item.name} to order`}
          className="quick-add"
        >
          <Plus size={19} />
        </button>
      </div>
      <div className="food-content">
        <div className="food-category">
          {item.category === "Pizza"
            ? "STONE-BAKED PIZZA"
            : item.category.toUpperCase()}
        </div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="food-bottom">
          <strong>
            {money(item.price)}{" "}
            <small>{item.category === "Pizza" ? " / regular" : ""}</small>
          </strong>
          <button
            onClick={() => add(item)}
            aria-label={`Add ${item.name} to order`}
          >
            Add to order <Plus size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}
export function MenuSection({ full = false }: { full?: boolean }) {
  return (
    <Suspense
      fallback={
        <div className="section container">Loading the good stuff…</div>
      }
    >
      <MenuContent full={full} />
    </Suspense>
  );
}
function MenuContent({ full }: { full: boolean }) {
  const params = useSearchParams();
  const requested = params.get("category");
  const [chosen, setCategory] = useState<string | null>(null);
  const category =
    chosen ||
    (requested && ["Pizza", "Burgers", "Fast Food"].includes(requested)
      ? requested
      : "All");
  const [query, setQuery] = useState("");
  const filtered = menu.filter(
    (i) =>
      (category === "All" || i.category === category) &&
      `${i.name} ${i.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  const items = full
    ? filtered
    : [menu[0], menu[1], menu[5], menu[11]].filter(
        (i) => category === "All" || i.category === category,
      );
  return (
    <section
      className={`section menu-section ${full ? "full-menu" : ""}`}
      id="menu"
    >
      <div className="container">
        <Reveal>
          <div className="section-heading">
            <div>
              <Eyebrow>THE GOOD STUFF</Eyebrow>
              <h2>
                {full ? (
                  "Find your new favorite."
                ) : (
                  <>
                    Meet your next <span>craving.</span>
                  </>
                )}
              </h2>
              <p>Fresh from our kitchen. Straight to your happy place.</p>
            </div>
            {!full && (
              <Link href="/menu" className="text-link">
                Explore full menu <ArrowUpRight size={18} />
              </Link>
            )}
          </div>
          <div className="menu-toolbar">
            <div className="category-tabs" aria-label="Menu categories">
              {["All", "Pizza", "Burgers", "Fast Food"].map((c, i) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={category === c ? "selected" : ""}
                  aria-pressed={category === c}
                >
                  {i === 0 ? (
                    <UtensilsCrossed size={15} />
                  ) : i === 1 ? (
                    <Flame size={15} />
                  ) : i === 2 ? (
                    <ChefHat size={15} />
                  ) : (
                    <Heart size={15} />
                  )}{" "}
                  {c === "All" ? "All favorites" : c}
                </button>
              ))}
            </div>
            {full && (
              <input
                className="menu-search"
                type="search"
                aria-label="Search the menu"
                placeholder="Search your cravings…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            )}
          </div>
        </Reveal>
        <div className="food-grid">
          {items.map((item) => (
            <Reveal key={item.id}>
              <FoodCard item={item} />
            </Reveal>
          ))}
        </div>
        {!items.length && (
          <p className="empty-results">
            No matches yet. Try a different craving.
          </p>
        )}
        <p className="menu-disclaimer">
          Illustrative menu & prices. Please confirm sizes, availability and
          final prices when ordering.
        </p>
      </div>
    </section>
  );
}
export function WhyUs() {
  return (
    <section className="why-section section">
      <div className="container">
        <Reveal className="why-layout">
          <div>
            <Eyebrow>THE STONE BAKE DIFFERENCE</Eyebrow>
            <h2>
              Good food.
              <br />
              No <span>shortcuts.</span>
            </h2>
            <p>
              Because a great meal starts long before
              <br className="desktop-break" /> the first bite.
            </p>
            <Link href="/about" className="text-link">
              A little more about us <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="values-grid">
            {[
              [
                Flame,
                "Stone-baked perfection",
                "A golden crust. A tender center. That unmistakable, oven-baked flavor.",
              ],
              [
                Leaf,
                "Fresh, quality ingredients",
                "Thoughtfully chosen ingredients that let every single flavor shine.",
              ],
              [
                ChefHat,
                "Crafted with passion",
                "From our signature sauce to the final topping, we put care into every bite.",
              ],
              [
                Heart,
                "Made for good moments",
                "Family dinners, late-night cravings and everything in between.",
              ],
            ].map(([Icon, title, desc]) => {
              const I = Icon as typeof Flame;
              return (
                <div className="value" key={String(title)}>
                  <div className="value-icon">
                    <I size={23} />
                  </div>
                  <h3>{String(title)}</h3>
                  <p>{String(desc)}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
export function OffersSection({ full = false }: { full?: boolean }) {
  const { add } = useCart();
  return (
    <section className="section offers-section">
      <div className="container">
        <Reveal>
          <div className="section-heading">
            <div>
              <Eyebrow>MORE BITES. MORE JOY.</Eyebrow>
              <h2>
                Big on flavor. <span>Bigger on value.</span>
              </h2>
            </div>
            {!full && (
              <Link href="/offers" className="text-link">
                All our offers <ArrowUpRight size={18} />
              </Link>
            )}
          </div>
        </Reveal>
        <div className={full ? "offers-grid full-offers" : "offers-grid"}>
          {deals.slice(0, full ? 4 : 2).map((item, i) => (
            <Reveal key={item.id}>
              <article className={`offer-card offer-${i}`}>
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width:700px) 100vw, 50vw"
                />
                <div className="offer-shade" />
                <div className="offer-copy">
                  <span className="offer-label">{item.badge}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <strong>{money(item.price)}</strong>
                  <button className="button" onClick={() => add(item)}>
                    Get this deal <ArrowUpRight size={16} />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="menu-disclaimer">
          Sample promotions. Confirm current offers and availability with the
          restaurant.
        </p>
      </div>
    </section>
  );
}
const reviews = [
  {
    name: "Ahmed R.",
    initials: "AR",
    text: "That perfectly baked crust and the generous toppings — exactly what a pizza night should taste like.",
    tag: "Pizza night, perfected",
  },
  {
    name: "Ayesha K.",
    initials: "AK",
    text: "The chicken tikka pizza is my pick. Big flavor, melty cheese, and something the whole family can enjoy.",
    tag: "A family favorite",
  },
  {
    name: "Hassan M.",
    initials: "HM",
    text: "A crispy zinger, hot fries, and good company. The kind of comfort food you keep coming back for.",
    tag: "Comfort in every bite",
  },
];
export function ReviewsSection({ full = false }: { full?: boolean }) {
  return (
    <section className="section reviews-section">
      <div className="container">
        <Reveal>
          <div className="section-heading">
            <div>
              <Eyebrow>GOOD FOOD. HAPPY PEOPLE.</Eyebrow>
              <h2>
                A little love, <span>by the slice.</span>
              </h2>
            </div>
            <a
              className="text-link"
              href="https://www.google.com/maps/search/Stone+Bake+Pizza+Dina+Jhelum"
              target="_blank"
              rel="noreferrer"
            >
              Find us on Google <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="review-grid">
            {reviews.map((r) => (
              <article className="review-card" key={r.name}>
                <div className="review-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star size={14} key={i} fill="currentColor" />
                  ))}
                  <span className="google-g">G</span>
                </div>
                <h3>{r.tag}</h3>
                <blockquote>“{r.text}”</blockquote>
                <div className="review-person">
                  <span>{r.initials}</span>
                  <div>
                    <strong>{r.name}</strong>
                    <small>Sample customer story</small>
                  </div>
                  <Check size={14} />
                </div>
              </article>
            ))}
          </div>
          <p className="menu-disclaimer">
            Illustrative testimonials for this website preview — not verified
            customer reviews.
          </p>
          {full && (
            <div className="review-cta">
              <h3>How was your Stone Bake moment?</h3>
              <p>
                We’d love to hear about your visit. Find our listing to share
                your experience.
              </p>
              <a
                className="button"
                href="https://www.google.com/maps/search/Stone+Bake+Pizza+Dina+Jhelum"
                target="_blank"
                rel="noreferrer"
              >
                Find us & leave a review <ArrowUpRight size={17} />
              </a>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
export function Location() {
  return (
    <section className="section location-section">
      <div className="container">
        <Reveal className="location-layout">
          <div>
            <Eyebrow>YOUR NEXT FOOD STOP</Eyebrow>
            <h2>
              Great pizza.
              <br />
              <span>Right here in Dina.</span>
            </h2>
            <p>
              Bring your appetite. Bring your people.
              <br />
              We’ll take care of the good food.
            </p>
            <div className="location-detail">
              <MapPin size={20} />
              <span>
                <strong>Stone Bake Pizza</strong>
                <br />
                Dina, Jhelum, Pakistan
              </span>
            </div>
            <div className="location-actions">
              <a
                className="button"
                target="_blank"
                rel="noreferrer"
                href="https://www.google.com/maps/search/Stone+Bake+Pizza+Dina+Jhelum"
              >
                Find us on the map <ArrowUpRight size={17} />
              </a>
              <a href="tel:+923256120333" className="text-link">
                0325-6120333
              </a>
            </div>
          </div>
          <div className="map-frame">
            <iframe
              title="Map of Stone Bake Pizza in Dina, Jhelum"
              src="https://maps.google.com/maps?q=Stone%20Bake%20Pizza%20Dina%20Jhelum%20Pakistan&t=&z=14&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <span className="map-caption">
              <MapPin size={15} /> DINA, JHELUM · COME SAY HELLO
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
export function BottomCTA() {
  return (
    <section className="bottom-cta">
      <div className="container">
        <div>
          <Flame size={32} />
          <h2>
            Your cravings called.
            <br />
            We’re ready.
          </h2>
        </div>
        <Link href="/menu" className="button light-button">
          Let’s order something good <ArrowUpRight size={20} />
        </Link>
      </div>
    </section>
  );
}
export function ContactForm() {
  const [sent, setSent] = useState(false);
  function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    window.open(
      whatsapp(
        `Hello Stone Bake Pizza!\nName: ${d.get("name")}\nPhone: ${d.get("phone")}\n\n${d.get("message")}`,
      ),
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  }
  return (
    <form onSubmit={send} className="contact-form">
      <h2>Let’s talk food.</h2>
      <p>
        Questions, celebrations, or just a pizza craving? Send us a message.
      </p>
      <label>
        Your name
        <input
          name="name"
          placeholder="Full name"
          autoComplete="name"
          required
          maxLength={80}
        />
      </label>
      <label>
        Phone number
        <input
          type="tel"
          name="phone"
          placeholder="03XX-XXXXXXX"
          autoComplete="tel"
          pattern="[+0-9 ()-]{10,20}"
          required
        />
      </label>
      <label>
        Your message
        <textarea
          name="message"
          placeholder="Tell us what’s on your mind…"
          required
          maxLength={1500}
          rows={4}
        />
      </label>
      <button type="submit" className="button">
        <MessageCircle size={18} /> Send via WhatsApp <ArrowRight size={16} />
      </button>
      <p className="small muted">
        Opens WhatsApp with your message, ready for you to send.
      </p>
      {sent && (
        <p role="status" className="success-note">
          Your message is ready in WhatsApp. Press send there to get in touch.
        </p>
      )}
    </form>
  );
}
