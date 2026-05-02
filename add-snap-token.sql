-- Run this in your Supabase SQL Editor to add the snap_token column
ALTER TABLE public.orders 
ADD COLUMN snap_token text;
