<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UserRepository;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
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
        return $this->email;
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

    public function __toString(): string
    {
        return (string) $this->getId(); // Ou tout autre champ que vous voulez afficher
    }
}
