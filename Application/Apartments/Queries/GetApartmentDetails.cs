using System;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Apartments.Queries;

public class GetApartmentDetails
{
    public class Query : IRequest<Result<Apartment>>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, Result<Apartment>>
    {
        public async Task<Result<Apartment>> Handle(Query request, CancellationToken cancellationToken)
        {
            var apartment = await context.Apartments.FindAsync([request.Id], cancellationToken);

            if (apartment == null) return Result<Apartment>.Failure("Apartment not found", 404);

            return Result<Apartment>.Success(apartment);
        }
    }
}
