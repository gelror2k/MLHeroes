<?php
/**
 * GET  /api/heroes.php?search=&role=&lane=&difficulty=&page=1&per_page=20
 *      Paginated hero list. All params optional. per_page is capped at 50.
 *
 * POST /api/heroes.php   (header X-Admin-Key required)
 *      Create a hero. JSON body: { name, role, lane, difficulty, picture }.
 *      picture is optional (a URL, or "" / omitted for no portrait link).
 *      Returns 201 with the new hero, 400 on validation errors, 409 if the name exists.
 */
require_once __DIR__ . '/../includes/helpers.php';
require_method(array('GET', 'POST'));

// ---- POST: create ---------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin_key();
    $input  = read_json_body();
    $result = validate_hero_input($input, false);
    if (count($result['errors'])) {
        json_error(implode('. ', $result['errors']) . '.', 400);
    }
    $v   = $result['values'];
    $pdo = db();

    try {
        if (hero_name_taken($pdo, $v['name'])) {
            json_error('A hero named "' . $v['name'] . '" already exists', 409);
        }
        $v['role'] = canonicalise_list($pdo, 'role', $v['role']);
        $v['lane'] = canonicalise_list($pdo, 'lane', $v['lane']);
        $stmt = $pdo->prepare(
            'INSERT INTO mobile_legends_heroes (name, role, lane, difficulty, picture)
             VALUES (:name, :role, :lane, :difficulty, :picture)'
        );
        $stmt->execute(array(
            ':name'       => $v['name'],
            ':role'       => $v['role'],
            ':lane'       => $v['lane'],
            ':difficulty' => $v['difficulty'],
            ':picture'    => $v['picture'],
        ));
        $row = fetch_hero_row($pdo, $pdo->lastInsertId());
    } catch (PDOException $e) {
        error_log('heroes create: ' . $e->getMessage());
        json_error('Could not create hero', 500);
    }

    http_response_code(201);
    json_success(format_hero($row), null, 'Hero created');
}

// ---- GET: list ------------------------------------------------------------
$search     = isset($_GET['search'])     ? trim($_GET['search'])     : '';
$role       = isset($_GET['role'])       ? trim($_GET['role'])       : '';
$lane       = isset($_GET['lane'])       ? trim($_GET['lane'])       : '';
$difficulty = isset($_GET['difficulty']) ? trim($_GET['difficulty']) : '';

$page     = isset($_GET['page'])     ? (int) $_GET['page']     : 1;
$per_page = isset($_GET['per_page']) ? (int) $_GET['per_page'] : 20;
if ($page < 1)      { $page = 1; }
if ($per_page < 1)  { $per_page = 20; }
if ($per_page > 50) { $per_page = 50; }
$offset = ($page - 1) * $per_page;

// Build WHERE with named placeholders only — user input never touches the SQL string.
$where  = array();
$params = array();

// like_escape() keeps a typed "%" or "_" a literal character instead of a
// wildcard, so searching for "50%" cannot quietly return the whole roster.
if ($search !== '') {
    $where[]           = "name LIKE :search ESCAPE '!'";
    $params[':search'] = '%' . like_escape($search) . '%';
}
// role/lane cells can hold "Mage/Tank", so match the value anywhere in the cell.
if ($role !== '') {
    $where[]         = "role LIKE :role ESCAPE '!'";
    $params[':role'] = '%' . like_escape($role) . '%';
}
if ($lane !== '') {
    $where[]         = "lane LIKE :lane ESCAPE '!'";
    $params[':lane'] = '%' . like_escape($lane) . '%';
}
if ($difficulty !== '') {
    $where[]               = 'difficulty = :difficulty';
    $params[':difficulty'] = $difficulty;
}

$where_sql = count($where) ? ' WHERE ' . implode(' AND ', $where) : '';

$pdo = db();

try {
    $count = $pdo->prepare('SELECT COUNT(*) AS n FROM mobile_legends_heroes' . $where_sql);
    $count->execute($params);
    $total = (int) $count->fetch()['n'];

    // LIMIT/OFFSET are already (int)-cast above, so interpolating them is safe.
    $stmt = $pdo->prepare(
        'SELECT hero_id, name, role, lane, difficulty, picture
           FROM mobile_legends_heroes' . $where_sql . '
          ORDER BY name ASC
          LIMIT ' . (int) $per_page . ' OFFSET ' . (int) $offset
    );
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
} catch (PDOException $e) {
    error_log('heroes: ' . $e->getMessage());
    json_error('Could not load heroes', 500);
}

$heroes = array();
foreach ($rows as $r) {
    $heroes[] = format_hero($r);
}

json_success($heroes, array(
    'page'        => $page,
    'per_page'    => $per_page,
    'total'       => $total,
    'total_pages' => $total > 0 ? (int) ceil($total / $per_page) : 0,
));
