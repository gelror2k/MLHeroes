<?php
/**
 * Shared helpers: headers, JSON envelope, DB connection, row formatting.
 * Every endpoint must require_once this file before doing anything else.
 */

// ---- Headers + CORS preflight ------------------------------------------
// Don't advertise the PHP version to every caller. Must run before the first header().
if (function_exists('header_remove')) {
    header_remove('X-Powered-By');
}
// Transparent gzip. Silently does nothing if zlib is unavailable on the host;
// a 50-hero page is ~12 KB uncompressed and ~3 KB gzipped.
@ini_set('zlib.output_compression', '1');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Key');

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

/** 405 unless the request method is one of $allowed, e.g. array('GET', 'POST'). */
function require_method($allowed)
{
    if (!in_array($_SERVER['REQUEST_METHOD'], $allowed, true)) {
        header('Allow: ' . implode(', ', $allowed));
        json_error('Method not allowed', 405);
    }
}

function require_get()
{
    require_method(array('GET'));
}

// ---- Write access --------------------------------------------------------
/**
 * Writes need the shared admin key from config/database.php, sent as an
 * X-Admin-Key header. This is deliberately not user auth: one secret, no
 * accounts. If the key is unset (or still CHANGE_ME) writes are refused.
 */
function require_admin_key()
{
    db(); // loads config/database.php so ADMIN_KEY is defined
    if (!defined('ADMIN_KEY') || ADMIN_KEY === '' || ADMIN_KEY === 'CHANGE_ME') {
        error_log('ADMIN_KEY is not set in config/database.php - write endpoints are disabled');
        json_error('Editing is disabled on this server', 503);
    }

    $given = '';
    if (isset($_SERVER['HTTP_X_ADMIN_KEY'])) {
        $given = $_SERVER['HTTP_X_ADMIN_KEY'];
    } elseif (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strtolower($k) === 'x-admin-key') {
                $given = $v;
                break;
            }
        }
    }

    if ($given === '' || !hash_equals(ADMIN_KEY, (string) $given)) {
        json_error('Admin key missing or incorrect', 401);
    }
}

/** Decode the JSON request body into an array (400 if it is not valid JSON). Falls back to form fields. */
function read_json_body()
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return is_array($_POST) ? $_POST : array();
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_error('Request body must be a JSON object', 400);
    }
    return $data;
}

// ---- Hero input validation -----------------------------------------------
/**
 * Normalise "mage , tank" / "Mage|Tank" to "Mage/Tank": parts trimmed, first letter
 * upper-cased (ucfirst, not ucwords, so "EXP" stays "EXP"), duplicates dropped.
 * Keeps filters.php from growing a second "marksman" chip next to "Marksman".
 */
function normalise_list($value)
{
    $out  = array();
    $seen = array();
    foreach (split_list($value) as $part) {
        $key = strtolower($part);
        if (isset($seen[$key])) {
            continue;
        }
        $seen[$key] = true;
        $out[]      = ucfirst($part);
    }
    return implode('/', $out);
}

/**
 * Validate and clean the hero fields from a request body.
 * With $partial = true (PUT) only the fields present are checked, so the
 * caller can merge them over the existing row.
 * picture is optional: absent on create, or sent as "", stores "" (no portrait
 * link). The app shows a monogram tile for those. When a value is given it
 * must still be a full http(s) URL, never image data.
 * Returns array('values' => array(...), 'errors' => array(...)).
 */
