<?php

/**
 * 
 * @param type $id
 */
function createUser($em) {
  $user = new \User();
  $user->setName("Tom");
  $user->setHp(100);
  $user->setY(5);
  $user->setX(5);
  $em->persist($user);
  $em->flush();
}

function getUser($em, $id) {
  $user = $em->find("User", $id);
  if ($user) {
    echo json_encode(array("x" => $user->getX(), "y" => $user->getY()));
  }
}

function updateUser($em, $id, $direction) {
  $user = $em->find("User", $id);
  if ($user) {
    $user->setX($user->getX() + 1);
    $em->persist($user);
    $em->flush();
  }
}
