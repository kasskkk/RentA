# RentA

Projekt służący do zarządzania mieszkaniami, zgłoszeniami usterek oraz rachunkami w środowisku ASP.NET Core i React.

# Screeny

## Company View / Owner

### Dashboard
<img width="2556" height="1220" alt="{BC33C9E8-6DEE-4F5D-B020-BCC33B060372}" src="https://github.com/user-attachments/assets/d2360e4f-3e97-4a96-a569-0436a7f2a13b" />

### Apartment
<img width="1745" height="1249" alt="{4536514B-50AE-49BD-B5A9-E86A7F828C66}" src="https://github.com/user-attachments/assets/5ca74bd8-d126-4b28-acfd-819572eb5aa2" />
<img width="1898" height="1164" alt="{CFAA1477-1F27-42D3-9C23-163C9ABFC5C1}" src="https://github.com/user-attachments/assets/ab112da0-27eb-424c-95c8-2f84fee70367" />
<img width="1601" height="1098" alt="{F6841ECB-D0B3-4DFB-AE80-CB33C76BAB75}" src="https://github.com/user-attachments/assets/e15acdc7-37e5-4c9f-96f0-bf6d1bfd6238" />

### Apartment Create
<img width="1839" height="1085" alt="{42D184C1-A30B-4361-8372-35607F733F35}" src="https://github.com/user-attachments/assets/ba9376a3-ecc2-4513-8bea-45a6e2517be8" />
<img width="1554" height="1202" alt="{FE74E92B-75AB-42D3-8000-874A9BD261F9}" src="https://github.com/user-attachments/assets/a878d18a-00b3-4ab6-9d8b-5980284f1f05" />
<img width="1683" height="1101" alt="{24449C4F-A012-4282-A320-BFB64DFB4427}" src="https://github.com/user-attachments/assets/a14f7059-3bee-41b3-b36f-9f3e527d21d8" />

## User View

### Dashboard
<img width="2558" height="1161" alt="{8BA58F7D-15FA-4E95-8898-4F2C728CA1A2}" src="https://github.com/user-attachments/assets/196d2e95-03dd-4e41-9c35-8420d8d6a62e" />

### Apartments
<img width="2557" height="1271" alt="{95D89B5D-9D47-4656-AA02-C0DD8D6AED11}" src="https://github.com/user-attachments/assets/00081d87-a7e2-4782-a277-445f4a8d1475" />


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
