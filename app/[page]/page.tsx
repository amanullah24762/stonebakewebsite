import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Flame,
  Heart,
  Leaf,
  MapPin,
  Phone,
} from "lucide-react";
import {
  BottomCTA,
  ContactForm,
  Eyebrow,
  Location,
  MenuSection,
  OffersSection,
  Reveal,
  ReviewsSection,
  WhyUs,
} from "@/components/sections";
import { AnimatedWords } from "@/components/animated-words";
import { photos } from "@/lib/menu";
const pages: Record<
  string,
  {
    title: string;
    eyebrow: string;
    heading: string;
    accent: string;
    description: string;
  }
> = {
  menu: {
    title: "Our Menu",
    eyebrow: "FRESH FROM THE OVEN",
    heading: "Good food.",
    accent: "Great choices.",
    description:
      "Stone-baked pizzas, seriously good burgers, and all your favorite sides. What are you craving?",
  },
  about: {
    title: "Our Story",
    eyebrow: "ROOTED IN DINA. MADE WITH HEART.",
    heading: "More than pizza.",
    accent: "A little piece of us.",
    description:
      "A passion for honest food, shared tables, and the simple joy of a really good slice.",
  },
  offers: {
    title: "Special Offers",
    eyebrow: "GATHER YOUR FAVORITE PEOPLE",
    heading: "More to share.",
    accent: "More to love.",
    description:
      "Bring everyone to the table with generous bundles and flavor-packed combinations.",
  },
  gallery: {
    title: "Gallery",
    eyebrow: "A FEAST FOR YOUR EYES",
    heading: "Looks good.",
    accent: "Tastes even better.",
    description:
      "A little inspiration from the oven, the kitchen, and the table.",
  },
  reviews: {
    title: "Customer Reviews",
    eyebrow: "THE BEST PART? HAPPY PEOPLE.",
    heading: "Every bite has",
    accent: "a story.",
    description:
      "Good meals become great memories. Here’s a taste of the experience we aim to create.",
  },
  contact: {
    title: "Contact Us",
    eyebrow: "WE’D LOVE TO HEAR FROM YOU",
    heading: "Come hungry.",
    accent: "Leave happy.",
    description:
      "Find us in Dina, call for a takeaway, or say hello on WhatsApp.",
  },
  order: {
    title: "Order Online",
    eyebrow: "YOUR NEXT GREAT MEAL",
    heading: "Pick your favorites.",
    accent: "We’ll bring the flavor.",
    description:
      "Choose your food, review your cart, and send your order to our team on WhatsApp.",
  },
};
export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return { title: pages[page]?.title, description: pages[page]?.description };
}
export default async function ContentPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const data = pages[page];
  if (!data) notFound();
  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            {data.title}
          </div>
          <Reveal>
            <Eyebrow>{data.eyebrow}</Eyebrow>
            <h1>
              <AnimatedWords text={data.heading} />
              <br />
              <span>
                <AnimatedWords
                  text={data.accent}
                  offset={data.heading.split(" ").length}
                />
              </span>
            </h1>
            <p>{data.description}</p>
          </Reveal>
          <Flame className="page-hero-flame" aria-hidden="true" />
        </div>
      </section>
      {(page === "menu" || page === "order") && <MenuSection full />}
      {page === "offers" && <OffersSection full />}
      {page === "reviews" && <ReviewsSection full />}
      {page === "about" && (
        <>
          <section className="section">
            <Reveal className="container about-story">
              <div className="about-image">
                <Image
                  src={photos.chef}
                  alt="A chef preparing a dish with care"
                  fill
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
                <div className="about-image-label">
                  <Flame /> REAL FOOD. REAL PASSION.
                </div>
              </div>
              <div>
                <Eyebrow>OUR STORY</Eyebrow>
                <h2>
                  From a hot stone.
                  <br />
                  To a <span>happy table.</span>
                </h2>
                <p>
                  Stone Bake Pizza brings authentic stone-baked flavors with
                  quality ingredients and a passion for creating memorable food
                  experiences.
                </p>
                <p>
                  Here in Dina, we believe a great meal should feel like a good
                  moment: warm, generous, and worth sharing. That’s the spirit
                  behind our pizzas, our burgers, and every little extra on your
                  table.
                </p>
                <div className="mission">
                  <Heart size={24} />
                  <div>
                    <h3>Our mission is simple.</h3>
                    <p>
                      Make the food you love, with the care you deserve. Every
                      order, every visit, every time.
                    </p>
                  </div>
                </div>
                <Link href="/menu" className="button">
                  Find your favorite <ArrowUpRight size={17} />
                </Link>
              </div>
            </Reveal>
          </section>
          <WhyUs />
          <section className="container about-principles">
            <div>
              <Leaf />
              <h3>Quality comes first</h3>
              <p>
                Fresh ingredients, careful preparation, and flavor at the heart
                of every recipe.
              </p>
            </div>
            <div>
              <Heart />
              <h3>Your happiness matters</h3>
              <p>
                Tell us what you love and what we can do better. Your next visit
                should be even better than your last.
              </p>
            </div>
          </section>
        </>
      )}
      {page === "gallery" && (
        <section className="section">
          <div className="container">
            <div className="gallery-grid">
              {[
                [photos.pizza, "The perfect slice", "Stone-baked goodness"],
                [
                  photos.chef,
                  "The hands behind the flavor",
                  "Kitchen inspiration",
                ],
                [
                  photos.burger,
                  "Stacked with the good stuff",
                  "Burgers & more",
                ],
                [
                  photos.kitchen,
                  "A seat at the table",
                  "Restaurant inspiration",
                ],
                [
                  photos.cheese,
                  "Simple. Golden. Delicious.",
                  "Fresh from the oven",
                ],
                [photos.pasta, "A little comfort", "Made to satisfy"],
              ].map(([src, title, tag], i) => (
                <Reveal
                  key={title}
                  className={`gallery-item gallery-item-${i}`}
                >
                  <Image
                    src={src}
                    alt={title}
                    fill
                    sizes="(max-width: 650px) 100vw, 50vw"
                  />
                  <div>
                    <small>{tag}</small>
                    <h3>{title}</h3>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="menu-disclaimer">
              Curated food and hospitality photography. Images are illustrative,
              not photographs of the actual restaurant.
            </p>
          </div>
        </section>
      )}
      {page === "contact" && (
        <>
          <section className="section">
            <div className="container contact-layout">
              <div className="contact-details">
                <Eyebrow>MAKE YOURSELF AT HOME</Eyebrow>
                <h2>
                  Your table.
                  <br />
                  Your <span>happy place.</span>
                </h2>
                <div>
                  <MapPin />
                  <span>
                    <h3>Visit us</h3>
                    <p>
                      Stone Bake Pizza
                      <br />
                      Dina, Jhelum, Pakistan
                    </p>
                    <a
                      className="text-link"
                      href="https://www.google.com/maps/search/Stone+Bake+Pizza+Dina+Jhelum"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Find us on Google Maps <ArrowUpRight size={15} />
                    </a>
                  </span>
                </div>
                <div>
                  <Phone />
                  <span>
                    <h3>Give us a call</h3>
                    <a href="tel:+923256120333">0325-6120333</a>
                  </span>
                </div>
                <div>
                  <Clock />
                  <span>
                    <h3>Opening hours</h3>
                    <p>
                      Please call or WhatsApp for today’s hours
                      <br />
                      and current delivery availability.
                    </p>
                  </span>
                </div>
              </div>
              <ContactForm />
            </div>
          </section>
          <Location />
        </>
      )}
      <BottomCTA />
    </main>
  );
}
