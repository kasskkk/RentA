using System;

namespace Application.Apartments.DTOs;

public class BaseApartmentDto
{
    // creating NAME from server side
    public string Name { get; set; } = ""; // "Street+BuildingNumber+ApartmentNumber+City" 
    public string Description { get; set; } = "";
    public decimal PricePerMonth { get; set; }
    public bool IsAvailable { get; set; }
    public int Rooms { get; set; }
    public double Area { get; set; } // m2
    public int MaxOccupants { get; set; } = 1;// max number of people allowed
    //location props
    public string City { get; set; } = "";
    public string Street { get; set; } = "";
    public string BuildingNumber { get; set; } = "";
    public string? ApartmentNumber { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}
