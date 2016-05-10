<?php

use Doctrine\ORM\Tools\Setup,
    Doctrine\ORM\EntityManager;

require_once "vendor/autoload.php";
foreach (glob(__DIR__ . "/config/dbmaps/src/*.php") as $filename) {
  include_once $filename;
}

require_once "router.php";


// Create a simple "default" Doctrine ORM configuration for Annotations
$isDevMode = true;
$config = Setup::createYAMLMetadataConfiguration(array(__DIR__ . "/config/dbmaps/yaml"), $isDevMode);
// or if you prefer yaml or XML
//$config = Setup::createXMLMetadataConfiguration(array(__DIR__."/config/xml"), $isDevMode);
//$config = Setup::createYAMLMetadataConfiguration(array(__DIR__."/config/yaml"), $isDevMode);
// database configuration parameters
$conn = array(
  'driver' => "mysqli",
  'user' => "root",
  'password' => "test123",
  'dbname' => "gameproject",
  'host' => "localhost",
  'charset' => "utf-8"
);

// obtaining the entity manager
$entityManager = EntityManager::create($conn, $config);
// $entityManager is an instance of EntityManager
// Add UTF8 handler to EntityManager
$entityManager->getEventManager()->addEventSubscriber(
    new \Doctrine\DBAL\Event\Listeners\MysqlSessionInit('utf8', 'utf8_unicode_ci')
);



