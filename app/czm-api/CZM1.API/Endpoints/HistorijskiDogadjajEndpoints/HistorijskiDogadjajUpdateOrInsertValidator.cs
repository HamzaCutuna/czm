namespace CZM1.API.Endpoints.HistorijskiDogadjajEndpoints;

using FluentValidation;
using static CZM1.API.Endpoints.HistorijskiDogadjajEndpoints.HistorijskiDogadjajUpdateOrInsertEndpoint;

public class HistorijskiDogadjajUpdateOrInsertValidator
    : AbstractValidator<HistorijskiDogadjajUpdateOrInsertRequest>
{
    public HistorijskiDogadjajUpdateOrInsertValidator()
    {
        RuleFor(x => x.KategorijaId)
            .GreaterThan(0).WithMessage("KategorijaId mora biti veći od 0.");

        RuleFor(x => x.RegijaId)
            .GreaterThan(0).WithMessage("RegijaId mora biti veći od 0.");

        RuleFor(x => x.Opis)
            .NotEmpty().WithMessage("Opis je obavezan.")
            .MaximumLength(4000).WithMessage("Opis ne smije imati više od 4000 karaktera.");

        RuleForEach(x => x.Slike).SetValidator(new SlikaValidator());
        RuleForEach(x => x.Dokumenti).SetValidator(new DokumentValidator());
    }

    public class SlikaValidator : AbstractValidator<HistorijskiDogadjajUpdateOrInsertRequest.SlikaUploadDto>
    {
        public SlikaValidator()
        {

        }
    }

    public class DokumentValidator : AbstractValidator<HistorijskiDogadjajUpdateOrInsertRequest.DokumentUploadDto>
    {
        public DokumentValidator()
        {
            RuleFor(x => x.EksterniFileUrl)
                .NotEmpty().WithMessage("URL dokumenta je obavezan.")
                .MaximumLength(256).WithMessage("URL dokumenta ne smije biti duži od 256 karaktera.");

            RuleFor(x => x.Opis)
                .NotEmpty().WithMessage("Opis dokumenta je obavezan.")
                .MaximumLength(512).WithMessage("Opis dokumenta ne smije biti duži od 512 karaktera.");
        }
    }
}
