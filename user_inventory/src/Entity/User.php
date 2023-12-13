<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UserRepository;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource]
class User implements PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column(type: "json")]
    private array $roles = [];

    #[ORM\OneToOne(targetEntity: Inventory::class, mappedBy: "user", cascade: ['persist', 'remove'])]
    private ?Inventory $idInventory = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return (string) $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function getIdInventory(): ?Inventory
    {
        return $this->idInventory;
    }

    public function setIdInventory(Inventory $idInventory): self
    {
        // set the owning side of the relation if necessary
        if ($idInventory->getUser() !== $this) {
            $idInventory->setUser($this);
        }

        $this->idInventory = $idInventory;

        return $this;
    }

    // public function eraseCredentials(): void
    // {
    //     // Si vous avez besoin de supprimer des informations sensibles stockées sur l'utilisateur,
    //     // cette méthode peut être utilisée pour effacer ces données.
    //     // Cependant, cela n'est pas souvent nécessaire pour un utilisateur standard.
    //     // Vous pouvez laisser cette méthode vide pour la plupart des cas.
    // }

    // public function getUserIdentifier(): string
    // {
    //     // Cette méthode doit retourner l'identifiant unique de l'utilisateur.
    //     // Dans votre cas, retournez l'adresse e-mail de l'utilisateur.
    //     return (string) $this->email;
    // }

    // public function getSalt(): ?string
    // {
    //     // Retournez le sel utilisé pour le hachage du mot de passe, si nécessaire
    //     return null;
    // }

    // public function getUsername(): string
    // {
    //     // Retournez l'identifiant de l'utilisateur (par exemple, l'adresse e-mail)
    //     return (string) $this->email;
    // }
}
