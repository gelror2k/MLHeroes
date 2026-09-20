-- Skills for every hero: 133 heroes x 4 slots = 532 rows. Generated 2026-09-20.
--
-- HOW TO RUN: phpMyAdmin -> gabcas7_gelodb -> SQL tab -> paste this whole file -> Go.
-- (Or Import tab -> choose this file.) That is the only step: it creates the hero_skills
-- table if it does not exist, then fills it. Safe to run again: REPLACE INTO swaps any
-- existing row for the same hero + slot, so a re-run never errors with "duplicate entry".
--
-- hero_id is looked up by hero name, so it works whatever ids the table assigned. If a
-- name were missing from mobile_legends_heroes only that hero's statement would fail.
--
-- Data source: the Mobile Legends fandom wiki (mobile-legends.fandom.com), read on
-- 2026-09-20 through its MediaWiki API:
--   * name, cooldown, mana_cost  = the wiki's current values (cooldown/mana shown as
--     "level 1 - max level", e.g. 12.0-8.0; NULL where the skill has none).
--   * icon_url                   = the wiki's icon file for that exact skill (all 532
--     links checked to return an image).
--   * description                = short ORIGINAL summaries written for this app, not
--     Moonton's or the wiki's text (CLAUDE.md rule 6).
-- Hirara, Julian and Suyou have no ultimate: their third / combo skill sits in the
-- 'ultimate' slot and the description says so.

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

-- Layla
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Layla'), 'passive', 'Malefic Gun', 'Her shots hit harder the farther the target is from her.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/3/30/Malefic_Gun_-_Layla.png/revision/latest?cb=20220613134225'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Layla'), 'skill1', 'Malefic Bomb', 'Fires an energy shot that damages the first enemy hit and extends her next attack''s reach.', '6.0-4.0', '40-65', 'https://static.wikia.nocookie.net/mobile-legends/images/e/ee/Malefic_Bomb.png/revision/latest?cb=20220613134304'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Layla'), 'skill2', 'Void Projectile', 'Lobs a blast that slows the target and splashes damage onto enemies nearby.', '7.5-6.5', '65-90', 'https://static.wikia.nocookie.net/mobile-legends/images/b/b8/Void_Projectile.png/revision/latest?cb=20220613134332'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Layla'), 'ultimate', 'Destruction Rush', 'Unleashes a long-range beam that pierces everything in a straight line.', '37.0-27.0', '130-170', 'https://static.wikia.nocookie.net/mobile-legends/images/5/5e/Destruction_Rush.png/revision/latest?cb=20220613134348');

-- Miya
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Miya'), 'passive', 'Moon Blessing', 'Each attack on a target stacks attack speed; at full stacks her arrows split to hit extra targets.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/d8/Moon_Blessing.png/revision/latest?cb=20220302071911'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Miya'), 'skill1', 'Moon Arrow', 'Her next attacks fire additional arrows that also strike nearby enemies.', '11.0', '50-75', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0e/Moon_Arrow.png/revision/latest?cb=20220302071842'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Miya'), 'skill2', 'Arrow of Eclipse', 'Rains arrows on an area, damaging and slowing enemies inside, then slowing them further on repeat hits.', '8.0', '80-130', 'https://static.wikia.nocookie.net/mobile-legends/images/7/73/Arrow_of_Eclipse.png/revision/latest?cb=20220302071714'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Miya'), 'ultimate', 'Hidden Moonlight', 'Clears debuffs, turns invisible briefly and gains a burst of movement and attack speed.', '30.0-20.0', '120-170', 'https://static.wikia.nocookie.net/mobile-legends/images/e/ec/Hidden_Moonlight.png/revision/latest?cb=20220302071615');

-- Tigreal
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Tigreal'), 'passive', 'Fearless', 'Taking hits builds stacks that reduce the damage of the next enemy skill.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/0/02/Fearless.png/revision/latest?cb=20250918045822'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Tigreal'), 'skill1', 'Attack Wave', 'Slams the ground in a line, damaging and slowing enemies in front of him.', '7.0-4.0', '45', 'https://static.wikia.nocookie.net/mobile-legends/images/9/96/Attack_Wave.png/revision/latest?cb=20250918045844'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Tigreal'), 'skill2', 'Sacred Hammer', 'Charges forward and then swings his hammer to knock enemies up and toss them behind him.', '12.5-10.0', '70', 'https://static.wikia.nocookie.net/mobile-legends/images/3/3b/Sacred_Hammer.png/revision/latest?cb=20250918045909'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Tigreal'), 'ultimate', 'Implosion', 'Drags nearby enemies toward himself and stuns them.', '45.0-37.0', '120-160', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0e/Implosion.png/revision/latest?cb=20250918045911');

-- Eudora
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Eudora'), 'passive', 'Superconductor', 'Her skills leave a mark that makes her next skill on that target deal extra damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a7/Superconductor.png/revision/latest?cb=20260129103510'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Eudora'), 'skill1', 'Forked Lightning', 'Fires a fan of lightning that damages every enemy in the cone.', '7.0-5.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/e6/Forked_Lightning.png/revision/latest?cb=20260129103509'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Eudora'), 'skill2', 'Ball Lightning', 'Hurls a lightning orb at one enemy, damaging them and cutting their defense.', '11.0-8.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/d7/Ball_Lightning.png/revision/latest?cb=20260129103506'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Eudora'), 'ultimate', 'Thunder''s Wrath', 'Calls a lightning blast on an area, hitting hardest at the center and bursting on marked targets.', '32.0-26.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/f9/Thunder%27s_Wrath.png/revision/latest?cb=20260129103512');

-- Zilong
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zilong'), 'passive', 'Dragon Flurry', 'After three hits his next basic attack strikes three times and heals him.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a8/Dragon_Flurry.png/revision/latest?cb=20210903165112'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zilong'), 'skill1', 'Spear Flip', 'Grabs an enemy and flips them over his shoulder, tossing them behind him.', '12.0-9.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/c/c2/Spear_Flip.png/revision/latest?cb=20210903165308'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zilong'), 'skill2', 'Spear Strike', 'Dashes at a target with a rapid series of spear thrusts.', '12.0-9.0', '40', 'https://static.wikia.nocookie.net/mobile-legends/images/b/b6/Spear_Strike.png/revision/latest?cb=20210903165358'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zilong'), 'ultimate', 'Supreme Warrior', 'Boosts movement and attack speed and becomes immune to slows for a while.', '35.0-27.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/b0/Supreme_Warrior.png/revision/latest?cb=20210903165435');

-- Balmond
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Balmond'), 'passive', 'Bloodthirst', 'Killing a minion or hero restores a chunk of his HP.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/3/34/Bloodthirst.png/revision/latest?cb=20220624121727'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Balmond'), 'skill1', 'Soul Lock', 'Charges forward and stops at the first enemy hero hit, slowing them.', '8.0-5.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/dd/Soul_Lock.png/revision/latest?cb=20220624121809'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Balmond'), 'skill2', 'Cyclone Sweep', 'Spins his axe to repeatedly damage everything around him.', '6.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/db/Cyclone_Sweep.png/revision/latest?cb=20220624121821'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Balmond'), 'ultimate', 'Lethal Counter', 'Smashes the ground with a blow that deals more damage the less HP the target has.', '34.0-24.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/50/Lethal_Counter.png/revision/latest?cb=20220624121847');

-- Nana
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Nana'), 'passive', 'Molina''s Gift', 'When hit hard she briefly becomes untargetable and drops a Molina that slows enemies.', '150.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/61/Molina%27s_Gift.png/revision/latest?cb=20210924002747'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Nana'), 'skill1', 'Magic Boomerang', 'Throws a boomerang that damages enemies on the way out and back.', '5.5-4.0', '50-75', 'https://static.wikia.nocookie.net/mobile-legends/images/e/ea/Magic_Boomerang.png/revision/latest?cb=20210924003015'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Nana'), 'skill2', 'Molina Smooch', 'Sends a Molina that turns the enemy hit into a harmless creature for a moment.', '14.5-12.0', '80-105', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0e/Molina_Smooch.png/revision/latest?cb=20210924002930'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Nana'), 'ultimate', 'Molina Blitz', 'Summons three Molina attacks in an area that damage and slow enemies.', '36.0-28.0', '135-165', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d1/Molina_Blitz.png/revision/latest?cb=20210924002855');

-- Estes
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Estes'), 'passive', 'Scripture of the Moon Elf', 'Every few attacks his basic attack heals himself and slows the target.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/b7/Scripture_of_the_Moon_Elf.png/revision/latest?cb=20220404063820'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Estes'), 'skill1', 'Moonlight Immersion', 'Links to an ally and heals them over time while they stay close.', '11.0-7.0', '110-210', 'https://static.wikia.nocookie.net/mobile-legends/images/2/2b/Moonlight_Immersion.png/revision/latest?cb=20220404063857'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Estes'), 'skill2', 'Domain of Moon Goddess', 'Creates a field that damages and slows enemies passing through it.', '12.0-9.5', '80-130', 'https://static.wikia.nocookie.net/mobile-legends/images/2/2f/Domain_of_Moon_Goddess.png/revision/latest?cb=20220404064002'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Estes'), 'ultimate', 'Blessing of Moon Goddess', 'Heals all nearby allies and empowers his healing links for a while.', '55.0-45.0', '150-350', 'https://static.wikia.nocookie.net/mobile-legends/images/d/db/Blessing_of_Moon_Goddess.png/revision/latest?cb=20220404064022');

-- Alucard
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Alucard'), 'passive', 'Pursuit', 'After using a skill his next basic attack leaps to the target and strikes harder.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/0/04/Pursuit.png/revision/latest?cb=20211216232556'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Alucard'), 'skill1', 'Groundsplitter', 'Jumps to a spot and slams down, damaging everything around him.', '8.5-6.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/2/2d/Groundsplitter.png/revision/latest?cb=20200718155948'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Alucard'), 'skill2', 'Whirling Smash', 'Spins his blade to hit surrounding enemies, healing based on damage dealt.', '6.0-4.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/1/1d/Whirling_Smash.png/revision/latest?cb=20211216232613'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Alucard'), 'ultimate', 'Fission Wave', 'Sends a slashing wave forward and gains extra lifesteal for a short time.', '40.0-30.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a0/Fission_Wave.png/revision/latest?cb=20211216232655');

-- Franco
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Franco'), 'passive', 'Wasteland Force', 'Regains HP and moves faster while he stays out of combat.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/ac/Wasteland_Force.png/revision/latest?cb=20211208235145'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Franco'), 'skill1', 'Iron Hook', 'Throws a hook that drags the first enemy hit back to him.', '15.0-11.0', '135-160', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a4/Iron_Hook.png/revision/latest?cb=20211208235153'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Franco'), 'skill2', 'Fury Shock', 'Slams the ground to damage and slow enemies around him.', '7.0-4.5', '40-65', 'https://static.wikia.nocookie.net/mobile-legends/images/0/06/Fury_Shock.png/revision/latest?cb=20211208235201'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Franco'), 'ultimate', 'Bloody Hunt', 'Locks a target in place with a chain of rapid strikes.', '62.0-45.0', '110-140', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0d/Bloody_Hunt.png/revision/latest?cb=20211208235209');

-- Saber
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Saber'), 'passive', 'Enemy''s Bane', 'His attacks reduce the target''s physical defense with stacking hits.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/2/20/Enemy%27s_Bane.png/revision/latest?cb=20200718155708'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Saber'), 'skill1', 'Orbiting Swords', 'Summons blades that circle him, then sends them flying at nearby enemies.', '9.0', '75-125', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d9/Orbiting_Swords.png/revision/latest?cb=20201214101424'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Saber'), 'skill2', 'Charge', 'Dashes forward and damages enemies along the path.', '7.0', '70-45', 'https://static.wikia.nocookie.net/mobile-legends/images/d/db/Charge.png/revision/latest?cb=20200718155500'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Saber'), 'ultimate', 'Triple Sweep', 'Knocks a hero into the air and follows with a chain of slashes.', '44.0-36.0', '100-140', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0e/Triple_Sweep.png/revision/latest?cb=20200718160427');

-- Karina
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Karina'), 'passive', 'Shadow Combo', 'Every third hit on the same target deals bonus true damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/9/94/Shadow_Combo.png/revision/latest?cb=20220220014127'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Karina'), 'skill1', 'Dance of Blades', 'Blocks incoming basic attacks and empowers her next strike to slow and crit.', '7.0', '70-120', 'https://static.wikia.nocookie.net/mobile-legends/images/9/9d/Dance_of_Blades.png/revision/latest?cb=20220220014511'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Karina'), 'skill2', 'Dance of Death', 'Spins her twin blades to damage everything around her.', '6.0-4.5', '60-100', 'https://static.wikia.nocookie.net/mobile-legends/images/6/6e/Dance_of_Death.png/revision/latest?cb=20210808074021'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Karina'), 'ultimate', 'Shadow Assault', 'Dashes to a target for heavy damage; a kill soon after resets the cooldown.', '34.0-26.0', '100-140', 'https://static.wikia.nocookie.net/mobile-legends/images/6/66/Shadow_Assault.png/revision/latest?cb=20210808074105');

-- Angela
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Angela'), 'passive', 'Smart Heart', 'Casting skills gives her a temporary burst of movement speed.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/7b/Smart_Heart.png/revision/latest?cb=20210816222919'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Angela'), 'skill1', 'Love Waves', 'Fires heart projectiles that heal allies and damage enemies they pass through.', '2.0', '60-110', 'https://static.wikia.nocookie.net/mobile-legends/images/8/88/Love_Waves.png/revision/latest?cb=20210816223021'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Angela'), 'skill2', 'Puppet-on-a-String', 'Tethers an enemy, slowing them and dealing damage while the link holds.', '13.0-10.0', '90-140', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a6/Puppet-on-a-String.png/revision/latest?cb=20210816223118'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Angela'), 'ultimate', 'Heartguard', 'Shields an ally and possesses them, letting her cast her skills from inside them.', '60.0', '100-200', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a0/Heartguard.png/revision/latest?cb=20210816223245');

-- Lesley
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lesley'), 'passive', 'Lethal Shot', 'Standing still charges her next shot with extra range and damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/f1/Lethal_Shot.png/revision/latest?cb=20220908163801'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lesley'), 'skill1', 'Master of Camouflage', 'Turns invisible and gains movement speed and crit rate.', '5.0-2.0', '30', 'https://static.wikia.nocookie.net/mobile-legends/images/3/32/Master_of_Camouflage.png/revision/latest?cb=20220908163809'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lesley'), 'skill2', 'Tactical Grenade', 'Throws a grenade that knocks back enemies and hops her backward.', '10.0-7.0', '40', 'https://static.wikia.nocookie.net/mobile-legends/images/5/5f/Tactical_Grenade.png/revision/latest?cb=20220908163815'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lesley'), 'ultimate', 'Ultimate Snipe', 'Fires a series of long-range shots that lock onto one target.', '40.0', '0', 'https://static.wikia.nocookie.net/mobile-legends/images/9/95/Ultimate_Snipe.png/revision/latest?cb=20220908163825');

-- Fanny
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Fanny'), 'passive', 'Air Superiority', 'Damage dealt while flying builds energy and applies a mark for bonus damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/ab/Air_Superiority.png/revision/latest?cb=20211205125003'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Fanny'), 'skill1', 'Tornado Strike', 'Spins her blades to damage enemies close to her.', '3.5-2.5', '12', 'https://static.wikia.nocookie.net/mobile-legends/images/3/35/Tornado_Strike.png/revision/latest?cb=20211205125011'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Fanny'), 'skill2', 'Steel Cable', 'Fires a cable and pulls herself to where it lands, slicing enemies on the way.', '0.0', '19-14', 'https://static.wikia.nocookie.net/mobile-legends/images/0/06/Steel_Cable.png/revision/latest?cb=20211205125019'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Fanny'), 'ultimate', 'Cut Throat', 'Dives onto a target for burst damage that scales with her marks.', '35.0-25.0', '12', 'https://static.wikia.nocookie.net/mobile-legends/images/4/46/Cut_Throat.png/revision/latest?cb=20211205125029');

