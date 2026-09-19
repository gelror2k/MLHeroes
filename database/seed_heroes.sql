-- Seed data for mobile_legends_heroes.
-- Paste into phpMyAdmin -> gabcas7_gelodb -> SQL tab -> Go.
--
-- Columns match the live table exactly; hero_id is left out so AUTO_INCREMENT assigns it.
-- Multiple roles / lanes are separated by "/" (the API splits them for the app).
-- difficulty is exactly one of: Easy | Medium | Hard.
-- picture holds a placeholder image URL for now. Replace with real portrait URLs
-- (must be full https:// links to an image, never a binary) when you have them.
--
-- Safe to re-run only on an empty table: it does not check for existing names.

INSERT INTO mobile_legends_heroes (name, role, lane, difficulty, picture) VALUES
('Layla',    'Marksman',          'Gold',        'Easy',   'https://placehold.co/400x400.png?text=Layla'),
('Miya',     'Marksman',          'Gold',        'Easy',   'https://placehold.co/400x400.png?text=Miya'),
('Tigreal',  'Tank',              'Roam',        'Easy',   'https://placehold.co/400x400.png?text=Tigreal'),
('Eudora',   'Mage',              'Mid',         'Easy',   'https://placehold.co/400x400.png?text=Eudora'),
('Zilong',   'Fighter/Assassin',  'EXP/Jungle',  'Easy',   'https://placehold.co/400x400.png?text=Zilong'),
('Balmond',  'Fighter',           'EXP/Jungle',  'Easy',   'https://placehold.co/400x400.png?text=Balmond'),
('Nana',     'Mage/Support',      'Mid/Roam',    'Easy',   'https://placehold.co/400x400.png?text=Nana'),
('Estes',    'Support',           'Roam',        'Easy',   'https://placehold.co/400x400.png?text=Estes'),
('Alucard',  'Fighter/Assassin',  'Jungle/EXP',  'Medium', 'https://placehold.co/400x400.png?text=Alucard'),
('Franco',   'Tank',              'Roam',        'Medium', 'https://placehold.co/400x400.png?text=Franco'),
('Saber',    'Assassin',          'Jungle',      'Medium', 'https://placehold.co/400x400.png?text=Saber'),
('Karina',   'Assassin/Mage',     'Jungle',      'Medium', 'https://placehold.co/400x400.png?text=Karina'),
('Angela',   'Support',           'Roam',        'Medium', 'https://placehold.co/400x400.png?text=Angela'),
('Lesley',   'Marksman/Assassin', 'Gold',        'Medium', 'https://placehold.co/400x400.png?text=Lesley'),
('Fanny',    'Assassin',          'Jungle',      'Hard',   'https://placehold.co/400x400.png?text=Fanny'),
('Gusion',   'Assassin/Mage',     'Jungle/Mid',  'Hard',   'https://placehold.co/400x400.png?text=Gusion'),
('Lancelot', 'Assassin',          'Jungle',      'Hard',   'https://placehold.co/400x400.png?text=Lancelot'),
('Chou',     'Fighter',           'EXP/Roam',    'Hard',   'https://placehold.co/400x400.png?text=Chou'),
('Kagura',   'Mage',              'Mid',         'Hard',   'https://placehold.co/400x400.png?text=Kagura'),
('Hayabusa', 'Assassin',          'Jungle',      'Hard',   'https://placehold.co/400x400.png?text=Hayabusa');
