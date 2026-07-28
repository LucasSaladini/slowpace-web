CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule('purge-deleted-users', '0 0 * * *', $$
    DELETE FROM "users"
    WHERE "isActive" = false
        And "deletedAt" < NOW() - INTERVAL '7 days';
$$);