import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bxstxjrlhzkilbjynoyq.supabase.co';
const supabaseKey = 'sb_publishable_8NuTvbSmwo6vzxGXg_FwgQ_UC1Wvi17';

export const supabase = createClient(supabaseUrl, supabaseKey);
