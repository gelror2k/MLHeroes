<?php
/**
 * GET /api/health.php
 * Connection check. Confirms PHP can reach the database and see the heroes table.
 * Open this first after uploading — it answers "is the backend wired up?" in one request.
 */
require_once __DIR__ . '/../includes/helpers.php';
require_get();

$pdo = db();

try {
    $stmt  = $pdo->query('SELECT COUNT(*) AS n FROM mobile_legends_heroes');
    $count = (int) $stmt->fetch()['n'];
} catch (PDOException $e) {
    error_log('health: table check failed: ' . $e->getMessage());
    json_error('Connected to the database, but the mobile_legends_heroes table was not found', 500);
}

json_success(array(
    'database'  => 'connected',
    'table'     => 'mobile_legends_heroes',
    'heroes'    => $count,
    'php'       => PHP_VERSION,
    'timestamp' => date('c'),
));
