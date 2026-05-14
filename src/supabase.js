import { createClient }
from "@supabase/supabase-js";

const supabaseUrl =
  "https://fxravtcycwhgrqnqybvg.supabase.co";

const supabaseKey =
  "sb_publishable_FlsPkdOSBv7Z2Yn0RQ3Ngg_SYIjEOYa";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  );