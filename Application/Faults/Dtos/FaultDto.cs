namespace Application.Faults.Dtos; 

public class FaultDto
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTime DateReported { get; set; }
    public bool IsResolved { get; set; }
    public DateTime? DateResolved { get; set; } 
    
    public required string DeviceId { get; set; }
    public required string DeviceName { get; set; } 
}