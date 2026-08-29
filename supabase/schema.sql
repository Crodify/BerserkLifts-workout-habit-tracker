-- ============================================
-- BerserkLifts — Supabase Database Schema
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. PROFILES (extends auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null default 'Hunter',
  avatar text default '⚔️',
  xp integer default 0,
  level integer default 1,
  rank text default 'E',
  total_workouts integer default 0,
  total_volume numeric default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  total_prs integer default 0,
  join_date timestamp with time zone default now(),
  preferred_unit text default 'kg',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Hunter'),
    coalesce(new.raw_user_meta_data->>'avatar', '⚔️')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- 2. WORKOUTS
-- ============================================
create table public.workouts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  exercises jsonb not null default '[]',
  date timestamp with time zone default now(),
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  duration integer default 0,
  total_volume numeric default 0,
  xp_gained integer default 0,
  prs_hit text[] default '{}',
  created_at timestamp with time zone default now()
);

-- ============================================
-- 3. HABITS
-- ============================================
create table public.habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  icon text default '📋',
  completed_dates text[] default '{}',
  streak integer default 0,
  created_at timestamp with time zone default now()
);

-- ============================================
-- 4. ROUTINES
-- ============================================
create table public.routines (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  exercises jsonb not null default '[]',
  folder_id uuid,
  last_used timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- ============================================
-- 5. FOLDERS
-- ============================================
create table public.folders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  color text,
  created_at timestamp with time zone default now()
);

-- Add folder_id foreign key to routines
alter table public.routines
  add constraint routines_folder_id_fkey
  foreign key (folder_id) references public.folders(id) on delete set null;

-- ============================================
-- 6. CUSTOM EXERCISES
-- ============================================
create table public.exercises (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  muscle text not null,
  equipment text not null,
  is_custom boolean default true,
  created_at timestamp with time zone default now()
);

-- ============================================
-- 7. PERSONAL RECORDS
-- ============================================
create table public.personal_records (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  exercise_id text not null,
  type text not null,
  value numeric not null,
  weight numeric,
  reps integer,
  date timestamp with time zone default now(),
  workout_id uuid,
  created_at timestamp with time zone default now()
);

-- ============================================
-- 8. BODY MEASUREMENTS
-- ============================================
create table public.body_measurements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date timestamp with time zone default now(),
  weight numeric,
  chest numeric,
  arms numeric,
  waist numeric,
  thighs numeric
);

-- ============================================
-- 9. SETTINGS
-- ============================================
create table public.settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  weight_unit text default 'kg',
  default_rest_timer integer default 90,
  auto_start_rest_timer boolean default true,
  theme text default 'dark',
  weekly_workout_goal integer default 5,
  body_weight_goal numeric default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Auto-create settings on profile creation
create or replace function public.handle_new_profile()
returns trigger as $$
begin
  insert into public.settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute function public.handle_new_profile();

-- ============================================
-- 10. CHALLENGES
-- ============================================
create table public.challenges (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  mode text not null,
  status text default 'active',
  start_date timestamp with time zone default now(),
  end_date timestamp with time zone not null,
  description text default '',
  created_at timestamp with time zone default now()
);

