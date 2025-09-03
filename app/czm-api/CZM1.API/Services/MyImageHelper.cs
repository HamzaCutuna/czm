using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace CZM1.API.Services
{
    public class MyImageHelper: IMyImageHelper
    {
        public async Task<Stream> ResizeImageAsync(Stream originalStream, int maxWidth, int maxHeight)
        {
            originalStream.Position = 0; // reset to beginning
            using var image = await Image.LoadAsync(originalStream);

            // Ako je slika manja od max dimenzija – ne diraj
            if (image.Width <= maxWidth && image.Height <= maxHeight)
            {
                originalStream.Position = 0;
                return originalStream; // samo vrati original
            }

            // Izračunaj nove dimenzije s aspect ratio
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Mode = ResizeMode.Max,
                Size = new Size(maxWidth, maxHeight)
            }));

            var outputStream = new MemoryStream();
            await image.SaveAsPngAsync(outputStream); // ili SaveAsJpegAsync
            outputStream.Position = 0;
            return outputStream;
        }
    }
}
