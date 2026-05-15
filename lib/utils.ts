/**
 * This function is used to generate a slug from a given name. 
 * It converts the string to lowercase, replaces spaces with hyphens, and removes special characters.
 * @param name The name from which to generate a slug
 * @returns Replace string with lowercase, spaces to hyphens, and remove special characters
 */
export const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

export const ALLOWED_FILES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/jpg'];
export const MAX_FILE_SIZE = 2 * 1024 * 1024;