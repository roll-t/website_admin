

class HandleImage {

    static isImageExists = async (imageUrl: string): Promise<string> => {
        try {
            const response = await fetch(imageUrl, { method: 'HEAD' });
            return response.ok ? imageUrl : '';
        } catch (error) {
            console.error('Error checking image existence:', error);
            return 'error';
        }
    }

}