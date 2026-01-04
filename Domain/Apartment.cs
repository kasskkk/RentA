using System;
using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(CreatedAt))]
public class Apartment
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public required string Name { get; set; }
    public required string Description { get; set; }
    public decimal PricePerMonth { get; set; }
    public bool IsAvailable { get; set; }
    public int Rooms { get; set; }
    public double Area { get; set; } // m2
    public int MaxOccupants { get; set; } // max number of people allowed
    //location props
    public required string City { get; set; }
    public required string Street { get; set; }
    public required string BuildingNumber { get; set; }
    public string? ApartmentNumber { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public ICollection<Device> Devices { get; set; } = [];
    public ICollection<ApartmentMember> ApartmentMembers { get; set; } = [];
    public ICollection<Bill> Bills { get; set; } = [];
    public ICollection<Photo> Photos { get; set; } = [];
}
