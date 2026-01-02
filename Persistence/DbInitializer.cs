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
                new() { FirstName = "Adam", LastName = "Właścicielski", DisplayName = "Owner1", UserName = "owner1@test.com", Email = "owner1@test.com", PhoneNumber = "111222333" },
                new() { FirstName = "Beata", LastName = "Kamienicznik", DisplayName = "Owner2", UserName = "owner2@test.com", Email = "owner2@test.com", PhoneNumber = "222333444" },
                new() { FirstName = "Cezary", LastName = "Wynajmski", DisplayName = "Owner3", UserName = "owner3@test.com", Email = "owner3@test.com", PhoneNumber = "333444555" },
                new() { FirstName = "Danuta", LastName = "Mieszkaniowa", DisplayName = "Owner4", UserName = "owner4@test.com", Email = "owner4@test.com", PhoneNumber = "444555666" },
                new() { FirstName = "Edward", LastName = "Lokatowski", DisplayName = "Owner5", UserName = "owner5@test.com", Email = "owner5@test.com", PhoneNumber = "555666777" },
            };

            var occupants = new List<User>
            {
                new() { FirstName = "Bob", LastName = "Kowalski", DisplayName = "Bob", UserName = "bob@test.com", Email = "bob@test.com", PhoneNumber = "600100100" },
                new() { FirstName = "Tom", LastName = "Nowak", DisplayName = "Tom", UserName = "tom@test.com", Email = "tom@test.com", PhoneNumber = "600200200" },
                new() { FirstName = "Jane", LastName = "Zielińska", DisplayName = "Jane", UserName = "jane@test.com", Email = "jane@test.com", PhoneNumber = "600300300" },
                new() { FirstName = "Alice", LastName = "Wiśniewska", DisplayName = "Alice", UserName = "alice@test.com", Email = "alice@test.com", PhoneNumber = "600400400" },
                new() { FirstName = "Eve", LastName = "Wójcik", DisplayName = "Eve", UserName = "eve@test.com", Email = "eve@test.com", PhoneNumber = "600500500" },
                new() { FirstName = "Charlie", LastName = "Kowalczyk", DisplayName = "Charlie", UserName = "charlie@test.com", Email = "charlie@test.com", PhoneNumber = "600600600" },
                new() { FirstName = "Dave", LastName = "Kamiński", DisplayName = "Dave", UserName = "dave@test.com", Email = "dave@test.com", PhoneNumber = "600700700" },
                new() { FirstName = "Mallory", LastName = "Lewandowska", DisplayName = "Mallory", UserName = "mallory@test.com", Email = "mallory@test.com", PhoneNumber = "600800800" },
                new() { FirstName = "Oscar", LastName = "Dąbrowski", DisplayName = "Oscar", UserName = "oscar@test.com", Email = "oscar@test.com", PhoneNumber = "600900900" },
                new() { FirstName = "Peggy", LastName = "Kozłowska", DisplayName = "Peggy", UserName = "peggy@test.com", Email = "peggy@test.com", PhoneNumber = "600000000" }
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
