// Import all images from assets/images
const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => {
        images[item.replace('./', '')] = r(item);
    });
    return images;
};

// Import all images from the images folder
const images = importAll(require.context('../assets/images', false, /\.(png|jpe?g|svg|webp)$/));

export const getImageUrl = (imageName) => {
    if (!imageName) return '';
    
    // If it's already a full URL, return as is
    if (imageName.startsWith('http') || imageName.startsWith('data:')) {
        return imageName;
    }

    // If the image exists in our assets
    if (images[imageName]) {
        return images[imageName];
    }

    // If the image name doesn't include extension, try common extensions
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];
    for (const ext of extensions) {
        if (images[`${imageName}.${ext}`]) {
            return images[`${imageName}.${ext}`];
        }
    }

    // Return the original image name if not found
    return imageName;
}; 