-- Gusion
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gusion'), 'passive', 'Dagger Specialist', 'Hitting an enemy with a skill marks them; his next basic attack detonates it.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/56/Dagger_Specialist.png/revision/latest?cb=20220908163637'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gusion'), 'skill1', 'Sword Spike', 'Throws a dagger, then can blink to the marked target.', '9.0-6.0', '70', 'https://static.wikia.nocookie.net/mobile-legends/images/1/1c/Sword_Spike.png/revision/latest?cb=20220908163717'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gusion'), 'skill2', 'Shadowblade Slaughter', 'Throws a fan of daggers and recalls them for a second wave of damage.', '11.0-9.0', '65-115', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c8/Shadowblade_Slaughter.png/revision/latest?cb=20220908163704'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gusion'), 'ultimate', 'Incandescence', 'Dashes in a direction and resets his other skills.', '28.0-20.0', '100-0', 'https://static.wikia.nocookie.net/mobile-legends/images/5/52/Incandescence.png/revision/latest?cb=20220908163651');

-- Lancelot
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lancelot'), 'passive', 'Soul Cutter', 'Marked targets take extra damage when he lands his skills.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/42/Soul_Cutter.png/revision/latest?cb=20210930072659'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lancelot'), 'skill1', 'Puncture', 'Dashes through a target; hitting a new target lets him dash again.', '14.0-12.0', '50-40', 'https://static.wikia.nocookie.net/mobile-legends/images/3/35/Puncture.png/revision/latest?cb=20210930072740'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lancelot'), 'skill2', 'Thorned Rose', 'Unleashes a flurry of stabs in a cone in front of him.', '10-7.0', '120-80', 'https://static.wikia.nocookie.net/mobile-legends/images/3/32/Thorned_Rose.png/revision/latest?cb=20210930072752'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lancelot'), 'ultimate', 'Phantom Execution', 'Becomes untargetable and charges forward with a devastating slash.', '27.0-21.0', '100-150', 'https://static.wikia.nocookie.net/mobile-legends/images/9/9d/Phantom_Execution.png/revision/latest?cb=20210930072804');

-- Chou
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Chou'), 'passive', 'Only Fast', 'Every few steps his next basic attack pierces armor and slows.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/0/02/Only_Fast.png/revision/latest?cb=20210808080206'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Chou'), 'skill1', 'Jeet Kune Do', 'A three-hit combo; the last hit knocks the target into the air.', '9.5-8.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/48/Jeet_Kune_Do.png/revision/latest?cb=20210808080309'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Chou'), 'skill2', 'Shunpo', 'Dashes forward, shrugging off crowd control with a shield.', '5.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/72/Shunpo.png/revision/latest?cb=20210808080502'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Chou'), 'ultimate', 'The Way of Dragon', 'Kicks an enemy away and can follow up to kick them again.', '34.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/65/The_Way_of_Dragon.png/revision/latest?cb=20210808080412');

-- Kagura
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kagura'), 'passive', 'Yin Yang Gathering', 'Retrieving her umbrella grants a shield and briefly disables nearby enemies.', '4.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/79/Yin_Yang_Gathering.png/revision/latest?cb=20210930071737'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kagura'), 'skill1', 'Seimei Umbrella Open', 'Sends her umbrella to a spot, damaging and slowing enemies there.', '5.0-3.5', '50-80', 'https://static.wikia.nocookie.net/mobile-legends/images/5/5d/Seimei_Umbrella_Open.png/revision/latest?cb=20210930071832'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kagura'), 'skill2', 'Rasho Umbrella Flee', 'Blinks a short distance, cleansing debuffs, with a different effect while holding the umbrella.', '12.0-9.5', '55-80', 'https://static.wikia.nocookie.net/mobile-legends/images/5/51/Rasho_Umbrella_Flee.png/revision/latest?cb=20210930071843'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kagura'), 'ultimate', 'Yin Yang Overturn', 'Slams the umbrella to knock enemies back or pull them in, depending on where it sits.', '43.0-33.0', '85-115', 'https://static.wikia.nocookie.net/mobile-legends/images/c/ce/Yin_Yang_Overturn.png/revision/latest?cb=20210930071853');

-- Hayabusa
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hayabusa'), 'passive', 'Ninjutsu: Trace of Shadow', 'Each hit on the same hero stacks up bonus damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/f4/Ninjutsu_Trace_of_Shadow.png/revision/latest?cb=20210930072349'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hayabusa'), 'skill1', 'Ninjutsu: Phantom Shuriken', 'Throws shuriken that slow enemies and steal a little energy.', '4.0', '30', 'https://static.wikia.nocookie.net/mobile-legends/images/5/59/Ninjutsu_Phantom_Shuriken.png/revision/latest?cb=20210930072401'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hayabusa'), 'skill2', 'Ninjutsu: Quad Shadow', 'Casts four shadows he can teleport to for repositioning.', '20.0-16.0', '25', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c7/Ninjutsu_Quad_Shadow.png/revision/latest?cb=20210930072410'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hayabusa'), 'ultimate', 'Ougi: Shadow Kill', 'Becomes untargetable and strikes a target repeatedly from the shadows.', '50.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/5e/Ougi_Shadow_Kill.png/revision/latest?cb=20210930072425');

-- Aamon
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aamon'), 'passive', 'Invisible Armor', 'Hitting an enemy lets him vanish and gain speed while regaining HP.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/0/0b/Invisible_Armor.png/revision/latest?cb=20211203045614'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aamon'), 'skill1', 'Soul Shards', 'Skills and hits charge his armor; when full, his next attack throws shards that scatter and keep striking.', '9.0-6.5', '60-90', 'https://static.wikia.nocookie.net/mobile-legends/images/e/e3/Soul_Shards.png/revision/latest?cb=20211203045706'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aamon'), 'skill2', 'Slayer Shards', 'Sends shards that scatter and return to him, damaging enemies on both paths.', '15.0-12.5', '110-80', 'https://static.wikia.nocookie.net/mobile-legends/images/5/52/Slayer_Shards.png/revision/latest?cb=20211203045819'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aamon'), 'ultimate', 'Endless Shards', 'Rains shards on a target for damage that grows with their missing HP.', '46.0-38.0', '150-190', 'https://static.wikia.nocookie.net/mobile-legends/images/3/37/Endless_Shards.png/revision/latest?cb=20211203045950');

-- Akai
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Akai'), 'passive', 'Tai Chi', 'Every skill cast grants a shield based on his max HP.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/f6/Tai_Chi.png/revision/latest?cb=20220807024925'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Akai'), 'skill1', 'Headbutt', 'Charges forward and knocks the first enemy hero hit into the air.', '13.0-10.0', '70-120', 'https://static.wikia.nocookie.net/mobile-legends/images/1/1a/Headbutt.png/revision/latest?cb=20220807024902'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Akai'), 'skill2', 'Body Slam', 'Belly-flops onto the ground to damage and slow enemies nearby.', '7.0-5.5', '70-95', 'https://static.wikia.nocookie.net/mobile-legends/images/2/2c/Body_Slam.png/revision/latest?cb=20220807024854'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Akai'), 'ultimate', 'Heavy Spin', 'Spins for several seconds, pushing enemies around and shrugging off slows.', '40.0-32.0', '120', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d1/Heavy_Spin.png/revision/latest?cb=20220807024909');

-- Aldous
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aldous'), 'passive', 'Contract: Transform', 'Casting a skill grants him a shield.', '5.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/8c/Contract_Transform.png/revision/latest?cb=20220201144120'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aldous'), 'skill1', 'Contract: Soul Steal', 'His next attack hits harder and stores permanent stacks when it kills.', '4.0', '60-85', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a0/Contract_Soul_Steal.png/revision/latest?cb=20220201144201'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aldous'), 'skill2', 'Contract: Explosion', 'Raises a guard that stuns nearby enemies when it ends.', '12.0-9.5', '80-130', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a3/Contract_Explosion.png/revision/latest?cb=20220201144246'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aldous'), 'ultimate', 'Contract: Chase Fate', 'Reveals every enemy hero, then lets him dash to one for a heavy knockback strike.', '60.0-50.0', '150-250', 'https://static.wikia.nocookie.net/mobile-legends/images/d/db/Contract_Chase_Fate.png/revision/latest?cb=20220201144314');

-- Alice
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Alice'), 'passive', 'Crimson Blood Banquet', 'Skill hits stack Crimson; at two stacks she drains nearby enemies while healing and moving faster.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/d5/Crimson_Blood_Banquet.png/revision/latest?cb=20250917073508'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Alice'), 'skill1', 'Crimson Gleam', 'Fires blood energy forward and can recast to blink to where it is.', '12.0-8.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/f0/Crimson_Gleam.png/revision/latest?cb=20250917073509'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Alice'), 'skill2', 'Doom Waltz', 'A dance that damages and heavily slows nearby enemies, scorching them while her banquet is active.', '4.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/2/2d/Doom_Waltz.png/revision/latest?cb=20250917073510'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Alice'), 'ultimate', 'Throne of Ruin', 'Wraps herself in blood with control immunity, then slams down to damage and immobilize enemies around her.', '60.0-50.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/2/2b/Throne_of_Ruin.png/revision/latest?cb=20250917073511');

-- Alpha
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Alpha'), 'passive', 'Beta, Advance!', 'His skills mark enemies for Beta to strafe with extra damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/1/15/Beta%2C_Advance%21.png/revision/latest?cb=20210616065533'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Alpha'), 'skill1', 'Rotary Impact', 'Swings his blade in a wave and Beta follows up on the marked line.', '4.0', '50', 'https://static.wikia.nocookie.net/mobile-legends/images/b/ba/Rotary_Impact.png/revision/latest?cb=20210616065548'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Alpha'), 'skill2', 'Force Swing', 'Sweeps in a cone, slowing enemies and healing himself per hit.', '6.0-4.0', '45-70', 'https://static.wikia.nocookie.net/mobile-legends/images/8/89/Force_Swing.png/revision/latest?cb=20210616065559'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Alpha'), 'ultimate', 'Spear of Alpha', 'Fires a spear and pulls himself to it, knocking enemies up on arrival.', '20.0-16.0', '70-90', 'https://static.wikia.nocookie.net/mobile-legends/images/5/5e/Spear_of_Alpha.png/revision/latest?cb=20210616065612');

-- Argus
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Argus'), 'passive', 'Warmonger', 'Attacks charge his blade; when full it deals bonus true damage.', NULL, '100', 'https://static.wikia.nocookie.net/mobile-legends/images/9/90/Warmonger.png/revision/latest?cb=20210313153523'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Argus'), 'skill1', 'Demonic Grip', 'Throws a chain to pull himself toward a target and slows nearby enemies.', '12.0-10.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/e6/Demonic_Grip.png/revision/latest?cb=20210313153103'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Argus'), 'skill2', 'Meteoric Sword', 'Slashes to leave a trail that boosts his movement and attack speed.', '8.0-6.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/3/30/Meteoric_Sword.png/revision/latest?cb=20210313153044'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Argus'), 'ultimate', 'Eternal Evil', 'Becomes immune to death for a few seconds, converting damage into healing.', '42.0-35.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/62/Eternal_Evil.png/revision/latest?cb=20210313152940');

-- Arlott
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Arlott'), 'passive', 'Demon Gaze', 'Enemies affected by crowd control get marked; his next hit on them heals him.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/48/Demon_Gaze.png/revision/latest?cb=20240605113340'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Arlott'), 'skill1', 'Dauntless Strike', 'Thrusts forward to damage and knock back enemies in a cone.', '8.0-5.0', '-', 'https://static.wikia.nocookie.net/mobile-legends/images/7/7d/Dauntless_Strike.png/revision/latest?cb=20240605113357'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Arlott'), 'skill2', 'Vengeance', 'Dashes to a marked target and knocks them up.', '10.0-8.0', '-', 'https://static.wikia.nocookie.net/mobile-legends/images/7/74/Vengeance_%28Arlott%29.png/revision/latest?cb=20240605113419'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Arlott'), 'ultimate', 'Final Slash', 'Cuts a line that flings every enemy in it toward one side.', '24.0-18.0', '100-140', 'https://static.wikia.nocookie.net/mobile-legends/images/2/2a/Final_Slash.png/revision/latest?cb=20240605113435');

-- Atlas
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Atlas'), 'passive', 'Frigid Breath', 'Emits a cold aura that slows nearby enemies until they freeze.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/64/Frigid_Breath.png/revision/latest?cb=20220410091657'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Atlas'), 'skill1', 'Annihilate', 'Triggers explosions around him that damage and slow enemies.', '7.0-4.5', '60-90', 'https://static.wikia.nocookie.net/mobile-legends/images/8/8c/Annihilate.png/revision/latest?cb=20220410091648'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Atlas'), 'skill2', 'Perfect Match', 'Ejects from his mecha to move fast, then reunites to stun enemies at the landing spot.', '15.0-10.0', '75-100', 'https://static.wikia.nocookie.net/mobile-legends/images/1/12/Perfect_Match.png/revision/latest?cb=20220410091559'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Atlas'), 'ultimate', 'Fatal Links', 'Chains nearby enemies and drags them all toward one point.', '55.0-45.0', '130-170', 'https://static.wikia.nocookie.net/mobile-legends/images/4/41/Fatal_Links.png/revision/latest?cb=20220410091537');

-- Aulus
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aulus'), 'passive', 'Fighting Spirit', 'Stacks power from hitting heroes and grows stronger the longer he fights.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/75/Fighting_Spirit.png/revision/latest?cb=20260423100255'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aulus'), 'skill1', 'Aulus, Charge!', 'Boosts movement speed and enhances his next attacks.', '14.0-12.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/8e/Aulus%2C_Charge%21.png/revision/latest?cb=20260423100322'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aulus'), 'skill2', 'The Power of Axe', 'Swings his axe in a sweep that slows and damages enemies in front.', '5.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/86/The_Power_of_Axe.png/revision/latest?cb=20260423100344'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aulus'), 'ultimate', 'Cleaving Axe', 'Swings repeatedly at nearby enemies, then a wide finishing slash, taking less damage while swinging.', '50.0-40.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/84/Cleaving_Axe.png/revision/latest?cb=20260423100403');

-- Aurora
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aurora'), 'passive', 'Pride of Ice', 'Every few skill casts her next skill freezes the target.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/62/Pride_of_Ice.png/revision/latest?cb=20240207104508'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aurora'), 'skill1', 'Hailstone Blast', 'Drops an icy meteorite on a spot, damaging and slowing enemies there.', '6.0-4.0', '55-105', 'https://static.wikia.nocookie.net/mobile-legends/images/2/25/Hailstone_Blast.png/revision/latest?cb=20240207104504'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aurora'), 'skill2', 'Frosty Breeze', 'Blows a cone of frost that damages enemies and can freeze them.', '13.0', '110-150', 'https://static.wikia.nocookie.net/mobile-legends/images/e/e9/Frosty_Breeze.png/revision/latest?cb=20240207104501'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Aurora'), 'ultimate', 'Frigid Glacier', 'Lays a frost path that slows enemies, then grows into glaciers that shatter for damage.', '50.0-40.0', '150-200', 'https://static.wikia.nocookie.net/mobile-legends/images/6/6e/Frigid_Glacier.png/revision/latest?cb=20240207104457');

-- Badang
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Badang'), 'passive', 'Chivalry Fist', 'Every few basic attacks his punch sends a shockwave that hits enemies behind the target.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/9/94/Chivalry_Fist.png/revision/latest?cb=20260919020957'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Badang'), 'skill1', 'Fist Wind', 'Punches a gust forward that damages, slows and knocks back, exploding when it hits an obstacle.', '10.4-7.2', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/55/Fist_Wind.png/revision/latest?cb=20260919021046'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Badang'), 'skill2', 'Fist Break', 'Dashes to a spot and raises a wall of fists that blocks enemy movement.', '9.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/c/ce/Fist_Break.png/revision/latest?cb=20260919021121'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Badang'), 'ultimate', 'Fist Crack', 'Channels a rapid barrage of punches in a direction.', '30.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/56/Fist_Crack.png/revision/latest?cb=20260919021157');

