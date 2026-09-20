-- Schema upgrade for gabcas7_gelodb: adds the optional hero_skills table (docs/PROJECT_PLAN.md §6.4).
-- You do not need to run this separately: database/seed_skills.sql creates the table itself.
-- Kept so the schema is documented on its own. Safe to re-run (IF NOT EXISTS).
--
-- hero.php already reads this table when it exists (GET returns skills[] ordered
-- passive, skill1, skill2, ultimate) and DELETE removes a hero's rows from it.
-- One row per (hero, slot); the UNIQUE key stops accidental duplicates.
-- Never touch the unrelated `students` table.

CREATE TABLE IF NOT EXISTS hero_skills (
  skill_id    INT AUTO_INCREMENT PRIMARY KEY,
  hero_id     INT NOT NULL,
  slot        ENUM('passive','skill1','skill2','ultimate') NOT NULL,
  name        VARCHAR(80) NOT NULL,
  description TEXT,
  cooldown    VARCHAR(40),
  mana_cost   VARCHAR(40),
  icon_url    VARCHAR(500),
  UNIQUE KEY uniq_hero_slot (hero_id, slot),
  CONSTRAINT fk_skill_hero FOREIGN KEY (hero_id)
    REFERENCES mobile_legends_heroes(hero_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
