using System;

namespace Domain;

public class Bill
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Title { get; set; } // np. "Czynsz styczeń", "Prąd"
    public string? Description { get; set; }
    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; } // Termin płatnościc
    
    // Relacja z Apartment
    public required string ApartmentId { get; set; }
    public Apartment Apartment { get; set; } = null!;
}