-- Bane
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Bane'), 'passive', 'Shark Bite', 'After a skill cast his next basic attack deals bonus damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/51/Shark_Bite.png/revision/latest?cb=20210519073932'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Bane'), 'skill1', 'Crab Claw Cannon', 'Fires a cannonball that bounces to another enemy after hitting the first.', '8.0-6.0', '30', 'https://static.wikia.nocookie.net/mobile-legends/images/e/e5/Crab_Claw_Cannon.png/revision/latest?cb=20210519073958'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Bane'), 'skill2', 'Ale', 'Drinks to recover HP and gain speed, then can spit venom in a cone.', '7.5-4.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a2/Ale.png/revision/latest?cb=20210519074017'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Bane'), 'ultimate', 'Deadly Catch', 'Sends a school of sharks in a direction, knocking enemies up.', '40.0-30.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/85/Deadly_Catch.png/revision/latest?cb=20210519074033');

-- Barats
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Barats'), 'passive', 'Big Guy', 'His skills stack up to grow bigger, gaining defense and size.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/2/20/Big_Guy.png/revision/latest?cb=20240104040408'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Barats'), 'skill1', 'So-Called Teamwork', 'Detona spits oil that damages and slows enemies in an area.', '7.0-5.0', '25-50', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d7/So-Called_Teamwork.png/revision/latest?cb=20240104040431'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Barats'), 'skill2', 'Missile Expert', 'Fires missiles that pull enemies toward him and knock them up.', '11.0-8.0', '70-100', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d5/Missile_%27Expert%27.png/revision/latest?cb=20240104040506'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Barats'), 'ultimate', 'Detona''s Welcome', 'Detona swallows an enemy hero and spits them out in a chosen direction.', '60.0-50.0', '100-140', 'https://static.wikia.nocookie.net/mobile-legends/images/6/6f/Detona%27s_Welcome.png/revision/latest?cb=20240104040522');

-- Baxia
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Baxia'), 'passive', 'Baxia Mark', 'His attacks reduce the healing enemies receive.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/3/3e/Baxia_Mark.png/revision/latest?cb=20220622095220'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Baxia'), 'skill1', 'Baxia-Shield Unity', 'Rolls forward at high speed and stuns the first enemy hit.', '15.0-12.0', '100-150', 'https://static.wikia.nocookie.net/mobile-legends/images/2/23/Shield_Unity.png/revision/latest?cb=20220622095232'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Baxia'), 'skill2', 'Shield of Spirit', 'Hurls his shield to damage and slow enemies in a line.', '10.0-7.0', '25-50', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c5/Shield_of_Spirit.png/revision/latest?cb=20220622095245'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Baxia'), 'ultimate', 'Tortoise''s Puissance', 'Leaves a burning trail while moving faster and taking less damage.', '40.0-35.0', '150-200', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d1/Tortoise%27s_Puissance.png/revision/latest?cb=20220622095259');

-- Beatrix
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Beatrix'), 'passive', 'Mechanical Genius', 'Carries two guns and swaps between them, each with a different attack style.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/2/2b/Mechanical_Genius_%28Renner%29.png/revision/latest?cb=20210905120255'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Beatrix'), 'skill1', 'Masterful Gunner', 'Reloads and fires an empowered attack whose effect depends on the equipped gun.', '12-7', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/3/30/Masterful_Gunner.png/revision/latest?cb=20210905120003'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Beatrix'), 'skill2', 'Tactical Reposition', 'Rolls in a direction and readies a full magazine.', '8.0-6.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/f0/Tactical_Reposition.png/revision/latest?cb=20210905120337'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Beatrix'), 'ultimate', 'Renner''s Apathy / Bennett''s Rage / Wesker''s Elation / Nibiru''s Passion', 'A special shot whose form depends on the equipped gun: a snipe, an explosive round, a spread or a rapid burst.', '24.0-18.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/c/c9/Renner%27s_Apathy.png/revision/latest?cb=20210905120358');

-- Belerick
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Belerick'), 'passive', 'Deadly Thorns', 'Taking damage lets him retaliate with thorn hits on nearby enemies.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/b2/Deadly_Thorns.png/revision/latest?cb=20200529095331'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Belerick'), 'skill1', 'Ancient Seed', 'Sends out roots that damage and slow enemies in a line.', '8.0-6.0', '60-90', 'https://static.wikia.nocookie.net/mobile-legends/images/a/af/Ancient_Seed.png/revision/latest?cb=20200529095427'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Belerick'), 'skill2', 'Nature''s Strike', 'Regains HP and taunts nearby enemies.', '12.0-9.0', '90-150', 'https://static.wikia.nocookie.net/mobile-legends/images/6/66/Nature%27s_Strike.png/revision/latest?cb=20200529095248'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Belerick'), 'ultimate', 'Wrath of Dryad', 'Whips out vines that drag enemies toward him.', '50.0-42.0', '150', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a8/Wrath_of_Dryad.png/revision/latest?cb=20200529095206');

-- Benedetta
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Benedetta'), 'passive', 'Elapsed Daytime', 'Holding a basic attack charges sword energy; releasing it dashes and slashes.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/4e/Elapsed_Daytime.png/revision/latest?cb=20210808075005'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Benedetta'), 'skill1', 'Phantom Slash', 'Dashes forward and follows with a slash that hits enemies in a line.', '10.0-6.5', '55-85', 'https://static.wikia.nocookie.net/mobile-legends/images/e/e6/Phantom_Slash.png/revision/latest?cb=20210808075102'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Benedetta'), 'skill2', 'An Eye for An Eye', 'Raises her blade to block damage, then thrusts and stuns if she was hit.', '15.0-12.0', '100-125', 'https://static.wikia.nocookie.net/mobile-legends/images/1/15/An_Eye_for_An_Eye.png/revision/latest?cb=20210808075205'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Benedetta'), 'ultimate', 'Alecto: Final Blow', 'Dashes through an area, slowing enemies, then returns to slash them again.', '45.0-35.0', '110-160', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d3/Alecto_Final_Blow.png/revision/latest?cb=20210808075249');

-- Brody
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Brody'), 'passive', 'Abyss Corrosion', 'Basic attacks move him slightly and stack marks on the target.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/73/Abyss_Corrosion.png/revision/latest?cb=20260916131216'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Brody'), 'skill1', 'Abyss Impact', 'Fires a shockwave that damages and slows enemies in a line.', '4.0', '40-90', 'https://static.wikia.nocookie.net/mobile-legends/images/f/f3/Abyss_Impact.png/revision/latest?cb=20260916131215'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Brody'), 'skill2', 'Corrosive Strike', 'Dashes to a target, stunning them and gaining movement speed.', '8.0-6.0', '75-100', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a2/Corrosive_Strike.png/revision/latest?cb=20260916131213'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Brody'), 'ultimate', 'Torn-Apart Memory', 'Locks onto marked enemies and unleashes stacked-based damage on each.', '24.0-19.0', '120-200', 'https://static.wikia.nocookie.net/mobile-legends/images/b/bf/Torn-Apart_Memory.png/revision/latest?cb=20260916131212');

-- Bruno
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Bruno'), 'passive', 'Mecha Legs', 'Every critical hit raises his crit damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/79/Mecha_Legs.png/revision/latest?cb=20260916132629'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Bruno'), 'skill1', 'Volley Shot', 'Kicks a ball that damages and slows the first enemy hit, then can be re-kicked.', '10.0-7.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/b0/Volley_Shot.png/revision/latest?cb=20260916132628'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Bruno'), 'skill2', 'Slide', 'Slides forward, briefly stunning enemies on the way, and readies a ball at the end.', '7.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/9/95/Slide.png/revision/latest?cb=20260916132627'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Bruno'), 'ultimate', 'Worldie', 'Kicks an energy ball at a hero that knocks them back and bounces on to others.', '38.0-28.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/fa/Worldie.png/revision/latest?cb=20260916132626');

-- Carmilla
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Carmilla'), 'passive', 'Vampire Pact', 'Attacking heroes steals defense from them and grants it to her.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/d9/Vampire_Pact.png/revision/latest?cb=20241020152046'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Carmilla'), 'skill1', 'Crimson Flower', 'Circles blood blossoms around her that damage nearby enemies and heal her.', '9.0', '50-90', 'https://static.wikia.nocookie.net/mobile-legends/images/5/5d/Crimson_Flower.png/revision/latest?cb=20241020152042'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Carmilla'), 'skill2', 'Bloodbath', 'Dashes to a target, dealing damage and slowing them.', '12.0-8.0', '85-160', 'https://static.wikia.nocookie.net/mobile-legends/images/c/cf/Bloodbath.png/revision/latest?cb=20241020152039'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Carmilla'), 'ultimate', 'Curse of Blood', 'Throws a curse that links nearby enemies so damage spreads between them.', '60.0-44.0', '150-200', 'https://static.wikia.nocookie.net/mobile-legends/images/3/37/Curse_of_Blood.png/revision/latest?cb=20241020152035');

-- Cecilion
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Cecilion'), 'passive', 'Overflowing', 'Hitting enemies with skills permanently increases his max mana.', '1.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/55/Overflowing.png/revision/latest?cb=20210809090952'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Cecilion'), 'skill1', 'Bat Impact', 'Sends a bat that damages enemies in a line and returns.', '1.5', '75', 'https://static.wikia.nocookie.net/mobile-legends/images/f/f0/Bat_Impact.png/revision/latest?cb=20210809091024'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Cecilion'), 'skill2', 'Sanguine Claws', 'Summons claws that pull enemies to a point and stun them.', '12.0-8.0', '95-120', 'https://static.wikia.nocookie.net/mobile-legends/images/1/1c/Sanguine_Claws.png/revision/latest?cb=20210809091115'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Cecilion'), 'ultimate', 'Bats Feast', 'Moves while continuously firing bats that damage and slow enemies.', '44.0-38.0', '150-250', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0f/Bats_Feast.png/revision/latest?cb=20210809091208');

-- Chang'e
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Chang''e'), 'passive', 'Trouble Maker', 'Gains a shield when using skills near allies.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/d5/Trouble_Maker.png/revision/latest?cb=20210816222133'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Chang''e'), 'skill1', 'Starmoon Shockwave', 'Sends an energy sphere that damages and slows enemies; extra spheres follow while her Crescent Moon is up.', '7.0', '70-95', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c0/Starmoon_Shockwave.png/revision/latest?cb=20210816222224'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Chang''e'), 'skill2', 'Crescent Moon', 'Summons a barrier that blocks projectiles and boosts her movement.', '12.0-9.5', '60-110', 'https://static.wikia.nocookie.net/mobile-legends/images/e/e7/Crescent_Moon.png/revision/latest?cb=20210816222319'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Chang''e'), 'ultimate', 'Meteor Shower', 'Rapid-fires a stream of meteors in a direction while she moves.', '36.0-30.0', '150-250', 'https://static.wikia.nocookie.net/mobile-legends/images/c/cf/Meteor_Shower.png/revision/latest?cb=20210816222411');

-- Chip
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Chip'), 'passive', 'Snack Time!', 'Eats chips while out of combat to regain HP faster.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a2/Snack_Time%21.png/revision/latest?cb=20240605110012'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Chip'), 'skill1', 'Crash Course', 'Jumps and slams the ground, marking enemies; hitting a marked enemy again stuns them.', '5.5-4.0', '40-65', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d4/Crash_Course.png/revision/latest?cb=20240605110128'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Chip'), 'skill2', 'Overtime', 'Builds up movement speed, then charges his next attack to knock the target back.', '13.0-10.0', '75-100', 'https://static.wikia.nocookie.net/mobile-legends/images/3/3f/Overtime.png/revision/latest?cb=20240605110146'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Chip'), 'ultimate', 'Shortcut', 'Opens a portal that allies and enemies can use to travel across the map.', '70.0-50.0', '110', 'https://static.wikia.nocookie.net/mobile-legends/images/8/89/Shortcut.png/revision/latest?cb=20240605110203');

-- Cici
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Cici'), 'passive', 'Performer''s Delight', 'Dealing damage stacks movement speed and spell vamp.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/9/97/Performer%27s_Delight.png/revision/latest?cb=20231223051030'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Cici'), 'skill1', 'Yo-Yo Blitz', 'Swings her yo-yo at an enemy, hitting them repeatedly while she stays close.', '6.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/59/Yo-Yo_Blitz.png/revision/latest?cb=20231223050624'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Cici'), 'skill2', 'Buoyant Bounce', 'Leaps to a spot and can bounce again toward a target, damaging where she lands.', '9.5-7.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/2/2e/Buoyant_Bounce.png/revision/latest?cb=20231223050621'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Cici'), 'ultimate', 'Curtain Call', 'Tethers an enemy hero so they take extra damage and are slowed while linked.', '40.0-32.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/0/06/Curtain_Call.png/revision/latest?cb=20231223050623');

-- Claude
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Claude'), 'passive', 'Battle Side-by-Side', 'Dexter, his monkey, attacks alongside him and stacks attack speed.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a5/Battle_Side-by-side.png/revision/latest?cb=20211205134824'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Claude'), 'skill1', 'Art of Thievery', 'Fires a wave that steals movement and attack speed from enemies hit.', '5.0', '65-90', 'https://static.wikia.nocookie.net/mobile-legends/images/8/8f/Art_of_Thievery.png/revision/latest?cb=20211205134839'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Claude'), 'skill2', 'Battle Mirror Image', 'Places a mirror image he can swap places with.', '11.0-8.5', '70-120', 'https://static.wikia.nocookie.net/mobile-legends/images/5/51/Battle_Mirror_Image.png/revision/latest?cb=20211205134848'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Claude'), 'ultimate', 'Blazing Duet', 'Sprays bullets at all nearby enemies while moving and gains a shield.', '50.0-40.0', '150-200', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0c/Blazing_Duet.png/revision/latest?cb=20211205134856');

-- Clint
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Clint'), 'passive', 'Double Shot', 'After a skill his next basic attack fires a piercing shot.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/9/9a/Double_Shot.png/revision/latest?cb=20260918135120'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Clint'), 'skill1', 'Quick Draw', 'Fires a spread of bullets in a cone that damages every enemy hit.', '8.0-5.0', '50', 'https://static.wikia.nocookie.net/mobile-legends/images/3/39/Quick_Draw.png/revision/latest?cb=20260918135145'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Clint'), 'skill2', 'Trapping Recoil', 'Fires a net that traps the enemy hit while he hops backward.', '10.0-8.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/57/Trapping_Recoil.png/revision/latest?cb=20260918135302'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Clint'), 'ultimate', 'Grenade Bombardment', 'Lobs grenades that explode on enemies, with several charges stored.', '1.5-0.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/be/Grenade_Bombardment.png/revision/latest?cb=20260918135404');

-- Cyclops
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Cyclops'), 'passive', 'Starlit Hourglass', 'Landing skills shortens his cooldowns.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/0/00/Starlit_Hourglass.png/revision/latest?cb=20171009130450'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Cyclops'), 'skill1', 'Stardust Shock', 'Fires two waves of star energy in a direction.', '9.0', '100', 'https://static.wikia.nocookie.net/mobile-legends/images/9/9d/Stardust_Shock.png/revision/latest?cb=20171009130518'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Cyclops'), 'skill2', 'Planets Attack', 'Summons orbs that circle him and shoot at nearby enemies.', '14-10.5', '60-90', 'https://static.wikia.nocookie.net/mobile-legends/images/c/ca/Planets_Attack.png/revision/latest?cb=20171009130630'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Cyclops'), 'ultimate', 'Star Power Lockdown', 'Launches a homing orb that chases a target and roots them on impact.', '43.0', '160-200', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a8/Star_Power_Lockdown.png/revision/latest?cb=20171009130650');

-- Diggie
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Diggie'), 'passive', 'Young Again', 'On death he becomes an egg that can still move, cannot be targeted and revives later.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/5e/Young_Again.png/revision/latest?cb=20211002145722'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Diggie'), 'skill1', 'Auto Alarm Bomb', 'Drops a bomb that chases enemies and explodes to slow them.', '8.0-5.0', '70-120', 'https://static.wikia.nocookie.net/mobile-legends/images/4/4b/Auto_Alarm_Bomb.png/revision/latest?cb=20211002145736'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Diggie'), 'skill2', 'Reverse Time', 'Marks a target so they are pulled back to where they were after a delay.', '15.0-10.0', '90', 'https://static.wikia.nocookie.net/mobile-legends/images/3/34/Reverse_Time.png/revision/latest?cb=20211002145746'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Diggie'), 'ultimate', 'Time Journey', 'Frees nearby allies from crowd control and shields them.', '76.0-64.0', '130-170', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a2/Time_Journey.png/revision/latest?cb=20211002145917');

