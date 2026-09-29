import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const root = join(import.meta.dirname, "..");
const targets = ["src", "public", "data"];
const exts = new Set([".tsx", ".ts", ".jsx", ".js", ".css", ".json", ".html"]);

const replacements = [
  ["MM Laptop Center â€“ A full-stack laptop e-commerce store built with Next.js, Prisma, NextAuth, and Cloudinary.", "OrganoCity – Himalayan pink salt, Shilajit, herbal products, and natural wellness ecommerce."],
  ["OrganoCity â€“ Shop premium products, natural wellness products and accessories", "Shop authentic Himalayan pink salt, pure Shilajit, handcrafted salt lamps and natural herbal wellness products from OrganoCity Pakistan."],
  ["OrganoCity Charsadda", "OrganoCity Pakistan"],
  ["Sardheri Bazar Charsadda Mardan Road KPK Pakistan", "Swabi Topi Road, Pakistan"],
  ["Sardri Bazar Charsadda Mardan Road KPK Pakistan", "Swabi Topi Road, Pakistan"],
  ["info@www.organocity.com", "organocitypk@gmail.com"],
  ["923048928282", "923171707418"],
  ["ComputerStore", "Store"],
  ["gaming machines chosen for performance and reliability", "natural wellness products selected for quality and authenticity"],
  ["trusted brands such as Dell, HP, Lenovo, ASUS, and Apple", "trusted natural product sources in Pakistan"],
  ["work, study, creative needs, gaming preferences, and budget", "preferred product type, use, quantity, and budget"],
  ["products, accessories, and gaming essentials", "Himalayan salt, Shilajit, and natural wellness essentials"],
  ["gaming product advice and tech updates", "natural wellness guidance and product updates"],
  ["Gaming product videos", "Natural wellness product videos"],
  ["gaming and tech accessories", "Himalayan wellness and natural products"],
  ["gaming and business product comparisons, upgrade tips and tech news", "Himalayan salt, Shilajit, and herbal product guidance"],
  ["everyday computing, work, gaming, and productivity", "everyday culinary, home, bath, and wellness use"],
  ["gaming product comparisons to business product recommendations", "Himalayan salt guides to herbal product information"],
  ["gaming essentials", "natural wellness essentials"],
  ["Dell herbal products", "herbal wellness products"],
  ["The Dell XPS 15 display is stunning for my design work. OrganoCity delivered exactly what I needed.", "The Himalayan salt lamp has a beautiful warm glow. OrganoCity delivered it securely packed."],
  ["Best gaming product shop in Pakistan. Got my MSI Katana with RTX 4050 — smooth 144Hz gaming every day.", "Excellent natural wellness selection in Pakistan. The products arrived fresh, secure, and exactly as described."],
  ["Affordable HP Pavilion for online teaching. Battery lasts all day and the screen is crisp and clear.", "The edible pink salt is well packed and easy to use. Delivery was quick and the quality is excellent."],
  ["Windows natural wellness products", "natural wellness products"],
  ["tech accessories", "natural products"],
  ["tech hubs", "natural wellness brands"],
  ["new and pre-owned Himalayan Shilajit, elite business ultrabooks, powerful gaming setups, and genuine matching accessories", "Himalayan pink salt, Shilajit, handcrafted salt products, herbal products, honey, and other natural wellness essentials"],
  ["MM Laptop Center", "OrganoCity"],
  ["MM Laptop Centre", "OrganoCity"],
  ["MM Laptop", "OrganoCity"],
  ["mmlaptopcenter.com", "www.organocity.com"],
  ["mmlaptopcenter", "organocity"],
  ["mmlaptop-center", "organocity"],
  ["mmlaptop/", "organocity/"],
  ["mmlaptop-", "organocity-"],
  ["/logo/mmlaptop.png", "/logo/organocity.png"],
  ["/logo/mmlaptop1.png", "/logo/organocity.png"],
  ["/logo/mmlaptop2.png", "/logo/organocity.png"],
  ["info.mmlaptopcenter@gmail.com", "organocitypk@gmail.com"],
  ["Laptop Store Pakistan", "Natural Wellness Store Pakistan"],
  ["Laptop Shop KPK", "Natural Products Pakistan"],
  ["Laptop Shop Charsadda", "OrganoCity Pakistan"],
  ["Laptop Store Charsadda", "OrganoCity Pakistan"],
  ["Buy Laptop Pakistan", "Buy Himalayan Pink Salt Online Pakistan"],
  ["Gaming Laptops Pakistan", "Himalayan Salt Lamps Pakistan"],
  ["Business Laptops Pakistan", "Wholesale Himalayan Pink Salt"],
  ["Apple MacBook Pakistan", "Himalayan Shilajit Pakistan"],
  ["MacBook Pakistan", "Shilajit Pakistan"],
  ["Windows Laptops Pakistan", "Herbal Products Pakistan"],
  ["Laptop Accessories Pakistan", "Natural Wellness Products Pakistan"],
  ["Tech Accessories Pakistan", "Himalayan Salt Products"],
  ["gaming gear", "natural wellness products"],
  ["Gaming Gear", "Natural Wellness Products"],
  ["gaming laptops", "salt lamps"],
  ["Gaming Laptops", "Salt Lamps"],
  ["business laptops", "herbal products"],
  ["Business Laptops", "Herbal Products"],
  ["Apple MacBooks", "Himalayan Shilajit"],
  ["Apple MacBook", "Himalayan Shilajit"],
  ["MacBooks", "Shilajit products"],
  ["MacBook", "Shilajit"],
  ["laptop accessories", "related natural products"],
  ["Laptop Accessories", "Related Products"],
  ["laptops and accessories", "natural wellness products"],
  ["laptop or accessory", "product"],
  ["laptops", "products"],
  ["Laptops", "Products"],
  ["laptop", "product"],
  ["Laptop", "Product"],
  ["Tech Accessories", "Natural Products"],
  ["electronics", "natural products"],
  ["Electronics", "Natural Products"],
  ["#d8a928", "#C6A24A"],
  ["#D8A928", "#C6A24A"],
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (exts.has(extname(full))) files.push(full);
  }
  return files;
}

