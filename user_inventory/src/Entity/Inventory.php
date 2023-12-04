<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\InventoryRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InventoryRepository::class)]
#[ApiResource]
class Inventory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $username = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $profilepicture = null;

    #[ORM\Column(nullable: true)]
    private ?int $streamz = null;

    #[ORM\Column(type: Types::ARRAY, nullable: true)]
    private ?array $items = null;

    #[ORM\Column(nullable: true)]
    private ?int $gameswon = null;

    #[ORM\Column(nullable: true)]
    private ?int $gamesplayed = null;

    #[ORM\OneToOne(targetEntity: User::class, inversedBy: "idInventory", cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(?string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getProfilepicture(): ?string
    {
        return $this->profilepicture;
    }

    public function setProfilepicture(?string $profilepicture): static
    {
        $this->profilepicture = $profilepicture;

        return $this;
    }

    public function getStreamz(): ?int
    {
        return $this->streamz;
    }

    public function setStreamz(?int $streamz): static
    {
        $this->streamz = $streamz;

        return $this;
    }

    public function getItems(): ?array
    {
        return $this->items;
    }

    public function setItems(?array $items): static
    {
        $this->items = $items;

        return $this;
    }

    public function getGameswon(): ?int
    {
        return $this->gameswon;
    }

    public function setGameswon(?int $gameswon): static
    {
        $this->gameswon = $gameswon;

        return $this;
    }

    public function getGamesplayed(): ?int
    {
        return $this->gamesplayed;
    }

    public function setGamesplayed(?int $gamesplayed): static
    {
        $this->gamesplayed = $gamesplayed;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
