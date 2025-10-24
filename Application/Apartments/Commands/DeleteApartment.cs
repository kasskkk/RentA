using System;
using MediatR;
using Persistence;

namespace Application.Apartments.Commands;

public class DeleteApartment
{
    public class Command : IRequest
    {
        public required string Id { get; set; }
    }
    public class Handler(AppDbContext context) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var apartment = await context.Apartments
                .FindAsync([request.Id], cancellationToken)
                ?? throw new Exception("cannot find apartment");

            context.Remove(apartment);

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
