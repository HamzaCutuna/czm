using CZM1.API.Data.BaseClasses;
using CZM1.API.Helper;
using CZM1.API.Models.Kalendar;
using CZM1.API.Models.Korisnici;
using CZM1.API.Models.Kviz;
using CZM1.API.Models.M04Kviz;
using CZM1.API.Models.Novosti;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Data
{
    public partial class MyDbContext : DbContext
    {
        public MyDbContext()
        {
        }

        public MyDbContext(DbContextOptions<MyDbContext> options)
            : base(options)
        {
        }

        // M01Korisnici
        public DbSet<KorisnikEntity> Korisnici { get; set; } = default!;
        public DbSet<InstitucijaEntity> Institucije { get; set; } = default!;
        public DbSet<AutentikacijaTokenEntity> AutentikacijaTokeni { get; set; } = default!;

        // M02Novosti
        public DbSet<NovostEntity> Novosti { get; set; } = default!;
        public DbSet<NovostSlikaEntity> NovostSlike { get; set; } = default!;

        // M03Kalendar
        public DbSet<HistorijskiDogadjajEntity> HistorijskiDogadjaji { get; set; } = default!;
        public DbSet<HistorijskiDogadjajSlikaEntity> HistorijskiDogadjajSlike { get; set; } = default!;
        public DbSet<HistorijskiDogadjajVideoEntity> HistorijskiDogadjajVideo { get; set; } = default!;
        public DbSet<HistorijskiDogadjajDokumentacijaEntity> HistorijskiDogadjajDokumentacije { get; set; } = default!;
        public DbSet<KategorijaEntity> Kategorije { get; set; } = default!;
        public DbSet<RegijaEntity> Regija { get; set; } = default!;

        // M04Kviz
        public DbSet<KvizEntity> Kvizovi { get; set; } = default!;
        public DbSet<KvizPitanjaEntity> KvizPitanja { get; set; } = default!;
        public DbSet<PitanjaPonudjenaOpcijaEntity> KvizPitanjaPonudjeneOpcije { get; set; } = default!;
        public DbSet<KvizRezultatEntity> KvizRezultati { get; set; } = default!;
        public DbSet<KvizRezultatKorisnickiOdgovorEntity> KvizRezultatiKorisnickiOdgovori { get; set; } = default!;
        public DbSet<PitanjeEntity> Pitanja { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Automatski učitava sve klase koje implementiraju IEntityTypeConfiguration<T>
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(MyDbContext).Assembly);

            // Spriječi cascade delete svuda
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.NoAction;
            }
        }


        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            SetAuditToMyEntity();
            return base.SaveChangesAsync(cancellationToken);
        }
        private void SetAuditToMyEntity()
        {
            var now = DateTime.UtcNow;

            foreach (var entry in ChangeTracker.Entries<AuditableBaseEntity>())
            {
                //if (entry.State == EntityState.Added)
                //{
                //    entry.Entity.CreatedAtUtc = now;

                //    // TODO: Postavi CreatedBy 
                //    // entry.Entity.CreatedBy = _currentUser.UserId;
                //}
                //else if (entry.State == EntityState.Modified)
                //{
                //    entry.Entity.ModifiedAtUtc = now;

                //    // TODO: Postavi ModifiedBy
                //    // entry.Entity.ModifiedBy = _currentUser.UserId;
                //}
            }
        }

    }
}
