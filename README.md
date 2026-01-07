# 🕷️ NestJS Website Crawler & Product Metadata Extractor

<p align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

<p align="center">
  A scalable <strong>Website Crawling & Product Metadata Extraction</strong> service built using
  <a href="https://nestjs.com">NestJS</a>,
  <a href="https://pptr.dev/">Puppeteer</a>,
  <a href="https://cheerio.js.org/">Cheerio</a>,
  and <strong>PostgreSQL</strong>.
</p>

---

## 📌 Description

This project extends the default **NestJS TypeScript starter** into a **production-ready website crawler** capable of:

- 🌐 Crawling websites via `sitemap.xml`
- 🧪 Crawling individual product pages for debugging
- 🧠 Rendering JavaScript-heavy pages using Puppeteer
- 🧾 Extracting structured metadata using Cheerio
- 🔄 Handling dynamic dropdown content (e.g. size-based product details)
- 🧭 Generating dynamic breadcrumb levels
- 💾 Persisting crawl results into PostgreSQL

---

## 🚀 Core Features

- ✅ Sitemap-based page discovery
- ✅ Direct single-page crawling (debug mode)
- ✅ JavaScript-rendered DOM support
- ✅ Dynamic breadcrumb level generation
- ✅ Product metadata extraction
- ✅ Size dropdown → dynamic description extraction
- ✅ Crawl status tracking (`pending / done / failed`)
- ✅ Modular NestJS architecture

---

## 🧰 Tech Stack

| Layer       | Technology          |
| ----------- | ------------------- |
| Backend     | NestJS (TypeScript) |
| Scraping    | Puppeteer + Cheerio |
| Database    | PostgreSQL          |
| ORM         | TypeORM             |
| HTTP Client | Axios               |

---

## 📂 Project Structure

```bash
src/
├── app.module.ts
├── main.ts
├── crawler/
│   ├── crawler.controller.ts
│   ├── crawler.service.ts
│   ├── crawler.module.ts
│   ├── entities/
│   │   ├── website.entity.ts
│   │   ├── page.entity.ts
│   │   └── page-metadata.entity.ts
│   └── utils/
│       ├── page-loader.ts
│       ├── metadata-extractor.ts
│       └── size-extractor.ts
```

---

## ⚙️ Environment Setup

### Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** and fill in your Supabase credentials

3. **See [ENV_SETUP.md](./ENV_SETUP.md)** for detailed instructions on getting your Supabase credentials

### Configuration Options

**Option 1: Supabase Pooler (Recommended)**
```env
DB_POOLER_HOST=aws-1-us-east-2.pooler.supabase.com
DB_POOLER_USER=postgres.deaohsesihodomvhqlxe
DB_POOLER_PORT=6543
DB_PASSWORD=your_password
DB_NAME=postgres
```

**Option 2: Direct Connection**
```env
DATABASE_HOST=db.deaohsesihodomvhqlxe.supabase.co
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=postgres
DATABASE_SSL=true
```

**Note**: SSL is automatically enabled for remote hosts (Supabase). See [ENV_SETUP.md](./ENV_SETUP.md) for complete setup instructions.

---

## 📦 Install Dependencies

```bash
npm install
```

---

## ▶️ Run the Application

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

---

## 🔌 API Usage (Postman)

### 1️⃣ Register a Website (Sitemap Crawl)

**Endpoint**

```http
POST /crawler/register
```

**Request Body**

```json
{
  "websiteUrl": "https://valveman.com"
}
```

---

### 2️⃣ Debug Single Page

**Endpoint**

```http
POST /crawler/debug-page
```

**Request Body**

```json
{
  "url": "https://valveman.com/products/2-1-2-apollo-94alf10901a/"
}
```

---

## 🧪 Example Output

```json
{
  "productTitle": "2-1/2 Apollo Valve",
  "brand": "Apollo",
  "breadcrumbs": "Valves > Ball Valves > Manual > Test > Product Name",
  "sizes": {
    "2 inch": { "price": "$120" },
    "2.5 inch": { "price": "$145" }
  }
}
```

---

## 🧑‍💻 Author

Ankit Vyas

---

## 📄 License

MIT License
