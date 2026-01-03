using Application.Bills.DTOs;
using Application.Core;
using Application.Bills.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Bills.Commands
{
    public class CreateBill
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required CreateBillDto BillDto { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.BillDto).SetValidator(new CreateBillValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly AppDbContext _context;

            public Handler(AppDbContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var bill = new Bill
                {

                    Id = Guid.NewGuid().ToString(),

                    Title = request.BillDto.Title,
                    Amount = request.BillDto.Amount,
                    DueDate = request.BillDto.DueDate,
                    Description = request.BillDto.Description ?? "",
                    ApartmentId = request.BillDto.ApartmentId.ToString()
                };

                _context.Bills.Add(bill);

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (!result) return Result<Unit>.Failure("Failed to create bill", 400);

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}