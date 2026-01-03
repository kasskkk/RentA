using Application.Core;
using Application.Faults.Dtos;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Faults.Commands;

public class CreateFault
{
    public class Command : IRequest<Result<Unit>>
    {
        public required CreateFaultDto FaultDto { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.FaultDto.Title).NotEmpty();
            RuleFor(x => x.FaultDto.Description).NotEmpty();
            RuleFor(x => x.FaultDto.DeviceId).NotEmpty();
        }
    }

    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var device = await context.Devices.FindAsync([request.FaultDto.DeviceId], cancellationToken);

            // POPRAWKA: Dodano kod błędu 404
            if (device == null) return Result<Unit>.Failure("Urządzenie nie istnieje", 404);

            var fault = mapper.Map<Fault>(request.FaultDto);

            context.Faults.Add(fault);

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            // POPRAWKA: Dodano kod błędu 400
            if (!result) return Result<Unit>.Failure("Nie udało się utworzyć zgłoszenia usterki", 400);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}