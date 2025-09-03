namespace CZM1.API.Services;

using Microsoft.AspNetCore.Hosting;

public class MyFileService : IMyFileService
{
    private readonly string _wwwRootPath;

    public MyFileService(IWebHostEnvironment env)
    {
        _wwwRootPath = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
    }

    public async Task<string> SaveFileAsync(IFormFile file, string relativePath, CancellationToken cancellationToken = default)
    {
        var directoryPath = Path.Combine(_wwwRootPath, relativePath);
        Directory.CreateDirectory(directoryPath);

        var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        var fullPath = Path.Combine(directoryPath, fileName);

        await using var stream = File.Create(fullPath);
        await file.CopyToAsync(stream, cancellationToken);

        // Vraćamo relativnu putanju npr: "dogadjaji/3/22/5fd3a.png"
        return Path.Combine(relativePath, fileName).Replace("\\", "/");
    }

    public void DeleteFile(string relativeFilePath)
    {
        var fullPath = Path.Combine(_wwwRootPath, relativeFilePath.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
    }

    public bool FileExists(string relativeFilePath)
    {
        var fullPath = Path.Combine(_wwwRootPath, relativeFilePath.TrimStart('/'));
        return File.Exists(fullPath);
    }

    public async Task<byte[]> ReadFileAsync(string relativeFilePath, CancellationToken cancellationToken)
    {
        var fullPath = Path.Combine(_wwwRootPath, relativeFilePath.TrimStart('/'));
        return await File.ReadAllBytesAsync(fullPath, cancellationToken);
    }



}
