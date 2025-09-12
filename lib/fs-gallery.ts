import fs from 'fs';
import path from 'path';

export interface GalleryImage {
  filename: string;
  url: string;
}

export function getGalleryImages(slug: string): GalleryImage[] {
  try {
    const dir = path.join(process.cwd(), "public", "images", "gallery", slug);
    
    if (!fs.existsSync(dir)) {
      return [];
    }
    
    const files = fs.readdirSync(dir).filter(f => 
      /\.(png|jpe?g|webp)$/i.test(f)
    );
    
    return files.map(filename => ({
      filename,
      url: `/images/gallery/${slug}/${filename}`
    }));
  } catch (error) {
    console.error(`Error reading gallery images for slug "${slug}":`, error);
    return [];
  }
}
