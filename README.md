# RentA

Projekt służący do zarządzania mieszkaniami, zgłoszeniami usterek oraz rachunkami w środowisku ASP.NET Core i React.

## Funkcjonalności

- Zarządzanie mieszkaniami 
- Obsługa zgłoszeń usterek
- Obsługa rachunków
- Rejestracja i logowanie użytkowników z rolami (Owner, Occupant)
- Wyszukiwanie i filtrowanie mieszkań
- Dodawanie zdjęć mieszkań
- Integracja z backendem poprzez REST API
- Użycie CQRS i wzorców projektowych w warstwie aplikacji
- Interaktywna mapa: wizualizacja lokalizacji nieruchomości.

## Struktura projektu

- **API** – warstwa prezentacji i kontrolery Web API  
- **Application** – logika aplikacji (CQRS, handlery, DTO)  
- **Domain** – modele domenowe
- **Persistence** – konfiguracja Entity Framework Core i dostęp do bazy  
- **Infrastructure** – serwisy wspomagające (np. zdjęcia)  

## Technologie

- ASP.NET Core 9
- Entity Framework Core  
- AutoMapper  
- FluentValidation  
- React + TypeScript
- SQLite

## Uruchomienie

### appsettings.json

- Dla "CloudinarySettings" w folderze appsettings.json lub appsettings.Development.json skonfiguruj konto claudinary

### env.

- Dla "VITE_LOCATIONIQ_KEY" w folderze env skofiguruj swój klucz

### Backend
-dotnet watch

### Frontend
-cd client
-npm install
-npm run dev

# Logwania (seedowane konta)

### Właściciel
*email:owner1@test.com | hasło:Pa$$w0rd
*email:owner2@test.com | hasło:Pa$$w0rd
*email:owner3@test.com | hasło:Pa$$w0rd
*email:owner4@test.com | hasło:Pa$$w0rd
*email:owner5@test.com | hasło:Pa$$w0rd

### Użytkownik
*email:bob@test.com | hasło:Pa$$w0rd
*email:jane@test.com | hasło:Pa$$w0rd
*email:oscar@test.com | hasło:Pa$$w0rd
*email:tom@test.com | hasło:Pa$$w0rd
*email:eve@test.com | hasło:Pa$$w0rd