using System;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Apartments.Commands;

public class EditApartment
{
    public class Command : IRequest
    {
        public required Apartment Apartment { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var apartment = await context.Apartments
                .FindAsync([request.Apartment.Id], cancellationToken)
                ?? throw new Exception("cannot find apartment");

            mapper.Map(request.Apartment, apartment);

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
