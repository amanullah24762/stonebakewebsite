"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Flame,
  MapPin,
  Menu as MenuIcon,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { deals, menu, MenuItem, money, whatsapp } from "@/lib/menu";
type Line = { item: MenuItem; quantity: number };
type CartContextType = { add: (item: MenuItem) => void; open: () => void };
const CartContext = createContext<CartContextType>({
  add: () => {},
  open: () => {},
});
export const useCart = () => useContext(CartContext);
const links = [
  ["Home", "/"],
  ["Our Menu", "/menu"],
  ["About Us", "/about"],
  ["Offers", "/offers"],
  ["Gallery", "/gallery"],
  ["Reviews", "/reviews"],
  ["Contact", "/contact"],
];
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Stone Bake Pizza home">
      <span className="brand-mark">
        <Flame size={31} />
      </span>
      <span>
        STONE BAKE<small>P I Z Z A &nbsp; & &nbsp; M O R E</small>
      </span>
    </Link>
  );
}
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  const [opened, setOpened] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(false);
  const [sent, setSent] = useState(false);
  const [fulfillment, setFulfillment] = useState("delivery");
  const dialog = useRef<HTMLDivElement>(null);
  // Restore browser-only storage after hydration without changing the server-rendered markup.
  /* eslint-disable react-hooks/set-state-in-effect -- Hydrate the browser-only cart after SSR. */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("stone-bake-cart") || "[]");
      if (Array.isArray(saved))
        setLines(
          saved.flatMap((l: { id: string; quantity: number }) => {
            if (!l || typeof l !== "object") return [];
            const item = [...menu, ...deals].find((i) => i.id === l.id);
            return item && Number.isInteger(l.quantity) && l.quantity > 0
              ? [{ item, quantity: Math.min(l.quantity, 99) }]
              : [];
          }),
        );
    } catch {}
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(
          "stone-bake-cart",
          JSON.stringify(
            lines.map((l) => ({ id: l.item.id, quantity: l.quantity })),
          ),
        );
      } catch {
        /* Cart remains available in memory when storage is blocked. */
      }
    }
  }, [lines, ready]);
  useEffect(() => {
    if (!opened) return;
    const previous = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpened(false);
      if (e.key === "Tab") {
        const elements = dialog.current?.querySelectorAll<HTMLElement>(
          'button, a, input, textarea, select, [tabindex="0"]',
        );
        if (!elements?.length) return;
        const first = elements[0],
          last = elements[elements.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialog.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [opened]);
  const add = (item: MenuItem) => {
    setLines((prev) => {
      const found = prev.find((l) => l.item.id === item.id);
      return found
        ? prev.map((l) =>
            l.item.id === item.id
              ? { ...l, quantity: Math.min(99, l.quantity + 1) }
              : l,
          )
        : [...prev, { item, quantity: 1 }];
    });
    setSent(false);
    setStep(false);
    setOpened(true);
  };
  const quantity = (id: string, delta: number) =>
    setLines((prev) =>
      prev
        .map((l) =>
          l.item.id === id
            ? { ...l, quantity: Math.min(99, l.quantity + delta) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );
  const count = lines.reduce((n, l) => n + l.quantity, 0),
    total = lines.reduce((n, l) => n + l.quantity * l.item.price, 0);
  function checkout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const message = `Hello Stone Bake Pizza! I'd like to order:\n\n${lines.map((l) => `${l.quantity} × ${l.item.name} — ${money(l.item.price * l.quantity)}`).join("\n")}\n\nEstimated subtotal: ${money(total)}\nName: ${data.get("name")}\nPhone: ${data.get("phone")}\nFulfillment: ${data.get("fulfillment")}\nAddress: ${data.get("address") || "Pickup"}\nNotes: ${data.get("notes") || "None"}\n\nPlease confirm availability, final prices, delivery charges and timing.`;
    window.open(whatsapp(message), "_blank", "noopener,noreferrer");
    setSent(true);
  }
  return (
    <CartContext.Provider
      value={{
        add,
        open: () => {
          setOpened(true);
          setStep(false);
          setSent(false);
        },
      }}
    >
      <div className="announcement">
        <Flame size={13} />
        <span>STONE-BAKED GOODNESS. EVERY SINGLE SLICE.</span>
        <span className="announcement-location">
          <MapPin size={12} /> Dina, Jhelum
        </span>
      </div>
      <header className="header">
        <div className="nav-wrap">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={pathname === href ? "active" : ""}
              >
                {name}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="cart-button"
              onClick={() => {
                setOpened(true);
                setStep(false);
              }}
              aria-label={`Open cart, ${count} items`}
            >
              <ShoppingBag size={20} />
              <span>{count}</span>
            </button>
            <Link href="/menu" className="button nav-order">
              Order Now <ArrowUpRight size={16} />
            </Link>
            <button
              className="mobile-toggle icon-button"
              onClick={() => setMobile(!mobile)}
              aria-label="Toggle navigation"
              aria-expanded={mobile}
            >
              {mobile ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
        {mobile && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {links.map(([name, href]) => (
              <Link key={href} href={href} onClick={() => setMobile(false)}>
                {name}
              </Link>
            ))}
          </nav>
        )}
      </header>
      {children}
      <footer>
        <div className="footer-grid">
          <div>
            <Brand />
            <p>
              Stone-baked with passion.
              <br />
              Shared with the people you love.
            </p>
            <a
              href={whatsapp(
                "Hello! I would like to know more about Stone Bake Pizza.",
              )}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Let’s talk on WhatsApp <ArrowUpRight size={16} />
            </a>
          </div>
          <div>
            <h4>Explore</h4>
            {links.slice(1, 5).map(([n, h]) => (
              <Link key={h} href={h}>
                {n}
              </Link>
            ))}
          </div>
          <div>
            <h4>Find your flavor</h4>
            <Link href="/menu?category=Pizza">Stone-baked pizzas</Link>
            <Link href="/menu?category=Burgers">Burgers</Link>
            <Link href="/menu?category=Fast%20Food">Fast food favorites</Link>
            <Link href="/offers">Deals worth sharing</Link>
          </div>
          <div>
            <h4>Come hungry.</h4>
            <p>
              <MapPin size={15} /> Dina, Jhelum, Pakistan
            </p>
            <a href="tel:+923256120333">
              <Phone size={15} /> 0325-6120333
            </a>
            <p>Call us for today’s opening hours.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Stone Bake Pizza. All rights reserved.
          </span>
          <span>
            Made with fire. Served with love. <Flame size={13} />
          </span>
        </div>
      </footer>
      <a
        className="floating-whatsapp"
        href={whatsapp("Hi Stone Bake Pizza! I would like to place an order.")}
        aria-label="Chat on WhatsApp"
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={25} />
      </a>
      <AnimatePresence>
        {opened && (
          <div className="cart-overlay">
            <motion.button
              aria-label="Close cart"
              className="cart-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpened(false)}
            />
            <motion.div
              ref={dialog}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
              className="cart-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="cart-heading">
                <h2 id="cart-title">
                  {step ? "Almost at your table." : "Your good taste."}
                </h2>
                <button
                  className="icon-button"
                  onClick={() => setOpened(false)}
                  aria-label="Close cart"
                >
                  <X />
                </button>
              </div>
              {!lines.length ? (
                <div className="empty-cart">
                  <ShoppingBag size={54} />
                  <h3>A little hungry?</h3>
                  <p>Your next favorite meal is waiting.</p>
                  <Link
                    className="button"
                    href="/menu"
                    onClick={() => setOpened(false)}
                  >
                    Explore the menu <ArrowUpRight size={18} />
                  </Link>
                </div>
              ) : (
                <>
                  {!step ? (
                    <>
                      <div className="cart-lines">
                        {lines.map(({ item, quantity: q }) => (
                          <div className="cart-line" key={item.id}>
                            <div>
                              <h4>{item.name}</h4>
                              <p>{money(item.price)}</p>
                              <div className="quantity">
                                <button
                                  aria-label={`Remove one ${item.name}`}
                                  onClick={() => quantity(item.id, -1)}
                                >
                                  <Minus size={14} />
                                </button>
                                <span>{q}</span>
                                <button
                                  aria-label={`Add one ${item.name}`}
                                  disabled={q >= 99}
                                  onClick={() => quantity(item.id, 1)}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>
                            <div>
                              <strong>{money(item.price * q)}</strong>
                              <button
                                className="remove-button"
                                onClick={() =>
                                  setLines((prev) =>
                                    prev.filter((l) => l.item.id !== item.id),
                                  )
                                }
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="cart-summary">
                        <div>
                          <span>Estimated subtotal</span>
                          <strong>{money(total)}</strong>
                        </div>
                        <p>
                          Sample prices. The restaurant will confirm pricing,
                          availability and any delivery fee on WhatsApp.
                        </p>
                        <button
                          className="button full-width"
                          onClick={() => setStep(true)}
                        >
                          Continue to checkout <ArrowUpRight size={18} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <form className="checkout-form" onSubmit={checkout}>
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => setStep(false)}
                      >
                        ← Back to your order
                      </button>
                      <label>
                        Your name
                        <input
                          name="name"
                          autoComplete="name"
                          required
                          maxLength={80}
                          placeholder="Full name"
                        />
                      </label>
                      <label>
                        Phone number
                        <input
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          pattern="[+0-9 ()-]{10,20}"
                          placeholder="03XX-XXXXXXX"
                        />
                      </label>
                      <label>
                        Order type
                        <select
                          name="fulfillment"
                          value={fulfillment}
                          onChange={(e) => setFulfillment(e.target.value)}
                        >
                          <option value="delivery">
                            Delivery — subject to location
                          </option>
                          <option value="pickup">Pickup</option>
                        </select>
                      </label>
                      <label>
                        Delivery address
                        <input
                          name="address"
                          required={fulfillment === "delivery"}
                          autoComplete="street-address"
                          maxLength={300}
                          placeholder="Street, area and a nearby landmark"
                        />
                      </label>
                      <label>
                        Anything else?
                        <textarea
                          name="notes"
                          maxLength={500}
                          placeholder="Special instructions or dietary requests"
                        />
                      </label>
                      <div className="checkout-total">
                        Estimated subtotal <strong>{money(total)}</strong>
                      </div>
                      <p className="muted small">
                        Your order is confirmed only when the restaurant
                        replies. Enter an address for delivery; timing and
                        charges are agreed on WhatsApp.
                      </p>
                      <button className="button full-width" type="submit">
                        <MessageCircle size={18} /> Send order on WhatsApp
                      </button>
                      {sent && (
                        <p role="status" className="success-note">
                          Your order message is ready in WhatsApp. Send it there
                          and wait for the restaurant’s confirmation. Your cart
                          is saved.
                        </p>
                      )}
                    </form>
                  )}
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
}
