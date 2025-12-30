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

public class GetApartmentList
{
    public class Query : IRequest<Result<PagedList<ApartmentDto, DateTime?>>>
    {
        public required ApartmentParams Params { get; set; }
    }
    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<PagedList<ApartmentDto, DateTime?>>>
    {
        public async Task<Result<PagedList<ApartmentDto, DateTime?>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = context.Apartments.AsQueryable();

            if (request.Params.Cursor.HasValue)
            {
                query = query.Where(x => x.CreatedAt > request.Params.Cursor.Value);
            }
            query = query.OrderBy(x => x.CreatedAt);

            if (!string.IsNullOrEmpty(request.Params.KeyWord))
            {
                var key = request.Params.KeyWord.ToLower();
                query = query.Where(x => x.Name.ToLower().Contains(key) || x.Description.ToLower().Contains(key));
            }

            if (!string.IsNullOrEmpty(request.Params.City))
            {
                query = query.Where(x => x.City == request.Params.City);
            }

            if (request.Params.PricePerMonth.HasValue)
            {
                query = query.Where(x => x.PricePerMonth <= request.Params.PricePerMonth.Value);
            }

            if (request.Params.Rooms.HasValue)
            {
                query = query.Where(x => x.Rooms == request.Params.Rooms.Value);
            }

            var apartments = await query
                .ProjectTo<ApartmentDto>(mapper.ConfigurationProvider)
                .Take(request.Params.PageSize + 1)
                .ToListAsync(cancellationToken);

            DateTime? nextCursor = null;
            if (apartments.Count > request.Params.PageSize)
            {
                nextCursor = apartments[request.Params.PageSize - 1].CreatedAt;
                apartments.RemoveAt(apartments.Count - 1);
            }

            return Result<PagedList<ApartmentDto, DateTime?>>.Success(
                new PagedList<ApartmentDto, DateTime?>
                {
                    Items = apartments,
                    NextCursor = nextCursor
                }
            );
        }
    }

}
