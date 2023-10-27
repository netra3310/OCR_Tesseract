<?php
print_r($_POST);
file_put_contents("demo.txt", $_POST["text"]);