using Application.Faults.Dtos;

public class DeviceDto
{
    public string? Id { get; set; } 
    public required string Name { get; set; }
    public string? Description { get; set; }
    public ICollection<FaultDto> Faults { get; set; } = []; 
}