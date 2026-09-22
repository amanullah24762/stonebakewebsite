export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  discount_price?: number | null;
  status?: "AVAILABLE" | "OUT_OF_STOCK" | "INACTIVE";
};
export const photos = {
  hero: "/images/hero-pizza.png",
  pizza: "/images/pizza.jpg",
  fajita: "/images/fajita.jpg",
  cheese: "/images/cheese.jpg",
  burger: "/images/burger.jpg",
  fries: "/images/fries.jpg",
  pasta: "/images/pasta.jpg",
  wings: "/images/wings.jpg",
  shawarma: "/images/shawarma.jpg",
  kitchen: "/images/kitchen.jpg",
  chef: "/images/chef.jpg",
};
export const menu: MenuItem[] = [
  {
    id: "tikka",
    name: "Chicken Tikka Pizza",
    category: "Pizza",
    description:
      "Smoky chicken tikka, mozzarella, onions & our signature sauce.",
    price: 1199,
    image: photos.pizza,
    badge: "BESTSELLER",
  },
  {
    id: "fajita",
    name: "Chicken Fajita Pizza",
    category: "Pizza",
    description:
      "Spiced chicken, colorful peppers & a generous melt of cheese.",
    price: 1299,
    image: photos.fajita,
    badge: "CROWD FAVORITE",
  },
  {
    id: "supreme",
    name: "Supreme Pizza",
    category: "Pizza",
    description: "Loaded chicken, olives, peppers & all the good stuff.",
    price: 1499,
    image: photos.hero,
  },
  {
    id: "cheese",
    name: "Cheese Pizza",
    category: "Pizza",
    description: "Our rich tomato sauce with a golden, bubbling cheese blend.",
    price: 999,
    image: photos.cheese,
  },
  {
    id: "special",
    name: "Special Stone Bake Pizza",
    category: "Pizza",
    description:
      "The house signature. Double chicken, extra cheese, bold flavor.",
    price: 1699,
    image: photos.pizza,
    badge: "HOUSE SPECIAL",
  },
  {
    id: "zinger",
    name: "Zinger Burger",
    category: "Burgers",
    description:
      "Crispy chicken, fresh lettuce & creamy sauce in a toasted bun.",
    price: 499,
    image: photos.burger,
    badge: "MUST TRY",
  },
  {
    id: "chicken",
    name: "Chicken Burger",
    category: "Burgers",
    description: "Tender chicken with garden-fresh greens and house mayo.",
    price: 399,
    image: photos.burger,
  },
  {
    id: "special-burger",
    name: "Special Burger",
    category: "Burgers",
    description:
      "A generously stacked chicken burger with cheese and house sauce.",
    price: 649,
    image: photos.burger,
  },
  {
    id: "shawarma",
    name: "Shawarma",
    category: "Fast Food",
    description:
      "Seasoned chicken, crisp vegetables & garlic sauce in a warm wrap.",
    price: 299,
    image: photos.shawarma,
  },
  {
    id: "pasta",
    name: "Creamy Pasta",
    category: "Fast Food",
    description: "Comfort in a bowl. Creamy sauce, tender chicken & herbs.",
    price: 699,
    image: photos.pasta,
  },
  {
    id: "fries",
    name: "Golden Fries",
    category: "Fast Food",
    description: "Perfectly crisp, lightly salted & made for sharing. Or not.",
    price: 249,
    image: photos.fries,
  },
  {
    id: "wings",
    name: "Hot & Crispy Wings",
    category: "Fast Food",
    description: "Six juicy wings tossed in our bold, tangy signature sauce.",
    price: 599,
    image: photos.wings,
  },
];
export const deals: MenuItem[] = [
  {
    id: "family",
    name: "The Family Feast",
    category: "Deals",
    description:
      "2 large pizzas + 1 large fries + 1.5L drink. Good food. Great company.",
    price: 2999,
    image: photos.pizza,
    badge: "FAMILY DEAL",
  },
  {
    id: "weekend",
    name: "Weekend Done Right",
    category: "Deals",
    description: "1 large Chicken Fajita Pizza + 6 wings + 2 drinks.",
    price: 1899,
    image: photos.fajita,
    badge: "WEEKEND SPECIAL",
  },
  {
    id: "student",
    name: "The Study Break",
    category: "Deals",
    description: "1 Zinger Burger + regular fries + a refreshing drink.",
    price: 699,
    image: photos.burger,
    badge: "STUDENT DEAL",
  },
  {
    id: "combo",
    name: "Your Perfect Combo",
    category: "Deals",
    description: "1 regular Cheese Pizza + regular fries + a drink.",
    price: 1199,
    image: photos.cheese,
    badge: "COMBO OFFER",
  },
];
export const money = (amount: number) =>
  `Rs. ${amount.toLocaleString("en-PK")}`;
export const whatsapp = (message: string) =>
  `https://wa.me/923256120333?text=${encodeURIComponent(message)}`;
