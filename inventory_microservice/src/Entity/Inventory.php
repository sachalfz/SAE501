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

    #[ORM\Column(length: 255)]
    private ?string $profile_picture = null;

    #[ORM\Column]
    private ?int $streamz = null;

    #[ORM\Column(type: Types::ARRAY, nullable: true)]
    private ?array $items = null;

    #[ORM\Column]
    private ?int $games_won = null;

    #[ORM\Column]
    private ?int $games_played = null;

    #[ORM\Column]
    private ?int $id_user = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $username = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProfilePicture(): ?string
    {
        return $this->profile_picture;
    }

    public function setProfilePicture(string $profile_picture): static
    {
        $this->profile_picture = $profile_picture;

        return $this;
    }

    public function getStreamz(): ?int
    {
        return $this->streamz;
    }

    public function setStreamz(int $streamz): static
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

    public function getGamesWon(): ?int
    {
        return $this->games_won;
    }

    public function setGamesWon(int $games_won): static
    {
        $this->games_won = $games_won;

        return $this;
    }

    public function getGamesPlayed(): ?int
    {
        return $this->games_played;
    }

    public function setGamesPlayed(int $games_played): static
    {
        $this->games_played = $games_played;

        return $this;
    }

    public function getIdUser(): ?int
    {
        return $this->id_user;
    }

    public function setIdUser(int $id_user): static
    {
        $this->id_user = $id_user;

        return $this;
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
}
