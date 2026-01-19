using System;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Apartments.Commands;

public class AddApartmentPhoto
{
    public class Command : IRequest<Result<Photo>>
    {
        public required IFormFile File { get; set; }
        public required string ApartmentId { get; set; }
    }

    public class Handler(AppDbContext context, IPhotoService photoService, IUserAccessor userAccessor)
        : IRequestHandler<Command, Result<Photo>>
    {
        public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserAsync();
            var apartment = await context.Apartments
                .Include(a => a.Photos)
                .Include(a => a.ApartmentMembers)
                .FirstOrDefaultAsync(x => x.Id == request.ApartmentId);

            if (apartment == null) return Result<Photo>.Failure("Mieszkanie nie istnieje", 404);

            var isOwner = apartment.ApartmentMembers.Any(m => m.UserId == user.Id && m.IsOwner);
            if (!isOwner) return Result<Photo>.Failure("Tylko właściciel może dodawać zdjęcia", 403);

            if (apartment.Photos.Count >= 20)
                return Result<Photo>.Failure("Osiągnięto limit 20 zdjęć dla tego mieszkania", 400);

            var uploadResult = await photoService.UploadPhoto(request.File);
            if (uploadResult == null) return Result<Photo>.Failure("Błąd uploadu", 400);

            var photo = new Photo
            {
                Url = uploadResult.Url,
                PublicId = uploadResult.PublicId,
                UserId = user.Id,
                ApartmentId = apartment.Id 
            };

            context.Photos.Add(photo);
            var result = await context.SaveChangesAsync() > 0;

            return result ? Result<Photo>.Success(photo) : Result<Photo>.Failure("Błąd zapisu w DB", 400);
        }
    }
}
