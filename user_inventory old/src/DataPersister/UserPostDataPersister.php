<?php

namespace App\DataPersister;

use ApiPlatform\Core\DataPersister\DataPersisterInterface;
use App\Entity\User;

final class UserPostDataPersister implements DataPersisterInterface
{
    public function supports($data): bool
    {
        return $data instanceof User;
    }
    
    public function persist($data)
    {
      // call your persistence layer to save $data
      return $data;
    }
    
    public function remove($data)
    {
      // call your persistence layer to delete $data
    }
}