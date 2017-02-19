<?php

/**
 * Created by PhpStorm.
 * User: Tom
 * Date: 19.02.2017
 * Time: 14:59
 */
class gameroom
{
    private $id;
    private $map;
    private $clients = [];

    public function __construct($id, $map)
    {
        $this->id = $id;
        $this->map = $map;
    }

    public function addClient($client, $id)
    {
        $this->clients[$id] = $client;
    }

    public function getClients()
    {
        return $this->clients;
    }

    public function getMap()
    {
        return $this->map;
    }

    public function removeClient($id)
    {
        $this->clients[$id] = null;
    }

}