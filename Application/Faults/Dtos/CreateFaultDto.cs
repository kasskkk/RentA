namespace Application.Faults.DTOs;

public class CreateFaultDto
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string DeviceId { get; set; }
}