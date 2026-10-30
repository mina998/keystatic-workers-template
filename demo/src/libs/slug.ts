export function slugify(name: string) {
    return name.trim().replace(/[\\/:*?"<>|]/g, '');
}
