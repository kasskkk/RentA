using Application.Core;
using Application.Faults.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Faults.Queries
{
    public class GetFaults
    {
        public class Query : IRequest<Result<List<FaultDto>>>
        {
            public required string ApartmentId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<FaultDto>>>
        {
            private readonly AppDbContext _context;
            private readonly IMapper _mapper;

            public Handler(AppDbContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<FaultDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // Pobieramy usterki powiązane z urządzeniami w danym apartamencie
                var faults = await _context.Faults
                    .Where(f => f.Device.ApartmentId == request.ApartmentId) // Filtrujemy po ApartmentId urządzenia
                    .OrderByDescending(f => f.DateReported) // Najnowsze na górze
                    .ProjectTo<FaultDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return Result<List<FaultDto>>.Success(faults);
            }
        }
    }
}