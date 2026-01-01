using Application.Core;
using MediatR;
using Persistence;

namespace Application.Faults.Commands;

public class ResolveFault
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var fault = await context.Faults.FindAsync([request.Id], cancellationToken);

            if (fault == null) return Result<Unit>.Failure("Usterka nie znaleziona", 404);

            fault.IsResolved = true;
            fault.DateResolved = DateTime.UtcNow;

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Problem z zapisem zmian", 400);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}