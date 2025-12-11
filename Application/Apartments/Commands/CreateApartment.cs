using System;
using Application.Apartments.DTOs;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Apartments.Commands;

public class CreateApartment
{
    public class Command : IRequest<Result<string>>
    {
        public required CreateApartmentDto ApartmentDto { get; set; }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var apartment = mapper.Map<Apartment>(request.ApartmentDto);

                context.Apartments.Add(apartment);

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                if (!result) return Result<string>.Failure("Failed to create the apartment", 404);

                return Result<string>.Success(apartment.Id);
            }
        }
    }
}
