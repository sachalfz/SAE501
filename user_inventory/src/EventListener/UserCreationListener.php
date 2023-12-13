<?php

namespace App\EventListener;

use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use App\Entity\User;
use App\Entity\Inventory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;

class UserCreationListener implements EventSubscriber
{
    private UserPasswordHasherInterface $passwordHasher;
    private EntityManagerInterface $entityManager; // Déclarez la propriété $entityManager

    public function __construct(UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager)
    {
        $this->passwordHasher = $passwordHasher;
        $this->entityManager = $entityManager; // Initialisez la propriété $entityManager
    }

    public function getSubscribedEvents()
    {
        return [
            Events::prePersist,
        ];
    }

    public function prePersist(LifecycleEventArgs $args)
    {
        $entity = $args->getObject();

        if ($entity instanceof User && $entity->getEmail() && $entity->getPassword()) {
            if ($this->isEmailTaken($entity->getEmail())) {
                throw new BadRequestHttpException('Cet email est déjà utilisé. Veuillez en choisir un autre.');
            }

            $this->handleUser($entity);
        }
        // Ajoutez d'autres vérifications pour d'autres entités si nécessaire
    }

    private function isEmailTaken(string $email): bool
    {
        $userRepository = $this->entityManager->getRepository(User::class);
        $existingUser = $userRepository->findOneBy(['email' => $email]);

        return $existingUser !== null;
    }

    private function handleUser(User $user)
    {
        // Récupérer le mot de passe non-hashé
        $plainPassword = $user->getPassword();

        // Hasher le mot de passe
        $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);

        // Si l'inventaire n'est pas initialisé
        if ($user->getIdInventory() === null) {
            // Création d'un nouvel inventaire pour l'utilisateur
            $inventory = new Inventory();
            // Initialisez les propriétés de l'inventaire si nécessaire

            // Associer l'inventaire à l'utilisateur
            $user->setIdInventory($inventory);

            // Initialiser les propriétés gamesplayed et gameswon à 0
            $inventory->setGamesplayed(0);
            $inventory->setGameswon(0);
            $inventory->setStreamz(0);
            $inventory->setItems([]);
            $inventory->setProfilepicture("https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png");
            $inventory->setUsername("Guest");
        }
    }
}
