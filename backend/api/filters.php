<?php
/**
 * GET /api/filters.php
 * Distinct roles, lanes and difficulties present in the table.
 * Multi-value cells ("Mage/Tank") are split so each value appears once.
 */
require_once __DIR__ . '/../includes/helpers.php';
require_get();

$pdo = db();

try {
    $rows = $pdo->query('SELECT role, lane, difficulty FROM mobile_legends_heroes')->fetchAll();
} catch (PDOException $e) {
    error_log('filters: ' . $e->getMessage());
    json_error('Could not load filters', 500);
}

$roles = array();
$lanes = array();
$difficulties = array();

foreach ($rows as $r) {
    foreach (split_list($r['role']) as $v) {
        $roles[$v] = true;
    }
    foreach (split_list($r['lane']) as $v) {
        $lanes[$v] = true;
    }
    $d = trim($r['difficulty']);
    if ($d !== '') {
        $difficulties[$d] = true;
    }
}

$roles = array_keys($roles);
$lanes = array_keys($lanes);
$difficulties = array_keys($difficulties);
sort($roles);
sort($lanes);

// Easy -> Medium -> Hard, anything unexpected goes last alphabetically.
$order = array('Easy' => 0, 'Medium' => 1, 'Hard' => 2);
usort($difficulties, function ($a, $b) use ($order) {
    $x = isset($order[$a]) ? $order[$a] : 99;
    $y = isset($order[$b]) ? $order[$b] : 99;
    return $x === $y ? strcmp($a, $b) : $x - $y;
});

json_success(array(
    'roles'        => $roles,
    'lanes'        => $lanes,
    'difficulties' => $difficulties,
));
