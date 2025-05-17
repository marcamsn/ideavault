-- 1. Asegúrate de que el tipo enumerado existe (ya lo tienes)
-- CREATE TYPE "IdeaState" AS ENUM ('open', 'completed', 'discarded');

-- 2. Añadir la columna status usando el tipo enumerado
ALTER TABLE ideas ADD COLUMN status "IdeaState" NOT NULL DEFAULT 'open';

-- 3. Actualizar las filas existentes a 'open' (por si acaso)
UPDATE ideas SET status = 'open' WHERE status IS NULL;