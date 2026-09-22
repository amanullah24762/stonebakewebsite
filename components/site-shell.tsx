
"use client";

import { createOrder } from "@/lib/api/orders";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

import {
  deals,
  menu,
  type MenuItem,
  money,
  whatsapp,
} from "@/lib/menu";

// Cart Types

type Line = {
  item: MenuItem;
  quantity: number;
};

type CartContextType = {
  add: (item: MenuItem) => void;
  open: () => void;
};

const CartContext = createContext<CartContextType>({
  add: () => {},
  open: () => {},
});

export const useCart = () => useContext(CartContext);

// Navigation Links

const links = [
  ["Home", "/"],
  ["Our Menu", "/menu"],
  ["About Us", "/about"],
  ["Offers", "/offers"],
  ["Gallery", "/gallery"],
  ["Reviews", "/reviews"],
  ["Contact", "/contact"],
];

// Brand Component

export function Brand() {
  return (
    <Link
      href="/"
      className="brand"
      aria-label="Stone Bake Pizza home"
    >
      <span className="brand-mark">
        <Flame size={31} />
      </span>

      <span>
        STONE BAKE
        <small>
          P I Z Z A &nbsp; & &nbsp; M O R E
        </small>
      </span>
    </Link>
  );
}

// Main Site Shell

