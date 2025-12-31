using System;

namespace Domain;

public class Device
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Name { get; set; }
    public string? Description { get; set; }


    public string ApartmentId { get; set; }

}