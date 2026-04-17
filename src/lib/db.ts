import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "articles.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      source_id TEXT UNIQUE,
      title TEXT NOT NULL,
      url TEXT,
      content TEXT,
      author TEXT,
      bank_name TEXT,
      category TEXT NOT NULL,
      published_at TEXT,
      collected_at TEXT DEFAULT (datetime('now', 'localtime')),
      is_read INTEGER DEFAULT 0,
      is_bookmarked INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
    CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_bank ON articles(bank_name);
    CREATE INDEX IF NOT EXISTS idx_articles_source_id ON articles(source_id);
  `);
}

export interface Article {
  id: number;
  source: string;
  source_id: string;
  title: string;
  url: string | null;
  content: string | null;
  author: string | null;
  bank_name: string | null;
  category: string;
  published_at: string | null;
  collected_at: string;
  is_read: number;
  is_bookmarked: number;
}

export function insertArticle(article: Omit<Article, "id" | "collected_at" | "is_read" | "is_bookmarked">): boolean {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO articles (source, source_id, title, url, content, author, bank_name, category, published_at)
    VALUES (@source, @source_id, @title, @url, @content, @author, @bank_name, @category, @published_at)
  `);
  const result = stmt.run(article);
  return result.changes > 0;
}

export function getArticles(options: {
  category?: string;
  bank_name?: string;
  search?: string;
  bookmarked?: boolean;
  limit?: number;
  offset?: number;
}): { articles: Article[]; total: number } {
  const db = getDb();
  const conditions: string[] = [];
  const params: Record<string, unknown> = {};

  if (options.category && options.category !== "all") {
    conditions.push("category = @category");
    params.category = options.category;
  }
  if (options.bank_name) {
    conditions.push("bank_name = @bank_name");
    params.bank_name = options.bank_name;
  }
  if (options.search) {
    conditions.push("(title LIKE @search OR content LIKE @search)");
    params.search = `%${options.search}%`;
  }
  if (options.bookmarked) {
    conditions.push("is_bookmarked = 1");
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = options.limit || 50;
  const offset = options.offset || 0;

  const countStmt = db.prepare(`SELECT COUNT(*) as total FROM articles ${where}`);
  const { total } = countStmt.get(params) as { total: number };

  const stmt = db.prepare(`
    SELECT * FROM articles ${where}
    ORDER BY published_at DESC, collected_at DESC
    LIMIT @limit OFFSET @offset
  `);
  const articles = stmt.all({ ...params, limit, offset }) as Article[];

  return { articles, total };
}

export function toggleBookmark(id: number): boolean {
  const db = getDb();
  const stmt = db.prepare("UPDATE articles SET is_bookmarked = CASE WHEN is_bookmarked = 0 THEN 1 ELSE 0 END WHERE id = @id");
  const result = stmt.run({ id });
  return result.changes > 0;
}

export function getBankNames(): string[] {
  const db = getDb();
  const rows = db.prepare("SELECT DISTINCT bank_name FROM articles WHERE bank_name IS NOT NULL ORDER BY bank_name").all() as { bank_name: string }[];
  return rows.map((r) => r.bank_name);
}
