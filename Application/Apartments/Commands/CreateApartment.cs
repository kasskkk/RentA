using System;
using Domain;
using MediatR;
using Persistence;

namespace Application.Apartments.Commands;

public class CreateApartment
{
    public class Command : IRequest<string>
    {
        public required Apartment Apartment { get; set; }
        public class Handler(AppDbContext context) : IRequestHandler<Command, string>
        {
            public async Task<string> Handle(Command request, CancellationToken cancellationToken)
            {
                context.Apartments.Add(request.Apartment);

                await context.SaveChangesAsync(cancellationToken);
                return request.Apartment.Id;
            }
        }
    }
}