-- Dyrroth
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Dyrroth'), 'passive', 'Wrath of the Abyss', 'Every few basic attacks he deals bonus damage and regains HP.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/53/Wrath_of_the_Abyss.png/revision/latest?cb=20250917081930'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Dyrroth'), 'skill1', 'Burst Strike', 'Two rapid slashes, the second one slowing enemies hit.', '5.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/9/96/Burst_Strike.png/revision/latest?cb=20250917081928'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Dyrroth'), 'skill2', 'Spectre Step', 'Dashes forward and can dash again to strike a target.', '8.0-4.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/0/09/Spectre_Step.png/revision/latest?cb=20250917081929'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Dyrroth'), 'ultimate', 'Abysm Strike', 'A heavy blow that deals more damage the less HP the target has.', '36.0-28.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/ff/Abysm_Strike.png/revision/latest?cb=20250917081927');

-- Edith
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Edith'), 'passive', 'Overload', 'Casting skills charges her attacks to chain lightning between enemies.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a7/Overload.png/revision/latest?cb=20211224061826'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Edith'), 'skill1', 'Earth Shatter', 'Phylax slams the ground to knock enemies into the air.', '8.5-6.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/64/Earth_Shatter.png/revision/latest?cb=20211224061841'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Edith'), 'skill2', 'Onward', 'Phylax charges forward and tosses the first hero hit over its shoulder.', '10.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/e7/Onward.png/revision/latest?cb=20211224061907'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Edith'), 'ultimate', 'Primal Wrath', 'Ejects from Phylax to fight as a ranged attacker with charged shots.', '40.0-34.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/2/24/Primal_Wrath.png/revision/latest?cb=20211224061924');

-- Esmeralda
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Esmeralda'), 'passive', 'Starmoon Casket', 'Absorbs enemy shields and turns them into her own shield.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/89/Starmoon_Casket.png/revision/latest?cb=20210808075519'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Esmeralda'), 'skill1', 'Frostmoon Shield', 'Gains a shield and movement speed while draining nearby enemies'' shields.', '8.5', '60-110', 'https://static.wikia.nocookie.net/mobile-legends/images/5/58/Frostmoon_Shield.png/revision/latest?cb=20210808075630'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Esmeralda'), 'skill2', 'Stardust Dance', 'Sweeps in an arc to damage enemies around her.', '4.5-3.5', '75-100', 'https://static.wikia.nocookie.net/mobile-legends/images/0/05/Stardust_Dance.png/revision/latest?cb=20210808075728'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Esmeralda'), 'ultimate', 'Falling Starmoon', 'Charges and throws a wave that damages and slows enemies in its path.', '32.0-24.0', '150-250', 'https://static.wikia.nocookie.net/mobile-legends/images/8/89/Falling_Starmoon.png/revision/latest?cb=20210808075820');

-- Faramis
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Faramis'), 'passive', 'Vicious Retrieval', 'Gathers soul fragments from fallen units to shorten his death timer.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/7e/Vicious_Retrieval.png/revision/latest?cb=20220612054039'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Faramis'), 'skill1', 'Shadow Stampede', 'Turns into a shadow, pulling enemies he passes through toward his stop point.', '15.0', '70-120', 'https://static.wikia.nocookie.net/mobile-legends/images/b/b4/Shadow_Stampede.png/revision/latest?cb=20220612054032'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Faramis'), 'skill2', 'Ghost Bursters', 'Fires a bolt that bounces between enemies.', '6.0-5.0', '75-125', 'https://static.wikia.nocookie.net/mobile-legends/images/1/14/Ghost_Bursters.png/revision/latest?cb=20220612054026'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Faramis'), 'ultimate', 'Nether Realm', 'Turns the area into a realm that shields allies and briefly resurrects them if the shield breaks.', '80.0-70.0', '150-350', 'https://static.wikia.nocookie.net/mobile-legends/images/f/f5/Nether_Realm.png/revision/latest?cb=20260313084936');

-- Floryn
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Floryn'), 'passive', 'Dew', 'Grants allies a flower item that heals them whenever she heals.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/ee/Dew.png/revision/latest?cb=20210930073514'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Floryn'), 'skill1', 'Sow', 'Throws a seed that damages an enemy and heals nearby allies.', '9.0-7.5', '90-140', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d6/Sow.png/revision/latest?cb=20210930073600'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Floryn'), 'skill2', 'Sprout', 'Fires a bolt that bounces to nearby enemies and slows them.', '13.0-10.0', '100-150', 'https://static.wikia.nocookie.net/mobile-legends/images/3/34/Sprout.png/revision/latest?cb=20210930073631'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Floryn'), 'ultimate', 'Bloom', 'Heals every ally on the map and shields those with low HP.', '70.0', '150-200', 'https://static.wikia.nocookie.net/mobile-legends/images/2/28/Bloom.png/revision/latest?cb=20210930073642');

-- Fredrinn
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Fredrinn'), 'passive', 'Crystalline Armor', 'Stores a portion of damage taken as energy to spend on his ultimate.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/dd/Crystalline_Armor.png/revision/latest?cb=20220807030146'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Fredrinn'), 'skill1', 'Piercing Strike', 'Thrusts his blade forward to damage enemies in a line.', '7.5-6.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/b3/Piercing_Strike.png/revision/latest?cb=20220807030157'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Fredrinn'), 'skill2', 'Brave Assault', 'Dashes forward and can follow with a wide sweep that knocks up.', '7.5-6.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/9/96/Brave_Assault.png/revision/latest?cb=20220807030045'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Fredrinn'), 'ultimate', 'Energy Eruption', 'Releases stored energy to damage and taunt nearby enemies, gaining defense for each one hit.', '8.0-5.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/73/Energy_Eruption.png/revision/latest?cb=20220807030151');

-- Freya
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Freya'), 'passive', 'Power of Einherjar', 'Landing skills builds stacks that empower her attacks.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/9/9d/Power_of_Einherjar.png/revision/latest?cb=20251110105718'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Freya'), 'skill1', 'Leap of Faith', 'Leaps to a spot, damaging and slowing enemies where she lands.', '8.0-6.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/55/Leap_of_Faith.png/revision/latest?cb=20251110105717'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Freya'), 'skill2', 'Valkyrie Slash', 'Charges and slashes to damage and slow enemies, spending Sacred Orbs instead of a cooldown.', '0.4', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/c/c7/Valkyrie_Slash.png/revision/latest?cb=20251110105436'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Freya'), 'ultimate', 'Valkyrie Descent', 'Enters a stronger form with a shield and empowered strikes.', '34.0-26.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/1/1a/Valkyrie_Descent.png/revision/latest?cb=20251110105720');

-- Gatotkaca
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gatotkaca'), 'passive', 'Steel Bones', 'Converts lost HP into extra physical defense.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/f0/Steel_Bones.png/revision/latest?cb=20210627030035'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gatotkaca'), 'skill1', 'Blast Iron Fist', 'Punches the ground to damage and slow enemies in a line.', '8.0-6.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/d4/Blast_Iron_Fist.png/revision/latest?cb=20210627025912'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gatotkaca'), 'skill2', 'Unbreakable', 'Taunts nearby enemies and gains a shield.', '12.0-10.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/ef/Unbreakable.png/revision/latest?cb=20171010092652'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gatotkaca'), 'ultimate', 'Avatar of the Guardian', 'Leaps to a spot and slams down, knocking enemies into the air.', '54.0-46.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/4e/Avatar_of_the_Guardian.png/revision/latest?cb=20171010092756');

-- Gloo
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gloo'), 'passive', 'Stick, Stick', 'Skills leave goo that sticks to enemies and slows them.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/6a/Stick%2C_Stick.png/revision/latest?cb=20250827131608'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gloo'), 'skill1', 'Slam, Slam', 'Slams the ground twice to damage and slow enemies nearby.', '10.0-6.0', '25-50', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c5/Slam%2C_Slam.png/revision/latest?cb=20250827131633'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gloo'), 'skill2', 'Spread, Spread', 'Splits into goos that damage and immobilize enemies in a cone, then pulls itself back together.', '12.0-10.0', '80-120', 'https://static.wikia.nocookie.net/mobile-legends/images/5/53/Spread%2C_Spread.png/revision/latest?cb=20250827132038'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gloo'), 'ultimate', 'Grab, Grab', 'Attaches to a fully stuck enemy hero, healing itself and passing most damage it takes onto them.', '50.0', '150', 'https://static.wikia.nocookie.net/mobile-legends/images/8/8f/Grab%2C_Grab.png/revision/latest?cb=20250827132205');

-- Gord
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gord'), 'passive', 'Mystic Favor', 'Every few skill hits on a target deal bonus true damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/69/Mystic_Favor.png/revision/latest?cb=20171023001614'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gord'), 'skill1', 'Mystic Projectile', 'Fires an orb that damages and stuns enemies in an area.', '10.0-7.5', '90-140', 'https://static.wikia.nocookie.net/mobile-legends/images/6/68/Mystic_Projectile.png/revision/latest?cb=20171023001237'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gord'), 'skill2', 'Mystic Injunction', 'Lays a zone that repeatedly damages enemies inside.', '8.0-6.0', '55-105', 'https://static.wikia.nocookie.net/mobile-legends/images/8/8b/Mystic_Injunction.png/revision/latest?cb=20171023001345'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Gord'), 'ultimate', 'Mystic Gush', 'Channels a wide beam that continuously damages enemies in its path.', '44.0-36.0', '150-190', 'https://static.wikia.nocookie.net/mobile-legends/images/5/5d/Mystic_Gush.png/revision/latest?cb=20171023001719');

-- Granger
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Granger'), 'passive', 'Capriccio', 'His gun and cannon run on demonic energy that refills over time and grows with each kill.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/b0/Capriccio.png/revision/latest?cb=20241107093833'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Granger'), 'skill1', 'Rhapsody', 'Fires all remaining bullets in a cone.', '0.3', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/e2/Rhapsody.png/revision/latest?cb=20241107093851'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Granger'), 'skill2', 'Rondo', 'Dashes forward and reloads a bullet.', '12.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/1/1e/Rondo.png/revision/latest?cb=20241107093903'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Granger'), 'ultimate', 'Death Sonata', 'Turns his violin into a cannon and fires powerful long-range rounds.', '0.6', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/61/Death_Sonata.png/revision/latest?cb=20241107093910');

-- Grock
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Grock'), 'passive', 'Bastion of Stone', 'Periodically gains a shield and an empowered attack that bites a share of max HP, recharging faster near walls.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/eb/Bastion_of_Stone.png/revision/latest?cb=20250811073743'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Grock'), 'skill1', 'Mighty Swing', 'A heavy strike that slams enemies into terrain behind them for extra damage and a knock-up.', '8.0-6.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/7f/Mighty_Swing.png/revision/latest?cb=20250811073747'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Grock'), 'skill2', 'Earthen Rampart', 'Raises a stone wall that damages and knocks back enemies where it appears.', '14.0-10.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/fd/Earthen_Rampart.png/revision/latest?cb=20250811073745'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Grock'), 'ultimate', 'Tectonic Charge', 'Charges forward; hitting terrain sets off an explosion that knocks nearby enemies airborne.', '55.0-45.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/72/Tectonic_Charge.png/revision/latest?cb=20250811073748');

-- Guinevere
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Guinevere'), 'passive', 'Super Magic', 'Casting skills empowers her next basic attack with bonus damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/2/21/Super_Magic.png/revision/latest?cb=20210808074341'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Guinevere'), 'skill1', 'Energy Wave', 'Fires an energy ball that damages and slows the first enemy hit.', '4.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/89/Energy_Wave.png/revision/latest?cb=20210808074449'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Guinevere'), 'skill2', 'Spatial Migration', 'Leaps to a spot, knocking enemies there airborne, and can blink back afterward.', '17.0-14.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/bd/Spatial_Migration.png/revision/latest?cb=20210808074631'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Guinevere'), 'ultimate', 'Violet Requiem', 'Unleashes a barrage on airborne enemies, keeping them in the air.', '52.0-40.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/0/04/Violet_Requiem.png/revision/latest?cb=20210808074543');

-- Hanabi
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hanabi'), 'passive', 'Ninjutsu: Petal Barrage', 'Her attacks launch petal blades that bounce between nearby enemies.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/88/Ninjutsu_Petal_Barrage.png/revision/latest?cb=20221217033136'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hanabi'), 'skill1', 'Ninjutsu: Equinox', 'Gains a shield that grants control immunity, speed and lifesteal while it holds.', '14.0-12.0', '35-60', 'https://static.wikia.nocookie.net/mobile-legends/images/5/5d/Ninjutsu_Equinox.png/revision/latest?cb=20221217033128'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hanabi'), 'skill2', 'Ninjutsu: Soul Scroll', 'Throws a scroll that damages and slows enemies in a line.', '8.0-6.0', '35-60', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d4/Ninjutsu_Soul_Scroll.png/revision/latest?cb=20221217033141'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hanabi'), 'ultimate', 'Forbidden Jutsu: Higanbana', 'Plants a flower that blooms to root enemies caught inside.', '40.0-30.0', '120-200', 'https://static.wikia.nocookie.net/mobile-legends/images/b/bc/Forbidden_Jutsu_Higanbana.png/revision/latest?cb=20221217033119');

-- Hanzo
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hanzo'), 'passive', 'Ame no Habakiri', 'Killing units gathers demon blood that fuels his ultimate.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/d0/Ame_no_Habakiri.png/revision/latest?cb=20250213043646'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hanzo'), 'skill1', 'Ninjutsu: Demon Feast', 'Devours a target for damage and blood; can also eat jungle monsters.', '30.0-20.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/7a/Ninjutsu_Demon_Feast.png/revision/latest?cb=20250213043813'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hanzo'), 'skill2', 'Ninjutsu: Dark Mist', 'Dashes and leaves a mist behind that damages and slows enemies inside it.', '10.0-8.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/4c/Ninjutsu_Dark_Mist.png/revision/latest?cb=20250213043908'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hanzo'), 'ultimate', 'Kinjutsu: Pinnacle Ninja', 'Leaves his body as a demon that fights independently while the body hides.', '24.0-16.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/ee/Kinjutsu_Pinnacle_Ninja.png/revision/latest?cb=20250213044240');

-- Harith
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Harith'), 'passive', 'Key Insight', 'Hitting heroes with his skills reduces the effect of crowd control on him.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/0/08/Key_Insight.png/revision/latest?cb=20240123231012'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Harith'), 'skill1', 'Synchro Fission', 'Sends out a phantom that damages enemies and returns to him.', '5.0', '50-75', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0f/Synchro_Fission.png/revision/latest?cb=20240123230739'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Harith'), 'skill2', 'Chrono Dash', 'Dashes and empowers his next attack with a shield-boosting strike.', '9.3', '40-55', 'https://static.wikia.nocookie.net/mobile-legends/images/6/6e/Chrono_Dash.png/revision/latest?cb=20240123230652'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Harith'), 'ultimate', 'Zaman Force', 'Creates a rift that slows enemies and resets his dash when he passes through it.', '40.0-30.0', '120-200', 'https://static.wikia.nocookie.net/mobile-legends/images/2/20/Zaman_Force.png/revision/latest?cb=20240123230545');

-- Harley
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Harley'), 'passive', 'Magic Master', 'His basic attacks deal magic damage instead of physical.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a7/Magic_Master.png/revision/latest?cb=20210802144608'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Harley'), 'skill1', 'Poker Trick', 'Throws a spread of cards that damage enemies in front.', '6.0', '90-115', 'https://static.wikia.nocookie.net/mobile-legends/images/3/3f/Poker_Trick.png/revision/latest?cb=20210802144324'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Harley'), 'skill2', 'Space Escape', 'Blinks forward and can return to his starting spot shortly after.', '8.5-6.5', '60-110', 'https://static.wikia.nocookie.net/mobile-legends/images/3/36/Space_Escape.png/revision/latest?cb=20210802144227'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Harley'), 'ultimate', 'Deadly Magic', 'Places a burning ring on a target that explodes for damage based on hits taken.', '36.0-30.0', '120-200', 'https://static.wikia.nocookie.net/mobile-legends/images/5/52/Deadly_Magic.png/revision/latest?cb=20210802144459');

