using System;
using Application.Apartments.DTOs;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Apartments.Commands;

public class EditApartment
{
    public class Command : IRequest<Result<Unit>>
    {
        public required EditApartmentDto ApartmentDto { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var apartment = await context.Apartments
                .Include(a => a.Devices) 
                .FirstOrDefaultAsync(x => x.Id == request.ApartmentDto.Id, cancellationToken);

            if (apartment == null) return Result<Unit>.Failure("Apartment not found", 404);
            mapper.Map(request.ApartmentDto, apartment);
            if (request.ApartmentDto.Devices != null)
            {
                // Usuwamy stare urządzenia z bazy (dla tego mieszkania)
                apartment.Devices.Clear();

                // Dodajemy te, które przyszły z formularza
                foreach (var deviceDto in request.ApartmentDto.Devices)
                {
                    apartment.Devices.Add(new Device
                    {
                        Name = deviceDto.Name,
                        Description = deviceDto.Description
                        // ID wygeneruje się nowe, ApartmentId ustawi się samo
                    });
                }
            }
            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Failed to edit the apartment", 404);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
