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
    private const int MaxPageSize = 50;
    public class Query : IRequest<Result<PagedList<ApartmentDto, DateTime?>>>
    {
        public DateTime? Cursor { get; set; }
        private int _pageSize = 6;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

    }
    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<PagedList<ApartmentDto, DateTime?>>>
    {
        public async Task<Result<PagedList<ApartmentDto, DateTime?>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = context.Apartments
                .OrderBy(x => x.CreatedAt)
                .AsQueryable();

            if (request.Cursor.HasValue)
            {
                query = query.Where(x => x.CreatedAt >= request.Cursor.Value);
            }

            var apartments = await query
                .Take(request.PageSize + 1)
                .ProjectTo<ApartmentDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            DateTime? nextCursor = null;
            if (apartments.Count > request.PageSize)
            {
                nextCursor = apartments.Last().CreatedAt;
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
