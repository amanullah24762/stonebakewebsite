import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Flame,
  Leaf,
  MapPin,
  UtensilsCrossed,
} from "lucide-react";
import {
  BottomCTA,
  Eyebrow,
  Location,
  MenuSection,
  OffersSection,
  Reveal,
  ReviewsSection,
  WhyUs,
} from "@/components/sections";
import { photos } from "@/lib/menu";
export default function Home() {
  return (
    <main id="main">
      <section className="hero">
        <Image
          className="hero-photo"
          src={photos.hero}
          alt="Fresh stone-baked pizza topped with melted cheese, herbs and tomatoes"
          fill
          preload
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="hero-grain" />
        <div className="container hero-container">
          <Reveal className="hero-copy">
            <Eyebrow>FIRE. FLAVOR. A LITTLE OBSESSION.</Eyebrow>
            <h1>
              Freshly Baked
              <br />
              Pizza, Crafted
              <br />
              With <span>Passion.</span>
            </h1>
            <p>
              Some things are worth doing the slow way.
              <br className="desktop-break" /> Experience delicious stone-baked
              pizzas, burgers
              <br className="desktop-break" /> and fast food prepared with fresh
              ingredients.
            </p>
            <div className="hero-buttons">
              <Link href="/menu" className="button">
                Order Now <ArrowUpRight size={18} />
              </Link>
              <Link href="/menu" className="button outline-button">
                View Menu <UtensilsCrossed size={17} />
              </Link>
            </div>
            <div className="hero-note">
              <span className="tiny-flame">
                <Flame size={17} />
              </span>
              <span>Fresh from the oven. Made for you.</span>
            </div>
          </Reveal>
          <div className="hero-stamp">
            <Flame size={26} />
            <strong>
              STONE
              <br />
              BAKED
            </strong>
            <span>THE REAL GOOD STUFF</span>
          </div>
          <div className="hero-bottom">
            <span>
              <MapPin size={14} /> PROUDLY SERVING DINA, JHELUM
            </span>
            <a href="#menu">
              SCROLL FOR THE GOOD STUFF <ArrowDown size={14} />
            </a>
          </div>
        </div>
      </section>
      <div className="promise-strip">
        <div>
          <Flame /> Stone-baked. Never ordinary.
        </div>
        <span>✦</span>
        <div>
          <Leaf /> Fresh ingredients, real flavor.
        </div>
        <span>✦</span>
        <div>
          <UtensilsCrossed /> Good food brings us together.
        </div>
        <span>✦</span>
        <div>
          Made with love in Dina <span className="orange">♥</span>
        </div>
      </div>
      <MenuSection />
      <WhyUs />
      <OffersSection />
      <section className="story-banner">
        <Image
          src={photos.chef}
          alt="Chef carefully preparing food in a restaurant kitchen"
          fill
          sizes="100vw"
        />
        <div className="story-shade" />
        <Reveal className="container story-copy">
          <Eyebrow>FROM OUR KITCHEN, WITH LOVE</Eyebrow>
          <h2>
            A little fire.
            <br />A lot of <span>heart.</span>
          </h2>
          <p>
            Great food isn’t just what we make. It’s what brings us together.
            <br />
            Discover the people and passion behind every Stone Bake bite.
          </p>
          <Link href="/about" className="button outline-button">
            Our story <ArrowUpRight size={17} />
          </Link>
        </Reveal>
        <span className="story-side">CRAFTED WITH CARE · SHARED WITH LOVE</span>
      </section>
      <ReviewsSection />
      <Location />
      <BottomCTA />
    </main>
  );
}