-- Helcurt
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Helcurt'), 'passive', 'Shadow of Styx', 'Stays hidden until spotted, regenerating and gaining a burst of speed when he breaks cover.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/9/9f/Shadow_of_Styx.png/revision/latest?cb=20240605110519'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Helcurt'), 'skill1', 'Hidden Terror', 'Blinks to a spot; cast from the shadows it also terrifies nearby enemies.', '15.0-10.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/72/Hidden_Terror.png/revision/latest?cb=20240605110545'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Helcurt'), 'skill2', 'Deadly Stinger', 'Fires a stack of stingers at a target.', '4.0-2.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/7a/Deadly_Stinger.png/revision/latest?cb=20240605110608'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Helcurt'), 'ultimate', 'Dark Night Falls', 'Darkens the map for enemies and boosts his speed.', '60.0-50.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/b3/Dark_Night_Falls.png/revision/latest?cb=20240605110619');

-- Hilda
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hilda'), 'passive', 'Blessing of Wilderness', 'Regains HP and moves faster while standing in bushes.', '6.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a5/Blessing_of_Wilderness.png/revision/latest?cb=20210315234250'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hilda'), 'skill1', 'Combat Ritual', 'Charges forward with a shield and boosted speed.', '10.0-7.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/8c/Combat_Ritual.png/revision/latest?cb=20210315234429'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hilda'), 'skill2', 'Art of Hunting', 'Slashes twice in a cone to damage and slow enemies.', '8.0-6.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/f8/Art_of_Hunting.png/revision/latest?cb=20210315234319'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hilda'), 'ultimate', 'Power of Wildness', 'Leaps onto a target for a heavy strike that grows with stacked kills.', '32.0-24.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/3/3f/Power_of_Wildness.png/revision/latest?cb=20210315234351');

-- Hirara
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hirara'), 'passive', 'Twin Fans: Ukifune', 'She can drag one skill onto the other to cast a combined combo skill.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/8c/Twin_Fans_Ukifune.png/revision/latest?cb=20260618092850'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hirara'), 'skill1', 'Meisen-e', 'Rides the waves with up to two joystick dashes that damage enemies hit.', '9.0-5.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/2/23/Meisen-e.png/revision/latest?cb=20260618092851'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hirara'), 'skill2', 'Kaerazu', 'Sweeps a crimson maple in a cone, then strikes the target spot again for double damage.', '5.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a3/Kaerazu.png/revision/latest?cb=20260618092849'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hirara'), 'ultimate', 'Infernal Torrent', 'Combo skill (Skill 1 then Skill 2): a wave of fan strikes across a wide area. Hirara has no ultimate.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/3/39/Infernal_Torrent.png/revision/latest?cb=20260618092847');

-- Hylos
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hylos'), 'passive', 'Thickened Blood', 'Extra mana is converted into bonus max HP.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a7/Thickened_Blood.png/revision/latest?cb=20171201071431'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hylos'), 'skill1', 'Law and Order', 'Stuns a target and deals damage.', '12.0-8.0', '80-130', 'https://static.wikia.nocookie.net/mobile-legends/images/f/f6/Law_and_Order.png/revision/latest?cb=20171201071413'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hylos'), 'skill2', 'Ring of Punishment', 'Emits a ring that repeatedly damages and slows nearby enemies.', '1.0', '30-150', 'https://static.wikia.nocookie.net/mobile-legends/images/4/4e/Ring_of_Punishment.png/revision/latest?cb=20171201070705'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Hylos'), 'ultimate', 'Glorious Pathway', 'Lays a path that speeds up allies and slows enemies walking on it.', '40.0-32.0', '150-450', 'https://static.wikia.nocookie.net/mobile-legends/images/f/fa/Glorious_Pathway.png/revision/latest?cb=20171201071444');

-- Irithel
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Irithel'), 'passive', 'Jungle Heart', 'Can fire basic attacks while moving.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/b8/Jungle_Heart.png/revision/latest?cb=20260618090445'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Irithel'), 'skill1', 'Strafe', 'Fires a volley of arrows that lowers enemy defense.', '10.0', '0', 'https://static.wikia.nocookie.net/mobile-legends/images/a/af/Strafe.png/revision/latest?cb=20260618090444'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Irithel'), 'skill2', 'Force of the Queen', 'Leo roars to damage and slow nearby enemies.', '10.0-7.0', '0', 'https://static.wikia.nocookie.net/mobile-legends/images/8/8c/Force_of_the_Queen.png/revision/latest?cb=20260618090443'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Irithel'), 'ultimate', 'Heavy Crossbow', 'Empowers her attacks to fire piercing bolts.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/63/Heavy_Crossbow.png/revision/latest?cb=20260618090442');

-- Ixia
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Ixia'), 'passive', 'Siphon Starlium', 'Her hits stack charges; a basic attack on a double-stacked target siphons extra damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/dc/Siphon_Starlium.png/revision/latest?cb=20231230023556'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Ixia'), 'skill1', 'Dual Beam', 'Fires twin beams that damage enemies in a line.', '8.0-4.0', '40-65', 'https://static.wikia.nocookie.net/mobile-legends/images/c/ce/Dual_Beam.png/revision/latest?cb=20231230023610'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Ixia'), 'skill2', 'Star Helix', 'Dashes and fires a wave that slows enemies.', '11.0-9.0', '75-100', 'https://static.wikia.nocookie.net/mobile-legends/images/9/9f/Star_Helix.png/revision/latest?cb=20231230023637'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Ixia'), 'ultimate', 'Full Barrage', 'Unleashes a long barrage of shots at enemies in a wide area.', '54.0-42.0', '75-105', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0a/Full_Barrage.png/revision/latest?cb=20231230023654');

-- Jawhead
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Jawhead'), 'passive', 'Mecha Suppression', 'His attacks stack marks that make enemies take more damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/de/Mecha_Suppression.png/revision/latest?cb=20210930074449'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Jawhead'), 'skill1', 'Smart Missiles', 'Fires a volley of homing missiles at nearby enemies.', '5.0', '60-85', 'https://static.wikia.nocookie.net/mobile-legends/images/6/6f/Smart_Missiles.png/revision/latest?cb=20210930074500'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Jawhead'), 'skill2', 'Ejector', 'Grabs a unit and throws it in a direction, stunning heroes on landing.', '15.0-12.0', '80-130', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c4/Ejector.png/revision/latest?cb=20210930074510'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Jawhead'), 'ultimate', 'Unstoppable Force', 'Charges at a target, knocking them back and stunning them.', '35.0-25.0', '120-180', 'https://static.wikia.nocookie.net/mobile-legends/images/5/58/Unstoppable_Force.png/revision/latest?cb=20210930074522');

-- Johnson
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Johnson'), 'passive', 'Electro-airbag', 'Gains a shield when his HP drops low.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/0/05/Electro_Airbag.png/revision/latest?cb=20231231123336'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Johnson'), 'skill1', 'Impact Wrench', 'Throws his wrench, damaging enemies in its path and stunning those around where it lands.', '8.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/bb/Impact_Wrench.png/revision/latest?cb=20231231123358'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Johnson'), 'skill2', 'Electromagnetic Waves', 'Raises his shield to continuously damage and slow enemies in a cone, ramping up on repeat hits.', '10.0-8.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/5f/Electromagnetic_Waves.png/revision/latest?cb=20231231123411'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Johnson'), 'ultimate', 'Full Throttle', 'Turns into a car that speeds up and explodes on impact to stun enemies; one ally can ride along.', '36.0-30.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/3/3f/Full_Throttle.png/revision/latest?cb=20231231123508');

-- Joy
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Joy'), 'passive', 'Humph, Joy''s Angry!', 'Skill hits on non-minions add bonus damage and a decaying burst of movement speed.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/51/Humph%2C_Joy%27s_Angry%21.png/revision/latest?cb=20221111121050'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Joy'), 'skill1', 'Look, Leonin Crystal!', 'Summons a crystal that damages and slows nearby enemies and serves as a springboard for her dashes.', '4.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/c/c0/Look%2C_Leonin_Crystal%21.png/revision/latest?cb=20221111121055'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Joy'), 'skill2', 'Meow, Rhythm of Joy!', 'Dashes in rhythm several times, each hit on beat adding a stack.', '8.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/c/c4/Meow%2C_Rhythm_of_Joy%21.png/revision/latest?cb=20221111121101'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Joy'), 'ultimate', 'Ha, Electrifying Beats!', 'Gains defense and speed, then pulses damage around her; casts on the beat hit harder.', '28.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/d2/Ha%2C_Electrifying_Beats%21.png/revision/latest?cb=20221111121040');

-- Julian
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Julian'), 'passive', 'Smith''s Legacy', 'Casting two different skills empowers the third into a stronger version.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/69/Smith%27s_Legacy.png/revision/latest?cb=20220525112147'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Julian'), 'skill1', 'Scythe', 'Throws a scythe that damages and slows enemies in a line.', '10.0-6.5', '30-50', 'https://static.wikia.nocookie.net/mobile-legends/images/c/cd/Scythe.png/revision/latest?cb=20220525111831'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Julian'), 'skill2', 'Sword', 'Dashes forward with a sword that damages enemies along the path.', '10.0-6.5', '30-50', 'https://static.wikia.nocookie.net/mobile-legends/images/8/89/Sword.png/revision/latest?cb=20220525111243'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Julian'), 'ultimate', 'Chain', 'His third skill: throws chains that pull enemies together. Julian has no ultimate.', '10.0-6.5', '30-50', 'https://static.wikia.nocookie.net/mobile-legends/images/a/ae/Chain.png/revision/latest?cb=20220525112413');

-- Kadita
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kadita'), 'passive', 'Thalassophobia', 'Regains lost HP shortly after taking damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/43/Thalassophobia.png/revision/latest?cb=20210809092741'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kadita'), 'skill1', 'Ocean Ode', 'Rides a wave out and back, damaging and slowing enemies, immune to control while riding.', '9.0-6.5', '80-130', 'https://static.wikia.nocookie.net/mobile-legends/images/4/40/Ocean_Ode.png/revision/latest?cb=20210809092828'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kadita'), 'skill2', 'Breath of the Ocean', 'Summons a wave that knocks enemies into the air after a delay.', '8.0', '90-140', 'https://static.wikia.nocookie.net/mobile-legends/images/6/6d/Breath_of_the_Ocean.png/revision/latest?cb=20210809092915'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kadita'), 'ultimate', 'Rough Waves', 'Sends out waves that return to her, damaging enemies twice.', '40.0-32.0', '200-280', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a0/Rough_Waves.png/revision/latest?cb=20210809093025');

-- Kaja
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kaja'), 'passive', 'Wings of Lightning', 'His skill damage paralyzes enemies, slowing them and reducing their damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/8f/Wings_of_Lightning.png/revision/latest?cb=20260805103803'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kaja'), 'skill1', 'Ring of Order', 'Emits an electric ring that damages and slows enemies around him.', '7.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/c/c2/Ring_of_Order.png/revision/latest?cb=20260805103800'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kaja'), 'skill2', 'Soaring Wings', 'Dashes to an area with control immunity, knocking enemies back and stunning them, then flies over terrain.', '14.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/c/c9/Soaring_Wings.png/revision/latest?cb=20260805103801'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kaja'), 'ultimate', 'Divine Binding', 'Hurls a lightning lasso; enemy heroes still in the area take damage and are restrained.', '70.0-60.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/2/2b/Divine_Binding.png/revision/latest?cb=20260805103802');

-- Kalea
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kalea'), 'passive', 'Surge of Life', 'Skills drop a water zone; casting inside it empowers her next three attacks with dashes and healing.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/1/1c/Surge_of_Life.png/revision/latest?cb=20250222151008'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kalea'), 'skill1', 'Wavebreaker', 'Creates a water zone and readies her enhanced attacks.', '4.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/0/08/Wavebreaker.png/revision/latest?cb=20250222151011'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kalea'), 'skill2', 'Tidal Strike', 'Charges forward and can leap into a slam that knocks enemies up.', '13.0-11.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/9/91/Tidal_Strike.png/revision/latest?cb=20250222151009'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kalea'), 'ultimate', 'Tsunami Slam', 'Grabs an enemy hero and slams them toward a chosen direction.', '55.0-45.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a3/Tsunami_Slam.png/revision/latest?cb=20250222151010');

-- Karrie
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Karrie'), 'passive', 'Lightwheel Mark', 'Every few hits on a target deal bonus true damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/73/Lightwheel_Mark.png/revision/latest?cb=20180524145209'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Karrie'), 'skill1', 'Spinning Lightwheel', 'Throws a lightwheel that damages and slows enemies in an area.', '8.0', '40-65', 'https://static.wikia.nocookie.net/mobile-legends/images/b/be/Spinning_Lightwheel.png/revision/latest?cb=20180524145319'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Karrie'), 'skill2', 'Phantom Step', 'Dashes and fires a lightwheel at nearby enemies.', '4.5-2.5', '35-60', 'https://static.wikia.nocookie.net/mobile-legends/images/1/12/Phantom_Step.png/revision/latest?cb=20180524151835'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Karrie'), 'ultimate', 'Speedy Lightwheel', 'Fires double lightwheels with every basic attack for a while.', '35.0', '70-90', 'https://static.wikia.nocookie.net/mobile-legends/images/d/da/Speedy_Lightwheel.png/revision/latest?cb=20180524151018');

-- Khaleed
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Khaleed'), 'passive', 'Sand Walk', 'Moving builds desert power that empowers his next attack.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/fe/Sand_Walk.png/revision/latest?cb=20200719044846'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Khaleed'), 'skill1', 'Desert Tornado', 'Spins his scimitar to damage enemies around him several times.', '6.5-4.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/ee/Desert_Tornado.png/revision/latest?cb=20210604062116'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Khaleed'), 'skill2', 'Quicksand Guard', 'Sits in sand to regain HP and slow nearby enemies.', '22.0-17.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/d9/Quicksand_Guard.png/revision/latest?cb=20210604062039'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Khaleed'), 'ultimate', 'Raging Sandstorm', 'Charges forward and stuns enemies at the end of the dash.', '46.0-38.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/c/c2/Raging_Sandstorm.png/revision/latest?cb=20200719044626');

-- Khufra
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Khufra'), 'passive', 'Spell Curse', 'His attacks gain bonus damage after skills and reduce enemy dash abilities nearby.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/66/Spell_Curse.png/revision/latest?cb=20240113135908'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Khufra'), 'skill1', 'Tyrant''s Revenge', 'Leaps forward and knocks up the first enemy hit.', '15.0-10.0', '80-105', 'https://static.wikia.nocookie.net/mobile-legends/images/0/04/Tyrant%27s_Revenge.png/revision/latest?cb=20240113140327'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Khufra'), 'skill2', 'Bouncing Ball', 'Curls into a ball that blocks dashes and stuns enemies who try to pass.', '10.0', '70-95', 'https://static.wikia.nocookie.net/mobile-legends/images/4/4c/Bouncing_Ball.png/revision/latest?cb=20240113140156'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Khufra'), 'ultimate', 'Tyrant''s Rage', 'Sweeps enemies in front of him and slams them together.', '50.0-40.0', '150-250', 'https://static.wikia.nocookie.net/mobile-legends/images/5/54/Tyrant%27s_Rage.png/revision/latest?cb=20240113140253');

-- Kimmy
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kimmy'), 'passive', 'Aerial Dominance', 'Aims her spray gun independently while moving and builds Starlium for enhanced attacks.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/85/Aerial_Dominance.png/revision/latest?cb=20250423105751'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kimmy'), 'skill1', 'Anti-Grav Thruster', 'Takes flight with her jetpack, ignoring slows and terrain while firing bolts at nearby enemies.', '14.0-9.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a1/Anti-Grav_Thruster.png/revision/latest?cb=20250423105752'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kimmy'), 'skill2', 'Starlium Beam', 'Fires a beam that immobilizes enemies in its path and damages them over two seconds.', '10.0-8.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a4/Starlium_Beam.png/revision/latest?cb=20250423105753'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Kimmy'), 'ultimate', 'Traction Pulse', 'Fires a pulse that explodes into a slowing field, which then contracts to pull enemies in.', '40.0-30.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/80/Traction_Pulse.png/revision/latest?cb=20250423105754');

