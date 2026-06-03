-- Admin credentials are now managed via the Lovable Cloud Users panel.
-- The previous contents of this migration embedded a plaintext admin password
-- and email, which is a credential exposure risk. The body has been removed.
-- Rotate the admin password in the Cloud Auth panel; do not re-introduce
-- plaintext credentials in migrations.
SELECT 1;
