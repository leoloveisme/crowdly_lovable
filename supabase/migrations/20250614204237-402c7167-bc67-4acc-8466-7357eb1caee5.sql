
-- Create the story_attributes table with the requested columns/types

CREATE TABLE public.story_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL,
  story_creator UUID NOT NULL,
  story_contributors TEXT, -- comma-separated list of user IDs
  new TEXT NOT NULL CHECK (new IN ('YES', 'NO')),
  most_popular TEXT CHECK (most_popular IN ('YES', 'NO')) DEFAULT NULL,
  most_active TEXT CHECK (most_active IN ('YES', 'NO')) DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- (Optional) You may want to consider foreign keys in the future to profiles or stories table if created
-- The user requested user_ID to be UUIDs, representing users on the platform

