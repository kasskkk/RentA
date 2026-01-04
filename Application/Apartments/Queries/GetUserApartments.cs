using Application.Apartments.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain.Enum;

namespace Application.Apartments.Queries;

public class GetUserApartments
{
    public class Query : IRequest<Result<List<ApartmentDto>>>
    {
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor)
        : IRequestHandler<Query, Result<List<ApartmentDto>>>
    {
        public async Task<Result<List<ApartmentDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var userId = userAccessor.GetUserId();

            var apartments = await context.Apartments
                .Where(x => x.ApartmentMembers.Any(m => m.UserId == userId &&
                    m.MemberStatus == MemberStatus.Accepted))
                .ProjectTo<ApartmentDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            return Result<List<ApartmentDto>>.Success(apartments);
        }
    }
}