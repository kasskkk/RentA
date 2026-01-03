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

            var incomingDevices = request.ApartmentDto.Devices;

            var incomingIds = incomingDevices.Select(d => d.Id).Where(id => !string.IsNullOrEmpty(id)).ToList();
            var devicesToRemove = apartment.Devices.Where(d => !incomingIds.Contains(d.Id)).ToList();

            foreach (var device in devicesToRemove)
            {
                context.Remove(device);
                apartment.Devices.Remove(device);
            }

            foreach (var deviceDto in incomingDevices)
            {
                if (string.IsNullOrEmpty(deviceDto.Id))
                {
                    var newDevice = mapper.Map<Device>(deviceDto);
                    apartment.Devices.Add(newDevice);
                }
                else
                {
                    var existingDevice = apartment.Devices.FirstOrDefault(d => d.Id == deviceDto.Id);
                    if (existingDevice != null)
                    {
                        mapper.Map(deviceDto, existingDevice);
                    }
                }
            }

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return Result<Unit>.Success(Unit.Value);
        }
    }
}