create table public.challenge_participants (
  id uuid default uuid_generate_v4() primary key,
  challenge_id uuid references public.challenges(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  score numeric default 0,
  joined_at timestamp with time zone default now(),
  unique(challenge_id, user_id)
);

-- ============================================
-- 11. FRIENDS (for leaderboard)
-- ============================================
create table public.friends (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  friend_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(user_id, friend_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.workouts enable row level security;
alter table public.habits enable row level security;
alter table public.routines enable row level security;
alter table public.folders enable row level security;
alter table public.exercises enable row level security;
alter table public.personal_records enable row level security;
alter table public.body_measurements enable row level security;
alter table public.settings enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_participants enable row level security;
alter table public.friends enable row level security;

-- Profiles: users can read all, update own
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Workouts: users can CRUD own
create policy "Users can view own workouts"
  on public.workouts for select using (auth.uid() = user_id);

create policy "Users can insert own workouts"
  on public.workouts for insert with check (auth.uid() = user_id);

create policy "Users can update own workouts"
  on public.workouts for update using (auth.uid() = user_id);

create policy "Users can delete own workouts"
  on public.workouts for delete using (auth.uid() = user_id);

-- Habits: users can CRUD own
create policy "Users can view own habits"
  on public.habits for select using (auth.uid() = user_id);

create policy "Users can insert own habits"
  on public.habits for insert with check (auth.uid() = user_id);

create policy "Users can update own habits"
  on public.habits for update using (auth.uid() = user_id);

create policy "Users can delete own habits"
  on public.habits for delete using (auth.uid() = user_id);

-- Routines: users can CRUD own
create policy "Users can view own routines"
  on public.routines for select using (auth.uid() = user_id);

create policy "Users can insert own routines"
  on public.routines for insert with check (auth.uid() = user_id);

create policy "Users can update own routines"
  on public.routines for update using (auth.uid() = user_id);

create policy "Users can delete own routines"
  on public.routines for delete using (auth.uid() = user_id);

-- Folders: users can CRUD own
create policy "Users can view own folders"
  on public.folders for select using (auth.uid() = user_id);

create policy "Users can insert own folders"
  on public.folders for insert with check (auth.uid() = user_id);

create policy "Users can update own folders"
  on public.folders for update using (auth.uid() = user_id);

create policy "Users can delete own folders"
  on public.folders for delete using (auth.uid() = user_id);

-- Custom Exercises: users can CRUD own
create policy "Users can view own exercises"
  on public.exercises for select using (auth.uid() = user_id);

create policy "Users can insert own exercises"
  on public.exercises for insert with check (auth.uid() = user_id);

create policy "Users can delete own exercises"
  on public.exercises for delete using (auth.uid() = user_id);

-- Personal Records: users can CRUD own
create policy "Users can view own PRs"
  on public.personal_records for select using (auth.uid() = user_id);

create policy "Users can insert own PRs"
  on public.personal_records for insert with check (auth.uid() = user_id);

-- Body Measurements: users can CRUD own
create policy "Users can view own measurements"
  on public.body_measurements for select using (auth.uid() = user_id);

create policy "Users can insert own measurements"
  on public.body_measurements for insert with check (auth.uid() = user_id);

-- Settings: users can CRUD own
create policy "Users can view own settings"
  on public.settings for select using (auth.uid() = user_id);

create policy "Users can upsert own settings"
  on public.settings for insert with check (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.settings for update using (auth.uid() = user_id);

-- Challenges: users can view all, CRUD own
create policy "Challenges are viewable by participants"
  on public.challenges for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.challenge_participants
      where challenge_id = challenges.id and user_id = auth.uid()
    )
  );

create policy "Users can create challenges"
  on public.challenges for insert with check (auth.uid() = user_id);

create policy "Users can update own challenges"
  on public.challenges for update using (auth.uid() = user_id);

-- Challenge Participants
create policy "Participants viewable for own challenges"
  on public.challenge_participants for select
  using (
    exists (
      select 1 from public.challenges
      where id = challenge_id and user_id = auth.uid()
    )
    or user_id = auth.uid()
  );

create policy "Users can join challenges"
  on public.challenge_participants for insert with check (auth.uid() = user_id);

-- Friends: users can view own friendships
create policy "Users can view own friends"
  on public.friends for select using (auth.uid() = user_id);

create policy "Users can add friends"
  on public.friends for insert with check (auth.uid() = user_id);

-- ============================================
-- INDEXES
-- ============================================
create index idx_workouts_user_id on public.workouts(user_id);
create index idx_workouts_date on public.workouts(user_id, date desc);
create index idx_habits_user_id on public.habits(user_id);
create index idx_routines_user_id on public.routines(user_id);
create index idx_folders_user_id on public.folders(user_id);
create index idx_exercises_user_id on public.exercises(user_id);
create index idx_prs_user_exercise on public.personal_records(user_id, exercise_id);
create index idx_measurements_user_id on public.body_measurements(user_id);
create index idx_settings_user_id on public.settings(user_id);
create index idx_challenges_user_id on public.challenges(user_id);
create index idx_cp_challenge on public.challenge_participants(challenge_id);
create index idx_friends_user_id on public.friends(user_id);
