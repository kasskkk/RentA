using System;
using Domain;
using Domain.Enum;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class DbInitializer
{
    public static async Task SeedData(AppDbContext context, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        #region ROLES
        if (!await roleManager.RoleExistsAsync("Owner"))
            await roleManager.CreateAsync(new IdentityRole("Owner"));

        if (!await roleManager.RoleExistsAsync("Occupant"))
            await roleManager.CreateAsync(new IdentityRole("Occupant"));
        #endregion

        #region USERS
        if (!userManager.Users.Any())
        {
            var owners = new List<User>
            {
                new() { DisplayName = "Owner1", UserName = "owner1@test.com", Email = "owner1@test.com" },
                new() { DisplayName = "Owner2", UserName = "owner2@test.com", Email = "owner2@test.com" },
                new() { DisplayName = "Owner3", UserName = "owner3@test.com", Email = "owner3@test.com" },
                new() { DisplayName = "Owner4", UserName = "owner4@test.com", Email = "owner4@test.com" },
                new() { DisplayName = "Owner5", UserName = "owner5@test.com", Email = "owner5@test.com" },
            };

            var occupants = new List<User>
            {
                new() { DisplayName = "Bob", UserName = "bob@test.com", Email = "bob@test.com" },
                new() { DisplayName = "Tom", UserName = "tom@test.com", Email = "tom@test.com" },
                new() { DisplayName = "Jane", UserName = "jane@test.com", Email = "jane@test.com" },
                new() { DisplayName = "Alice", UserName = "alice@test.com", Email = "alice@test.com" },
                new() { DisplayName = "Eve", UserName = "eve@test.com", Email = "eve@test.com" },
                new() { DisplayName = "Charlie", UserName = "charlie@test.com", Email = "charlie@test.com" },
                new() { DisplayName = "Dave", UserName = "dave@test.com", Email = "dave@test.com" },
                new() { DisplayName = "Mallory", UserName = "mallory@test.com", Email = "mallory@test.com" },
                new() { DisplayName = "Oscar", UserName = "oscar@test.com", Email = "oscar@test.com" },
                new() { DisplayName = "Peggy", UserName = "peggy@test.com", Email = "peggy@test.com" }
            };

            foreach (var owner in owners)
            {
                await userManager.CreateAsync(owner, "Pa$$w0rd");
                await userManager.AddToRoleAsync(owner, "Owner");
            }

            foreach (var occupant in occupants)
            {
                await userManager.CreateAsync(occupant, "Pa$$w0rd");
                await userManager.AddToRoleAsync(occupant, "Occupant");
            }
        }
        #endregion

        #region APARTMENTS
        if (!context.Apartments.Any())
        {
            var usersList = await userManager.Users.ToListAsync();
            var ownersList = usersList.Where(u => u.DisplayName!.StartsWith("Owner")).ToList();
            var occupantsList = usersList.Where(u => !u.DisplayName!.StartsWith("Owner")).ToList();

            var apartments = new List<Apartment>();
            var rnd = new Random();

            foreach (var owner in ownersList)
            {
                var fullApartment = new Apartment
                {
                    CreatedAt = DateTime.Now,
                    Name = $"Full Apartment {owner.DisplayName}",
                    Description = "Pełne mieszkanie z członkami",
                    PricePerMonth = rnd.Next(2000, 5000),
                    IsAvailable = true,
                    Rooms = rnd.Next(1, 4),
                    Area = rnd.Next(30, 80),
                    MaxOccupants = 4,
                    City = "City" + rnd.Next(1, 6),
                    Street = "Street" + rnd.Next(1, 20),
                    BuildingNumber = rnd.Next(1, 50).ToString(),
                    ApartmentNumber = rnd.Next(1, 20).ToString(),
                    Latitude = 50 + rnd.NextDouble() * 5,
                    Longitude = 19 + rnd.NextDouble() * 5
                };

                fullApartment.ApartmentMembers.Add(new ApartmentMember
                {
                    UserId = owner.Id,
                    ApartmentId = fullApartment.Id,
                    IsOwner = true,
                    MemberStatus = MemberStatus.Accepted
                });

                var members = occupantsList.OrderBy(_ => rnd.Next()).Take(fullApartment.MaxOccupants - 1).ToList();
                foreach (var member in members)
                {
                    fullApartment.ApartmentMembers.Add(new ApartmentMember
                    {
                        UserId = member.Id,
                        ApartmentId = fullApartment.Id,
                        IsOwner = false,
                        MemberStatus = MemberStatus.Accepted
                    });
                }

                apartments.Add(fullApartment);

                var pendingApartment = new Apartment
                {
                    CreatedAt = DateTime.Now,
                    Name = $"Pending Apartment {owner.DisplayName}",
                    Description = "Mieszkanie oczekujące na zatwierdzenie",
                    PricePerMonth = rnd.Next(2000, 5000),
                    IsAvailable = true,
                    Rooms = rnd.Next(1, 4),
                    Area = rnd.Next(30, 80),
                    MaxOccupants = 4,
                    City = "City" + rnd.Next(1, 6),
                    Street = "Street" + rnd.Next(1, 20),
                    BuildingNumber = rnd.Next(1, 50).ToString(),
                    ApartmentNumber = rnd.Next(1, 20).ToString(),
                    Latitude = 50 + rnd.NextDouble() * 5,
                    Longitude = 19 + rnd.NextDouble() * 5
                };

                pendingApartment.ApartmentMembers.Add(new ApartmentMember
                {
                    UserId = owner.Id,
                    ApartmentId = pendingApartment.Id,
                    IsOwner = true,
                    MemberStatus = MemberStatus.Accepted
                });

                if (occupantsList.Count > 0)
                {
                    var applicant = occupantsList[rnd.Next(occupantsList.Count)];
                    pendingApartment.ApartmentMembers.Add(new ApartmentMember
                    {
                        UserId = applicant.Id,
                        ApartmentId = pendingApartment.Id,
                        IsOwner = false,
                        MemberStatus = MemberStatus.Pending
                    });
                }

                apartments.Add(pendingApartment);
            }

            context.Apartments.AddRange(apartments);
        }
        ;
        #endregion

        await context.SaveChangesAsync();
    }
}
