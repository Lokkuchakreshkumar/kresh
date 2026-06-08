CREATE TABLE IF NOT EXISTS users (
  id              uuid primary key,
  username        varchar(50) unique not null,
  email           varchar(255) unique,
  avatar_url      text,
  bio             text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS skills (
  id                uuid primary key,
  owner_id          uuid not null references users(id),
  slug              varchar(100) unique not null,
  name              varchar(120) not null,
  description       text,
  category          varchar(50) not null,
  visibility        varchar(20) not null default 'public',
  current_version   varchar(30),
  installs_count    int not null default 0,
  stars_count       int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS skill_versions (
  id              uuid primary key,
  skill_id        uuid not null references skills(id),
  version         varchar(30) not null,
  changelog       text,
  checksum        varchar(128),
  created_at      timestamptz not null default now(),
  published_at    timestamptz not null default now(),
  unique(skill_id, version)
);

CREATE TABLE IF NOT EXISTS skill_files (
  id                uuid primary key,
  skill_version_id   uuid not null references skill_versions(id),
  path              text not null,
  content           text not null,
  file_type         varchar(30),
  created_at        timestamptz not null default now(),
  unique(skill_version_id, path)
);

CREATE TABLE IF NOT EXISTS skill_stars (
  id          uuid primary key,
  user_id     uuid not null references users(id),
  skill_id    uuid not null references skills(id),
  created_at  timestamptz not null default now(),
  unique(user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS collections (
  id            uuid primary key,
  owner_id      uuid not null references users(id),
  slug          varchar(100) unique not null,
  name          varchar(120) not null,
  description   text,
  visibility    varchar(20) not null default 'public',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS collection_skills (
  collection_id   uuid not null references collections(id),
  skill_id        uuid not null references skills(id),
  position        int not null default 0,
  created_at      timestamptz not null default now(),
  primary key (collection_id, skill_id)
);
