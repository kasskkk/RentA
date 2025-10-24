using System;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Apartments.Queries;

public class GetApartmentList
{
    public class Query : IRequest<List<Apartment>> { }
    public class Handler(AppDbContext context) : IRequestHandler<Query, List<Apartment>>
    {
        public async Task<List<Apartment>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await context.Apartments.ToListAsync(cancellationToken);
        }
    }

}
