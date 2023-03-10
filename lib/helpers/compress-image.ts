export function compressImage(image: string, compress?: number): string {
    return `https://images.weserv.nl/?url=${image}${compress ? `&w=${compress}` : ''}`
}
