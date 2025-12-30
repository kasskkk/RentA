using System;
using Application.Core;

namespace Application.Apartments.Queries;

public class ApartmentParams : PaginationParams<DateTime?>
{
    public string? KeyWord {get;set;}
    public string? City { get; set; }
    public int? PricePerMonth { get; set; }
    public int? Rooms { get; set; }
}
