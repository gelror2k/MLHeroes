<?php
/**
 * GET    /api/hero.php?id=12
 *        One hero plus its skills. skills[] is empty if the hero_skills table does not exist yet.
 *
 * PUT    /api/hero.php?id=12   (header X-Admin-Key required)
 *        Update a hero. JSON body with any of { name, role, lane, difficulty, picture }.
 *        Fields left out keep their current value; picture: "" removes the portrait link.
 *        Returns the updated hero.
 *
 * DELETE /api/hero.php?id=12   (header X-Admin-Key required)
 *        Delete a hero (and its skills, if that table exists). Returns { hero_id }.
 */
require_once __DIR__ . '/../includes/helpers.php';
require_method(array('GET', 'PUT', 'DELETE'));

$id = isset($_GET['id']) ? trim($_GET['id']) : '';
if ($id === '' || !ctype_digit($id)) {
    json_error('A numeric id is required', 400);
}
$id = (int) $id;

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET') {
    require_admin_key();
}

$pdo = db();

try {
    $row = fetch_hero_row($pdo, $id);
} catch (PDOException $e) {
    error_log('hero: ' . $e->getMessage());
    json_error('Could not load hero', 500);
}

if (!$row) {
    json_error('Hero not found', 404);
}

// ---- DELETE ---------------------------------------------------------------
if ($method === 'DELETE') {
    try {
        // Optional table — ignore "doesn't exist", surface anything else.
        try {
            $sk = $pdo->prepare('DELETE FROM hero_skills WHERE hero_id = :id');
            $sk->execute(array(':id' => $id));
        } catch (PDOException $e) {
            if ($e->getCode() !== '42S02') {
                throw $e;
            }
        }
        $stmt = $pdo->prepare('DELETE FROM mobile_legends_heroes WHERE hero_id = :id');
        $stmt->execute(array(':id' => $id));
    } catch (PDOException $e) {
        error_log('hero delete: ' . $e->getMessage());
        json_error('Could not delete hero', 500);
    }
    json_success(array('hero_id' => $id), null, 'Hero deleted');
}

// ---- PUT ------------------------------------------------------------------
if ($method === 'PUT') {
    $input  = read_json_body();
    $result = validate_hero_input($input, true);
    if (count($result['errors'])) {
        json_error(implode('. ', $result['errors']) . '.', 400);
    }
    if (count($result['values']) === 0) {
        json_error('Nothing to update: send at least one of name, role, lane, difficulty, picture', 400);
    }
    // Merge the submitted fields over the current row.
    $v = array_merge(
        array(
            'name'       => $row['name'],
            'role'       => $row['role'],
            'lane'       => $row['lane'],
            'difficulty' => $row['difficulty'],
            'picture'    => $row['picture'],
        ),
        $result['values']
    );

    try {
        if (hero_name_taken($pdo, $v['name'], $id)) {
            json_error('A hero named "' . $v['name'] . '" already exists', 409);
        }
        if (isset($result['values']['role'])) {
            $v['role'] = canonicalise_list($pdo, 'role', $v['role']);
        }
        if (isset($result['values']['lane'])) {
            $v['lane'] = canonicalise_list($pdo, 'lane', $v['lane']);
        }
        $stmt = $pdo->prepare(
            'UPDATE mobile_legends_heroes
                SET name = :name, role = :role, lane = :lane, difficulty = :difficulty, picture = :picture
              WHERE hero_id = :id'
        );
        $stmt->execute(array(
            ':name'       => $v['name'],
            ':role'       => $v['role'],
            ':lane'       => $v['lane'],
            ':difficulty' => $v['difficulty'],
            ':picture'    => $v['picture'],
            ':id'         => $id,
        ));
        $row = fetch_hero_row($pdo, $id);
    } catch (PDOException $e) {
        error_log('hero update: ' . $e->getMessage());
        json_error('Could not update hero', 500);
    }
    json_success(format_hero($row), null, 'Hero updated');
}

// ---- GET ------------------------------------------------------------------
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
