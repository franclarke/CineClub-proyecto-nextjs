
async function getMemberships() {
    try {
        const response = await fetch('http://localhost:3000/api/memberships');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching memberships:', error);
        return [];
    }
}