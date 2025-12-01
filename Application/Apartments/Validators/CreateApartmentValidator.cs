using System;
using Application.Apartments.Commands;
using FluentValidation;

namespace Application.Apartments.Validators;

public class CreateApartmentValidator : AbstractValidator<CreateApartment.Command>
{
    public CreateApartmentValidator()
    {
        RuleFor(x => x.ApartmentDto.Name).NotEmpty().WithMessage("Name is required");
        RuleFor(x => x.ApartmentDto.Description).NotEmpty().WithMessage("Description is required");
        RuleFor(x => x.ApartmentDto.City).NotEmpty().WithMessage("City is required");
    }
}
