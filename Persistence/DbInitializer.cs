using System;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class DbInitializer
{
    public static async Task SeedData(AppDbContext context, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        if (!await roleManager.RoleExistsAsync("Owner"))
            await roleManager.CreateAsync(new IdentityRole("Owner"));

        if (!await roleManager.RoleExistsAsync("Occupant"))
            await roleManager.CreateAsync(new IdentityRole("Occupant"));

        if (!userManager.Users.Any())
        {
            var users = new List<User>
            {
                new() {DisplayName = "Bob", UserName = "bob@test.com", Email = "bob@test.com"},
                new() {DisplayName = "Tom", UserName = "tom@test.com", Email = "tom@test.com"},
                new() {DisplayName = "Jane", UserName = "jane@test.com", Email = "jane@test.com"},
            };

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Occupant");
            }

            var owners = new List<User>
            {
                new() {DisplayName = "Owner", UserName = "owner@test.com", Email = "owner@test.com"},
            };

            foreach (var owner in owners)
            {
                await userManager.CreateAsync(owner, "Pa$$w0rd");
                await userManager.AddToRoleAsync(owner, "Owner");
            }
        }

        if (context.Apartments.Any()) return;

        var apartments = new List<Apartment>
        {
            new() {
                Date = DateTime.Now,
                Name = "Długa 10/5, Warszawa",
                Description = "Przytulne mieszkanie w centrum",
                PricePerMonth = 3500m,
                IsAvailable = true,
                Rooms = 3,
                Area = 65.5,
                MaxOccupants = 4,
                City = "Warszawa",
                Street = "Długa",
                BuildingNumber = "10",
                ApartmentNumber = "5",
                Latitude = 52.2297,
                Longitude = 21.0122
            },
            new() {
                Date = DateTime.Now,
                Name = "Kwiatowa 7, Kraków",
                Description = "Słoneczne studio blisko rynku",
                PricePerMonth = 2500m,
                IsAvailable = true,
                Rooms = 1,
                Area = 35.0,
                MaxOccupants = 2,
                City = "Kraków",
                Street = "Kwiatowa",
                BuildingNumber = "7",
                ApartmentNumber = null,
                Latitude = 50.0614,
                Longitude = 19.9383
            },
            new() {
                Date = DateTime.Now,
                Name = "Leśna 15/3, Wrocław",
                Description = "Nowoczesne 2-pokojowe mieszkanie",
                PricePerMonth = 2800m,
                IsAvailable = false,
                Rooms = 2,
                Area = 50.0,
                MaxOccupants = 3,
                City = "Wrocław",
                Street = "Leśna",
                BuildingNumber = "15",
                ApartmentNumber = "3",
                Latitude = 51.1079,
                Longitude = 17.0385
            },
            new() {
                Date = DateTime.Now,
                Name = "Słoneczna 22, Gdańsk",
                Description = "Mieszkanie z widokiem na morze",
                PricePerMonth = 4000m,
                IsAvailable = true,
                Rooms = 3,
                Area = 70.0,
                MaxOccupants = 5,
                City = "Gdańsk",
                Street = "Słoneczna",
                BuildingNumber = "22",
                ApartmentNumber = null,
                Latitude = 54.3520,
                Longitude = 18.6466
            },
            new() {
                Date = DateTime.Now,
                Name = "Polna 8/2, Poznań",
                Description = "Kameralne mieszkanie w centrum",
                PricePerMonth = 3000m,
                IsAvailable = true,
                Rooms = 2,
                Area = 45.0,
                MaxOccupants = 2,
                City = "Poznań",
                Street = "Polna",
                BuildingNumber = "8",
                ApartmentNumber = "2",
                Latitude = 52.4064,
                Longitude = 16.9252
            },
            new() {
                Date = DateTime.Now,
                Name = "Cicha 12, Lublin",
                Description = "Przytulne studio na spokojnej ulicy",
                PricePerMonth = 2200m,
                IsAvailable = true,
                Rooms = 1,
                Area = 32.0,
                MaxOccupants = 2,
                City = "Lublin",
                Street = "Cicha",
                BuildingNumber = "12",
                ApartmentNumber = null,
                Latitude = 51.2465,
                Longitude = 22.5684
            },
            new() {
                Date = DateTime.Now,
                Name = "Rynek 5/1, Toruń",
                Description = "Mieszkanie blisko starówki",
                PricePerMonth = 2600m,
                IsAvailable = false,
                Rooms = 2,
                Area = 48.0,
                MaxOccupants = 3,
                City = "Toruń",
                Street = "Rynek",
                BuildingNumber = "5",
                ApartmentNumber = "1",
                Latitude = 53.0138,
                Longitude = 18.5984
            },
            new() {
                Date = DateTime.Now,
                Name = "Wrzosowa 18, Katowice",
                Description = "Przestronne mieszkanie w spokojnej dzielnicy",
                PricePerMonth = 3200m,
                IsAvailable = true,
                Rooms = 3,
                Area = 68.0,
                MaxOccupants = 4,
                City = "Katowice",
                Street = "Wrzosowa",
                BuildingNumber = "18",
                ApartmentNumber = null,
                Latitude = 50.2649,
                Longitude = 19.0238
            },
            new() {
                Date = DateTime.Now,
                Name = "Ogrodowa 3/4, Szczecin",
                Description = "Nowoczesne mieszkanie z balkonem",
                PricePerMonth = 2900m,
                IsAvailable = true,
                Rooms = 2,
                Area = 55.0,
                MaxOccupants = 3,
                City = "Szczecin",
                Street = "Ogrodowa",
                BuildingNumber = "3",
                ApartmentNumber = "4",
                Latitude = 53.4285,
                Longitude = 14.5528
            },
            new() {
                Date = DateTime.Now,
                Name = "Mostowa 20, Bydgoszcz",
                Description = "Komfortowe mieszkanie w centrum miasta",
                PricePerMonth = 3100m,
                IsAvailable = true,
                Rooms = 3,
                Area = 60.0,
                MaxOccupants = 4,
                City = "Bydgoszcz",
                Street = "Mostowa",
                BuildingNumber = "20",
                ApartmentNumber = null,
                Latitude = 53.1235,
                Longitude = 18.0084
            }
        };

        context.Apartments.AddRange(apartments);
        await context.SaveChangesAsync();
    }
}
