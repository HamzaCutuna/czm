namespace FIT.OpenApiDtoGenerator;

using System.Text;
using System.Text.Json;
using System.Xml.Linq;

internal class Program
{
    static async Task Main(string[] args)
    {
        var outputDir = Path.Combine(AppContext.BaseDirectory, "generated-ts-dto");
        Directory.CreateDirectory(outputDir);

        var httpClient = new HttpClient();
        const string openApiUrl = "http://localhost:7000/swagger/v1/swagger.json";
        var maxRetries = 15;
        var attempt = 0;
        string? json = null;

        Console.WriteLine("🔄 Čekam da swagger API bude spreman...");

        while (attempt < maxRetries)
        {
            try
            {
                json = await httpClient.GetStringAsync(openApiUrl);
                Console.WriteLine("✅ API dostupan.");
                break;
            }
            catch
            {
                attempt++;
                Console.WriteLine($"⏳ Pokušaj {attempt}/{maxRetries} nije uspio. Čekam 2 sekunde...");
                await Task.Delay(2000);
            }
        }

        if (json == null)
        {
            Console.WriteLine("❌ Ne mogu pristupiti swagger API-ju nakon više pokušaja.");
            return;
        }

        var document = JsonDocument.Parse(json);
        var components = document.RootElement.GetProperty("components");
        var schemas = components.GetProperty("schemas");

        var schemaMap = new Dictionary<string, JsonElement>();
        foreach (var def in schemas.EnumerateObject())
        {
            schemaMap[def.Name] = def.Value;
        }

        foreach (var schema in schemas.EnumerateObject())
        {
            Console.WriteLine($"DTO/ENUM: {schema.Name}");
            GenerateTypeScriptClassOrEnum(schema.Name, schema.Value, outputDir, schemaMap);
        }
    }

    private static void GenerateTypeScriptClassOrEnum(string dtoName, JsonElement schema, string outputBaseDir, Dictionary<string, JsonElement> schemaMap)
    {
        //if (schema.TryGetProperty("enum", out var enumValues))
        //{
        //    var sbEnum = new StringBuilder();
        //    sbEnum.AppendLine($"export enum {dtoName} {{");

        //    foreach (var enumVal in enumValues.EnumerateArray())
        //    {
        //        var enumStr = enumVal.GetString();
        //        var enumKey = string.Join("", enumStr!.Split('-')).Replace(" ", "");
        //        enumKey = char.ToUpperInvariant(enumKey[0]) + enumKey.Substring(1);
        //        sbEnum.AppendLine($"  {enumKey} = \"{enumStr}\",");
        //    }

        //    sbEnum.AppendLine("}");

        //    var (folder, fileNameOnly) = ToFinalFilePath(dtoName);
        //    var outputDir = Path.Combine(outputBaseDir, folder);
        //    Directory.CreateDirectory(outputDir);

        //    var filePath = Path.Combine(outputDir, fileNameOnly);
        //    File.WriteAllText(filePath, sbEnum.ToString());
        //    Console.WriteLine($"✅ Enum generisan: {filePath}");
        //    return;
        //}

        if (!schema.TryGetProperty("properties", out var props))
        {
            Console.WriteLine($"⚠️ Preskačem (nema properties): {dtoName}");
            return;
        }

        var sb = new StringBuilder();
        var classDesc = schema.TryGetProperty("description", out var descProp)
            ? descProp.GetString()
            : "Data transfer object.";

        var className = ToFinalClassName(dtoName);

        sb.AppendLine($"export interface {className} {{");

        var propsList = props.EnumerateObject().ToList();
        foreach (var prop in propsList)
        {
            var name = ToCamelCase(prop.Name);
            var tsType = MapToTsType(prop.Value, prop.Name, className);
            var isNullable = IsNullable(prop.Value);
            var isArray = prop.Value.TryGetProperty("type", out var t) && t.GetString() == "array";

            var desc = "";
            if (prop.Value.TryGetProperty("description", out var d))
            {
                desc = d.GetString() ?? "";
            }
            else if (prop.Value.TryGetProperty("$ref", out var refProp))
            {
                var refName = refProp.GetString()?.Split('/').Last();
                if (refName != null && schemaMap.TryGetValue(refName, out var referencedSchema))
                {
                    if (referencedSchema.TryGetProperty("description", out var refDesc))
                    {
                        desc = refDesc.GetString() ?? "";
                    }
                }
            }

            var finalTsType = tsType;
            if (isNullable && !tsType.Contains("null"))
            {
                finalTsType += " | null";
            }

            var readonlyLine =  $"  {name}: {finalTsType};";
            sb.AppendLine(readonlyLine);

            var paramDefault = isNullable ? " = null" : "";
        }

        sb.AppendLine("}");

        var (folderName, fileName) = ToFinalFilePath(dtoName);
        var targetDir = Path.Combine(outputBaseDir, folderName);
        Directory.CreateDirectory(targetDir);
        var filePathFull = Path.Combine(targetDir, fileName);
        var finalClassContent = sb.ToString();
        File.WriteAllText(filePathFull, finalClassContent);
        Console.WriteLine($"✅ DTO generisan: {filePathFull}");
    }
    private static (string folderName, string fileName) ToFinalFilePath(string originalName)
    {
        var modifiedName = originalName;

        var kebabFinal = ToKebabCase(modifiedName);
        var splited = kebabFinal.Split('-');
        var folderName = "tmp";
        return (folderName, kebabFinal + ".dto.ts");
    }


    private static string ToFinalClassName(string originalName)
    {
        originalName = originalName + "Dto";

        return originalName;
    }

    private static string MapToTsType(JsonElement prop, string propName, string className)
    {
        if (prop.TryGetProperty("$ref", out var refEl))
        {
            var refPath = refEl.GetString();
            if (refPath == null)
            {
                return "";
            }
            var refName = refPath!.Split('/').Last();
            var finalName = ToFinalClassName(refName);
            return finalName;
        }

        if (prop.TryGetProperty("type", out var typeEl))
        {
            var type = typeEl.GetString();
            return type switch
            {
                "string" => "string",
                "integer" => "number",
                "number" => "number",
                "boolean" => "boolean",
                "array" => prop.TryGetProperty("items", out var items)
                    ? $"Array<{MapToTsType(items, propName, className)}>" : "Array<any>",
                "object" => GuessDtoClassName(className, propName),
                _ => "any"
            };
        }

        if (prop.TryGetProperty("properties", out _))
        {
            return GuessDtoClassName(className, propName);
        }

        return "any";
    }

    private static string GuessDtoClassName(string className, string propName)
    {
        var baseName = className.Replace("Dto", "");
        var pascalProp = char.ToUpperInvariant(propName[0]) + propName.Substring(1);
        return $"{baseName}{pascalProp}";
    }

    private static bool IsNullable(JsonElement prop)
    {
        return prop.TryGetProperty("nullable", out var nullable) && nullable.GetBoolean();
    }

    private static string ToCamelCase(string name)
    {
        return char.ToLowerInvariant(name[0]) + name.Substring(1);
    }

    private static string ToKebabCase(string name)
    {
        return string.Concat(name.Select((c, i) => char.IsUpper(c) && i > 0 ? "-" + char.ToLowerInvariant(c) : char.ToLowerInvariant(c).ToString()));
    }
}