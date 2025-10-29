ALTER TABLE users DROP CONSTRAINT users_username_unique;
ALTER TABLE users ALTER COLUMN username TYPE TEXT;
ALTER TABLE users RENAME COLUMN username TO name;