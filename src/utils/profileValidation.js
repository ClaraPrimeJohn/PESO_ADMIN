export const isProfileComplete = (employer) => {
    if (!employer) return false;

    const requiredFields = [
        'companyName',
        'email',
        'companyPhone',
        'companyAddress',
        'contactPersonName',
        'contactPersonEmail',
        'companyDescription',
        'businessPermit',
        'companyLogo'
    ];

    return requiredFields.every(field => {
        const value = employer[field];
        return value && value.toString().trim() !== '';
    });
};