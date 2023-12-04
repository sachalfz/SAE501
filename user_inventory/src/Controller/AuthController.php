<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;

class AuthController extends AbstractController
{
    /**
     * @Route("/api/login", name="api_login", methods={"POST"})
     */
    public function login(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): JsonResponse
    {
        $requestData = json_decode($request->getContent(), true);

        // Récupération des données d'authentification depuis la requête
        $email = $requestData['email'] ?? null;
        $password = $requestData['password'] ?? null;

        if (!$email || !$password) {
            return new JsonResponse(['message' => 'Veuillez fournir un email et un mot de passe'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Récupération de l'utilisateur depuis la base de données
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Vérification du mot de passe
        if ($passwordHasher->isPasswordValid($user, $password)) {
            // Le mot de passe est correct, authentification réussie
            // Gérer l'authentification ou renvoyer les données de l'utilisateur
            return new JsonResponse(['user' => $user]);
        } else {
            // Le mot de passe ne correspond pas, retourner une réponse d'erreur
            return new JsonResponse(['message' => 'Mot de passe incorrect'], JsonResponse::HTTP_UNAUTHORIZED);
        }
    }
}
