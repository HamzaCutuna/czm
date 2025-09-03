namespace CZM1.API.Endpoints.KvizPitanjaEndpoints;

using FluentValidation;
using static CZM1.API.Endpoints.KvizPitanjaEndpoints.KvizPitanjeUpdateOrInsertEndpoint;

public class KvizPitanjeUpdateOrInsertValidator
    : AbstractValidator<KvizPitanjeUpdateOrInsertRequest>
{
    public KvizPitanjeUpdateOrInsertValidator()
    {
        RuleFor(x => x.TekstPitanja)
            .NotEmpty().WithMessage("Tekst pitanja je obavezan.")
            .MaximumLength(1000).WithMessage("Tekst pitanja ne smije imati više od 1000 karaktera.");

        RuleFor(x => x.HistorijskiDogadjajId)
            .GreaterThan(0).WithMessage("HistorijskiDogadjajId mora biti veći od 0.");

        RuleFor(x => x.TipPitanja)
            .IsInEnum().WithMessage("Tip pitanja nije validan.");

        RuleFor(x => x.TezinaPitanja)
            .IsInEnum().WithMessage("Težina pitanja nije validna.");

        RuleFor(x => x.BrojBodova)
            .GreaterThanOrEqualTo(0).WithMessage("Broj bodova mora biti 0 ili veći.");

        // Validate answer count: must have between 1 and 10 answers
        RuleFor(x => x.Odgovori)
            .NotNull().WithMessage("Lista odgovora je obavezna.")
            .Must(list => list.Count >= 1).WithMessage("Pitanje mora imati najmanje 1 ponuđeni odgovor.")
            .Must(list => list.Count <= 10).WithMessage("Pitanje ne može imati više od 10 ponuđenih odgovora.");

        // Validate each answer
        RuleForEach(x => x.Odgovori).SetValidator(new OdgovorValidator());

        // Ensure exactly one answer is marked as correct
        RuleFor(x => x.Odgovori)
            .Must(list => list.Count(o => o.Tacan) == 1)
            .WithMessage("Mora biti tačno jedan tačan odgovor.");
    }

    public class OdgovorValidator : AbstractValidator<KvizPitanjeUpdateOrInsertRequestOdgovor>
    {
        public OdgovorValidator()
        {
            RuleFor(x => x.TekstOdgovora)
                .NotEmpty().WithMessage("Tekst odgovora je obavezan.")
                .MaximumLength(512).WithMessage("Tekst odgovora ne smije imati više od 512 karaktera.");
        }
    }
}