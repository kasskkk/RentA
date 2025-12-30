namespace Application.Apartments.DTOs;

public class DeviceDto
{
    public string? Id { get; set; }
    public required string Name { get; set; }
    public required string Brand { get; set; }
    public string? Description { get; set; }
}