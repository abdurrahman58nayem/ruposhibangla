import { neon } from '@neondatabase/serverless'

export const DATABASE_URL = process.env.DATABASE_URL || ''

let cached: ReturnType<typeof neon> | null = null

export function hasDb(): boolean {
  return !!DATABASE_URL
}

export function getSql() {
  if (!DATABASE_URL) throw new Error('DATABASE_URL is not set')
  if (!cached) cached = neon(DATABASE_URL)
  return cached
}

export const SCHEMA_SQL = `
create table if not exists species (
  slug text primary key,
  type text not null,
  category text not null,
  name_bn text not null,
  name_en text,
  scientific_name text,
  other_names text default '[]',
  summary text default '',
  description text default '',
  habitat text default '',
  diet text default '',
  size_info text default '',
  season text default '',
  where_to_see text default '',
  reproduction text default '',
  conservation text default 'NE',
  conservation_bn text default '',
  color_tags text default '[]',
  image text default '',
  gallery text default '[]',
  poet_views text default '[]',
  sources text default '[]',
  featured boolean default false,
  views integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists species_type_idx on species(type);
create index if not exists species_category_idx on species(category);

create table if not exists posts (
  id text primary key,
  kind text not null,
  category text not null,
  title text default '',
  body text default '',
  media_url text default '',
  media_type text default '',
  thumb_url text default '',
  location text default '',
  species_slug text default '',
  tags text default '[]',
  author_name text not null,
  author_id text,
  author_key text default '',
  status text default 'approved',
  likes integer default 0,
  comments integer default 0,
  featured boolean default false,
  created_at timestamptz default now()
);
create index if not exists posts_status_idx on posts(status);
create index if not exists posts_created_idx on posts(created_at desc);
create index if not exists posts_species_idx on posts(species_slug);

create table if not exists comments (
  id text primary key,
  post_id text not null,
  name text not null,
  user_id text,
  body text not null,
  created_at timestamptz default now()
);
create index if not exists comments_post_idx on comments(post_id);

create table if not exists likes (
  post_id text not null,
  like_key text not null,
  created_at timestamptz default now(),
  primary key (post_id, like_key)
);

create table if not exists users (
  id text primary key,
  username text unique not null,
  name text not null,
  password_hash text default '',
  email text default '',
  role text default 'user',
  verified boolean default false,
  avatar text default '',
  bio text default '',
  location text default '',
  followers integer default 0,
  following integer default 0,
  created_at timestamptz default now()
);

create table if not exists follows (
  follower_key text not null,
  user_id text not null,
  created_at timestamptz default now(),
  primary key (follower_key, user_id)
);

create table if not exists news (
  id text primary key,
  slug text unique not null,
  title text not null,
  excerpt text default '',
  body text default '',
  cover text default '',
  tags text default '[]',
  published boolean default true,
  pinned boolean default false,
  views integer default 0,
  created_at timestamptz default now()
);

create table if not exists jeno (
  id text primary key,
  name text not null,
  contact text default '',
  topic text default '',
  message text default '',
  species_slug text default '',
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists settings (
  key text primary key,
  value text default ''
);
`
