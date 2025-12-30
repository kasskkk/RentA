using System;
using Application.Apartments.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Domain.Enum;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Apartments.Commands;

public class CreateApartment
{
    public class Command : IRequest<Result<string>>
    {
        public required CreateApartmentDto ApartmentDto { get; set; }

        public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await userAccessor.GetUserAsync();

                var apartment = mapper.Map<Apartment>(request.ApartmentDto);

                
                foreach (var device in apartment.Devices)
                {
                    device.Id = Guid.NewGuid().ToString();
                }

                
                if (string.IsNullOrEmpty(apartment.Id))
                {
                    apartment.Id = Guid.NewGuid().ToString();
                }

                context.Apartments.Add(apartment);

                var member = new ApartmentMember
                {
                    ApartmentId = apartment.Id,
                    UserId = user.Id,
                    IsOwner = true,
                    MemberStatus = MemberStatus.Accepted
                };

                apartment.ApartmentMembers.Add(member);

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                if (!result) return Result<string>.Failure("Failed to create the apartment", 404);

                return Result<string>.Success(apartment.Id);
            }
        }
    }
}