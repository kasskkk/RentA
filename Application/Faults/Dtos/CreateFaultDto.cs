namespace Application.Faults.Dtos;

public class CreateFaultDto
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public required string DeviceId { get; set; }
}