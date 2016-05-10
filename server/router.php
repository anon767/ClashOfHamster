<?php
$router = new AltoRouter();
$router->setBasePath('/gameproject/server');

use Symfony\Component\Yaml\Yaml;

$yaml_file = 'config/routes/routes.yml';
$routes = Yaml::parse(file_get_contents($yaml_file));
foreach ($routes as $route_name => $params) {
  $router->map($params[0], $params[1], $params[2] . '#' . $params[3], $route_name);
}

$match = $router->match();

