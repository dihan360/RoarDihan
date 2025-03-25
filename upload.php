<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the form data
    $title = $_POST['mod-title'];
    $description = $_POST['mod-description'];

    // Get the uploaded mod file and screenshot
    $modFile = $_FILES['mod-file'];
    $screenshot = $_FILES['mod-screenshot'];

    // Define the upload paths
    $modUploadPath = 'uploads/mods/' . basename($modFile['name']);
    $screenshotUploadPath = '';

    // Move the mod file to the mods folder
    if (move_uploaded_file($modFile['tmp_name'], $modUploadPath)) {
        echo 'Mod file uploaded successfully.<br>';
    } else {
        echo 'Failed to upload mod file.<br>';
    }

    // Move the screenshot if uploaded
    if ($screenshot['error'] == 0) {
        $screenshotUploadPath = 'uploads/screenshots/' . basename($screenshot['name']);
        if (move_uploaded_file($screenshot['tmp_name'], $screenshotUploadPath)) {
            echo 'Screenshot uploaded successfully.<br>';
        } else {
            echo 'Failed to upload screenshot.<br>';
        }
    }

    // Save the mod details in mods.txt (or you can use a database)
    $modDetails = "$title|$description|$modUploadPath|$screenshotUploadPath\n";
    file_put_contents('mods.txt', $modDetails, FILE_APPEND);

    // Redirect to mods page after uploading
    header('Location: mods.html');
    exit;
}
?>
