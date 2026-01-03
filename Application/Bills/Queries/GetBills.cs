using Application.Core;
using Application.Bills.DTOs;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Bills.Queries;

public class GetBills
{
    public class Query : IRequest<Result<List<BillDto>>>
    {
        public string ApartmentId { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Query, Result<List<BillDto>>>
    {
        public async Task<Result<List<BillDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var userId = userAccessor.GetUserId();

            var isMember = await context.ApartmentMembers
                .AnyAsync(x => x.ApartmentId == request.ApartmentId && x.UserId == userId, cancellationToken);

            var bills = await context.Bills
                .Where(x => x.ApartmentId == request.ApartmentId)
                .OrderByDescending(x => x.DueDate) 
                .ProjectTo<BillDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            return Result<List<BillDto>>.Success(bills);
        }
    }
}