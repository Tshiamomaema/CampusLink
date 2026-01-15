// University domain validation and mapping
// MVP: Supports common university email formats

const UNIVERSITY_DOMAINS: Record<string, string> = {
    // South Africa
    'wits.ac.za': 'University of the Witwatersrand',
    'up.ac.za': 'University of Pretoria',
    'uct.ac.za': 'University of Cape Town',
    'sun.ac.za': 'Stellenbosch University',
    'uj.ac.za': 'University of Johannesburg',
    'ukzn.ac.za': 'University of KwaZulu-Natal',
    'nwu.ac.za': 'North-West University',
    'ufs.ac.za': 'University of the Free State',
    'ru.ac.za': 'Rhodes University',
    'unisa.ac.za': 'University of South Africa',
    'tut.ac.za': 'Tshwane University of Technology',
    'cput.ac.za': 'Cape Peninsula University of Technology',
    'dut.ac.za': 'Durban University of Technology',
    'vut.ac.za': 'Vaal University of Technology',
    'cut.ac.za': 'Central University of Technology',

    // Generic patterns for other universities
    'student.': 'Student Email Domain',
};

export function extractDomain(email: string): string {
    const parts = email.toLowerCase().split('@');
    return parts[1] || '';
}

export function isUniversityEmail(email: string): boolean {
    const domain = extractDomain(email);

    // Check exact matches
    if (UNIVERSITY_DOMAINS[domain]) {
        return true;
    }

    // Check for .ac.za or .edu domains
    if (domain.endsWith('.ac.za') || domain.endsWith('.edu')) {
        return true;
    }

    // Check for student. prefix
    if (domain.startsWith('student.')) {
        return true;
    }

    return false;
}

export function getUniversityName(email: string): string {
    const domain = extractDomain(email);

    // Check exact matches first
    if (UNIVERSITY_DOMAINS[domain]) {
        return UNIVERSITY_DOMAINS[domain];
    }

    // For unknown .ac.za domains, extract name
    if (domain.endsWith('.ac.za')) {
        const name = domain.replace('.ac.za', '').replace(/\./g, ' ');
        return name.charAt(0).toUpperCase() + name.slice(1) + ' University';
    }

    // For .edu domains
    if (domain.endsWith('.edu')) {
        const name = domain.replace('.edu', '').replace(/\./g, ' ');
        return name.charAt(0).toUpperCase() + name.slice(1) + ' University';
    }

    return 'Unknown University';
}
