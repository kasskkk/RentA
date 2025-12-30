using System;
using Application.Apartments.DTOs;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Apartments.Queries;

public class GetApartmentDetails
{
    public class Query : IRequest<Result<ApartmentDto>>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<ApartmentDto>>
    {
        public async Task<Result<ApartmentDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var apartment = await context.Apartments
                .ProjectTo<ApartmentDto>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => request.Id == x.Id, cancellationToken);

            if (apartment == null) return Result<ApartmentDto>.Failure("Apartment not found", 404);

            return Result<ApartmentDto>.Success(apartment);
        }
    }
}
