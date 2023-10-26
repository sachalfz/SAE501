<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AlbumRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AlbumRepository::class)]
#[ApiResource]
class Album
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $artiste = null;

    #[ORM\Column]
    private ?float $year = null;

    #[ORM\Column(type: Types::ARRAY, nullable: true)]
    private ?array $certifications = null;

    #[ORM\Column(type: Types::ARRAY)]
    private array $beatmakers = [];

    #[ORM\Column(length: 255)]
    private ?string $label = null;

    #[ORM\Column]
    private ?float $nb_titres = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $enabled_at = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $deleted_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getArtiste(): ?string
    {
        return $this->artiste;
    }

    public function setArtiste(string $artiste): static
    {
        $this->artiste = $artiste;

        return $this;
    }

    public function getYear(): ?float
    {
        return $this->year;
    }

    public function setYear(float $year): static
    {
        $this->year = $year;

        return $this;
    }

    public function getCertifications(): ?array
    {
        return $this->certifications;
    }

    public function setCertifications(?array $certifications): static
    {
        $this->certifications = $certifications;

        return $this;
    }

    public function getBeatmakers(): array
    {
        return $this->beatmakers;
    }

    public function setBeatmakers(array $beatmakers): static
    {
        $this->beatmakers = $beatmakers;

        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function getNbTitres(): ?float
    {
        return $this->nb_titres;
    }

    public function setNbTitres(float $nb_titres): static
    {
        $this->nb_titres = $nb_titres;

        return $this;
    }

    public function getEnabledAt(): ?\DateTimeImmutable
    {
        return $this->enabled_at;
    }

    public function setEnabledAt(?\DateTimeImmutable $enabled_at): static
    {
        $this->enabled_at = $enabled_at;

        return $this;
    }

    public function getDeletedAt(): ?\DateTimeImmutable
    {
        return $this->deleted_at;
    }

    public function setDeletedAt(?\DateTimeImmutable $deleted_at): static
    {
        $this->deleted_at = $deleted_at;

        return $this;
    }
}
