using System;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Apartments.Commands;

public class DeleteApartment
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
    }
    public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var apartment = await context.Apartments
                .FindAsync([request.Id], cancellationToken);

            if (apartment == null) return Result<Unit>.Failure("Apartment not found", 404);

            context.Remove(apartment);

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Failed to delete the apartment", 404);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
