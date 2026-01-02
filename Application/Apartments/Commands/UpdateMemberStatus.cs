using System;
using Application.Core;
using Domain.Enum;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Apartments.Commands;

public class UpdateMemberStatus
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
        public required string UserId { get; set; }
        public required MemberStatus MemberStatus { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var apartment = await context.Apartments
                .Include(x => x.ApartmentMembers)
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (apartment == null) return Result<Unit>.Failure("Apartment not found", 404);

            var member = apartment.ApartmentMembers
                .FirstOrDefault(x => x.UserId == request.UserId);

            if (member == null) return Result<Unit>.Failure("This user is not a member", 404);

            if (member.MemberStatus == request.MemberStatus)
                return Result<Unit>.Success(Unit.Value);

            member.MemberStatus = request.MemberStatus;

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result
            ? Result<Unit>.Success(Unit.Value)
            : Result<Unit>.Failure("Problem changing the status of member", 400);
        }
    }
}
