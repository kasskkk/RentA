using System;
using Domain;
using MediatR;
using Persistence;

namespace Application.Apartments.Queries;

public class GetApartmentDetails
{
    public class Query : IRequest<Apartment>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, Apartment>
    {
        public async Task<Apartment> Handle(Query request, CancellationToken cancellationToken)
        {
            var apartment = await context.Apartments.FindAsync([request.Id], cancellationToken);

            if (apartment == null) throw new Exception("apartment not found");

            return apartment;
        }
    }
}
