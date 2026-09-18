<?php
/**
 * Shared helpers: headers, JSON envelope, DB connection, row formatting.
 * Every endpoint must require_once this file before doing anything else.
 */

// ---- Headers + CORS preflight ------------------------------------------
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Never leak PHP warnings into the JSON body.
ini_set('display_errors', '0');
error_reporting(E_ALL);

// ---- JSON envelope -------------------------------------------------------
function json_success($data, $meta = null, $message = 'OK')
{
    $body = array('success' => true, 'message' => $message, 'data' => $data);
    if ($meta !== null) {
        $body['meta'] = $meta;
    }
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function json_error($message, $status = 400)
{
    http_response_code($status);
    echo json_encode(
        array('success' => false, 'message' => $message, 'data' => null),
        JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    );
    exit;
}

function require_get()
{
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_error('Method not allowed', 405);
    }
}

// ---- Database ------------------------------------------------------------
function db()
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $config = __DIR__ . '/../config/database.php';
    if (!file_exists($config)) {
        error_log('config/database.php is missing - copy config.sample.php');
        json_error('Server configuration error', 500);
    }
    require_once $config;

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, array(
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ));
    } catch (PDOException $e) {
        error_log('DB connection failed: ' . $e->getMessage());
        json_error('Database connection failed', 500);
    }
    return $pdo;
}

// ---- Row formatting ------------------------------------------------------
/** Split "Mage/Tank", "Gold, EXP" or "Mid|Roam" into a clean array. */
function split_list($value)
{
    $parts = preg_split('/[\/,|]/', (string) $value);
    $out = array();
    foreach ($parts as $p) {
        $p = trim($p);
        if ($p !== '') {
            $out[] = $p;
        }
    }
    return $out;
}

/** Shape one DB row into the hero object the app expects. */
function format_hero($row)
{
    return array(
        'hero_id'    => (int) $row['hero_id'],
        'name'       => $row['name'],
        'role'       => $row['role'],
        'roles'      => split_list($row['role']),
        'lane'       => $row['lane'],
        'lanes'      => split_list($row['lane']),
        'difficulty' => $row['difficulty'],
        'picture'    => $row['picture'],
    );
}
