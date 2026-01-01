using System;

namespace Application.Faults.DTOs;

public class FaultDto
{
    public string Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime DateReported { get; set; }
    public bool IsResolved { get; set; }
    public string DeviceId { get; set; }
    public string DeviceName { get; set; } // Przydatne do wyświetlania
}