using System;
using Application.Apartments.Commands;
using Application.Apartments.DTOs;
using FluentValidation;

namespace Application.Apartments.Validators;

public class EditApartmentValidator : BaseApartmentValidator<EditApartment.Command, EditApartmentDto>
{
    public EditApartmentValidator() : base(x => x.ApartmentDto)
    {
        RuleFor(x => x.ApartmentDto.Id)
            .NotEmpty().WithMessage("Id is recuired");
    }
}
