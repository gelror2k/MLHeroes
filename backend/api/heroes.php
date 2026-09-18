<?php
/**
 * GET /api/heroes.php?search=&role=&lane=&difficulty=&page=1&per_page=20
 * Paginated hero list. All params optional. per_page is capped at 50.
 */
require_once __DIR__ . '/../includes/helpers.php';
require_get();

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

if ($search !== '') {
    $where[]           = 'name LIKE :search';
    $params[':search'] = '%' . $search . '%';
}
// role/lane cells can hold "Mage/Tank", so match the value anywhere in the cell.
if ($role !== '') {
    $where[]         = 'role LIKE :role';
    $params[':role'] = '%' . $role . '%';
}
if ($lane !== '') {
    $where[]         = 'lane LIKE :lane';
    $params[':lane'] = '%' . $lane . '%';
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
