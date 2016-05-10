<?php

use Doctrine\ORM\Tools\Console\ConsoleRunner;
include 'bootstrap.php';

return ConsoleRunner::createHelperSet($entityManager);