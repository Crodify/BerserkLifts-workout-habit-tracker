-- Fix: Add INSERT policy for profiles (needed for upsert)
-- Run this in Supabase SQL Editor

-- Allow users to insert their own profile
CREATE POLICY IF NOT EXISTS "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to insert own workouts (if missing)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own workouts') THEN
    CREATE POLICY "Users can insert own workouts"
      ON public.workouts FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Allow users to insert own habits (if missing)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own habits') THEN
    CREATE POLICY "Users can insert own habits"
      ON public.habits FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Allow users to insert own routines (if missing)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own routines') THEN
    CREATE POLICY "Users can insert own routines"
      ON public.routines FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Allow users to insert own folders (if missing)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own folders') THEN
    CREATE POLICY "Users can insert own folders"
      ON public.folders FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Allow users to delete own workouts (if missing)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own workouts') THEN
    CREATE POLICY "Users can delete own workouts"
      ON public.workouts FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Allow users to delete own habits (if missing)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own habits') THEN
    CREATE POLICY "Users can delete own habits"
      ON public.habits FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Allow users to delete own routines (if missing)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own routines') THEN
    CREATE POLICY "Users can delete own routines"
      ON public.routines FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Allow users to delete own folders (if missing)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own folders') THEN
    CREATE POLICY "Users can delete own folders"
      ON public.folders FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;
