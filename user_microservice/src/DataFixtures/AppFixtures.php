<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $manager->getConnection()->beginTransaction();

        try {
            for ($i = 0; $i < 20; $i++) {
                $user = new User;
                $user->setEmail('user' . $i . '@gmail.com');
                $user->setPassword('originalPwd' . $i);
                $user->setPermissions('permissionsTo' . $i);
                $manager->persist($user);
            }
            // Explicitly set a savepoint
            $manager->getConnection()->createSavepoint('my_savepoint');

            // More data insertion code

            // If everything is successful, release the savepoint
            $manager->getConnection()->releaseSavepoint('my_savepoint');

            $manager->getConnection()->commit();
        } catch (\Exception $e) {
            // In case of an error, roll back to the savepoint
            $manager->getConnection()->rollbackSavepoint('my_savepoint');
        }
        $manager->flush();
    }

}

