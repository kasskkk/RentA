using Application.Core;
using Application.Bills.DTOs;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;

namespace Application.Bills.Commands;

public class CreateBill
{
    public class Command : IRequest<Result<Unit>>
    {
        public CreateBillDto BillDto { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.BillDto.ApartmentId).NotEmpty();
            RuleFor(x => x.BillDto.Title).NotEmpty();
            RuleFor(x => x.BillDto.Amount).GreaterThan(0).WithMessage("Kwota musi być większa od 0");
            RuleFor(x => x.BillDto.DueDate).NotEmpty();
        }
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var userId = userAccessor.GetUserId();

            
            var apartmentMember = await context.ApartmentMembers
                .FirstOrDefaultAsync(x => 
                    x.ApartmentId == request.BillDto.ApartmentId && 
                    x.UserId == userId, cancellationToken);

            if (apartmentMember == null) 
                return Result<Unit>.Failure("Nie znaleziono apartamentu lub brak dostępu", 404);

            if (!apartmentMember.IsOwner)
                return Result<Unit>.Failure("Tylko właściciel może dodawać rachunki", 403);

            
            var bill = mapper.Map<Bill>(request.BillDto);

            context.Bills.Add(bill);

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Nie udało się dodać rachunku", 400);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}