-- Lapu-Lapu
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lapu-Lapu'), 'passive', 'Homeland Defender', 'Landing skills builds up bravery that grants a shield.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/9/99/Homeland_Defender.png/revision/latest?cb=20210930071154'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lapu-Lapu'), 'skill1', 'Justice Blades', 'Throws two blades that return to him, damaging enemies twice.', '8.0-6.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/84/Justice_Blades.png/revision/latest?cb=20210930071251'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lapu-Lapu'), 'skill2', 'Jungle Warrior', 'Dashes forward with a slash that damages enemies in the path.', '12.0-7.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/aa/Jungle_Warrior.png/revision/latest?cb=20210930071310'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lapu-Lapu'), 'ultimate', 'Bravest Fighter', 'Leaps and combines his blades into a heavy sword with new empowered skills.', '20.0-15.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/88/Bravest_Fighter.png/revision/latest?cb=20210930071356');

-- Leomord
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Leomord'), 'passive', 'The Oath Keeper', 'His attacks always crit against enemies with low HP.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/ac/The_Oath_Keeper.png/revision/latest?cb=20220628181202'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Leomord'), 'skill1', 'Momentum', 'Charges up a slash that damages and slows, knocking back when fully charged.', '6.0-4.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/dd/Momentum.png/revision/latest?cb=20220628181142'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Leomord'), 'skill2', 'Decimation Assault', 'Dashes to a spot and slashes, slowing enemies hit.', '12.0-10.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/f0/Decimation_Assault.png/revision/latest?cb=20220628181137'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Leomord'), 'ultimate', 'Phantom Steed', 'Summons his horse Barbiel to ride, gaining speed and mounted attacks.', '30.0-20.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/ff/Phantom_Steed.png/revision/latest?cb=20220628181153');

-- Ling
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Ling'), 'passive', 'Cloud Walker', 'Can leap onto walls and move along them unseen.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/68/Cloud_Walker.png/revision/latest?cb=20240622134906'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Ling'), 'skill1', 'Finch Poise', 'Jumps onto a wall or leaps off it to strike enemies below.', '20.0', '30', 'https://static.wikia.nocookie.net/mobile-legends/images/1/14/Finch_Poise.png/revision/latest?cb=20240622134915'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Ling'), 'skill2', 'Defiant Sword', 'Dashes and slashes a target, gaining energy on hits.', '2.5', '35', 'https://static.wikia.nocookie.net/mobile-legends/images/a/ae/Defiant_Sword.png/revision/latest?cb=20240622134923'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Ling'), 'ultimate', 'Tempest of Blades', 'Leaps into the air and lands with a ring of swords that slow and damage.', '52.0-46.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/3/30/Tempest_of_Blades.png/revision/latest?cb=20240622134931');

-- Lolita
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lolita'), 'passive', 'Noumenon Energy Core', 'Her shield charges a stack that empowers her next basic attack.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/7b/Noumenon_Energy_Core.png/revision/latest?cb=20250917083627'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lolita'), 'skill1', 'Power Charge', 'Blinks forward with her shield and stuns the enemy she reaches.', '10.0', '70-120', 'https://static.wikia.nocookie.net/mobile-legends/images/e/e3/Power_Charge.png/revision/latest?cb=20250917083732'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lolita'), 'skill2', 'Guardian''s Reflection', 'Raises her shield to reflect ranged attacks and projectiles back for a few seconds.', '17.5-15.0', '90-115', 'https://static.wikia.nocookie.net/mobile-legends/images/d/da/Guardian%27s_Reflection.png/revision/latest?cb=20250917083743'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lolita'), 'ultimate', 'Noumenon Blast', 'Charges a shockwave that damages and stuns enemies in a cone.', '55.0-45.0', '120-160', 'https://static.wikia.nocookie.net/mobile-legends/images/6/6a/Noumenon_Blast.png/revision/latest?cb=20250917083754');

-- Lukas
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lukas'), 'passive', 'Hero''s Resolve', 'Builds resolve over time and from damaging heroes, spent to stay in beast form.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/b2/Hero%27s_Resolve.png/revision/latest?cb=20241221054549'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lukas'), 'skill1', 'Flash Combo', 'Basic attacks stack vigor; casting it releases a pulverizing strike based on stacks.', '5.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/5e/Flash_Combo.png/revision/latest?cb=20241221054546'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lukas'), 'skill2', 'Flash Step', 'Dashes and empowers his next attack to blink behind the target with a lightning burst.', '12.0-8.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/4f/Flash_Step.png/revision/latest?cb=20241221054548'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lukas'), 'ultimate', 'Unleash the Beast', 'Transforms into his sacred beast form with boosted stats and new skill effects.', '0.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/67/Unleash_the_Beast.png/revision/latest?cb=20241221054551');

-- Lunox
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lunox'), 'passive', 'Dreamland Twist', 'Switches between Order and Chaos stances, each altering her passive bonuses.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/7f/Dreamland_Twist.png/revision/latest?cb=20210816211509'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lunox'), 'skill1', 'Starlight Pulse', 'Fires bolts that damage nearby enemies and heal her per hit.', '2.0', '75-100', 'https://static.wikia.nocookie.net/mobile-legends/images/0/09/Starlight_Pulse.png/revision/latest?cb=20210816211618'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lunox'), 'skill2', 'Chaos Assault', 'Hurls a bolt that damages a target and reduces their defense.', '2.0', '30-55', 'https://static.wikia.nocookie.net/mobile-legends/images/e/e2/Chaos_Assault.png/revision/latest?cb=20210816211707'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lunox'), 'ultimate', 'Order & Chaos', 'In Order she turns invincible and damages nearby enemies; in Chaos she blinks and Chaos Assault recharges fast.', '30.0-22.0', '120-200', 'https://static.wikia.nocookie.net/mobile-legends/images/2/27/Order_%26_Chaos.png/revision/latest?cb=20240208124046');

-- Luo Yi
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Luo Yi'), 'passive', 'Duality', 'Her skills mark targets with Yin or Yang; opposite marks collide for extra damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/d4/Duality.png/revision/latest?cb=20260918024315'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Luo Yi'), 'skill1', 'Dispersion', 'Fires an orb that marks and damages enemies hit.', '1.2', '50-90', 'https://static.wikia.nocookie.net/mobile-legends/images/9/92/Dispersion.png/revision/latest?cb=20260918024347'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Luo Yi'), 'skill2', 'Rotation', 'Drops a circle that marks and damages enemies inside.', '12.0', '120-170', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c9/Rotation.png/revision/latest?cb=20260918024503'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Luo Yi'), 'ultimate', 'Diversion', 'Teleports herself and nearby allies to a distant spot.', '55.0-45.0', '0', 'https://static.wikia.nocookie.net/mobile-legends/images/7/74/Diversion.png/revision/latest?cb=20260918024603');

-- Lylia
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lylia'), 'passive', 'Angry Gloom', 'Skills that hit enemies stack up to boost her next Magic Shockwave.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/9/9c/Angry_Gloom.png/revision/latest?cb=20210809093713'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lylia'), 'skill1', 'Magic Shockwave', 'Fires a wave of shadow energy that damages and slows enemies.', '4.0', '50-75', 'https://static.wikia.nocookie.net/mobile-legends/images/b/b5/Magic_Shockwave.png/revision/latest?cb=20210809093754'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lylia'), 'skill2', 'Shadow Energy', 'Plants shadow bombs that detonate when a Shockwave passes through.', '1.0', '40-100', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0c/Shadow_Energy.png/revision/latest?cb=20210809093832'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Lylia'), 'ultimate', 'Black Shoes', 'Returns to where she stood a moment ago, restoring HP and mana.', '45.0-35.0', '120-0', 'https://static.wikia.nocookie.net/mobile-legends/images/9/94/Black_Shoes.png/revision/latest?cb=20210809093908');

-- Marcel
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Marcel'), 'passive', 'Platinum Snap', 'Snaps nearby enemies in place briefly and shields himself and the closest ally.', '12.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/f8/Platinum_Snap.png/revision/latest?cb=20260311075433'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Marcel'), 'skill1', 'Framed Moment', 'Leaves his camera companion in place and can return to it.', '12.5-10.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a2/Framed_Moment.png/revision/latest?cb=20260311075430'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Marcel'), 'skill2', 'Tracking Shot', 'Gains movement speed and can reactivate to dash forward.', '12.5-10.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/66/Tracking_Shot.png/revision/latest?cb=20260311075427'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Marcel'), 'ultimate', 'Golden Hour', 'Freezes everyone in an area in time while he moves freely inside.', '74.0-62.0', '150', 'https://static.wikia.nocookie.net/mobile-legends/images/9/9c/Golden_Hour.png/revision/latest?cb=20260311075423');

-- Martis
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Martis'), 'passive', 'Asura''s Wrath', 'Landing skills raises his attack speed, with bonus attack at full stacks.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/4f/Asura%27s_Wrath.png/revision/latest?cb=20231226165530'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Martis'), 'skill1', 'Asura Aura', 'Sweeps his blades to pull enemies toward him and slow them.', '7.0-5.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/be/Asura_Aura.png/revision/latest?cb=20231226165646'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Martis'), 'skill2', 'Mortal Coil', 'Dashes with a series of slashes that knock enemies up.', '8.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/41/Mortal_Coil.png/revision/latest?cb=20231226165916'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Martis'), 'ultimate', 'Decimation', 'Leaps onto a target for a strike that grows deadlier the lower their HP is.', '36.0-28.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/6f/Decimation.png/revision/latest?cb=20231226170036');

-- Masha
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Masha'), 'passive', 'Primal Pact', 'Three HP bars; losing one clears control and blocks a hit, and damage dealt builds Feral that turns into HP.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/d1/Primal_Pact.png/revision/latest?cb=20260918142334'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Masha'), 'skill1', 'Feral Swipe', 'Releases energy forward, damaging enemies in its path and slowing any hero hit.', '8.0-6.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/0/05/Feral_Swipe.png/revision/latest?cb=20260918142335'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Masha'), 'skill2', 'Claw Strike', 'Dashes in a direction for damage; resets whenever an HP bar is lost.', '9.0-7.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/62/Claw_Strike.png/revision/latest?cb=20260918142333'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Masha'), 'ultimate', 'Savage Maul', 'Charges an enemy hero, stunning them and knocking back others nearby.', '42.0-34.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/7c/Savage_Maul.png/revision/latest?cb=20260918142336');

-- Mathilda
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Mathilda'), 'passive', 'Ancestral Guidance', 'Moving builds up a speed boost for her next basic attack.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/72/Ancestral_Guidance.png/revision/latest?cb=20210809085552'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Mathilda'), 'skill1', 'Soul Bloom', 'Summons wisps that fly at nearby enemies.', '7.5', '60-110', 'https://static.wikia.nocookie.net/mobile-legends/images/f/f1/Soul_Bloom.png/revision/latest?cb=20210809085520'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Mathilda'), 'skill2', 'Guiding Wind', 'Dashes to a spot; allies near her can follow the same path.', '12.0-11.0', '75-100', 'https://static.wikia.nocookie.net/mobile-legends/images/1/16/Guiding_Wind.png/revision/latest?cb=20210809085631'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Mathilda'), 'ultimate', 'Circling Eagle', 'Circles a target rapidly, then dives to knock them back.', '40.0', '150-210', 'https://static.wikia.nocookie.net/mobile-legends/images/9/90/Circling_Eagle.png/revision/latest?cb=20210809085702');

-- Melissa
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Melissa'), 'passive', 'Doll Buster', 'Every few attacks she fires a needle that deals extra damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/86/Doll_Buster.png/revision/latest?cb=20220311092717'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Melissa'), 'skill1', 'Falling', 'Dashes forward and gains attack speed.', '7.5-5.0', '30-55', 'https://static.wikia.nocookie.net/mobile-legends/images/b/b5/Falling%21.png/revision/latest?cb=20220311092948'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Melissa'), 'skill2', 'Eyes on You!', 'Links a doll to an enemy so damage to the doll is copied to them.', '9.0-7.0', '60-10', 'https://static.wikia.nocookie.net/mobile-legends/images/4/41/Eyes_on_You%21.png/revision/latest?cb=20220311093026'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Melissa'), 'ultimate', 'Go Away!', 'Places a field that pushes enemies out and keeps them away.', '50.0-40.0', '120-180', 'https://static.wikia.nocookie.net/mobile-legends/images/e/e4/Go_Away%21.png/revision/latest?cb=20220311093058');

-- Minotaur
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Minotaur'), 'passive', 'Rage Incarnate', 'Builds rage in combat; at full rage his skills are empowered.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/7b/Rage_Incarnate.png/revision/latest?cb=20210616060409'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Minotaur'), 'skill1', 'Despair Stomp', 'Leaps to a spot and stomps to damage and slow enemies.', '12.0-9.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/b9/Despair_Stomp.png/revision/latest?cb=20210616060356'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Minotaur'), 'skill2', 'Motivation Roar', 'Roars to heal himself and nearby allies.', '10.0-7.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/3/3e/Motivation_Rage.png/revision/latest?cb=20210616060342'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Minotaur'), 'ultimate', 'Minoan Fury', 'Smashes the ground repeatedly, knocking enemies into the air.', '60.0-50.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/2/27/Minoan_Fury.png/revision/latest?cb=20210616060308');

-- Minsitthar
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Minsitthar'), 'passive', 'Mark of the King', 'Attacks on marked targets deal bonus damage and grant speed.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/61/Mark_of_the_King.png/revision/latest?cb=20230315070651'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Minsitthar'), 'skill1', 'Spear of Glory', 'Thrusts his spear and drags the enemy hit toward him.', '13.0-9.0', '95-145', 'https://static.wikia.nocookie.net/mobile-legends/images/1/16/Spear_of_Glory.png/revision/latest?cb=20230315070700'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Minsitthar'), 'skill2', 'Shield Assault', 'Charges with his shield, knocking back enemies.', '7.0-5.0', '50-75', 'https://static.wikia.nocookie.net/mobile-legends/images/5/56/Shield_Assault.png/revision/latest?cb=20230315070653'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Minsitthar'), 'ultimate', 'King''s Calling', 'Summons a ring of guards that stops enemies from dashing across it.', '60.0-50.0', '150-250', 'https://static.wikia.nocookie.net/mobile-legends/images/1/1d/King%27s_Calling.png/revision/latest?cb=20230315070647');

-- Moskov
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Moskov'), 'passive', 'Spear of Quiescence', 'Her basic attacks pierce through to hit enemies behind the target.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/ea/Spear_of_Quiescence.png/revision/latest?cb=20231110024956'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Moskov'), 'skill1', 'Abyss Walker', 'Blinks a short distance and resets her attack speed.', '10.0-8.0', '45-70', 'https://static.wikia.nocookie.net/mobile-legends/images/f/fa/Abyss_Walker.png/revision/latest?cb=20231110025034'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Moskov'), 'skill2', 'Spear of Misery', 'A powerful strike that knocks the target back; hitting terrain or another hero stuns them.', '12.0-9.5', '80-130', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c1/Spear_of_Misery.png/revision/latest?cb=20231110025107'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Moskov'), 'ultimate', 'Spear of Destruction', 'Throws a spear across the map at a chosen hero.', '55.0-45.0', '130-170', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a0/Spear_of_Destruction.png/revision/latest?cb=20231110025126');

-- Natalia
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Natalia'), 'passive', 'Assassin Instinct', 'Turns invisible in bushes and her next attack from stealth crits and silences.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/1/10/Assassin_Instinct.png/revision/latest?cb=20210816210625'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Natalia'), 'skill1', 'Claw Dash', 'Dashes forward and can dash again after hitting an enemy.', '10.0-6.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/89/Claw_Dash.png/revision/latest?cb=20210816210737'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Natalia'), 'skill2', 'Smoke Bomb', 'Drops smoke that makes her dodge basic attacks and slows enemies inside.', '12.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/eb/Smoke_Bomb.png/revision/latest?cb=20210816210831'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Natalia'), 'ultimate', 'The Hunt', 'Boosts her speed and empowers her next attacks.', '3.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/c/c8/The_Hunt.png/revision/latest?cb=20210816210938');

