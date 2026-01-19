using Application.Bills.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Enum;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Bills.Queries;

public class GetUserBills
{
    public class Query : IRequest<Result<List<BillDto>>>
    {
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor)
        : IRequestHandler<Query, Result<List<BillDto>>>
    {
        public async Task<Result<List<BillDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var userId = userAccessor.GetUserId();


            var bills = await context.Bills
                .Where(b => b.Apartment.ApartmentMembers.Any(am => am.UserId == userId &&
                    am.MemberStatus == MemberStatus.Accepted))
                .OrderByDescending(x => x.DueDate)
                .ProjectTo<BillDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);


            return Result<List<BillDto>>.Success(bills);
        }
    }
}