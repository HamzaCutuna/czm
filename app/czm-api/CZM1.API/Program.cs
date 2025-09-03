using CZM1.API.Data;
using CZM1.API.Endpoints.AuthEndpoints;
using CZM1.API.Helper.Auth;
using CZM1.API.Helpers;
using CZM1.API.Middlewares;
using CZM1.API.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Text;
using System.Text.Json;

var config = new ConfigurationBuilder()
.Build();

var builder = WebApplication.CreateBuilder(args);

Console.WriteLine("ENV: " + builder.Environment.EnvironmentName);

var logDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Logs");

try
{
    if (!Directory.Exists(logDirectory))
    {
        Directory.CreateDirectory(logDirectory);
        Console.WriteLine($"[LOG] Folder 'Logs' kreiran na putanji: {logDirectory}");
    }
    else
    {
        Console.WriteLine($"[LOG] Folder 'Logs' već postoji: {logDirectory}");
    }

    var testFilePath = Path.Combine(logDirectory, "test_write.txt");
    await File.WriteAllTextAsync(testFilePath, "test");
    File.Delete(testFilePath);
    Console.WriteLine($"[LOG] Write permission OK za folder: {logDirectory}");
}
catch (Exception ex)
{
    Console.WriteLine($"[LOG] Greška prilikom kreiranja foldera ili pisanja u 'Logs': {ex.Message}");
}


Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Warning()
    .WriteTo.File(
        Path.Combine(logDirectory, "errors.txt"),
        restrictedToMinimumLevel: Serilog.Events.LogEventLevel.Error,
        rollingInterval: RollingInterval.Day,
        fileSizeLimitBytes: 100 * 1024 * 1024,
        rollOnFileSizeLimit: true,
        retainedFileCountLimit: 3)
    .CreateLogger();


builder.Host.UseSerilog();

// Add services to the container.

// Ispis connection stringa
var connectionString = builder.Configuration.GetConnectionString("db1");
Console.WriteLine("CS: " + connectionString);

builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseSqlServer(connectionString));


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(x => x.OperationFilter<MyAuthorizationSwaggerHeader>());
builder.Services.AddHttpContextAccessor();

//dodajte vaše servise
builder.Services.AddTransient<IMyAuthService, MyAuthService>();
builder.Services.AddTransient<IMyFileService, MyFileService>();
builder.Services.AddTransient<IMyImageHelper, MyImageHelper>();
builder.Services.AddSignalR();

builder.Services.AddFluentValidationAutoValidation();

//pretrazuje sve validatore iz DLL fajla (tj. projekta) koji sadrži AuthGetEndpoint.css
builder.Services.AddValidatorsFromAssemblyContaining<AuthGetEndpoint>();//moze se navesti bilo koja klasa iz ovog projekta

// ✅ Dodaj CORS policy (dozvoli sve za testiranje)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseMiddleware<RequestLoggingMiddleware>();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        // 1. Postavi status i content-type
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        // 2. Uhvati exception koji je ASP.NET Core uhvatio globalno
        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var ex = exceptionHandlerPathFeature?.Error;

        // 3. Koristi CancellationToken iz HttpContext
        var cancellationToken = context.RequestAborted;

        // 4. Loguj exception koristeći helper koji također prima cancellationToken
        var errorInfo = await ErrorLoggerHelper.LogExceptionAsync(context, ex, cancellationToken);

        // 5. Vrati JSON response sa detaljima
        await context.Response.WriteAsync(
            JsonSerializer.Serialize(new
            {
                status = 500,
                message = "Greška na serveru.",
                exception = ex?.Message,
                stackTrace = ex?.StackTrace,
                logDetails = errorInfo
            }),
            cancellationToken
        );
    });
});


// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

// ✅ CORS
app.UseCors("AllowAll");

app.UseStaticFiles(); // omogućava pristup fajlovima iz wwwroot

app.UseAuthorization();

app.MapControllers();

app.Run();
