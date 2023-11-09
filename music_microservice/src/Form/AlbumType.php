<?php

namespace App\Form;

use App\Entity\Album;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AlbumType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')
            ->add('artist')
            ->add('date')
            ->add('label')
            ->add('beatmakers', CollectionType::class, [
                'entry_type' => TextType::class, // Assuming beatmakers are represented as strings
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false, // This is important to properly handle the collection
            ])
            ->add('cover')
            ->add('certification')
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Album::class,
        ]);
    }
}
