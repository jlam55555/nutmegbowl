<?php

  function returnFilesRecursive($dirname) {
    $files = [];
    foreach(scandir($dirname) as $file) {
      $relPath = "$dirname/$file";
      if(substr($file, 0, 1) == "." || $file == "_site" || $file == "_layouts")
        continue;
      else if(is_dir($relPath))
        $files = array_merge($files, returnFilesRecursive($relPath));
      else if(substr($file, count($file)-5) == "html")
        $files[] = $relPath;
    }
    return $files;
  }
  $files = returnFilesRecursive(".");
  $filesStrings = [];
  foreach($files as $file) {
    $fileString = strip_tags(file_get_contents($file));
    $fileString = preg_replace(["/^\-\-\-[\d\D]+\-\-\-/", "/\s+/"], ["", " "], $fileString);
    $filesStrings[$file] = html_entity_decode($fileString);
  }
  $json = json_encode($filesStrings, JSON_UNESCAPED_SLASHES, JSON_PRETTY_PRINT);
  file_put_contents("res/search.json", $json);

?>
