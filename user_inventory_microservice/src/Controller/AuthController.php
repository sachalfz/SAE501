<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\AuthenticationService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\User\UserInterface;

class AuthController extends AbstractController
{
    private $authenticationService;

    public function __construct(AuthenticationService $authenticationService)
    {
        $this->authenticationService = $authenticationService;
    }

    /**
 * @Route("/login", name="login", methods={"POST"})
 */
public function login(Request $request): Response
{
    $data = json_decode($request->getContent(), true);

    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;

    if (!is_string($email) || !$password) {
        return $this->json(['message' => 'Missing email or password'], Response::HTTP_BAD_REQUEST);
    }

    $authenticatedUser = $this->authenticationService->authenticateUser($email, $password);

    if (!$authenticatedUser) {
        return $this->json(['message' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
    }

    return $this->json(['message' => 'Login successful', 'user' => $authenticatedUser], Response::HTTP_OK);
}
}
