using System;

namespace Domain;

public class Fault
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Title { get; set; }       // Np. "Cieknąca woda"
    public required string Description { get; set; } // Szczegóły usterki
    public DateTime DateReported { get; set; } = DateTime.UtcNow;
    public DateTime? DateResolved { get; set; }
    public bool IsResolved { get; set; } = false;

    // Relacja z urządzeniem
    public string? DeviceId { get; set; }
    public Device? Device { get; set; }
}