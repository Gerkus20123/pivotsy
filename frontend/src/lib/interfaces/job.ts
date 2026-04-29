export interface Job {
    id: number,
    logo?: string,
    background_image?: string,
    short_description: string,
    long_description?: string,
    category: string,
    subcategory: string,
    type_of_work: string,
    schedule: string,
    agreement_type: string,
    location: string,
    experience_requirement: string,
    additional_requirements: string,
    transport_availability: string,
    currency: string,
    payment: number | null,
    created_at: string,
    updated_at?: string,
    user: {
        id: number;
        name: string;
        phone_number: string;
        company_name?: string;
    };
}