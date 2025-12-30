using System;
using Application.Profiles.DTOs;
using Domain.Enum;

namespace Application.Apartments.DTOs;

public class ApartmentDto
{
    public required string Id { get; set; }
    public required DateTime CreatedAt { get; set; }
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
    public ICollection<DeviceDto> Devices { get; set; } = [];
    public ICollection<ApartmentMemberDto> ApartmentMembers { get; set; } = [];
}
