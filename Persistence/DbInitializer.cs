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

            // Definicje urządzeń i udogodnień
            var appliancesDefinitions = new[]
            {
                new { Name = "Telewizor", Desc = "Smart TV 55 cali, 4K" },
                new { Name = "Pralka", Desc = "Ładowana od frontu, klasa A+++" },
                new { Name = "Lodówka", Desc = "No Frost z kostkarką" },
                new { Name = "Zmywarka", Desc = "Zabudowana, 60cm" },
                new { Name = "Klimatyzacja", Desc = "Split 3.5kW w salonie" },
                new { Name = "Mikrofalówka", Desc = "20L z grillem" },
                new { Name = "Żelazko", Desc = "Parowe ze stacją" },
                new { Name = "Suszarka do włosów", Desc = "Jonizacja" }
            };

            var amenitiesDefinitions = new[]
            {
                new { Name = "Internet (WiFi)", Desc = "Światłowód 1Gb/s" },
                new { Name = "Balkon / Taras", Desc = "15m2 z widokiem" },
                new { Name = "Garaż / Parking", Desc = "Miejsce w hali garażowej" },
                new { Name = "Winda", Desc = "Cichobieżna" },
                new { Name = "Ogród", Desc = "Dostęp do ogrodu wspólnego" },
                new { Name = "Basen", Desc = "W strefie mieszkańca" },
                new { Name = "Siłownia", Desc = "Dostępna 24/7" },
                new { Name = "Recepcja / Ochrona", Desc = "Monitoring i portier" }
            };

            // Pula tytułów usterek
            var faultTitles = new[] {
                "Dziwne dźwięki podczas pracy",
                "Nie włącza się",
                "Uszkodzony panel sterowania",
                "Wyciek wody",
                "Przegrzewa się",
                "Błąd na wyświetlaczu",
                "Mechaniczne uszkodzenie obudowy",
                "Słaba wydajność"
            };

            // Pula dodatkowych rachunków (poza czynszem)
            var billTypes = new[]
            {
                new { Title = "Energia Elektryczna", Desc = "Opłata za zużycie prądu", Min = 100, Max = 400 },
                new { Title = "Internet + TV", Desc = "Abonament miesięczny", Min = 60, Max = 120 },
                new { Title = "Woda i ścieki", Desc = "Rozliczenie wodomierzy", Min = 80, Max = 250 },
                new { Title = "Gaz", Desc = "Opłata za gaz ziemny", Min = 50, Max = 200 },
                new { Title = "Ogrzewanie", Desc = "Zaliczka CO", Min = 200, Max = 600 }
            };

            foreach (var owner in ownersList)
            {
                var fullApartment = new Apartment
                {
                    CreatedAt = DateTime.Now,
                    Name = $"Apartament {owner.DisplayName}",
                    Description = "Nowoczesne mieszkanie w centrum, w pełni wyposażone, gotowe do zamieszkania od zaraz.",
                    PricePerMonth = rnd.Next(2000, 5000),
                    IsAvailable = true,
                    Rooms = rnd.Next(2, 5),
                    Area = rnd.Next(35, 90),
                    MaxOccupants = rnd.Next(2, 6),
                    City = "Poznań",
                    Street = "Polna",
                    BuildingNumber = rnd.Next(1, 50).ToString(),
                    ApartmentNumber = rnd.Next(1, 100).ToString(),
                    Latitude = 52.4064 + (rnd.NextDouble() - 0.5) * 0.1,
                    Longitude = 16.9252 + (rnd.NextDouble() - 0.5) * 0.1
                };

                fullApartment.ApartmentMembers.Add(new ApartmentMember
                {
                    UserId = owner.Id,
                    ApartmentId = fullApartment.Id,
                    IsOwner = true,
                    MemberStatus = MemberStatus.Accepted
                });

                var members = occupantsList.OrderBy(_ => rnd.Next()).Take(rnd.Next(0, fullApartment.MaxOccupants)).ToList();
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

                // --- 1. DODAWANIE URZĄDZEŃ (Bez usterek na starcie) ---
                var selectedAppliances = appliancesDefinitions.OrderBy(_ => rnd.Next()).Take(rnd.Next(3, 7)); // min 3, max 6
                foreach (var item in selectedAppliances)
                {
                    fullApartment.Devices.Add(new Device { Name = item.Name, Description = item.Desc });
                }

                var selectedAmenities = amenitiesDefinitions.OrderBy(_ => rnd.Next()).Take(rnd.Next(2, 6));
                foreach (var item in selectedAmenities)
                {
                    fullApartment.Devices.Add(new Device { Name = item.Name, Description = item.Desc });
                }

                // --- 2. GENEROWANIE 2-3 USTEREK ---
                // Wybieramy losowo 2 lub 3 urządzenia z tych, które właśnie dodaliśmy
                var devicesForFaults = fullApartment.Devices
                    .OrderBy(_ => rnd.Next())
                    .Take(rnd.Next(2, 4)) // Losuje 2 lub 3
                    .ToList();

                foreach (var device in devicesForFaults)
                {
                    var isResolved = rnd.Next(0, 2) == 1; // 50/50 resolved
                    device.Faults.Add(new Fault
                    {
                        Title = faultTitles[rnd.Next(faultTitles.Length)],
                        Description = "Usterka wygenerowana losowo przez seedera.",
                        DateReported = DateTime.Now.AddDays(-rnd.Next(1, 60)),
                        IsResolved = isResolved,
                        DateResolved = isResolved ? DateTime.Now.AddDays(-rnd.Next(1, 5)) : null
                    });
                }

                // --- 3. GENEROWANIE 2-3 RACHUNKÓW ---
                // a) Zawsze czynsz
                fullApartment.Bills.Add(new Bill
                {
                    Title = $"Czynsz - {DateTime.Now:MMMM yyyy}",
                    Description = "Czynsz najmu + opłaty administracyjne",
                    Amount = fullApartment.PricePerMonth,
                    DueDate = DateTime.Now.AddDays(rnd.Next(5, 15)),
                    ApartmentId = fullApartment.Id
                });

                // b) Losujemy 1 lub 2 dodatkowe rachunki, aby łącznie było 2 lub 3
                int extraBillsCount = rnd.Next(1, 3); // da 1 lub 2
                var selectedBillTypes = billTypes.OrderBy(_ => rnd.Next()).Take(extraBillsCount).ToList();

                foreach (var billDef in selectedBillTypes)
                {
                    fullApartment.Bills.Add(new Bill
                    {
                        Title = billDef.Title,
                        Description = billDef.Desc,
                        Amount = rnd.Next(billDef.Min, billDef.Max),
                        DueDate = DateTime.Now.AddDays(rnd.Next(2, 20)),
                        ApartmentId = fullApartment.Id
                    });
                }

                apartments.Add(fullApartment);

                // --- Mieszkanie oczekujące (Pending) ---

                var pendingApartment = new Apartment
                {
                    CreatedAt = DateTime.Now,
                    Name = $"Oczekujące {owner.DisplayName}",
                    Description = "Mieszkanie w trakcie weryfikacji.",
                    PricePerMonth = rnd.Next(1500, 3000),
                    IsAvailable = true,
                    Rooms = 2,
                    Area = 45,
                    MaxOccupants = 2,
                    City = "Warszawa",
                    Street = "Złota",
                    BuildingNumber = rnd.Next(1, 10).ToString(),
                    ApartmentNumber = rnd.Next(1, 50).ToString(),
                    Latitude = 52.2297 + (rnd.NextDouble() - 0.5) * 0.05,
                    Longitude = 21.0122 + (rnd.NextDouble() - 0.5) * 0.05
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

                // Dodaj urządzenia do pending
                var pDev1 = new Device { Name = "Internet (WiFi)", Description = "Podstawowy" };
                var pDev2 = new Device { Name = "Lodówka", Description = "Stara" };
                var pDev3 = new Device { Name = "Pralka", Description = "Wirnikowa" };
                
                pendingApartment.Devices.Add(pDev1);
                pendingApartment.Devices.Add(pDev2);
                pendingApartment.Devices.Add(pDev3);

                // Dodaj 2 usterki do pending
                pDev2.Faults.Add(new Fault { Title = "Głośna praca", Description = "Buczy", DateReported = DateTime.Now.AddDays(-2) });
                pDev3.Faults.Add(new Fault { Title = "Nie wiruje", Description = "Bęben stoi", DateReported = DateTime.Now.AddDays(-5) });

                // Dodaj 2 rachunki do pending
                pendingApartment.Bills.Add(new Bill
                {
                    Title = "Kaucja",
                    Description = "Kaucja zwrotna",
                    Amount = pendingApartment.PricePerMonth,
                    DueDate = DateTime.Now.AddDays(3),
                    ApartmentId = pendingApartment.Id
                });
                pendingApartment.Bills.Add(new Bill
                {
                    Title = "Opłata rezerwacyjna",
                    Description = "Bezzwrotna",
                    Amount = 500m,
                    DueDate = DateTime.Now.AddDays(1),
                    ApartmentId = pendingApartment.Id
                });

                apartments.Add(pendingApartment);
            }

            context.Apartments.AddRange(apartments);
        }
        #endregion

        await context.SaveChangesAsync();
    }
}