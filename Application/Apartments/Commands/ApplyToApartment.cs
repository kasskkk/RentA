using System;
using Application.Core;
using Application.Interfaces;
using Domain;
using Domain.Enum;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Apartments.Commands;

public class ApplyToApartment
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
    }

    public class Handler(IUserAccessor userAccessor, AppDbContext context) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var apartment = await context.Apartments
            .Include(x => x.ApartmentMembers)
            .ThenInclude(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (apartment == null) return Result<Unit>.Failure("Apartment not found", 404);

            var user = await userAccessor.GetUserAsync();

            var isOwner = apartment.ApartmentMembers.Any(x => x.IsOwner && x.UserId == user.Id);

            if (isOwner) return Result<Unit>.Failure("Owner cannot apply to own apartment", 400);

            var membership = apartment.ApartmentMembers.FirstOrDefault(x => x.UserId == user.Id);

            if (membership != null) return Result<Unit>.Failure("You already applied or are a member", 400);

            apartment.ApartmentMembers.Add(new ApartmentMember
            {
                UserId = user.Id,
                ApartmentId = apartment.Id,
                IsOwner = false,
                MemberStatus = MemberStatus.Pending
            });

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result
            ? Result<Unit>.Success(Unit.Value)
            : Result<Unit>.Failure("Problem updating the db", 400);
        }
    }
}