-- Natan
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Natan'), 'passive', 'Theory of Everything', 'His skills stack a mark that raises his attack speed and damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/57/Theory_of_Everything.png/revision/latest?cb=20210903170055'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Natan'), 'skill1', 'Superposition', 'Fires a wave that damages and slows enemies in a line.', '8.0-5.0', '50-75', 'https://static.wikia.nocookie.net/mobile-legends/images/6/68/Superposition.png/revision/latest?cb=20210903170126'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Natan'), 'skill2', 'Interference!', 'Throws a gravity bomb that pulls enemies toward it.', '12.0-10.0', '60-85', 'https://static.wikia.nocookie.net/mobile-legends/images/4/49/Interference%21.png/revision/latest?cb=20210903170153'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Natan'), 'ultimate', 'Entropy?', 'Summons a clone that mirrors his movement and attacks.', '24.0-16.0', '100-0', 'https://static.wikia.nocookie.net/mobile-legends/images/5/53/Entropy%3F.png/revision/latest?cb=20210903170224');

-- Nolan
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Nolan'), 'passive', 'Dimensional Rift', 'His skills leave rifts; when rifts overlap they pull enemies in and explode.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/46/Dimensional_Rift.png/revision/latest?cb=20231110015640'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Nolan'), 'skill1', 'Expansion', 'Cuts a rectangle in front of him and leaves a rift at the first enemy hit.', '2.0-1.0', '25', 'https://static.wikia.nocookie.net/mobile-legends/images/b/bb/Expansion.png/revision/latest?cb=20231110015656'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Nolan'), 'skill2', 'Gauge', 'Blinks forward, leaving a rift behind him.', '2.0-1.0', '25', 'https://static.wikia.nocookie.net/mobile-legends/images/9/90/Gauge.png/revision/latest?cb=20231110015706'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Nolan'), 'ultimate', 'Fracture', 'Slashes three times in front of him, leaving several rifts.', '21.0-15.0', '0', 'https://static.wikia.nocookie.net/mobile-legends/images/e/ed/Fracture.png/revision/latest?cb=20231110015726');

-- Novaria
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Novaria'), 'passive', 'Star Trail', 'Her skills reveal and pass through terrain in a comet trail.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/ff/Star_Trail.png/revision/latest?cb=20230420164248'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Novaria'), 'skill1', 'Astral Meteor', 'Drops a meteor that grows in damage as it travels.', '8.0-6.0', '60-100', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c5/Astral_Meteor.png/revision/latest?cb=20230420164231'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Novaria'), 'skill2', 'Astral Recall', 'Summons a distant sphere and pulls it back to her, gaining speed and passing terrain, then launches it.', '8.0', '60-110', 'https://static.wikia.nocookie.net/mobile-legends/images/0/09/Astral_Recall.png/revision/latest?cb=20230420164237'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Novaria'), 'ultimate', 'Astral Echo', 'Scatters echoes that slow enemies hit, reveal them and enlarge their hitbox.', '45.0-35.0', '100', 'https://static.wikia.nocookie.net/mobile-legends/images/0/03/Astral_Echo.png/revision/latest?cb=20230420164226');

-- Obsidia
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Obsidia'), 'passive', 'Return to Bone', 'Damaging enemies builds Bone Energy that converts into shards which empower her skills.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/e3/Return_to_Bone.png/revision/latest?cb=20250918010853'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Obsidia'), 'skill1', 'Abyssal Bone Needle', 'Fires a needle that pierces enemies and triggers her passive on the first hero hit.', '4.5-3.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/ff/Abyssal_Bone_Needle.png/revision/latest?cb=20250918010947'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Obsidia'), 'skill2', 'Phantom Shadowmeld', 'Dives into the shadows for a burst of movement speed.', '4.5-3.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/89/Phantom_Shadowmeld.png/revision/latest?cb=20250918011152'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Obsidia'), 'ultimate', 'Hunt of Bone', 'Shoots bones that stun the first hero hit, pull her to them and tether them so they cannot escape.', '40.0-30.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/3/33/Hunt_of_Bone.png/revision/latest?cb=20250918011139');

-- Odette
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Odette'), 'passive', 'Lakeshore Ambience', 'Casting skills adds a bouncing energy ball to her next basic attack.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a4/Lakeshore_Ambience.png/revision/latest?cb=20210930072957'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Odette'), 'skill1', 'Avian Authority', 'Sends a swan that damages and slows enemies in an area.', '6.0-5.0', '90-140', 'https://static.wikia.nocookie.net/mobile-legends/images/5/5a/Avian_Authority.png/revision/latest?cb=20210930073008'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Odette'), 'skill2', 'Blue Nova', 'Fires an orb that roots the first enemy hit and nearby enemies.', '12.0-10.0', '90-115', 'https://static.wikia.nocookie.net/mobile-legends/images/3/37/Blue_Nova.png/revision/latest?cb=20210930073018'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Odette'), 'ultimate', 'Swan Song', 'Channels a storm of energy that damages everything around her.', '50.0-40.0', '200-280', 'https://static.wikia.nocookie.net/mobile-legends/images/e/e0/Swan_Song.png/revision/latest?cb=20210930073037');

-- Paquito
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Paquito'), 'passive', 'Champ Stance', 'Every third skill cast enters Champ Stance, giving an enhanced skill that ignores its cooldown.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/45/Champ_Stance.png/revision/latest?cb=20210315233746'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Paquito'), 'skill1', 'Heavy Left Punch', 'Punches forward and gains a shield.', '8.0-6.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/2/2a/Heavy_Left_Punch.png/revision/latest?cb=20210315233622'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Paquito'), 'skill2', 'Jab', 'Dashes and jabs, dealing damage and slowing.', '8.0-5.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/c/cd/Jab.png/revision/latest?cb=20210315233645'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Paquito'), 'ultimate', 'Knockout Strike', 'A heavy elbow that knocks the target back.', '18.0-15.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/43/Knockout_Strike.png/revision/latest?cb=20210315233719');

-- Pharsa
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Pharsa'), 'passive', 'Spiritual Unity', 'Her crow marks enemies, and her attacks on marked targets deal bonus damage.', '8.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/5f/Spiritual_Unity.png/revision/latest?cb=20240120063431'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Pharsa'), 'skill1', 'Curse of Crow', 'Fires a curse that damages and stuns the enemy hit.', '8.0-6.0', '60-90', 'https://static.wikia.nocookie.net/mobile-legends/images/1/15/Curse_of_Crow.png/revision/latest?cb=20240122034020'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Pharsa'), 'skill2', 'Energy Impact', 'Fires an energy bolt in a direction.', '5.0', '50-80', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a9/Energy_Impact.png/revision/latest?cb=20240122034024'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Pharsa'), 'ultimate', 'Feathered Air Strike', 'Flies up and bombards an area with several magic strikes.', '36.0-30.0', '120-180', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c7/Feathered_Air_Strike.png/revision/latest?cb=20240122034028');

-- Phoveus
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Phoveus'), 'passive', 'Demonic Force', 'After a skill his next basic attack charges at the enemy and knocks them back.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/3/3f/Demonic_Force.png/revision/latest?cb=20240929060141'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Phoveus'), 'skill1', 'Demonic Impact', 'Slams his monolith into the ground to damage and slow enemies in the area.', '6.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/ee/Demonic_Impact.png/revision/latest?cb=20240929060119'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Phoveus'), 'skill2', 'Dark Wave', 'Releases demonic power in a direction that knocks enemies airborne.', '10.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/3/30/Dark_Wave.png/revision/latest?cb=20240929060137'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Phoveus'), 'ultimate', 'Infernal Pursuit', 'Leaps onto an enemy hero who dashed nearby, smashing down for damage while healing himself.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a2/Infernal_Pursuit.png/revision/latest?cb=20240802111808');

-- Popol and Kupa
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Popol and Kupa'), 'passive', 'We Are Friends', 'Kupa fights alongside Popol and grows stronger with his skill upgrades.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/80/We_Are_Friends.png/revision/latest?cb=20210809083507'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Popol and Kupa'), 'skill1', 'Bite ''em, Kupa!', 'Sends Kupa to bite a target.', '6.5', '50-80', 'https://static.wikia.nocookie.net/mobile-legends/images/7/71/Bite_%27em%2C_Kupa%21.png/revision/latest?cb=20210809083631'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Popol and Kupa'), 'skill2', 'Kupa, Help!', 'Calls Kupa back to shield Popol.', '6.5', '80-110', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0e/Kupa%2C_Help%21.png/revision/latest?cb=20210809083707'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Popol and Kupa'), 'ultimate', 'We Are Angry!', 'Kupa enters an enraged form with boosted damage and defense.', '38.0-32.0', '100-140', 'https://static.wikia.nocookie.net/mobile-legends/images/c/cd/We_Are_Angry%21.png/revision/latest?cb=20210905105738');

-- Rafaela
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Rafaela'), 'passive', 'Divine Resurrection', 'Periodically can channel to resurrect a fallen ally, who respawns at base with a speed boost.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/40/Divine_Resurrection.png/revision/latest?cb=20250917074635'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Rafaela'), 'skill1', 'Light of Retribution', 'Damages nearby enemies and reveals them.', '4.0', '70-145', 'https://static.wikia.nocookie.net/mobile-legends/images/f/f6/Light_of_Retribution.png/revision/latest?cb=20240118091251'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Rafaela'), 'skill2', 'Holy Healing', 'Heals herself and nearby allies and speeds them up.', '10.5-8.5', '100-150', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a5/Holy_Healing.png/revision/latest?cb=20200917011935'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Rafaela'), 'ultimate', 'Holy Baptism', 'Fires a beam that damages and stuns enemies in a line.', '42.0-34.0', '150-200', 'https://static.wikia.nocookie.net/mobile-legends/images/4/40/Holy_Baptism.png/revision/latest?cb=20200917011934');

-- Roger
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Roger'), 'passive', 'Full Moon Curse', 'Switching forms grants bonus effects to his next attack.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/f9/Full_Moon_Curse.png/revision/latest?cb=20210905105058'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Roger'), 'skill1', 'Open Fire', 'Fires a bullet that damages and slows the first enemy hit.', '7.0', '70-120', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c1/Open_Fire.png/revision/latest?cb=20210905105026'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Roger'), 'skill2', 'Hunter''s Steps', 'Gains a burst of movement speed.', '10.0-8.0', '50', 'https://static.wikia.nocookie.net/mobile-legends/images/1/1d/Hunter%27s_Steps.png/revision/latest?cb=20210905104945'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Roger'), 'ultimate', 'Wolf Transformation', 'Turns into a wolf with new melee skills and a leaping strike.', '6.0-4.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/b2/Wolf_Transformation.png/revision/latest?cb=20210905104842');

-- Ruby
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Ruby'), 'passive', 'Let''s Dance!', 'Skills let her dash after casting and she gains lifesteal from basic attacks.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/ab/Let%27s_dance%21.png/revision/latest?cb=20210816063243'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Ruby'), 'skill1', 'Be Good!', 'Swings her scythe forward and lets her dash.', '4.0', '25', 'https://static.wikia.nocookie.net/mobile-legends/images/9/90/Be_good%21.png/revision/latest?cb=20210816063353'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Ruby'), 'skill2', 'Don''t Run, Wolf King!', 'Sweeps twice, stunning enemies hit on the second swing.', '7.0', '50-75', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0a/Don%27t_run%2C_Wolf_King%21.png/revision/latest?cb=20210816063441'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Ruby'), 'ultimate', 'I''m Offended!', 'Pulls enemies in front of her toward herself.', '26.0-20.0', '80-120', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a9/I%27m_offended%21.png/revision/latest?cb=20210816063549');

-- Selena
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Selena'), 'passive', 'Symbiosis', 'Switches between an Elf form with traps and a shadow form with melee strikes.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/44/Symbiosis.png/revision/latest?cb=20211108070339'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Selena'), 'skill1', 'Abyssal Trap', 'Places traps that slow and mark enemies who step on them.', '8.0-6.0', '60-110', 'https://static.wikia.nocookie.net/mobile-legends/images/e/ed/Abyssal_Trap.png/revision/latest?cb=20211108070434'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Selena'), 'skill2', 'Abyssal Arrow', 'Fires an arrow that stuns longer the farther it flies.', '12.0', '70-120', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c2/Abyssal_Arrow.png/revision/latest?cb=20211108070444'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Selena'), 'ultimate', 'Primal Darkness', 'Transforms into her shadow form, swapping her skills for melee attacks.', '5.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/b4/Primal_Darkness.png/revision/latest?cb=20211108070514');

-- Silvanna
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Silvanna'), 'passive', 'Knightess'' Resolve', 'Her skills mark enemies to reduce their magic defense.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/7f/Knightess%27_Resolve.png/revision/latest?cb=20210802142628'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Silvanna'), 'skill1', 'Cometic Lance', 'Dashes and swings her lance to damage and stun nearby enemies.', '11.0-9.0', '70-110', 'https://static.wikia.nocookie.net/mobile-legends/images/1/13/Cometic_Lance_2.png/revision/latest?cb=20220220064643'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Silvanna'), 'skill2', 'Spiral Strangling', 'Spins her lance to damage and heal from nearby enemies.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/8b/Spiral_Strangling.png/revision/latest?cb=20210802142752'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Silvanna'), 'ultimate', 'Imperial Justice', 'Leaps to a spot and traps enemies inside a circle.', '52.0-44.0', '130-150', 'https://static.wikia.nocookie.net/mobile-legends/images/8/8a/Imperial_Justice.png/revision/latest?cb=20210802142931');

-- Sora
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Sora'), 'passive', 'Mystic Surge', 'Damaging heroes stacks cloudstep; at full stacks his ultimate lets him ascend.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/8c/Mystic_Surge.png/revision/latest?cb=20251218013740'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Sora'), 'skill1', 'Sundering Strike', 'Strikes twice and lunges forward, changing effect with his current form.', '5.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a5/Sundering_Strike.png/revision/latest?cb=20251218013739'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Sora'), 'skill2', 'Windstride', 'Leaps forward and slams down to damage and slow enemies.', '8.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/9/93/Windstride.png/revision/latest?cb=20251218013738'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Sora'), 'ultimate', 'Shifting Skies', 'Ascends into Thunder (assassin) or Torrent (tank) form by swiping a direction.', '32.0-24.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/c/cc/Shifting_Skies.png/revision/latest?cb=20251218013737');

-- Sun
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Sun'), 'passive', 'Simian God', 'His attacks hit harder against enemies with more HP.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/1/17/Simian_God.png/revision/latest?cb=20240208125440'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Sun'), 'skill1', 'Endless Variety', 'Throws his staff and creates a clone that fights.', '10.0-8.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/f9/Endless_Variety.png/revision/latest?cb=20240208125547'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Sun'), 'skill2', 'Swift Exchange', 'Throws his staff forward for damage and leaves a clone behind while he slips out of sight.', '10.0', '70-120', 'https://static.wikia.nocookie.net/mobile-legends/images/9/9c/Swift_Exchange.png/revision/latest?cb=20240208125456'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Sun'), 'ultimate', 'Clone Techniques', 'Summons a clone that attacks and heals him with each hit.', '36.0-28.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/b7/Clone_Techniques.png/revision/latest?cb=20240208125649');

-- Suyou
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Suyou'), 'passive', 'Transient Immortal', 'Switches between a fast mortal form and a sturdier immortal form.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/3/3c/Transient_Immortal.png/revision/latest?cb=20240921145922'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Suyou'), 'skill1', 'Blade Surge', 'Throws his weapon and blinks to it for a slash.', '8.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/c/ca/Blade_Surge.png/revision/latest?cb=20240921145922'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Suyou'), 'skill2', 'Soul Sever', 'Sweeps to deal damage that scales with the enemy''s lost HP.', '8.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/0/01/Soul_Sever.png/revision/latest?cb=20240921145921'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Suyou'), 'ultimate', 'Evil Queller', 'His third skill: blinks back while swinging to damage and slow nearby foes. Suyou has no ultimate.', '8.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/89/Evil_Queller.png/revision/latest?cb=20240921145920');

-- Terizla
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Terizla'), 'passive', 'Body of Smith', 'Loses attack speed in exchange for bonus damage as his HP drops.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/c/c3/Body_of_Smith.png/revision/latest?cb=20220204074740'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Terizla'), 'skill1', 'Revenge Strike', 'Slams his hammer forward and can slam again.', '8.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/3/3d/Revenge_Strike.png/revision/latest?cb=20220204074814'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Terizla'), 'skill2', 'Execution Strike', 'Leaps and hammers the ground to damage enemies in a line.', '9.0-4.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/9/93/Execution_Strike.png/revision/latest?cb=20220204074847'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Terizla'), 'ultimate', 'Penalty Zone', 'Drops a machine that pulls enemies into it.', '50.0-36.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/49/Penalty_Zone.png/revision/latest?cb=20220204074917');

