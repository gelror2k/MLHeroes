<?php
/**
 * GET /api/hero.php?id=12
 * One hero plus its skills. skills[] is empty if the hero_skills table does not exist yet.
 */
require_once __DIR__ . '/../includes/helpers.php';
require_get();

$id = isset($_GET['id']) ? trim($_GET['id']) : '';
if ($id === '' || !ctype_digit($id)) {
    json_error('A numeric id is required', 400);
}
$id = (int) $id;

$pdo = db();

try {
    $stmt = $pdo->prepare(
        'SELECT hero_id, name, role, lane, difficulty, picture
           FROM mobile_legends_heroes
          WHERE hero_id = :id
          LIMIT 1'
    );
    $stmt->execute(array(':id' => $id));
    $row = $stmt->fetch();
} catch (PDOException $e) {
    error_log('hero: ' . $e->getMessage());
    json_error('Could not load hero', 500);
}

if (!$row) {
    json_error('Hero not found', 404);
}

$hero = format_hero($row);

// Optional table — tolerate its absence.
$hero['skills'] = array();
try {
    $sk = $pdo->prepare(
        'SELECT skill_id, slot, name, description, cooldown, mana_cost, icon_url
           FROM hero_skills
          WHERE hero_id = :id
          ORDER BY FIELD(slot, "passive", "skill1", "skill2", "ultimate")'
    );
    $sk->execute(array(':id' => $id));
    foreach ($sk->fetchAll() as $s) {
        $hero['skills'][] = array(
            'skill_id'    => (int) $s['skill_id'],
            'slot'        => $s['slot'],
            'name'        => $s['name'],
            'description' => $s['description'],
            'cooldown'    => $s['cooldown'],
            'mana_cost'   => $s['mana_cost'],
            'icon_url'    => $s['icon_url'],
        );
    }
} catch (PDOException $e) {
    // 42S02 = table doesn't exist. Expected until upgrade.sql is run; anything else is worth logging.
    if ($e->getCode() !== '42S02') {
        error_log('hero skills: ' . $e->getMessage());
    }
}

json_success($hero);