function validate_hero_input($input, $partial = false)
{
    $values = array();
    $errors = array();
    $difficulties = array('easy' => 'Easy', 'medium' => 'Medium', 'hard' => 'Hard');

    $fields = array('name', 'role', 'lane', 'difficulty', 'picture');
    foreach ($fields as $f) {
        $present = array_key_exists($f, $input);
        if (!$present) {
            if ($f === 'picture') {
                if (!$partial) {
                    $values['picture'] = '';
                }
            } elseif (!$partial) {
                $errors[] = $f . ' is required';
            }
            continue;
        }
        // A present-but-wrong-typed field is its own mistake, not a missing one.
        // Saying so beats reporting `{"name": 123}` as "name is required", and it
        // stops `{"picture": null}` from silently wiping the portrait link: only
        // an omitted field keeps its value, and only "" clears it.
        if (!is_string($input[$f])) {
            $errors[] = $f . ' must be text';
            continue;
        }
        $v = trim($input[$f]);

        switch ($f) {
            case 'name':
                if ($v === '') {
                    $errors[] = 'name is required';
                } elseif (mb_strlen($v) > 255) {
                    $errors[] = 'name must be 255 characters or fewer';
                } elseif (preg_match('/[[:cntrl:]]/', $v)) {
                    $errors[] = 'name cannot contain control characters';
                } else {
                    $values['name'] = $v;
                }
                break;

            case 'role':
            case 'lane':
                $clean = normalise_list($v);
                if ($clean === '') {
                    $errors[] = $f . ' is required';
                } elseif (mb_strlen($clean) > 255) {
                    $errors[] = $f . ' must be 255 characters or fewer';
                } else {
                    $values[$f] = $clean;
                }
                break;

            case 'difficulty':
                $key = strtolower($v);
                if (!isset($difficulties[$key])) {
                    $errors[] = 'difficulty must be Easy, Medium or Hard';
                } else {
                    $values['difficulty'] = $difficulties[$key];
                }
                break;

            case 'picture':
                if ($v === '') {
                    $values['picture'] = ''; // remove the portrait link
                } elseif (mb_strlen($v) > 1000) {
                    $errors[] = 'picture must be 1000 characters or fewer';
                } elseif (!preg_match('#^https?://#i', $v) || filter_var($v, FILTER_VALIDATE_URL) === false) {
                    $errors[] = 'picture must be a full http:// or https:// image URL';
                } else {
                    $values['picture'] = $v;
                }
                break;
        }
    }

    return array('values' => $values, 'errors' => $errors);
}

/**
 * Map each part of a role/lane value onto the spelling already used in the table
 * ("roam" or "ROAM" -> "Roam") so filters.php never grows a near-duplicate chip.
 * Parts the table has never seen keep the caller's spelling.
 * $column is whitelisted to role/lane before it touches the SQL string.
 */
function canonicalise_list($pdo, $column, $value)
{
    if ($column !== 'role' && $column !== 'lane') {
        return $value;
    }
    $known = array();
    foreach ($pdo->query('SELECT ' . $column . ' FROM mobile_legends_heroes')->fetchAll() as $r) {
        foreach (split_list($r[$column]) as $p) {
            $k = strtolower($p);
            if (!isset($known[$k])) {
                $known[$k] = $p;
            }
        }
    }
    $out = array();
    foreach (split_list($value) as $p) {
        $k     = strtolower($p);
        $out[] = isset($known[$k]) ? $known[$k] : $p;
    }
    return implode('/', $out);
}

/** Fetch one raw hero row by id, or null. Caller handles the 404. */
function fetch_hero_row($pdo, $id)
{
    $stmt = $pdo->prepare(
        'SELECT hero_id, name, role, lane, difficulty, picture
           FROM mobile_legends_heroes
          WHERE hero_id = :id
          LIMIT 1'
    );
    $stmt->execute(array(':id' => (int) $id));
    $row = $stmt->fetch();
    return $row ? $row : null;
}

/** True if another hero (not $except_id) already uses this name, case-insensitively. */
function hero_name_taken($pdo, $name, $except_id = 0)
{
    $stmt = $pdo->prepare(
        'SELECT COUNT(*) AS n FROM mobile_legends_heroes WHERE LOWER(name) = LOWER(:name) AND hero_id <> :id'
    );
    $stmt->execute(array(':name' => $name, ':id' => (int) $except_id));
    return (int) $stmt->fetch()['n'] > 0;
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
/**
 * Escape the LIKE metacharacters in a user-supplied search term so "%" and "_"
 * match themselves instead of "anything". Pair with  LIKE :x ESCAPE '!'  in the
 * query. "!" is used rather than a backslash so NO_BACKSLASH_ESCAPES cannot
 * change the meaning of the pattern.
 */
function like_escape($value)
{
    return str_replace(
        array('!', '%', '_'),
        array('!!', '!%', '!_'),
        (string) $value
    );
}

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