-- Thamuz
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Thamuz'), 'passive', 'Grand Lord Lava', 'His scythes attach to enemies and burn them over time.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/af/Grand_Lord_Lava.png/revision/latest?cb=20250917080548'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Thamuz'), 'skill1', 'Molten Scythes', 'Throws scythes that return to him, damaging enemies twice.', '3.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/4/44/Molten_Scythes.png/revision/latest?cb=20250917080550'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Thamuz'), 'skill2', 'Chasm Trample', 'Leaps to a spot to damage and slow enemies there.', '8.0-6.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/51/Chasm_Trample.png/revision/latest?cb=20250917080546'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Thamuz'), 'ultimate', 'Cauterant Inferno', 'Ignites himself to burn nearby enemies and boost his own stats.', '38.0-30.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/0/06/Cauterant_Inferno.png/revision/latest?cb=20250917080545');

-- Uranus
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Uranus'), 'passive', 'Radiance', 'Taking damage builds stacks that regenerate his HP.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/71/Radiance.png/revision/latest?cb=20210903163930'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Uranus'), 'skill1', 'Ionic Edge', 'Fires two energy blades that damage and slow enemies.', '4.0', '60-85', 'https://static.wikia.nocookie.net/mobile-legends/images/6/61/Ionic_Edge.png/revision/latest?cb=20210903164010'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Uranus'), 'skill2', 'Transcendent Ward', 'Dashes and gains a shield and movement speed.', '10.0', '80-130', 'https://static.wikia.nocookie.net/mobile-legends/images/7/71/Transcendent_Ward.png/revision/latest?cb=20210903164056'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Uranus'), 'ultimate', 'Consecration', 'Removes debuffs and boosts his regeneration and speed.', '42.0-36.0', '100-150', 'https://static.wikia.nocookie.net/mobile-legends/images/9/96/Consecration.png/revision/latest?cb=20210903164156');

-- Vale
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Vale'), 'passive', 'Windtalk', 'Each skill can be upgraded into a damage or control version.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/83/Windtalk.png/revision/latest?cb=20250918050055'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Vale'), 'skill1', 'Wind Blade', 'Sends out blades of wind in a direction.', '6.0-4.0', '60-85', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c4/Wind_Blade.png/revision/latest?cb=20250918050123'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Vale'), 'skill2', 'Wind Blow', 'Blows a gust that knocks enemies back.', '10.0', '90-115', 'https://static.wikia.nocookie.net/mobile-legends/images/9/9d/Windblow.png/revision/latest?cb=20250918050129'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Vale'), 'ultimate', 'Windstorm', 'Summons a tornado that damages and pulls enemies inside.', '40.0-32.0', '150-250', 'https://static.wikia.nocookie.net/mobile-legends/images/b/b1/Windstorm.png/revision/latest?cb=20250918050134');

-- Valentina
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Valentina'), 'passive', 'Primal Force', 'Gains bonus experience from skills and grows stronger with level.', '2.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/68/Primal_Force.png/revision/latest?cb=20211202092807'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Valentina'), 'skill1', 'Shadow Strike', 'Fires a bolt that damages and slows the enemy hit.', '7.0-5.0', '70-95', 'https://static.wikia.nocookie.net/mobile-legends/images/4/46/Shadow_Strike.png/revision/latest?cb=20211202092839'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Valentina'), 'skill2', 'Arcane Shade', 'Dashes and marks enemies, gaining a follow-up hit.', '12.0', '45-70', 'https://static.wikia.nocookie.net/mobile-legends/images/5/56/Arcane_Shade.png/revision/latest?cb=20211202092934'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Valentina'), 'ultimate', 'I Am You', 'Copies a target hero''s ultimate for a while.', 'Varying (>= 10 seconds)', 'Varying', 'https://static.wikia.nocookie.net/mobile-legends/images/3/37/I_Am_You.png/revision/latest?cb=20211202093159');

-- Valir
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Valir'), 'passive', 'Ashing', 'His fire skills stack burns that eventually stun the target.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/6/6a/Ashing.png/revision/latest?cb=20210903173840'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Valir'), 'skill1', 'Burst Fireball', 'Throws a fireball that explodes on the first enemy hit.', '1.5', '50-90', 'https://static.wikia.nocookie.net/mobile-legends/images/5/5f/Burst_Fireball.png/revision/latest?cb=20210903173909'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Valir'), 'skill2', 'Searing Torrent', 'Sends a wave of flame that knocks enemies back.', '13-10.0', '80-110', 'https://static.wikia.nocookie.net/mobile-legends/images/7/7f/Searing_Torrent.png/revision/latest?cb=20210903173933'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Valir'), 'ultimate', 'Vengeance Flame', 'Cleanses debuffs and empowers his skills for a while.', '36.0-30.0', '100-150', 'https://static.wikia.nocookie.net/mobile-legends/images/1/1e/Vengeance_Flame.png/revision/latest?cb=20210903173958');

-- Vexana
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Vexana'), 'passive', 'Nether Touch', 'Enemies hit by her skills explode when killed, damaging others nearby.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/ec/Nether_Touch.png/revision/latest?cb=20241018163634'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Vexana'), 'skill1', 'Deathly Grasp', 'Fires a projectile that terrifies and knocks back the first hero hit, then explodes to terrify others.', '14.0-11.0', '80-130', 'https://static.wikia.nocookie.net/mobile-legends/images/e/ed/Deathly_Grasp.png/revision/latest?cb=20241018163631'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Vexana'), 'skill2', 'Cursed Blast', 'Marks an area that erupts after a short delay, damaging enemies inside.', '7.0-5.5', '80-130', 'https://static.wikia.nocookie.net/mobile-legends/images/3/37/Cursed_Blast.png/revision/latest?cb=20241018163628'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Vexana'), 'ultimate', 'Eternal Guard', 'Summons a knight that fights for her and taunts enemies.', '60.0-46.0', '120-200', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c5/Eternal_Guard.png/revision/latest?cb=20241018163624');

-- Wanwan
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Wanwan'), 'passive', 'Tiger Pace', 'Her basic attacks let her hop; hitting an enemy''s weak points unlocks her ultimate.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/50/Tiger_Pace.png/revision/latest?cb=20210809084948'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Wanwan'), 'skill1', 'Swallow''s Path', 'Throws a fire swallow that splits into daggers which fly back to her, hitting enemies both ways.', '10.0-8.0', '85-110', 'https://static.wikia.nocookie.net/mobile-legends/images/e/ef/Swallow%27s_Path.png/revision/latest?cb=20210809085051'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Wanwan'), 'skill2', 'Needles in Flowers', 'Cleanses debuffs and fires needles at nearby enemies.', '24.0-20.0', '100-75', 'https://static.wikia.nocookie.net/mobile-legends/images/7/7e/Needles_in_Flowers.png/revision/latest?cb=20210809085122'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Wanwan'), 'ultimate', 'Crossbow of Tang', 'Becomes untargetable and rapid-fires arrows at a target.', '50.0-42.0', '130-170', 'https://static.wikia.nocookie.net/mobile-legends/images/3/32/Crossbow_of_Tang.png/revision/latest?cb=20191128203850');

-- X.Borg
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'X.Borg'), 'passive', 'Firaga Armor', 'Fights inside a suit of armor with its own HP bar and burns nearby enemies.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/7b/Firaga_Armor.png/revision/latest?cb=20220302070112'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'X.Borg'), 'skill1', 'Fire Missiles', 'Sprays flames in a cone that damages and burns enemies.', '4.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a0/Fire_Missiles.png/revision/latest?cb=20220302070149'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'X.Borg'), 'skill2', 'Fire Stake', 'Fires stakes that pull enemies toward him.', '12-9', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/1/18/Fire_Stake.png/revision/latest?cb=20220302070221'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'X.Borg'), 'ultimate', 'Last Insanity', 'Charges forward and self-destructs the armor for a big explosion.', '30.0-24.0', '100', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a5/Last_Insanity.png/revision/latest?cb=20220302070257');

-- Xavier
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Xavier'), 'passive', 'Transcendence', 'Landing skills stacks up to enhance his next skill.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/85/Transcendence.png/revision/latest?cb=20220317095446'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Xavier'), 'skill1', 'Infinite Extension', 'Fires a bolt that extends when it hits an enemy.', '6.5-6.0', '50-75', 'https://static.wikia.nocookie.net/mobile-legends/images/9/98/Infinite_Extension.png/revision/latest?cb=20220317095424'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Xavier'), 'skill2', 'Mystic Field', 'Creates a barrier that slows enemies and speeds up allies.', '13.0', '80-120', 'https://static.wikia.nocookie.net/mobile-legends/images/a/ad/Mystic_Field.png/revision/latest?cb=20220317095438'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Xavier'), 'ultimate', 'Dawning Light', 'Fires a global beam that damages every enemy in its line.', '56.0', '120-200', 'https://static.wikia.nocookie.net/mobile-legends/images/9/9a/Dawning_Light.png/revision/latest?cb=20220317095409');

-- Yi Sun-shin
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yi Sun-shin'), 'passive', 'Heavenly Vow', 'Switches between a bow and a sword depending on distance.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/ee/Heavenly_Vow.png/revision/latest?cb=20260905054701'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yi Sun-shin'), 'skill1', 'Traceless', 'Dashes and fires a piercing arrow.', '12.0-7.0', '50-75', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d9/Traceless.png/revision/latest?cb=20260905054849'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yi Sun-shin'), 'skill2', 'Blood Floods', 'Charges an arrow that deals more damage the longer it is held.', '11.0', '60-85', 'https://static.wikia.nocookie.net/mobile-legends/images/b/b3/Blood_Floods.png/revision/latest?cb=20260905054911'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yi Sun-shin'), 'ultimate', 'Mountain Shocker', 'Calls a fleet to bombard the map and reveal enemies.', '60.0', '150-210', 'https://static.wikia.nocookie.net/mobile-legends/images/2/2b/Mountain_Shocker.png/revision/latest?cb=20260905055001');

-- Yin
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yin'), 'passive', 'Leave It to Me', 'Deals more damage and gains spell vamp when no allies are nearby.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/ad/Leave_It_to_Me.png/revision/latest?cb=20220108155655'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yin'), 'skill1', 'Charged Punch', 'Dashes forward and punches the first enemy hit.', '10.0-7.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/e/e2/Charged_Punch.png/revision/latest?cb=20220108155643'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yin'), 'skill2', 'Instant Blast', 'Fires a shockwave that damages and slows enemies.', '14.0-10.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/ad/Instant_Blast.png/revision/latest?cb=20220108155652'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yin'), 'ultimate', 'My Turn', 'Drags an enemy into a separate arena for a one-on-one fight.', '60.0-50.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/a/a8/My_Turn.png/revision/latest?cb=20220108155647');

-- Yu Zhong
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yu Zhong'), 'passive', 'Cursing Touch', 'His attacks stack a curse that bursts for bonus damage.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/0/00/Cursing_Touch.png/revision/latest?cb=20240819053114'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yu Zhong'), 'skill1', 'Dragon Tail', 'Whips a tail that damages enemies in a cone.', '6.0-4.5', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/8/88/Dragon_Tail.png/revision/latest?cb=20240819053214'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yu Zhong'), 'skill2', 'Soul Grip', 'Sends out an energy pull that damages and slows enemies.', '14.0-11.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/2/20/Soul_Grip.png/revision/latest?cb=20240819053317'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yu Zhong'), 'ultimate', 'Black Dragon Form', 'Transforms into a dragon that flies over terrain and knocks enemies up.', '85.0-65.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/5/5c/Black_Dragon_Form.png/revision/latest?cb=20240819054031');

-- Yve
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yve'), 'passive', 'Galactic Power', 'Her skills gain extra effects while she stands in her void field.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/f/f6/Galactic_Power.png/revision/latest?cb=20210315234218'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yve'), 'skill1', 'Void Blast', 'Fires a wave of energy that damages enemies in a line.', '5.0-2.5', '65-90', 'https://static.wikia.nocookie.net/mobile-legends/images/b/b0/Void_Blast.png/revision/latest?cb=20210315234044'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yve'), 'skill2', 'Void Crystal', 'Sends crystals that damage and slow enemies.', '14.0-12.0', NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/9/96/Void_Crystal.png/revision/latest?cb=20210315234111'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Yve'), 'ultimate', 'Real World Manipulation', 'Opens a grid field she can tap to detonate damage across the area.', '60.0', '180-260', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c8/Real_World_Manipulation.png/revision/latest?cb=20210315234144');

-- Zetian
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zetian'), 'passive', 'Celestial Armament', 'Knocks back enemies who get too close and shields her.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/7/7e/Celestial_Armament.png/revision/latest?cb=20250118135549'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zetian'), 'skill1', 'Phoenix Strike', 'Fires three waves of magic damage, the last one larger and pulling enemies.', '7.0-5.0', '70-120', 'https://static.wikia.nocookie.net/mobile-legends/images/4/49/Phoenix_Strike.png/revision/latest?cb=20250118135551'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zetian'), 'skill2', 'Phoenix Descent', 'Summons a spirit that damages and weakens enemies in an area.', '15.0', '80-130', 'https://static.wikia.nocookie.net/mobile-legends/images/f/fd/Phoenix_Descent.png/revision/latest?cb=20250118135552'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zetian'), 'ultimate', 'Fury of the Phoenix', 'Speeds up allies while damaging and stunning every enemy hero.', '90.0-70.0', '150-210', 'https://static.wikia.nocookie.net/mobile-legends/images/d/db/Fury_of_the_Phoenix.png/revision/latest?cb=20250118135550');

-- Zhask
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zhask'), 'passive', 'Decimation', 'On death he summons a frenzied spawn that fights until its HP runs out.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/b/bf/Decimation_%28Zhask%29.png/revision/latest?cb=20220203075416'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zhask'), 'skill1', 'Nightmaric Spawn', 'Summons a spawn that attacks nearby enemies.', '13.0-10.0', '60-90', 'https://static.wikia.nocookie.net/mobile-legends/images/4/45/Nightmaric_Spawn.png/revision/latest?cb=20220203075736'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zhask'), 'skill2', 'Mind Eater', 'Fires a wave that damages and slows enemies in a line.', '8.0', '50-95', 'https://static.wikia.nocookie.net/mobile-legends/images/d/dc/Mind_Eater.png/revision/latest?cb=20220203075810'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zhask'), 'ultimate', 'Dominator''s Descent', 'Merges with his spawn to become a powerful mobile turret.', '60.0-50.0', '100-200', 'https://static.wikia.nocookie.net/mobile-legends/images/6/6d/Dominator%27s_Descent.png/revision/latest?cb=20220203080019');

-- Zhuxin
REPLACE INTO hero_skills (hero_id, slot, name, description, cooldown, mana_cost, icon_url) VALUES
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zhuxin'), 'passive', 'Crimson Butterflies', 'Mana spent on her lantern skill returns as butterflies that restore mana.', NULL, NULL, 'https://static.wikia.nocookie.net/mobile-legends/images/d/dc/Crimson_Butterflies.png/revision/latest?cb=20240620224157'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zhuxin'), 'skill1', 'Fluttering Grace', 'Releases a fan of magic that damages enemies in front.', '12.0-10.0', '100', 'https://static.wikia.nocookie.net/mobile-legends/images/4/43/Fluttering_Grace.png/revision/latest?cb=20240620224301'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zhuxin'), 'skill2', 'Lantern Flare', 'Guides a floating lantern around to damage and mark enemies it touches.', '0.5', '90', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0e/Lantern_Flare.png/revision/latest?cb=20240620224332'),
  ((SELECT hero_id FROM mobile_legends_heroes WHERE name = 'Zhuxin'), 'ultimate', 'Crimson Beacon', 'Summons a lantern field that slows and damages enemies inside.', '60.0-50.0', '200', 'https://static.wikia.nocookie.net/mobile-legends/images/4/40/Crimson_Beacon.png/revision/latest?cb=20240620224352');
