using System;
using Application.Apartments.DTOs;
using FluentValidation;

namespace Application.Apartments.Validators;

public class BaseApartmentValidator<T, TDto> : AbstractValidator<T> where TDto : BaseApartmentDto
{
    public BaseApartmentValidator(Func<T, TDto> selector)
    {
        RuleFor(x => selector(x).Name).NotEmpty().WithMessage("Name is required");
        RuleFor(x => selector(x).Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(1000).WithMessage("Description is required");
        RuleFor(x => selector(x).City).NotEmpty().WithMessage("City is required");
        // RuleFor(x => selector(x).Date).GreaterThan(DateTime.UtcNow).WithMessage("Date must be in the future");
        RuleFor(x => selector(x).Latitude)
            .InclusiveBetween(-90, 90).WithMessage("Latitude must be between -90 and 90")
            .NotEmpty().WithMessage("Latitude is required");
        RuleFor(x => selector(x).Longitude)
            .InclusiveBetween(-90, 90).WithMessage("Latitude must be between -90 and 90")
            .NotEmpty().WithMessage("Longitude is required");
    }
}
