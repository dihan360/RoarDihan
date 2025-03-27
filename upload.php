<?php
require __DIR__ . '/vendor/autoload.php';

// Google Drive Configuration
define('SERVICE_ACCOUNT_KEY_PATH', __DIR__ . '/service-account-key.json');
define('DRIVE_FOLDER_ID', '1Nn1O-2bRWHG0m54mm6ZR38vkyPjTN1Oa');
define('UPLOAD_DIR', __DIR__ . '/uploads/');

session_start();

// Create required directories
if (!file_exists(UPLOAD_DIR . 'screenshots/')) {
    mkdir(UPLOAD_DIR . 'screenshots/', 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Validate form data
        $title = trim($_POST['mod-title'] ?? '');
        $description = trim($_POST['mod-description'] ?? '');
        
        if (empty($title) || empty($description)) {
            throw new Exception('Title and description are required');
        }

        // Process screenshot
        $screenshotPath = '';
        if (isset($_FILES['mod-screenshot']) && $_FILES['mod-screenshot']['error'] === UPLOAD_ERR_OK) {
            $screenshot = $_FILES['mod-screenshot'];
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            
            if (!in_array($screenshot['type'], $allowedTypes)) {
                throw new Exception('Only JPG, PNG, or GIF images allowed for screenshots');
            }

            $screenshotExt = pathinfo($screenshot['name'], PATHINFO_EXTENSION);
            $screenshotPath = 'screenshots/' . uniqid() . '.' . $screenshotExt;
            move_uploaded_file($screenshot['tmp_name'], UPLOAD_DIR . $screenshotPath);
        }

        // Process mod file
        if (!isset($_FILES['mod-file']) || $_FILES['mod-file']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Mod file upload failed');
        }

        $modFile = $_FILES['mod-file'];
        $allowedModTypes = [
            'application/zip' => 'zip',
            'application/x-rar-compressed' => 'rar',
            'application/x-7z-compressed' => '7z'
        ];

        if (!array_key_exists($modFile['type'], $allowedModTypes)) {
            throw new Exception('Only ZIP, RAR, or 7Z files allowed for mods');
        }

        // Initialize Google Drive client
        $client = new Google\Client();
        $client->setAuthConfig(SERVICE_ACCOUNT_KEY_PATH);
        $client->addScope(Google\Service\Drive::DRIVE);
        $client->setSubject('akshayraj42015@gmail.com'); // Impersonate your account

        $service = new Google\Service\Drive($client);

        // Upload to Google Drive
        $fileMetadata = new Google\Service\Drive\DriveFile([
            'name' => htmlspecialchars($modFile['name']),
            'parents' => [DRIVE_FOLDER_ID]
        ]);

        $content = file_get_contents($modFile['tmp_name']);
        $uploadedFile = $service->files->create($fileMetadata, [
            'data' => $content,
            'uploadType' => 'multipart',
            'fields' => 'id,name,webContentLink'
        ]);

        // Generate direct download link
        $downloadLink = 'https://drive.google.com/uc?export=download&id=' . $uploadedFile->id;

        // Save mod data
        $modData = [
            'title' => htmlspecialchars($title),
            'description' => htmlspecialchars($description),
            'screenshot' => $screenshotPath,
            'download' => $downloadLink,
            'date' => date('Y-m-d H:i:s'),
            'filename' => htmlspecialchars($modFile['name'])
        ];

        $mods = [];
        if (file_exists('mods.json')) {
            $mods = json_decode(file_get_contents('mods.json'), true) ?: [];
        }

        array_unshift($mods, $modData); // Add newest mod first
        file_put_contents('mods.json', json_encode($mods, JSON_PRETTY_PRINT));

        $_SESSION['upload_status'] = ['type' => 'success', 'message' => 'Mod uploaded successfully!'];
    } catch (Exception $e) {
        $_SESSION['upload_status'] = ['type' => 'error', 'message' => $e->getMessage()];
    }

    header('Location: mods.html');
    exit;
}
?>