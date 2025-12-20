using System;
using Application.Apartments.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Apartments.Queries;

public class GetApartmentList
{
    public class Query : IRequest<List<ApartmentDto>> { }
    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, List<ApartmentDto>>
    {
        public async Task<List<ApartmentDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await context.Apartments
                .ProjectTo<ApartmentDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }

}
