-- ============================================
-- ENABLE REALTIME UNTUK SUPABASE
-- Jalankan di: https://supabase.com/dashboard/project/xlvohdfwyhifaqqpstzo/sql/new
-- ============================================

-- STEP 1: Disable RLS (untuk development/testing)
-- WARNING: Di production, gunakan RLS policies yang proper!
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE labels DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- STEP 2: Grant permissions ke anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON messages TO anon;
GRANT ALL ON contacts TO anon;
GRANT ALL ON labels TO anon;
GRANT ALL ON users TO anon;

-- STEP 3: Enable Realtime publication
-- Cek apakah tabel sudah ada di publication
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Jika messages dan contacts TIDAK muncul, jalankan ini:
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE labels;

-- STEP 4: Set REPLICA IDENTITY (penting untuk Realtime!)
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE contacts REPLICA IDENTITY FULL;
ALTER TABLE labels REPLICA IDENTITY FULL;

-- STEP 5: Verify setup
-- Cek RLS status (harus false)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('messages', 'contacts', 'labels', 'users');

-- Cek grants (harus ada banyak untuk anon)
SELECT table_name, privilege_type 
FROM information_schema.table_privileges 
WHERE grantee = 'anon' 
AND table_schema = 'public'
AND table_name IN ('messages', 'contacts', 'labels', 'users');

-- Cek publication (harus ada messages, contacts, labels)
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename IN ('messages', 'contacts', 'labels');

-- ============================================
-- EXPECTED RESULTS:
-- ✅ RLS: rowsecurity = false untuk semua tabel
-- ✅ Grants: SELECT, INSERT, UPDATE, DELETE untuk anon
-- ✅ Publication: messages, contacts, labels muncul
-- ✅ Replica Identity: FULL untuk semua tabel
-- ============================================
