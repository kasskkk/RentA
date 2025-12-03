using System;
using Application.Apartments.Commands;
using Application.Apartments.DTOs;
using FluentValidation;

namespace Application.Apartments.Validators;

public class CreateApartmentValidator : BaseApartmentValidator<CreateApartment.Command, CreateApartmentDto>
{
    public CreateApartmentValidator() : base(x => x.ApartmentDto)
    {

    }
}
