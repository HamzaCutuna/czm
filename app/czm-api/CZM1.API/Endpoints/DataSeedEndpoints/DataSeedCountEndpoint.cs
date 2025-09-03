using CZM1.API.Data;
using CZM1.API.Helper.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("data-seed")]
public class DataSeedCountEndpoint(MyDbContext db)
    : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<Dictionary<string, int>>
{
    [HttpGet]
    public override async Task<Dictionary<string, int>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var dataCounts = new Dictionary<string, int>();

        var dbSetProperties = typeof(MyDbContext)
            .GetProperties()
            .Where(p => p.PropertyType.IsGenericType
                        && p.PropertyType.GetGenericTypeDefinition() == typeof(DbSet<>));

        foreach (var prop in dbSetProperties)
        {
            var entityType = prop.PropertyType.GetGenericArguments()[0];
            var dbSet = prop.GetValue(db);
            var method = typeof(EntityFrameworkQueryableExtensions)
                .GetMethod(nameof(EntityFrameworkQueryableExtensions.CountAsync), [typeof(IQueryable<>).MakeGenericType(entityType), typeof(CancellationToken)])
                ?.MakeGenericMethod(entityType);

            if (method is not null && dbSet is IQueryable queryable)
            {
                var task = (Task<int>)method.Invoke(null, [queryable, cancellationToken])!;
                var count = await task;
                dataCounts.Add(prop.Name, count);
            }
        }

        return dataCounts;
    }
}
