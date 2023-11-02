<?php
print_r($_POST);
file_put_contents("demo.csv", $_POST["text"]);