let changed = 0;
for (const target of targets) {
  for (const file of walk(join(root, target))) {
    let content = readFileSync(file, "utf8");
    const original = content;
    for (const [from, to] of replacements) content = content.split(from).join(to);
    if (file.endsWith(join("(public)", "page.tsx"))) {
      content = content.replace(/title: "Natural Wellness Store Pakistan[^\n]+/, 'title: "OrganoCity | Himalayan Pink Salt, Shilajit & Herbal Products",');
      content = content.replace(/description: "Buy products in Pakistan[^\n]+/, 'description: "Shop authentic Himalayan pink salt, pure Shilajit, handcrafted salt lamps and natural herbal wellness products from OrganoCity Pakistan.",');
      content = content.replace(/<h1 className="sr-only">[^<]+<\/h1>/, '<h1 className="sr-only">OrganoCity – Pure Himalayan Wellness</h1>');
    }
    if (file.endsWith(join("public", "manifest.json"))) {
      content = content.replace(/"description": "OrganoCity[^\n]+/, '"description": "Pure Himalayan pink salt, Shilajit, herbal products, salt lamps, and natural wellness products.",');
      content = content.replace('"categories": ["shopping", "technology"]', '"categories": ["shopping", "food", "health"]');
    }
    if (file.endsWith(join("src", "app", "layout.tsx"))) {
      content = content.replace(/"OrganoCity[^\n]+Shop premium products, natural wellness products and accessories"/g, '"Shop authentic Himalayan pink salt, pure Shilajit, handcrafted salt lamps and natural herbal wellness products from OrganoCity Pakistan."');
    }
    if (content !== original) {
      writeFileSync(file, content, "utf8");
      changed++;
    }
  }
}
console.log(`Updated ${changed} files`);