export function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Navigation States

  const [mobile, setMobile] = useState(false);

  // Cart States

  const [opened, setOpened] = useState(false);

  const [lines, setLines] = useState<Line[]>([]);

  const [ready, setReady] = useState(false);

  const [step, setStep] = useState(false);

  const [fulfillment, setFulfillment] = useState("delivery");

  const dialog = useRef<HTMLDivElement>(null);

  // Order API States

  const [submitting, setSubmitting] = useState(false);

  const submittingRef = useRef(false);

  const [orderError, setOrderError] = useState("");

  const [orderNumber, setOrderNumber] = useState<string | null>(
    null
  );

  // Restore Cart From Local Storage

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("stone-bake-cart") || "[]"
      );

      if (Array.isArray(saved)) {
        const restored: Line[] = [];

        for (const line of saved) {
          if (
            !line ||
            typeof line !== "object" ||
            typeof line.id !== "string" ||
            !Number.isInteger(line.quantity) ||
            line.quantity <= 0
          ) {
            continue;
          }

          // Support previous static cart format.

          const staticItem = [...menu, ...deals].find(
            (item) => item.id === line.id
          );

          // Support API-loaded menu items saved in the cart.

          const storedItem = line.item;

          const validStoredItem =
            storedItem &&
            typeof storedItem === "object" &&
            storedItem.id === line.id &&
            typeof storedItem.name === "string" &&
            typeof storedItem.category === "string" &&
            typeof storedItem.description === "string" &&
            typeof storedItem.price === "number" &&
            Number.isFinite(storedItem.price) &&
            storedItem.price >= 0 &&
            typeof storedItem.image === "string";

          const item: MenuItem | undefined =
            staticItem ||
            (validStoredItem
              ? (storedItem as MenuItem)
              : undefined);

          if (item) {
            restored.push({
              item,
              quantity: Math.min(line.quantity, 99),
            });
          }
        }

        setLines(restored);
      }
    } catch {
      // Keep cart available if storage is unavailable.
    }

    setReady(true);
  }, []);

  // Save Cart To Local Storage

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(
        "stone-bake-cart",
        JSON.stringify(
          lines.map((line) => ({
            id: line.item.id,
            quantity: line.quantity,
            item: {
              id: line.item.id,
              name: line.item.name,
              category: line.item.category,
              description: line.item.description,
              price: line.item.price,
              image: line.item.image,
              badge: line.item.badge,
              discount_price: line.item.discount_price,
              status: line.item.status,
            },
          }))
        )
      );
    } catch {
      // Cart continues working in memory.
    }
  }, [lines, ready]);

  // Cart Dialog Accessibility

  useEffect(() => {
    if (!opened) return;

    const previous = document.activeElement as HTMLElement;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    dialog.current?.focus();

    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!submittingRef.current) {
          setOpened(false);
        }
      }

      if (e.key === "Tab") {
        const elements =
          dialog.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a, input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]'
          );

        if (!elements?.length) return;

        const first = elements[0];

        const last = elements[elements.length - 1];

        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialog.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === last
        ) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", key);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", key);

      previous?.focus();
    };
  }, [opened]);

  // Add Item To Cart

  const add = useCallback((item: MenuItem) => {
    if (submittingRef.current) return;

    setLines((prev) => {
      const found = prev.find(
        (line) => line.item.id === item.id
      );

      return found
        ? prev.map((line) =>
            line.item.id === item.id
              ? {
                  ...line,
                  quantity: Math.min(
                    99,
                    line.quantity + 1
                  ),
                }
              : line
          )
        : [
            ...prev,
            {
              item,
              quantity: 1,
            },
          ];
    });

    setOrderNumber(null);

    setOrderError("");

    setStep(false);

    setOpened(true);
  }, []);

  // Cart Context

  const cart = useMemo(
    () => ({
      add,

      open: () => {
        setOpened(true);

        if (!submittingRef.current) {
          setStep(false);
          setOrderError("");
        }
      },
    }),
    [add]
  );

  // Update Cart Quantity

  const quantity = (id: string, delta: number) => {
    if (submittingRef.current) return;

    setLines((prev) =>
      prev
        .map((line) =>
          line.item.id === id
            ? {
                ...line,
                quantity: Math.min(
                  99,
                  line.quantity + delta
                ),
              }
            : line
        )
        .filter((line) => line.quantity > 0)
    );
  };

  // Calculate Cart

  const count = lines.reduce(
    (total, line) => total + line.quantity,
    0
  );

  const total = lines.reduce(
    (sum, line) =>
      sum + line.quantity * line.item.price,
    0
  );

  // Checkout - Send Order To Backend

  async function checkout(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    // Prevent duplicate submissions.

    if (submittingRef.current) return;

    submittingRef.current = true;

    setSubmitting(true);

    setOrderError("");

    try {
      if (lines.length === 0) {
        throw new Error("Your cart is empty.");
      }

      // Static deals do not have matching order-item
      // records in the current backend.

      const containsDeal = lines.some((line) =>
        deals.some(
          (deal) => deal.id === line.item.id
        )
      );

      if (containsDeal) {
        throw new Error(
          "Deals cannot be ordered online yet. Please remove deals from your cart."
        );
      }

      // Get Customer Details

      const data = new FormData(e.currentTarget);

      const name = String(
        data.get("name") || ""
      ).trim();

      const phone = String(
        data.get("phone") || ""
      ).trim();

      const address = String(
        data.get("address") || ""
      ).trim();

      const orderType =
        data.get("fulfillment") === "pickup"
          ? "PICKUP"
          : "DELIVERY";

      // Basic Validation

      if (!name || !phone) {
        throw new Error(
          "Please enter your name and phone number."
        );
      }

      if (
        orderType === "DELIVERY" &&
        !address
      ) {
        throw new Error(
          "Please enter your delivery address."
        );
      }

      // Submit Order To Backend

      const order = await createOrder({
        name,

        phone,

        address:
          orderType === "DELIVERY"
            ? address
            : null,

        order_type: orderType,

        items: lines.map((line) => ({
          menu_item_id: line.item.id,
          quantity: line.quantity,
        })),
      });

      // Show Order Confirmation

      setOrderNumber(order.order_number);

      // Clear Cart Only After Successful API Response

      setLines([]);

      setStep(false);

      setOrderError("");

    } catch (error) {
      setOrderError(
        error instanceof Error
          ? error.message
          : "Unable to place your order. Please try again."
      );

    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  // Main Layout

  return (
    <CartContext.Provider value={cart}>

      {/* Announcement Bar */}

      <div className="announcement">
        <Flame size={13} />

        <span>
          STONE-BAKED GOODNESS. EVERY SINGLE SLICE.
        </span>

        <span className="announcement-location">
          <MapPin size={12} />
          Dina, Jhelum
        </span>
      </div>

      {/* Header */}

      <header className="header">
        <div className="nav-wrap">

          <Brand />

          {/* Desktop Navigation */}

          <nav
            className="desktop-nav"
            aria-label="Main navigation"
          >
            {links.map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={
                  pathname === href
                    ? "active"
                    : ""
                }
              >
                {name}
              </Link>
            ))}
          </nav>

          {/* Header Actions */}

          <div className="nav-actions">

            {/* Cart Button */}

            <button
              className="cart-button"
              onClick={() => {
                setOpened(true);
                if (!submittingRef.current) {
                  setStep(false);
                }
              }}
              aria-label={`Open cart, ${count} items`}
            >
              <ShoppingBag size={20} />

              <span
                key={count}
                className="cart-count"
              >
                {count}
              </span>
            </button>

            {/* Order Now */}

            <Link
              href="/menu"
              className="button nav-order"
            >
              Order Now
              <ArrowUpRight size={16} />
            </Link>

            {/* Mobile Toggle */}

            <button
              className="mobile-toggle icon-button"
              onClick={() =>
                setMobile(!mobile)
              }
              aria-label="Toggle navigation"
              aria-expanded={mobile}
            >
              {mobile ? (
                <X />
              ) : (
                <MenuIcon />
              )}
            </button>

          </div>
        </div>

        {/* Mobile Navigation */}

        {mobile && (
          <nav
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {links.map(([name, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() =>
                  setMobile(false)
                }
              >
                {name}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Website Content */}

      {children}

      {/* Footer */}

      <footer>
        <div className="footer-grid">

          {/* Footer Brand */}

          <div>
            <Brand />

            <p>
              Stone-baked with passion.
              <br />
              Shared with the people you love.
            </p>

            <a
              href={whatsapp(
                "Hello! I would like to know more about Stone Bake Pizza."
              )}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Let’s talk on WhatsApp
              <ArrowUpRight size={16} />
            </a>
          </div>

          {/* Explore */}

          <div>
            <h4>Explore</h4>

            {links.slice(1, 5).map(([name, href]) => (
              <Link
                key={href}
                href={href}
              >
                {name}
              </Link>
            ))}
          </div>

          {/* Menu Links */}

          <div>
            <h4>Find your flavor</h4>

            <Link href="/menu?category=Pizza">
              Stone-baked pizzas
            </Link>

            <Link href="/menu?category=Burgers">
              Burgers
            </Link>

            <Link href="/menu?category=Fast%20Food">
              Fast food favorites
            </Link>

            <Link href="/offers">
              Deals worth sharing
            </Link>
          </div>

          {/* Contact Details */}

          <div>
            <h4>Come hungry.</h4>

            <p>
              <MapPin size={15} />
              Dina, Jhelum, Pakistan
            </p>

            <a href="tel:+923256120333">
              <Phone size={15} />
              0325-6120333
            </a>

            <p>
              Call us for today’s opening hours.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Stone Bake Pizza.
            All rights reserved.
          </span>

          <span>
            Developed by Aman Ullah
          </span>
        </div>
      </footer>

      {/* WhatsApp Contact Button */}

      <a
        className="floating-whatsapp"
        href={whatsapp(
          "Hi Stone Bake Pizza! I have a question."
        )}
        aria-label="Chat on WhatsApp"
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={25} />
      </a>

      {/* Cart Dialog */}

      {opened && (
        <div className="cart-overlay">

          {/* Backdrop */}

          <button
            aria-label="Close cart"
            className="cart-backdrop"
            disabled={submitting}
            onClick={() =>
              setOpened(false)
            }
          />

          {/* Cart Panel */}

          <div
            ref={dialog}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="cart-panel"
          >

            {/* Cart Heading */}

            <div className="cart-heading">
              <h2 id="cart-title">
                {orderNumber
                  ? "Order received!"
                  : step
                    ? "Almost at your table."
                    : "Your good taste."}
              </h2>

              <button
                className="icon-button"
                onClick={() =>
                  setOpened(false)
                }
                disabled={submitting}
                aria-label="Close cart"
              >
                <X />
              </button>
            </div>

            {/* Order Success */}

            {orderNumber ? (

              <div className="empty-cart">

                <ShoppingBag size={54} />

                <h3>
                  Order received!
                </h3>

                <p>
                  Order number:
                </p>

                <strong>
                  {orderNumber}
                </strong>

                <p>
                  Your order has been received
                  and is awaiting restaurant
                  confirmation.
                </p>

                <button
                  className="button"
                  onClick={() => {
                    setOrderNumber(null);
                    setOpened(false);
                  }}
                >
                  Done
                </button>

              </div>

            ) : !lines.length ? (

              /* Empty Cart */

              <div className="empty-cart">

                <ShoppingBag size={54} />

                <h3>
                  A little hungry?
                </h3>

                <p>
                  Your next favorite meal is waiting.
                </p>

                <Link
                  className="button"
                  href="/menu"
                  onClick={() =>
                    setOpened(false)
                  }
                >
                  Explore the menu
                  <ArrowUpRight size={18} />
                </Link>

              </div>

            ) : (

              <>
                {/* Cart Items */}

                {!step ? (

                  <>
                    <div className="cart-lines">

                      {lines.map(
                        ({ item, quantity: q }) => (

                          <div
                            className="cart-line"
                            key={item.id}
                          >

                            <div>
                              <h4>
                                {item.name}
                              </h4>

                              <p>
                                {money(item.price)}
                              </p>

                              {/* Quantity Controls */}

                              <div className="quantity">

                                <button
                                  aria-label={`Remove one ${item.name}`}
                                  disabled={submitting}
                                  onClick={() =>
                                    quantity(
                                      item.id,
                                      -1
                                    )
                                  }
                                >
                                  <Minus size={14} />
                                </button>

                                <span>
                                  {q}
                                </span>

                                <button
                                  aria-label={`Add one ${item.name}`}
                                  disabled={
                                    q >= 99 ||
                                    submitting
                                  }
                                  onClick={() =>
                                    quantity(
                                      item.id,
                                      1
                                    )
                                  }
                                >
                                  <Plus size={14} />
                                </button>

                              </div>
                            </div>

                            {/* Item Total */}

                            <div>
                              <strong>
                                {money(
                                  item.price * q
                                )}
                              </strong>

                              <button
                                className="remove-button"
                                disabled={submitting}
                                onClick={() =>
                                  setLines((prev) =>
                                    prev.filter(
                                      (line) =>
                                        line.item.id !==
                                        item.id
                                    )
                                  )
                                }
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>

                          </div>
                        )
                      )}

                    </div>

                    {/* Cart Summary */}

                    <div className="cart-summary">

                      <div>
                        <span>
                          Estimated subtotal
                        </span>

                        <strong>
                          {money(total)}
                        </strong>
                      </div>

                      <p>
                        Final prices and availability
                        will be checked by the restaurant.
                        Delivery charges may apply.
                      </p>

                      <button
                        className="button full-width"
                        onClick={() => {
                          setOrderError("");
                          setStep(true);
                        }}
                      >
                        Continue to checkout
                        <ArrowUpRight size={18} />
                      </button>

                    </div>
                  </>

                ) : (

                  /* Checkout Form */

                  <form
                    className="checkout-form"
                    onSubmit={checkout}
                  >

                    {/* Back Button */}

                    <button
                      type="button"
                      className="text-link"
                      disabled={submitting}
                      onClick={() =>
                        setStep(false)
                      }
                    >
                      ← Back to your order
                    </button>

                    {/* Customer Name */}

                    <label>
                      Your name

                      <input
                        name="name"
                        autoComplete="name"
                        required
                        maxLength={80}
                        placeholder="Full name"
                        disabled={submitting}
                      />
                    </label>

                    {/* Phone Number */}

                    <label>
                      Phone number

                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        pattern="[+0-9 ()-]{10,20}"
                        placeholder="03XX-XXXXXXX"
                        disabled={submitting}
                      />
                    </label>

                    {/* Order Type */}

                    <label>
                      Order type

                      <select
                        name="fulfillment"
                        value={fulfillment}
                        disabled={submitting}
                        onChange={(e) =>
                          setFulfillment(
                            e.target.value
                          )
                        }
                      >

                        <option value="delivery">
                          Delivery — subject to location
                        </option>

                        <option value="pickup">
                          Pickup
                        </option>

                      </select>
                    </label>

                    {/* Delivery Address */}

                    {fulfillment === "delivery" && (

                      <label>
                        Delivery address

                        <input
                          name="address"
                          required
                          autoComplete="street-address"
                          maxLength={300}
                          placeholder="Street, area and a nearby landmark"
                          disabled={submitting}
                        />
                      </label>

                    )}

                    {/* Checkout Total */}

                    <div className="checkout-total">

                      Estimated subtotal

                      <strong>
                        {money(total)}
                      </strong>

                    </div>

                    {/* Checkout Information */}

                    <p className="muted small">
                      Your order will be sent to
                      the restaurant.

                      Delivery charges and timing
                      will be confirmed separately.
                    </p>

                    {/* Place Order Button */}

                    <button
                      className="button full-width"
                      type="submit"
                      disabled={submitting}
                    >

                      {submitting ? (

                        "Placing Order..."

                      ) : (

                        <>
                          Place Order
                          <ArrowUpRight size={18} />
                        </>

                      )}

                    </button>

                    {/* Order Error */}

                    {orderError && (

                      <p
                        role="alert"
                        className="error-note"
                      >
                        {orderError}
                      </p>

                    )}

                  </form>

                )}

              </>

            )}

          </div>
        </div>
      )}

    </CartContext.Provider>
  );
}