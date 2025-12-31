using System;
using Application.Apartments.DTOs;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Apartments.Commands;

public class EditApartment
{
    public class Command : IRequest<Result<Unit>>
    {
        public required EditApartmentDto ApartmentDto { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var apartment = await context.Apartments
                .FindAsync([request.ApartmentDto.Id], cancellationToken);

            if (apartment == null) return Result<Unit>.Failure("Apartment not found", 404);

            mapper.Map(request.ApartmentDto, apartment);

            await context.SaveChangesAsync(cancellationToken);

            // if (!result) return Result<Unit>.Failure("Failed to edit the apartment", 404);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
