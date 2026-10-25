
create table if not exists species (
  slug text primary key,
  type text not null,
  category text not null,
  "group" text default 'pranijogot',
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
  synonyms text default '[]',
  taxonomy text default '{}',
  physical text default '',
  identification text default '',
  behavior text default '',
  distribution text default '',
  ecological_role text default '',
  origin text default '',
  threats text default '',
  conservation_actions text default '',
  media text default '[]',
  data_status text default 'partial',
  last_verified_at timestamptz,
  conflicting_info text default '',
  sensitive boolean default false,
  featured boolean default false,
  views integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists species_type_idx on species(type);
create index if not exists species_category_idx on species(category);
create index if not exists species_group_idx on species("group");
create index if not exists species_status_idx on species(data_status);

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
  pinned boolean default false,
  "group" text default '',
  needs_identification boolean default false,
  identified_species text default '',
  created_at timestamptz default now()
);
create index if not exists posts_status_idx on posts(status);
create index if not exists posts_group_idx on posts("group");
create index if not exists posts_created_idx on posts(created_at desc);
create index if not exists posts_species_idx on posts(species_slug);

create table if not exists comments (
  id text primary key,
  post_id text not null,
  name text not null,
  user_id text,
  body text not null,
  suggested_species text default '',
  suggested_name text default '',
  id_source text default '',
  id_verified boolean default false,
  verified_by text default '',
  verified_at timestamptz,
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

create table if not exists ai_questions (
  id text primary key,
  question text not null,
  user_id text,
  user_name text default '',
  user_key text not null,
  track_code text unique not null,
  image_url text default '',
  ai_analysis text default '',
  missing_info text default '',
  search_results text default '[]',
  status text default 'new',
  answer text default '',
  answered_by text default '',
  answered_at timestamptz,
  suggest_to_kb boolean default false,
  species_slug text default '',
  created_at timestamptz default now()
);
create index if not exists aiq_status_idx on ai_questions(status);

create table if not exists notifications (
  id text primary key,
  user_key text not null,
  type text default 'system',
  title text not null,
  body text default '',
  url text default '',
  read boolean default false,
  created_at timestamptz default now()
);
create index if not exists ntf_user_idx on notifications(user_key);

create table if not exists saves (
  id text primary key,
  user_key text not null,
  target_type text not null,
  target_id text not null,
  created_at timestamptz default now(),
  unique (user_key, target_type, target_id)
);

create table if not exists reports (
  id text primary key,
  target_type text not null,
  target_id text not null,
  reason text default '',
  details text default '',
  reporter_name text default '',
  reporter_key text default '',
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists observations (
  id text primary key,
  species_slug text default '',
  guessed_name text default '',
  name text default '',
  user_id text,
  author_key text not null,
  photo_url text default '',
  location text default '',
  coarse_location text default '',
  location_shared boolean default false,
  notes text default '',
  observed_at timestamptz default now(),
  uncertain boolean default true,
  status text default 'submitted',
  identified_by text default '',
  created_at timestamptz default now()
);
create index if not exists obs_status_idx on observations(status);

create table if not exists audit_logs (
  id text primary key,
  actor_id text default '',
  actor_name text default '',
  action text not null,
  target text default '',
  detail text default '',
  created_at timestamptz default now()
);

create table if not exists blocks (
  blocker_key text not null,
  user_id text not null,
  created_at timestamptz default now(),
  primary key (blocker_key, user_id)
);

/* ------------------------------------------------------------------ */
/* হালনাগাদ কলাম — পুরোনো ডেটাবেজেও নিরাপদে যোগ হয়                     */
/*                                                                     */
/* `create table if not exists` আগের টেবিলে নতুন কলাম যোগ করে না। তাই  */
/* নিচের কলামগুলো আগে কোডে ব্যবহার হলেও বাস্তব Neon ডেটাবেজে ছিল না —   */
/* ফলে প্রোফাইল কভার, অ্যাকাউন্ট মুছার অনুরোধ, সংবাদের ধরন/প্রকাশক/     */
/* উৎস-লিংক, জেনো-র ধরন ও প্রজাতির পুরোনো-লেখার আর্কাইভ সাইলেন্টলি     */
/* হারিয়ে যেত। `if not exists` থাকায় বারবার চালালেও নিরাপদ।            */
/* ------------------------------------------------------------------ */

alter table species add column if not exists stub_archive text default '{}';
alter table species add column if not exists status_locked_at timestamptz;

alter table users add column if not exists cover text default '';
alter table users add column if not exists deletion_requested boolean default false;

alter table news add column if not exists kind text default 'news';
alter table news add column if not exists publisher text default '';
alter table news add column if not exists source_url text default '';
alter table news add column if not exists published_at timestamptz;

alter table jeno add column if not exists kind text default '';
